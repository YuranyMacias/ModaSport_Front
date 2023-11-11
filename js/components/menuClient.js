const menuClient = () => {
    const header = document.getElementById('header');

    const menu = `
        <nav class="navbar navbar-expand-lg navbar-light bg-light fixed-top">
            <div class="container">
                <a class="navbar-brand" href="./index.html">
                    <img src="./assets/images/logo80.png" alt="" width="50" height="50" class="d-inline-block">
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
                            <a class="nav-link active" aria-current="page" href="./index.html">Inicio</a>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
                                data-bs-toggle="dropdown" aria-expanded="false">
                                Hombres
                            </a>
                            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                                <li><a class="dropdown-item"
                                    href="./products.html?genero=hombre">Todos</a></li>
                                <li>
                                    <hr class="dropdown-divider">
                                </li>
                                <li><a class="dropdown-item"
                                        href="./products.html?genero=hombre&categoria=PANTALONES">Pantalones</a></li>
                                <li><a class="dropdown-item"
                                        href="./products.html?genero=hombre&categoria=CAMISETAS">Camisetas</a></li>
                                <li><a class="dropdown-item"
                                        href="./products.html?genero=hombre&categoria=CAMISAS">Camisas</a></li>
                                <li><a class="dropdown-item"
                                        href="./products.html?genero=hombre&categoria=BUZOS">Buzos</a></li>
                                <li><a class="dropdown-item"
                                        href="./products.html?genero=hombre&categoria=ZAPATOS">Zapatos</a></li>
                                <li>
                                    <hr class="dropdown-divider">
                                </li>
                                <li><a class="dropdown-item"
                                        href="./products.html?genero=hombre&ofertas=TODAS">Ofertas</a></li>
                            </ul>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
                                data-bs-toggle="dropdown" aria-expanded="false">
                                Mujeres
                            </a>
                            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                                <li><a class="dropdown-item"
                                    href="./products.html?genero=mujer">Todos</a></li>
                                <li>
                                    <hr class="dropdown-divider">
                                </li>
                                <li><a class="dropdown-item"
                                        href="./products.html?genero=mujer&categoria=PANTALONES">Pantalones</a></li>
                                <li><a class="dropdown-item"
                                        href="./products.html?genero=mujer&categoria=CAMISETAS">Camisetas</a></li>
                                <li><a class="dropdown-item"
                                        href="./products.html?genero=mujer&categoria=CAMISAS">Camisas</a></li>
                                <li><a class="dropdown-item"
                                        href="./products.html?genero=mujer&categoria=BUZOS">Buzos</a></li>
                                <li><a class="dropdown-item"
                                        href="./products.html?genero=mujer&categoria=ZAPATOS">Zapatos</a></li>
                                <li>
                                    <hr class="dropdown-divider">
                                </li>
                                <li><a class="dropdown-item"
                                        href="./products.html?genero=mujer&ofertas=TODAS">Ofertas</a></li>
                            </ul>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
                                data-bs-toggle="dropdown" aria-expanded="false">
                                Niños
                            </a>
                            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                                <li><a class="dropdown-item"
                                        href="./products.html?genero=niño">Todos</a></li>
                                <li>
                                    <hr class="dropdown-divider">
                                </li>
                                <li><a class="dropdown-item"
                                        href="./products.html?genero=niño&categoria=PANTALONES">Pantalones</a></li>
                                <li><a class="dropdown-item"
                                        href="./products.html?genero=niño&categoria=CAMISETAS">Camisetas</a></li>
                                <li><a class="dropdown-item"
                                        href="./products.html?genero=niño&categoria=CAMISAS">Camisas</a></li>
                                <li><a class="dropdown-item"
                                        href="./products.html?genero=niño&categoria=BUZOS">Buzos</a></li>
                                <li><a class="dropdown-item"
                                        href="./products.html?genero=niño&categoria=ZAPATOS">Zapatos</a></li>
                                <li>
                                    <hr class="dropdown-divider">
                                </li>
                                <li><a class="dropdown-item"
                                        href="./products.html?genero=niño&ofertas=TODAS">Ofertas</a></li>
                            </ul>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link " aria-current="page" href="./sobre-nosotros.html">Nosotros</a>
                        </li>
                        <li class="nav-item">
                            <form class="d-flex">
                                <input class="form-control me-2" type="search" placeholder="Buscar" aria-label="Buscar">
                                <button class="btn btn-outline-success" type="submit" aria-label="Botón buscar"
                                    title="Buscar">
                                    <i class="fa-solid fa-magnifying-glass"></i>
                                </button>
                            </form>
                        </li>
                    </ul>

                    <button type="button" class="btn btn-outline-success m-1 position-relative"
                        aria-label="Botón carrito de compras" title="Carrito de compras" onclick="goToShoppingCart()">
                        <i class="fa-solid fa-cart-shopping"></i>
                        <span class="position-absolute top-0 start-0 translate-middle badge rounded-pill bg-danger" id="shoppingCartNumber">
                            0
                            <span class="visually-hidden">Number of items</span>
                        </span>
                    </button>

                    <div class="btn-group" role="group" id="btnDropUser">
                        <button id="btnGroupDrop1" data-bs-toggle="dropdown" aria-expanded="false"
                            type="button" class="btn btn-outline-success d-block dropdown-toggle" aria-label="Botón de inicio de sesión"
                            title="Inicio de sesión">
                            
                            <img src="../assets/images/user2.png" width="25" height="25" alt="" >
                        </button>
                        <ul class="dropdown-menu" aria-labelledby="btnGroupDrop1" style="left: -60px;" >

                            
                            
                            
                        
                        </ul>
                    </div>

                </div>
            </div>
        </nav>
    `;

    header.innerHTML = menu;
}

menuClient();

