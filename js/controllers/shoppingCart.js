const shoppingCartNumber = document.getElementById('shoppingCartNumber');

function saveIdShoppingCart(id) {
    localStorage.setItem('idShoppingCart', id);
}

function getIdShoppingCart() {
    const idShoppingCart = localStorage.getItem('idShoppingCart');
    if (!idShoppingCart) {
        return false;
    }
    return idShoppingCart;
}

const removeIdShoppingCart = () => {
    localStorage.removeItem('idShoppingCart');
}

const getShoppingCarts = async () => {
    try {
        const idShoppingCart = getIdShoppingCart();
        if (idShoppingCart) {
            let response = await fetch(`${URL_API}/shopping-cart/${idShoppingCart}`);

            if (!response.ok) {
                throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();
            if (data) {
                return data;
            }
        }

        const optionalToken = getOptionalToken();
        if (optionalToken) {
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
            return data;
        }

        return null;

    } catch (error) {
        console.error('Error al consultar carrito de compras:', error.message);
        throw new Error(`Error al consultar carrito de compras:`, error.message);
    }
}

const getNumberItems = async () => {
    getShoppingCarts()
        .then(data => {
            if (data) {
                let shoppingCart = [];
                let details = [];

                if (data?.shoppingCart && data?.details) {
                    shoppingCart = data.shoppingCart;
                    details = data.details;
                }

                const items = details.length;

                if (items === 0) {
                    shoppingCartNumber.innerHTML = `0`;
                } else {
                    shoppingCartNumber.innerHTML = `${items}`;
                }
            } else {
                shoppingCartNumber.innerHTML = `0`;
            }
        });
}


const createShoppingCart = async (productId, quantity = 1, color, size) => {
    try {

        const data = {
            products: [{
                id: productId,
                quantity: parseInt(quantity),
                color,
                size
            }]
        };

        const idShoppingCart = getIdShoppingCart();
        const optionalToken = getOptionalToken();

        if (idShoppingCart) {
            data.idShoppingCart = idShoppingCart;
            const response = await fetch(`${URL_API}/shopping-cart-details/${idShoppingCart}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })

            if (!response.ok) {
                throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`);
            }

            const shoppingCart = await response.json();

            window.location.href = '../../shopping-cart.html'
            return shoppingCart;
        }


        if (optionalToken) {
            const response = await fetch(`${URL_API}/shopping-cart`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-token': `${optionalToken}`
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`);
            }


            const shopping = await response.json();
            const shoppingCartId = shopping?.shoppingCart?._id;
            if (shoppingCartId) {
                saveIdShoppingCart(shoppingCartId)
            }
            // window.location.href = '../../shopping-cart.html'
            return shopping;
        }

        const response = await fetch(`${URL_API}/shopping-cart?skipJWTValidation=true`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`);
        }

        const shoppingCart = await response.json();
        saveIdShoppingCart(shoppingCart.shoppingCart._id);
        window.location.href = '../../shopping-cart.html'
        return shoppingCart;

        return null;

    } catch (error) {
        console.error('Error al crear el género:', error);
        throw new Error(`Error al crear el género:`, error);
    }
}

const updateItemShoppingCart = async (objectId) => {
    try {
        const selectQuantity = document.getElementById('form-quantity-select').value;
        const selectColor = document.getElementById('form-colors-select').value;
        const selectSize = document.getElementById('form-sizes-select').value;


        // Data to send in the POST request
        const data = {
            item: [{
                itemId: objectId,
                quantity: selectQuantity,
                color: selectColor,
                size: selectSize
            }]
        };
        const idShoppingCart = getIdShoppingCart();
        const optionalToken = getOptionalToken();
        if (optionalToken) {

            const response = await fetch(`${URL_API}/shopping-cart-details/${idShoppingCart}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-token': `${optionalToken}`
                },
                body: JSON.stringify(data)
            })

            if (!response.ok) {
                throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`);
            }

            const shoppingCart = await response.json();
            window.location.href = '../../shopping-cart.html'
            return shoppingCart;
        }


        if (idShoppingCart) {
            data.idShoppingCart = idShoppingCart;
            const response = await fetch(`${URL_API}/shopping-cart-details/${idShoppingCart}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })

            if (!response.ok) {
                throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`);
            }

            const shoppingCart = await response.json();
            window.location.href = '../../shopping-cart.html'
            return shoppingCart;
        }

        return null;
    } catch (error) {
        console.error('Error al crear el género:', error);
        throw new Error(`Error al crear el género:`, error);
    }
}

