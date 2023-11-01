const divInvoiceCustomer = document.getElementById('invoice-customer');
const tbody = document.getElementById('tbody');
const totals = document.getElementById('totals');


const urlParams = new URLSearchParams(window.location.search);
const idOrder = urlParams.get('idOrder') || null;
console.log('idOrder:', idOrder);

const getOrderById = async (idOrder) => {
    try {
        const token = await getToken();
        console.log(token)
        if (token) {
            const response = await fetch(`${URL_API}/orders/${idOrder}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-token': `${token}`
                }
            })

            if (!response.ok) {
                throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();
            console.log(data)

            return data;
        }
        return null;
    } catch (error) {
        console.error('Error al consultar orden por id:', error.message);
        throw new Error(`Error al consultar orden por id:`, error.message);
    }
}

const createItemsPreOrderHTML = () => {
    tbody.innerHTML = '';
    tbody.innerHTML = `<div class="item item-body d-flex flex-column w-100"><strong> Buscando productos ... </strong></div>`;

    if (!idOrder) {
        tbody.innerHTML = `<div class="item item-body d-flex flex-column w-100"><strong> No se puede consultar. </strong></div>`;
        console.log('Id de la orden vacía.')
        return null;
    }

    getOrderById(idOrder)
        .then(data => {

            if (data?.message) {
                tbody.innerHTML = `<div class="item item-body d-flex flex-column w-100"><strong> ${data?.message}. </strong></div>`;
                return null;
            }

            let invoice;
            let details = [];

            console.log(data)

            if (data?.order?.[0] && data?.details) {
                invoice = data.order[0];
                details = data.details;
            }

            console.log(invoice)
            console.log(details)


            if (details.length == 0) {
                tbody.innerHTML = `<div class="item item-body d-flex flex-column w-100"><strong> Sin detalles de factura. </strong></div>`;
            }

            if (invoice) {
                divInvoiceCustomer.innerHTML = '';
                const fullName = `${(invoice.customer.name) ? invoice.customer.name : ''} ${(invoice.customer.lastname) ? invoice.customer.lastname : ''}`;
                let customerHtml = `
                    <p><strong>Cliente:</strong> ${fullName} </p>
                    <p><strong>Email:</strong> ${invoice.customer.email} </p>
                    <p><strong>Fecha:</strong> ${invoice.date} </p>
                    <p><strong>Estado:</strong> ${invoice.orderStatus} </p>
                `;
                divInvoiceCustomer.innerHTML = customerHtml;
            }

            if (details.length > 0) {

                let items = ``;
                details.forEach(item => {
                    items += ` 
                    <tr>
                        <td>${item.product.name}</td>
                        <td>${item.color}</td>
                        <td>${item.size}</td>
                        <td>${item.quantity}</td>
                        <td>${item.price}</td>
                        <td>${item.discount} %</td>
                        <td>${item.total}</td>
                    </tr>`;

                });

                tbody.innerHTML = items;


                let totalsHtml = ` 
                    <div class="cart_detail d-flex flex-row justify-content-between">
                            <p> Sub Total </p>
                            <p>$ <strong>${invoice.totalWithoutCoupon}</strong> </p>

                        </div>
                        <div class="cart_detail d-flex flex-row justify-content-between">
                            <p> Descuento </p>
                            <p> <strong>${invoice.couponDiscount} %</strong> </p>

                        </div>
                        <div class="cart_detail d-flex flex-row justify-content-between mt-2">
                            <h2> Total </h2>
                            <h2>$ <strong>${invoice.total}</strong> </h2>
                    </div>
                    `;

                totals.innerHTML = totalsHtml;


            } else {
                console.log('No se pudieron obtener items del carrito.');
            }
        });
}

createItemsPreOrderHTML();