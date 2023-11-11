const createbtnDropUser = async () => {
    const menuDropUser = document.getElementById('btnDropUser');
    menuDropUser.innerHTML = '';

    const imgUser = await getUserImage();
    console.log(imgUser)

    const btnUser = `    
        <button id="btnGroupDrop1" data-bs-toggle="dropdown" aria-expanded="false"
            type="button" class="btn btn-outline-success d-block dropdown-toggle" aria-label="Botón Usuario"
            title="Usuario">
            <img src="${(imgUser) ? imgUser : '/assets/images/user2.png'}" width="25" height="25" alt="" >
        </button>
        <ul class="dropdown-menu" aria-labelledby="btnGroupDrop1" style="left: -60px;" > 
            <li><a class="dropdown-item" href="#">Perfil</a></li>
            <li><a class="dropdown-item" href="/orders/">Pedidos</a></li>
            <li>
                <hr class="dropdown-divider">
            </li>
            <li><a class="dropdown-item" href="#" id="btnLogout">Cerrar sesión</a></li>
        </ul>
    `;

    const btnGuest = `    
        <button id="btnGroupDrop1" data-bs-toggle="dropdown" aria-expanded="false"
            type="button" class="btn btn-outline-success d-block dropdown-toggle" aria-label="Botón de inicio de sesión"
            title="Inicio de sesión">        
            <i class="fa-solid fa-user"></i>
        </button>
        <ul class="dropdown-menu" aria-labelledby="btnGroupDrop1" style="left: -60px;" >
            <li>
                <a class="dropdown-item" id="btnLogin" href="#" data-bs-toggle="modal"
                    data-bs-target="#modalLogin">Iniciar sesión</a>
            </li>   
        </ul>
    `;

    const tokenValid = await isValidToken();
    if (tokenValid) {
        menuDropUser.innerHTML = btnUser;
        actionsUser();
    } else {
        menuDropUser.innerHTML = btnGuest;
    } 
}

const actionsUser = () => {
    const btnLogout = document.getElementById('btnLogout');
    btnLogout.addEventListener('click', () => {
        removeIdShoppingCart();
        removeToken();
        removeUserImage();

        window.location.href = '/index.html'
    })
}

createbtnDropUser();