const deleteItemShoppingCart = async (itemId) => {
    const confirmDelete = confirm('Desea eliminar el item?');
    if (confirmDelete) {
        try {
            const data = {
                details: [{
                    id: itemId
                }]
            };

            const optionalToken = getOptionalToken();
            const idShoppingCart = getIdShoppingCart();
            if (optionalToken) {

                const response = await fetch(`${URL_API}/shopping-cart-details/${idShoppingCart}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-token': `${optionalToken}`
                    },
                    body: JSON.stringify(data)
                })

                if (!response.ok) {
                    throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`);
                }

                const shoppingCart = await response.json();
                location.reload();
                return shoppingCart;
            }
 
            if (idShoppingCart) {
                data.idShoppingCart = idShoppingCart;
                const response = await fetch(`${URL_API}/shopping-cart-details/${idShoppingCart}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                })

                if (!response.ok) {
                    throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`);
                }

                const shoppingCart = await response.json();
                location.reload();
                return shoppingCart;
            }

            return null;
        } catch (error) {
            console.error('Error al eliminar el género:', error.message);
            throw new Error(`Error al eliminar el género:`, error.message);
        }
    }
}



// Form edit
const isAvailable = (stock) => stock > 0;

const quantitySelectHtml = (stock, limit = 10) => {
    if (!isAvailable(stock)) {
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
        option.text = i;

        select.appendChild(option);
    }

    return select.outerHTML;
};


const sizesSelectHtml = (sizes, size) => {
    const select = document.createElement('select');
    select.id = 'form-sizes-select';
    select.classList.add('form-select');
    select.name = 'sizes';


    for (let i = 0; i < sizes.length; i++) {
        const option = document.createElement('option');
        option.value = sizes[i];
        option.text = sizes[i];

        select.appendChild(option);
    }

    return select.outerHTML;
};


const colorsSelectHtml = (colors, color) => {
    const select = document.createElement('select');
    select.id = 'form-colors-select';
    select.classList.add('form-select');
    select.name = 'colors';


    for (let i = 0; i < colors.length; i++) {
        const option = document.createElement('option');
        option.value = colors[i];
        option.text = colors[i];

        select.appendChild(option);
    }

    return select.outerHTML;
};
// End Form edit



const editItemShoppingCart = async (objectId) => {
    try {
        const shoppingCartModal = document.getElementById('shoppingCartModal');

        const responseItem = await fetch(`${URL_API}/shopping-cart-details/item/${objectId}`);

        if (!responseItem.ok) {
            throw new Error(`Error en la solicitud: ${responseItem.status} - ${responseItem.statusText}`);
        }

        let [details] = await responseItem.json();
        const { product } = details;


        if (details) {
            let dataDescription = `<div class="modal-content" >
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Editar item: ${product.name}</h5>
                <button type="button" id="btnCloseModal" class="btn-close" data-bs-dismiss="modal"
                    aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form class="bg-light p-3" id="formCategory">
                    <div class="mb-3">
                        <label for="inputQuantity" class="form-label">Cantidad:</label>
                        ${quantitySelectHtml(product.stock)}
                        <div id="QuantityHelp" class="form-text">Cantidad de productos a comprar.
                        </div>
                    </div>
                    <div class="mb-3">
                        <label for="inputColor" class="form-label">Color:</label>
                        ${colorsSelectHtml(product.colors)}
                        <div id="ColorHelp" class="form-text">Color del producto a comprar.
                        </div>
                    </div>
                    <div class="mb-3">
                        <label for="inputSize" class="form-label">Talla:</label>
                        ${sizesSelectHtml(product.sizes)}
                        <div id="SizeHelp" class="form-text">Talla del producto a comprar.
                        </div>
                    </div>
                    <button class="btn btn-warning" id="btnFormUpdate" data-id="${details._id}">
                        <i class="fa-solid fa-pen-to-square"></i>
                        Actualizar
                    </button>
                    <button class="btn btn-danger" id="btnFormCancel" data-bs-dismiss="modal" >
                        <i class="fa-solid fa-x"></i>
                        Cancelar
                    </button>
                </form>
            </div>
        </div> `;

            shoppingCartModal.innerHTML = dataDescription;

            document.getElementById('form-quantity-select').value = details.quantity;
            document.getElementById('form-colors-select').value = details.color;
            document.getElementById('form-sizes-select').value = details.size;

            const formModal = document.getElementById('formCategory');
            formModal.addEventListener("submit", (event) => {
                event.preventDefault();
            })

            const btnFormUpdate = document.getElementById('btnFormUpdate');
            btnFormUpdate.addEventListener('click', () => {
                let objectId = btnFormUpdate.getAttribute('data-id');
                updateItemShoppingCart(objectId);
            })
        }

    } catch (error) {
        console.error('Error al consultar los items:', error.message);
        throw new Error(`Error al consultar los items:`, error.message);
    }
}

