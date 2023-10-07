const menuAdmin = () => {
    const header = document.getElementById('header');

    const menu = `
        <nav class="navbar navbar-expand-lg navbar-light bg-light fixed-top">
            <div class="container">
                <a class="navbar-brand" href="../../index.html">
                    <img src="/assets/img/logo80.png" alt="" width="50" height="50" class="d-inline-block">
                    Moda Sport
                </a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                    aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item">
                            <a class="nav-link active" aria-current="page" href="../reports/">Inicio</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" aria-current="page" href="../users/">Usuarios</a>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
                                data-bs-toggle="dropdown" aria-expanded="false">
                                Productos
                            </a>
                            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                                <li><a class="dropdown-item" href="../categories/">Categoría</a></li>
                                <li><a class="dropdown-item" href="../seasons/">Temporada</a></li>
                                <li><a class="dropdown-item" href="../genders/">Género</a></li>
                                <li>
                                    <hr class="dropdown-divider">
                                </li>
                                <li><a class="dropdown-item" href="../products">Productos</a></li>
                            </ul>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
                                data-bs-toggle="dropdown" aria-expanded="false">
                                Facturas
                            </a>
                            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                                <li><a class="dropdown-item" href="#">Pedidos</a></li>
                                <li>
                                    <hr class="dropdown-divider">
                                </li>
                                <li><a class="dropdown-item" href="#">Facturas</a></li>
                            </ul>
                        </li>

                    </ul>

                    <button type="button" class="btn btn-outline-success m-1 position-relative"
                        aria-label="Botón carrito de compras" title="Carrito de compras">
                        <i class="fa-solid fa-cart-shopping"></i>
                        <span class="position-absolute top-0 start-0 translate-middle badge rounded-pill bg-danger" id="shoppingCartNumber">
                            2
                            <span class="visually-hidden">Number of items</span>
                        </span>
                    </button>

                    <div class="dropdown ml-1">
                        <button class="btn btn-outline-success dropdown-toggle" type="button" id="dropdownMenuButton1"
                            data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="fa-solid fa-user"></i>
                            Usuario
                        </button>
                        <ul class="dropdown-menu text-center" aria-labelledby="dropdownMenuButton1">
                            <li><a class="dropdown-item" href="#">Test Test22</a></li>
                            <li><a class="dropdown-item" href="#">Administrador</a></li>
                            <li><a class="dropdown-item" href="#">Configuración</a></li>
                            <li>
                                <hr class="dropdown-divider">
                            </li>
                            <li><a class="dropdown-item" href="#">Cerrar sesión</a></li>
                        </ul>
                    </div>

                </div>
            </div>
        </nav>
    `;

    header.innerHTML = menu;
}

menuAdmin();

