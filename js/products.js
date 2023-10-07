const URLAPI = `${URL_API}/products`;
const productsList = document.getElementById('productsList');


const urlParams = new URLSearchParams(window.location.search);
const gender = urlParams.get('genero');
const category = urlParams.get('categoria');
const season = urlParams.get('temporada');
const offers = urlParams.get('ofertas');
console.log('Dato 1:', gender);
console.log('Dato 2:', category);
console.log('Dato 3:', season);
console.log('Dato 4:', offers);

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

const filtersGenderCategorySeason = (products) => {
    let filteredProducts = products;

    if (offers) {
        filteredProducts = filteredProducts.filter((product) => product.discount > 0);
    }

    if (gender) {
        filteredProducts = filteredProducts.filter((product) => product.gender.name === gender.toUpperCase());
    }

    if (category) {
        filteredProducts = filteredProducts.filter((product) => product.category.name === category.toUpperCase());
    }

    if (season) {
        filteredProducts = filteredProducts.filter((product) => product.season.name === season.toUpperCase());
    }

    return filteredProducts;
}

const calculatePrice = (product) => {
       return (product.discount > 0) ? (product.price * (100 - product.discount) / 100) : product.price;
}

const filters = async (products) => {
    const filterOrder = document.getElementById('filter-order-select');
    let filteredProducts = filtersGenderCategorySeason(products);
    createProductsHTML(filteredProducts);

    let orderedProducts = [];
    filterOrder.addEventListener('change', () => {
        let ordenSeleccionado = filterOrder.value;

        if (ordenSeleccionado == 1) {
            orderedProducts = filteredProducts.sort((a, b) => calculatePrice(a) - calculatePrice(b));
            createProductsHTML(orderedProducts);
        }

        if (ordenSeleccionado == 2) {
            orderedProducts = filteredProducts.sort((a, b) => calculatePrice(b) - calculatePrice(a));
            createProductsHTML(orderedProducts);
        }

        if (ordenSeleccionado == 3) {
            orderedProducts = filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            createProductsHTML(orderedProducts);
        }

        if (ordenSeleccionado == 4) {
            orderedProducts = filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
            createProductsHTML(orderedProducts);
        }
    });
}

const pricesHtml = (price, discount) => {
    const discountedPrices = `
        <div class="product-details__prices-previous-current">
            <p class="previous-price"> Antes: $ ${price} </p>
            <p class="current-price current-price-red">
                <strong> Ahora: $ ${price * (100 - discount) / 100} </strong>
            </p>
        </div>                 
    `;

    const pricesWithoutDiscount = `
        <div class="product-details__prices-previous-current">
            <p class="current-price current-price-red">
                <strong> Ahora: ${price} </strong>
            </p>
        </div>                 
    `;

    return discount > 0 ? discountedPrices : pricesWithoutDiscount
}

const createProductsHTML = (filteredProducts) => {
    let cardHTML = ``;
    console.log({ filteredProducts })
    if (filteredProducts.length > 0) {
        filteredProducts.forEach(product => {
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
                            ${pricesHtml(product.price, product.discount)}
                        </div>
                        <a href="./details-products.html?producto=${product._id}" class="btn btn-outline-dark stretched-link">Ver detalles</a>
                    </div>
                </div>
            </div>`;

        });

        productsList.innerHTML = cardHTML;
    } else {
        cardHTML += `
            <div class="alert alert-warning">
                <p>
                    <strong>No hay productos con el filtro.</strong>
                    <a href="./../products.html" class="link">Ver todos los productos ...</a>
                </p>
            </div>`;
        productsList.innerHTML = cardHTML;
    }

}


const createDataProducts = () => {

    productsList.innerHTML = `<div>Consultando datos... </div>`

    getProducts()
        .then(data => {
            const { totalProducts, products } = data;

            if (products.length === 0) {
                productsList.innerHTML = `<div> Sin datos para mostrar </div>`
            }

            if (products) {
                filters(products);
            } else {
                console.log('No se pudieron obtener los productos.');
                // Tomar medidas alternativas si no se pudieron obtener los productos
            }
        });
}

createDataProducts();