const prepareOrder = async () => {
    const token = await getToken();
    if (token) {
        console.log(token)
        window.location.href = '/pre-order.html'
    } else {
        alert('Generar el login')
        
    }
};

const createActionsBtnsShoppingCart = () => {
    const btnsEdit = document.querySelectorAll('.btnEdit');
    const btnsDelete = document.querySelectorAll('.btnDelete');
    
    const btnRedeemCoupon = document.getElementById('btnRedeemCoupon');
    const btnPay = document.getElementById('btnPay');


    btnsEdit.forEach((btnEdit) => {
        btnEdit.addEventListener('click', () => {
            let objectId = btnEdit.getAttribute('data-id');
            // btnFormUpdate.setAttribute("data-id", objectId);
            editItemShoppingCart(objectId);
        })
    })


    btnsDelete.forEach((btnDelete) => {
        btnDelete.addEventListener('click', () => {
            let objectId = btnDelete.getAttribute('data-id');
            deleteItemShoppingCart(objectId);
        })
    });

    btnRedeemCoupon.addEventListener('click', () => {
        let inputCoupon = document.getElementById('inputCoupon').value;
        if (inputCoupon != '') {
            redeemCoupon(inputCoupon);
        } else {
            alert('Debe introducir el código para canjearlo.')
        }
    })

    btnPay.addEventListener('click', () => {
        prepareOrder();
    })
}

