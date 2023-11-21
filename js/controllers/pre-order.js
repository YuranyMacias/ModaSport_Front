
const btnMercadoPago = document.getElementById('btnMercadoPago');
const btnCash = document.getElementById('btnCash');




btnMercadoPago.addEventListener('click', () => {
    console.log('btnMercadoPago')
    generateOrder('MercadoPago')
})

btnCash.addEventListener('click', () => {
    console.log('btnCash')
    generateOrder('Cash')
})



// const createShoppingCart = async (productId, quantity = 1, color, size) => {
//     try {

//         const data = {
//             products: [{
//                 id: productId,
//                 quantity: parseInt(quantity),
//                 color,
//                 size
//             }]
//         };

//         const idShoppingCart = getIdShoppingCart();
//         const optionalToken = getOptionalToken();

//         if (idShoppingCart) {
//             data.idShoppingCart = idShoppingCart;
//             const response = await fetch(`${URL_API}/shopping-cart-details/${idShoppingCart}`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify(data)
//             })

//             if (!response.ok) {
//                 throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`);
//             }

//             const shoppingCart = await response.json();

//             window.location.href = '../../shopping-cart.html'
//             return shoppingCart;
//         }


//         if (optionalToken) {
//             const response = await fetch(`${URL_API}/shopping-cart`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'x-token': `${optionalToken}`
//                 },
//                 body: JSON.stringify(data)
//             });

//             if (!response.ok) {
//                 throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`);
//             }


//             const shopping = await response.json();
//             const shoppingCartId = shopping?.shoppingCart?._id;
//             if (shoppingCartId) {
//                 saveIdShoppingCart(shoppingCartId)
//             }
//             // window.location.href = '../../shopping-cart.html'
//             return shopping;
//         }

//         const response = await fetch(`${URL_API}/shopping-cart?skipJWTValidation=true`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(data)
//         })

//         if (!response.ok) {
//             throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`);
//         }

//         const shoppingCart = await response.json();
//         saveIdShoppingCart(shoppingCart.shoppingCart._id);
//         window.location.href = '../../shopping-cart.html'
//         return shoppingCart;

//         return null;

//     } catch (error) {
//         console.error('Error al crear el género:', error);
//         throw new Error(`Error al crear el género:`, error);
//     }
// }






// Form edit
const methodPaypal = () => {
    console.log('PayPal')
}

const methodMercadoPago = async (itemsOrder, code) => {
    console.log('MercadoPago')
    let orderId = '';
    try {
        const token = await getToken();

        if (itemsOrder.length > 0) {
            const data = {
                products: itemsOrder
            }

            if (code) {
                data.code = code;
            }

            console.log(data)

            if (token) {
                const response = await fetch(`${URL_API}/orders`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-token': `${token}`
                    },
                    body: JSON.stringify(data)
                });

                if (!response.ok) {
                    throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`);
                }


                const dataOrder = await response.json();
                console.log(dataOrder)
                console.log(dataOrder?.order?._id)
                orderId = dataOrder?.order?._id;
            }





            const dataM = {
                idOrder: orderId,
                paymentType: "mercadoPago"
            }

            if (token) {
                const response = await fetch(`${URL_API}/payments`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-token': `${token}`
                    },
                    body: JSON.stringify(dataM)
                });

                if (!response.ok) {
                    throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`);
                }


                const dataOrder = await response.json();
                console.log(dataOrder)
                console.log(dataOrder.paymentDetail.init_point)
                // window.location.href = dataOrder.init_point;
                window.open(dataOrder.paymentDetail.init_point, '_blank');
                return dataOrder;
            }
        }











    } catch (error) {
        console.log(error)
    }
}

const methodCash = async (itemsOrder, code) => {
    try {
        if (itemsOrder.length > 0) {
            const data = {
                products: itemsOrder
            }

            if (code) {
                data.code = code;
            }

            console.log(data)
            const token = await getToken();
            if (token) {
                const response = await fetch(`${URL_API}/orders`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-token': `${token}`
                    },
                    body: JSON.stringify(data)
                });

                if (!response.ok) {
                    throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`);
                }


                const dataOrder = await response.json();
                console.log(dataOrder)
                console.log(dataOrder?.order?._id)
                const urlInvoice = `/invoice.html?idOrder=${dataOrder?.order?._id}`;
                window.location.href = urlInvoice;
                return dataOrder;
            }
        }
    } catch (error) {
        console.error('Error en el método de pago cash:', error);
        throw new Error(`Error en el método de pago cash:`, error);
    }
}


const generateOrder = async (methodPayment = '') => {
    const orderTemp = await getShoppingCarts();
    let details = orderTemp?.details || [];
    let code = orderTemp?.shoppingCart?.[0]?.coupon?.code || '';

    let shoppingCart;
    let itemsOrder = [];

    if (details.length > 0) {
        itemsOrder = details.map((item) => {
            return { id: item.product._id, quantity: parseInt(item.quantity), color: item.color, size: item.size }
        })
    } else {
        console.log("Lista de artículos vacíos.")
        return null;
    }


    switch (methodPayment) {
        case 'PayPal':
            methodPaypal(itemsOrder, code);
            break;
        case 'MercadoPago':
            methodMercadoPago(itemsOrder, code);
            break;
        case 'Cash':
            methodCash(itemsOrder, code);
            break;
        default:
            console.log('No seleccionado')
            console.log({ methodPayment })
            break;
    }
};



const createItemsPreOrderHTML = () => {
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
                                    <p class="card-title text-center text-sm-start"> <strong> ${item.product.name} </strong></p>
                                </div>
                                <div class="cart_detail d-flex flex-row justify-content-between">
                                    <p> Cantidad: <strong> ${item.quantity} </strong></p>
                                    <p> <strong> ${item.size} </strong> </p>
                                    <p> <strong> ${item.color}  </strong> </p>
                                    <p> <strong> $ ${item.total} </strong> </p>
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


            } else {
                console.log('No se pudieron obtener items del carrito.');
            }
        });
}

createItemsPreOrderHTML();