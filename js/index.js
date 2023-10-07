const URLAPI = `${URL_API}/products`;

const getProducts = async () => {
    try {
        const response = await fetch(URLAPI);

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al consultar los productos:', error.message);
        throw new Error(`Error al consultar los productos:`, error.message);
    }
}

const createDataOffers = () => {
    const offersList = document.getElementById('offersList');
    offersList.innerHTML = `<div>Consultando datos... </div>`

    getProducts()
        .then(data => {
            const { totalProducts, products } = data;

            if (products.length === 0) {
                offersList.innerHTML = `<div> Sin datos para mostrar </div>`
            }

            if (products) {

                // Hacer algo con los productos recibidas
                let cardHTML = ``;
                products.forEach(product => {
                    if (product.discount > 0) {
                        cardHTML += `
                            <div class="col">
                                <div class="card h-100">
                                    <div class="ratio ratio-1x1">
                                        <img src="${product.images[0]}" class="card-img-top" alt="${product.name}">
                                    </div>
                                    <div class="card-body">
                                        <h5 class="card-title">${product.name}</h5>
                                        <p class="card-text text-truncate">${product.description}.</p>
                                        <div class="details d-flex flex-row justify-content-between">
                                            <p class="text-danger"> <strong>$${product.price}</strong> </p>
                                            <p class="text-success">
                                                <strong><i class="fa-solid fa-check"></i></strong>
                                                ${(product.available) ? "Si" : "No"}
                                            </p>
                                        </div>
                                        <a href="./details-products.html?producto=${product._id}" class="btn btn-outline-dark stretched-link">Ver detalles</a>
                                    </div>
                                </div>
                            </div>`;
                    }
                });

                offersList.innerHTML = cardHTML;


            } else {
                console.log('No se pudieron obtener los productos.');
                // Tomar medidas alternativas si no se pudieron obtener los productos
            }
        });
}

const createDataProducts = () => {
    const productsList = document.getElementById('productsList');
    productsList.innerHTML = `<div>Consultando datos... </div>`

    getProducts()
        .then(data => {
            const { totalProducts, products } = data;

            if (products.length === 0) {
                productsList.innerHTML = `<div> Sin datos para mostrar </div>`
            }

            if (products) {
        
                let cardHTML = ``;
                products.forEach(product => {
                    cardHTML += `
                        <div class="col">
                            <div class="card h-100">
                                <div class="ratio ratio-1x1">

                                    <img src="${(product.images[0]) ? product.images[0] : '../assets/img/logo.png'}" class="card-img-top" alt="${product.name}">
                                </div>
                                <div class="card-body">
                                    <h5 class="card-title">${product.name}</h5>
                                    <p class="card-text text-truncate">${product.description}.</p>
                                    <div class="details d-flex flex-row justify-content-between">
                                        <p class="text-danger"> <strong>$${product.price}</strong> </p>
                                        <p class="text-success">
                                            <strong><i class="fa-solid fa-check"></i></strong>
                                            ${(product.available) ? "Si" : "No"}
                                        </p>
                                    </div>
                                    <a href="./details-products.html?producto=${product._id}" class="btn btn-outline-dark stretched-link">Ver detalles</a>
                                </div>
                            </div>
                        </div>`;

                });

                productsList.innerHTML = cardHTML;


            } else {
                console.log('No se pudieron obtener los productos.');
                // Tomar medidas alternativas si no se pudieron obtener los productos
            }
        });
}

createDataOffers();
createDataProducts();