const createShoppingCartHTML = () => {
    const itemsList = document.getElementById('itemsList');
    const totals = document.getElementById('totals');
    itemsList.innerHTML = `<div class="item item-body d-flex flex-column w-100"><strong> Buscando productos ... </strong></div>`;

    getShoppingCarts()
        .then(data => {
            let shoppingCart = [];
            let details = [];

            if (data?.shoppingCart && data?.details) {
                shoppingCart = data.shoppingCart;
                details = data.details;
            }


            if (details.length == 0) {
                itemsList.innerHTML = `<div class="item border row row-cols-1 p-1 my-1">
                                        <div class="col-4 col-sm-2 d-flex align-items-center">
                                            <div class="ratio ratio-1x1 ">
                                                <img src="../../assets/images/logo200.png" class="img-fluid rounded-start" alt="Sin productos en carrito.">
                                            </div>
                                        </div>
                                        <div class="col-8 col-sm-9 d-flex align-items-center" >
                                            <div class="item item-body d-flex flex-column w-100">
                                                <div class="item-title">
                                                    <h2 class="card-title text-center text-sm-start">Sin productos en el carrito...</h2>
                                                </div>
                                                <a href="./products.html">Seguir comprando... </a>
                                            </div>
                                        </div>
                                    </div>`;
            }

            if (shoppingCart[0]?.coupon?.code) {
                const viewCoupon = document.getElementById('viewCoupon');

                const itemCoupon = `
                        <p class="m-2"><strong>Cupón:</strong> ${shoppingCart[0].coupon.code} </p>
                        <button class="btn btn-danger btn-sm m-1" title="Eliminar cupón" id="btnRemoveCoupon">
                            <i class="fa-solid fa-x"></i>
                        </button>
                    `;

                viewCoupon.innerHTML = itemCoupon;

                const btnRemoveCoupon = document.getElementById('btnRemoveCoupon');
                btnRemoveCoupon.addEventListener('click', () => {
                    removeCoupon(shoppingCart[0]._id);
                })
            }

            if (details.length > 0) {

                let items = ``;
                details.forEach(item => {
                    items += ` 
                    <div class="item border row row-cols-1 p-1 my-1">
                        <div class="col-4 col-sm-2 d-flex align-items-center">
                            <div class="ratio ratio-1x1 ">
                                <img src="${(item?.product?.images[0]) ? item.product.images[0] : `../assets/img/logo.png`}" 
                                class="img-fluid rounded-start" alt="${(item?.product?.name) ? item.product.name : `Imagen no disponible.`}"}">
                            </div>
                        </div>

                        <div class="col-8 col-sm-9 d-flex align-items-center" >
                            <div class="item item-body d-flex flex-column w-100">
                                <div class="item-title">
                                    <h2 class="card-title text-center text-sm-start">${item.product.name}</h2>
                                </div>
                                <div class="cart_detail d-flex flex-row justify-content-between">
                                    <p> Cantidad: <strong> ${item.quantity} </strong></p>
                                    <p> <strong> ${item.size} </strong> </p>
                                    <p> <strong> ${item.color}  </strong> </p>
                                    <p> <strong> $ ${item.total} </strong> </p>
                                </div>
                                <div class="btns d-flex flex-row justify-content-between justify-content-sm-end g-2">
                                    <button class="btn btn-warning btn-sm mx-sm-2 btnEdit" role="button" id="btnEdit" data-id="${item._id}" data-bs-toggle="modal"
                                    data-bs-target="#exampleModal">
                                        <i class="fa-solid fa-pen-to-square"></i>
                                        Editar
                                    </button>

                                    <button class="btn btn-danger btn-sm btnDelete" role="button" id="btnDelete" data-id="${item._id}" >
                                        <i class="fa-solid fa-trash"></i>
                                        Borrar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>`;

                });

                itemsList.innerHTML = items;


                let totalsHtml = ` 
                    <div class="cart_detail d-flex flex-row justify-content-between">
                            <p> Sub Total </p>
                            <p>$ <strong>${shoppingCart[0].totalWithoutCoupon}</strong> </p>

                        </div>
                        <div class="cart_detail d-flex flex-row justify-content-between">
                            <p> Descuento </p>
                            <p> <strong>${shoppingCart[0].couponDiscount} %</strong> </p>

                        </div>
                        <div class="cart_detail d-flex flex-row justify-content-between mt-2">
                            <h2> Total </h2>
                            <h2>$ <strong>${shoppingCart[0].total}</strong> </h2>
                    </div>
                    `;

                totals.innerHTML = totalsHtml;

                createActionsBtnsShoppingCart();

            } else {
                console.log('No se pudieron obtener items del carrito.');
            }
        });
}

const redeemCoupon = async (inputCoupon) => {
    try {

        // Data to send in the POST request
        const data = {
            code: inputCoupon,
        };

        const idShoppingCart = getIdShoppingCart();
        if (idShoppingCart) {
            data.idShoppingCart = idShoppingCart;
            const response = await fetch(`${URL_API}/coupons/redeem`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })

            if (!response.ok) {
                throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`);
            }

            const coupon = await response.json();
            window.location.href = '../../shopping-cart.html'
            return coupon;
        }

        return null;
    } catch (error) {
        console.error('Error al crear el género:', error);
        throw new Error(`Error al crear el género:`, error);
    }
}

const removeCoupon = async (couponCode) => {
    try {

        const idShoppingCart = getIdShoppingCart();
        if (idShoppingCart) {

            const response = await fetch(`${URL_API}/coupons/remove/${couponCode}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (!response.ok) {
                throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`);
            }

            const coupon = await response.json();
            window.location.href = '../../shopping-cart.html'
            return coupon;
        }

        return null;
    } catch (error) {
        console.error('Error al crear el género:', error);
        throw new Error(`Error al crear el género:`, error);
    }
}

const goToShoppingCart = () => {
    window.location.href = '../../shopping-cart.html';
}


getNumberItems();