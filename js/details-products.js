const URLAPI = `${URL_API}/products`;

const urlParams = new URLSearchParams(window.location.search);
const objectId = urlParams.get('producto');
console.log('Dato 1:', objectId);

const detailsProduct = async (objectId) => {

    const detailsProduct = document.getElementById('detailsProduct');
    detailsProduct.innerHTML = `<div> Consultando datos... </div>`

    const response = await fetch(`${URLAPI}/${objectId}`);

    if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`);
    }

    const product = await response.json();

    if (!product) {
        detailsProduct.innerHTML = `<div>  Sin datos para mostrar  </div>`
        return
    }

    const isAvailable = () => product.stock > 0 ;

    const quantitySelectHtml = (stock, limit = 10) => {
        if (!isAvailable()) {
            return '0';
        }
    
        const select = document.createElement('select');
        select.id = 'form-quantity-select';
        select.classList.add('form-select');
        select.name = 'quantity';
    
        const qty = Math.min(stock, limit);
    
        for (let i = 1; i <= qty; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            select.appendChild(option);
        }
    
        return select.outerHTML;
    };


    const sizesSelectHtml = (sizes) => {
        const select = document.createElement('select');
        select.id = 'form-sizes-select';
        select.classList.add('form-select');
        select.name = 'sizes';
    

        for (let i = 0; i < sizes.length; i++) {
            const option = document.createElement('option');
            option.value = sizes[i];
            option.textContent = sizes[i];
            select.appendChild(option);
        }
    
        return select.outerHTML;
    };


    const colorsSelectHtml = (colors) => {
        const select = document.createElement('select');
        select.id = 'form-colors-select';
        select.classList.add('form-select');
        select.name = 'colors';
    

        for (let i = 0; i < colors.length; i++) {
            const option = document.createElement('option');
            option.value = colors[i];
            option.textContent = colors[i];
            select.appendChild(option);
        }
    
        return select.outerHTML;
    };


    let imagesHTML = ``;
    console.log(product.images.length > 0)
    console.log(product.images)

    if (product.images.length > 0) {
        product.images.forEach((image, index) => {
            imagesHTML += `
            <div class="carousel-item ratio ratio-1x1 ${(index == 0) ? 'active' : ''} ">
                <img src="${image}" class="d-block w-100" width="350" alt="">
            </div>`
        });
    } else {
        imagesHTML = `<div class="carousel-item ratio ratio-1x1 active">
            <img src="../assets/img/logo.png" class="d-block w-100" width="350" alt="Sin Imagenes">
        </div>`
    }

    if (product) {
        let dataDescription = `<div class="col">
                        <div id="carouselExampleControls" class="carousel slide" data-bs-ride="carousel">
                            <div class="carousel-inner">
                                ${imagesHTML}  
                                
                            </div>
                            <button class="carousel-control-prev" type="button"
                                data-bs-target="#carouselExampleControls" data-bs-slide="prev">
                                <span class="carousel-control-prev-icon bg-dark" aria-hidden="true"></span>
                                <span class="visually-hidden">Previous</span>
                            </button>
                            <button class="carousel-control-next" type="button"
                                data-bs-target="#carouselExampleControls" data-bs-slide="next">
                                <span class="carousel-control-next-icon bg-dark" aria-hidden="true"></span>
                                <span class="visually-hidden">Next</span>
                            </button>
                        </div>
                    </div>

                    <div class="col d-flex align-items-center">
                        <div class="details-body text-center text-sm-start d-flex flex-column justify-content-center">

                            <h2 class="mt-0">${product.name} </h2>
                            <p>${product.reference}  </p>
                            <p>$ ${product.price} </p>
                            <form>
                                <div class="organizar d-flex justify-content-between">
                                    <div class="talla-form  mb-3">
                                        <label for="inputtalla" class="col-sm-2 col-form-label">Talla</label>
                                        ${sizesSelectHtml(product.sizes)}
                                    </div>
                                    <div class="color-form  mb-3">
                                        <label for="inputcolor" class="col-sm-2 col-form-label">Color</label>
                                        ${colorsSelectHtml(product.colors)}
                                    </div>
                                </div>
                                <div class="talla-form d-flex mb-3 ">
                                    <label for="inputcantidad" class="col-sm-2 col-form-label">Cantidad</label>
                                    ${quantitySelectHtml(product.stock)}
                                </div>
                                <p>Nota: Para pedidos al mayor comunicarse con <a href="#Contacto" class="text-dark"
                                        title="Contacto">Nosotros</a></p>

                                <a href="#" class="text-decoration-none">
                                    <button type="button" class="btn btn-success d-block mb-5" data-id="${product._id}"  id="btnAddCart">
                                        <i class="fa-solid fa-shirt"></i>
                                        Añadir al carrito
                                    </button>
                                </a>
                            </form>

                            <h3>Detalles</h3>
                            <p>${product.description} </p>
                        </div>
                    </div>
           `;


        detailsProduct.innerHTML = dataDescription;



        
        const btnAddCart = document.getElementById('btnAddCart');
        btnAddCart.addEventListener('click', () => {
            const productId = btnAddCart.getAttribute("data-id");
            const quantity = document.getElementById('form-quantity-select').value;
            const size = document.getElementById('form-sizes-select').value;
            const color = document.getElementById('form-colors-select').value;

            createShoppingCart(productId, quantity, color, size);
        })


        // const btnCreateImagesModal = document.getElementById('btnCreateImagesModal');
        // btnCreateImagesModal.addEventListener('click', () => {
        //     const btnImagesSave = document.getElementById('btnImagesSave');
        //     btnImagesSave.setAttribute("data-id", objectId);

        //     const btnCloseDetailsModal = document.getElementById('btnCloseDetailsModal');
        //     btnCloseDetailsModal.click();
        //     preloadImages();
        // })


        // const btnImagesSave = document.getElementById('btnImagesSave');
        // btnImagesSave.addEventListener('click', () => {
        //     let objectId = btnImagesSave.getAttribute('data-id');
        //     uploadImages(objectId);
        // })


        // btnEdit.addEventListener('click', () => {
        //     let objectId = btnEdit.getAttribute('data-id');
        //     const btnCloseDetailsModal = document.getElementById('btnCloseDetailsModal');
        //     btnCloseDetailsModal.click();
        //     editProduct(objectId);
        // })

    } else {
        console.log('No se pudieron obtener los productos.');
        // Tomar medidas alternativas si no se pudieron obtener los productos
    }

}


detailsProduct(objectId);