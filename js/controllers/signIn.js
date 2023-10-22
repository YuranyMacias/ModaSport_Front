


// ------------------------- 

// const validateShoppingCart = async () => {
//     const idShoppingCart = getIdShoppingCart();
//     const optionalToken = getOptionalToken();

//     if (optionalToken && idShoppingCart) {
//         const response = await fetch(`${URL_API}/shopping-cart/${idShoppingCart}`, {
//             method: 'PUT',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'x-token': `${optionalToken}`
//             }
//         })

//         if (!response.ok) {
//             throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`);
//         }

//         const data = await response.json();
//         return data;
//     }

//     if (!idShoppingCart) {
//         const response = await fetch(`${URL_API}/shopping-cart/find/ByUser`, {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'x-token': `${optionalToken}`
//             }
//         })

//         if (!response.ok) {
//             throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`);
//         }

//         const data = await response.json();
//         const shoppingCartId = data?.shoppingCart?.[0]?._id;
//         if (shoppingCartId) {
//             saveIdShoppingCart(shoppingCartId)
//         }
//         return data;
//     }
//     return null;
// }



// ------------------------- 
const inputName = document.getElementById('inputName');
const inputLastName = document.getElementById('inputLastName');
const inputEmailS = document.getElementById('inputEmailS');
const inputPasswordS = document.getElementById('inputPasswordS');
const inputConfirmPassword = document.getElementById('inputConfirmPassword');

const inputCellphone = document.getElementById('inputCellphone');


const validateInputs = () => {
    if (isEmptyField([inputName, inputLastName, inputEmailS, inputPasswordS, inputConfirmPassword])) {
        alert('Por favor, complete todos los campos obligatorios * ');
        return false;
    }

    if (!isPasswordMatch(inputPasswordS.value, inputConfirmPassword.value)) {
        alert('Por favor! verificar Clave, es incorrecta, no coinciden!')
        return false;
    }

    return true;
}

const isEmptyField = (inputs) => {
    return inputs.some(input => input.value.trim() === '');
}


const goSignIn = async () => {
    try {

        const data = {
            name: inputName.value,
            lastname: inputLastName.value,
            email: inputEmailS.value,
            password: inputPasswordS.value,
        };

        if (inputCellphone.value.trim() !== '') {
            data.phone = inputCellphone.value;
        }

        console.log(data)

        const response = await fetch(`${URL_API}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        const signIn = await response.json();

        if (signIn?.message) {
            console.log(`Error:  ${signIn.message} .`);
            alert(`Error:  ${signIn.message} .`);
        }

        if (signIn?.errors?.length > 0) {
            let message = `Error: `
            signIn.errors.forEach(error => {
                message += `==> ${error.msg}  `
            });
            alert(message);
        }

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`);
            
        } 
        
        if(response.ok) {
            alert('Registro exitoso!')
            validateLogin(inputEmailS.value, inputPasswordS.value);
        }

        // window.location.href = '../../shopping-cart.html'
        return signIn;
    } catch (error) {
        console.error('Error al registrarme:', error);
        throw new Error(`Error al registrarme:`, error);
    }
}

const createActions = () => {
    const formSignIn = document.getElementById('formSignIn');
    const btnSignIn = document.getElementById('btnSignIn');

    formSignIn.addEventListener("submit", (event) => {
        event.preventDefault();
    })

    btnSignIn.addEventListener('click', () => {
        if (validateInputs()) {
            goSignIn();
        }
    })

    validatePasswordMatch(inputPasswordS, inputConfirmPassword);
}

createActions();
