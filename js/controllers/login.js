const main = document.querySelector('body');
const divcontent = document.createElement('div');

let dataDescription = `
        <div class="modal fade" id="modalLogin" tabindex="-1" aria-labelledby="modalLoginLabel"
            aria-hidden="true">
            <div class="modal-dialog modal-xl modal-dialog-centered" id="shoppingCartModal">


            <div class="modal-content" >
                <div class="modal-header p-2 text-center">
                    <h2 class="m-1 w-100">INICIAR SESIÓN</h2>
                    <button type="button" id="btnCloseModal" class="btn-close" data-bs-dismiss="modal"
                        aria-label="Close"></button>
                </div>
                <div class="modal-body">


                    <div class="row row-cols-1 row-cols-md-2 d-flex flex-column-reverse flex-sm-row g-4 ">
                        <div class="col col-md-7 d-flex flex-column align-items-center">                     
                            <div
                                class="login-cuadro text-center text-sm-start d-flex flex-column justify-content-center border border-dark p-4 w-100">

                                <p class="text-center mt-2"> <strong>INGRESA CON</strong> </p>
                                <button type="button" class="btn btn-outline-success d-block mb-1">
                                    <i class="fa-brands fa-google"></i>
                                    Google
                                </button>
                                <hr>
                                <p class="text-center mt-2">O si lo prefieres, ingresa con</p>
                                <form id="formLogin">
                                    <div class="form-floating mb-3">
                                        <input type="email" class="form-control" id="floatingInpuEmail"
                                            placeholder="name@example.com">
                                        <label for="floatingInputEmail">Email address</label>
                                    </div>
                                    <div class="form-floating">
                                        <input type="password" class="form-control" id="floatingInputPassword"
                                            placeholder="Password">
                                        <label for="floatingInputPassword">Password</label>
                                    </div>

                                    <p class="text-center mt-2">¿olvidó su contraseña?</p>
                                    <div class="d-grid gap-2">
                                        <button class="btn btn-success" type="button" id="btnLogin">Iniciar sesión</button>
                                    </div>
                                </form>
                            </div>
                            <div class="registro w-75">
                                <p class="text-center mt-2"> <strong> ¿NO TIENES CUENTA? </strong> </p>
                                <hr>
                                <div class="d-grid gap-2">
                                        <a href="./sign-in.html" class="btn d-block w-100 mb-5">
                                        <button class="btn btn-success" type="button">REGÍSTRATE</button>
                                    </a> 
                                </div>
                            </div>
                        </div>
                        <div class="col col-md-5 d-flex d-none d-md-flex align-items-start">
                            <img src="/assets/images/login.webp" width="100%" class="card-img-top" alt="..."  >
                        </div>
                    </div>

                </div>


            </div>
        </div> `;
divcontent.innerHTML = dataDescription;

main.appendChild(divcontent);


// ------------------------- 
const validateShoppingCart = async () => {
    const idShoppingCart = getIdShoppingCart();
    const optionalToken = getOptionalToken();

    if (optionalToken && idShoppingCart) {
        const response = await fetch(`${URL_API}/shopping-cart/${idShoppingCart}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-token': `${optionalToken}`
            }
        })

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    }
    
    if (!idShoppingCart) {
        const response = await fetch(`${URL_API}/shopping-cart/find/ByUser`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-token': `${optionalToken}`
            }
        })

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        const shoppingCartId = data?.shoppingCart?.[0]?._id;
        if (shoppingCartId) {
            saveIdShoppingCart(shoppingCartId)
        }
        return data;
    }
    return null;
}



// ------------------------- 
const inputEmail = document.getElementById('floatingInpuEmail');
const inputPassword = document.getElementById('floatingInputPassword');


const validateLogin = async (emailValue = '', passwordValue = '') => {
    try {

        const email = (emailValue !== '') ? emailValue : inputEmail.value;
        const password = (passwordValue !== '') ? passwordValue : inputPassword.value;

        const data = {
            email,
            password
        };

        const response = await fetch(`${URL_API}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        const session = await response.json();

        if (session?.message) {
            console.log(`Error:  ${session.message} .`);
            alert(`-  ${session.message} .`);
        }

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`);
        }

        if (session.token) {
            console.log(session.token);
            saveToken(session.token)
        }

        if (session?.user?.image?.trim() !== '') {
            console.log(session.user.image);
            saveImage(session.user.image)
        }

        if (session?.user?.role === "ADMIN_ROLE") {
            console.log(session?.user?.role)
            validateShoppingCart();
            // window.location.href = '/reports'
            location.reload()
        } else if (session?.user?.role) {
            console.log(session?.user?.role)
            validateShoppingCart();
            // window.location.href = './shopping-cart'
            location.reload()
        }

        console.log(session);
        // window.location.href = '../../shopping-cart.html'
        return session;
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        throw new Error(`Error al iniciar sesión:`, error);
    }
}


const formLogin = document.getElementById('formLogin');
const btnLogin = document.getElementById('btnLogin');

formLogin.addEventListener("submit", (event) => {
    event.preventDefault();
})

btnLogin.addEventListener('click', () => {
    if (inputEmail.value == '' || inputPassword.value == '') {
        alert('Debe completar los campos antes de iniciar.');
    } else {
        validateLogin();
    }
})


