const URLAPI = `${URL_API}/orders`;

const getOrders = async () => {
    try {
        const optionalToken = getOptionalToken();
        if (optionalToken) {
            const response = await fetch(`${URL_API}/orders/find/ByUser`, {
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
        console.error('Error al consultar los pedidos:', error.message);
        throw new Error(`Error al consultar los pedidos:`, error.message);
    }
}


const updateProduct = async (objectId) => {
    try {
        const inputName = document.getElementById('inputName').value;
        const inputDescription = document.getElementById('inputDescription').value;
        const inputReference = document.getElementById('inputReference').value;
        const inputPrice = document.getElementById('inputPrice').value;
        const inputStock = document.getElementById('inputStock').value;
        const inputDiscount = document.getElementById('inputDiscount').value;
        const inputBrand = document.getElementById('inputBrand').value;
        const selectCategory = document.getElementById('selectCategory').value;
        const selectGender = document.getElementById('selectGender').value;
        const selectSeason = document.getElementById('selectSeason').value;

        // Data to send in the POST request
        const data = {
            name: inputName,
            description: inputDescription,
            price: inputPrice,
            stock: inputStock,
            reference: inputReference,
            sizes: sizesListArr,
            colors: colorsListArr,
            discount: inputDiscount,
            brand: inputBrand,
            category: selectCategory,
            gender: selectGender,
            season: selectSeason,
        };

        let token = await getToken();

        // Realizar la petición POST
        const response = await fetch(`${URLAPI}/${objectId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-token': `${token}`
            },
            body: JSON.stringify(data)
        })

        const order = await response.json();

        if (!response.ok) {
            alert(`Alerta: ${order.message}`);
            console.log((order.message ? order.message : order.errors))
            return
        }

        console.log(order)

        location.reload();
        alert(`Producto ${order.name} actualizada con éxito! `)
        closeModal();

    } catch (error) {
        console.error('Error al crear el ordero:', error);
        throw new Error(`Error al crear el ordero:`, error);
    }
}


const deleteProduct = async (objectId) => {

    const confirmDelete = confirm('Desea eliminar el ordero?');
    if (confirmDelete) {
        try {
            let token = await getToken();

            const response = await fetch(`${URLAPI}/${objectId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'x-token': `${token}`
                }
            })

            if (!response.ok) {
                throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();


            location.reload();
            alert(`Género ${data.name} eliminada con éxito! `)

        } catch (error) {
            console.error('Error al eliminar el ordero:', error.message);
            throw new Error(`Error al eliminar el ordero:`, error.message);
        }
    }
}



const editProduct = async (objectId) => {
    const inputName = document.getElementById('inputName');
    const inputDescription = document.getElementById('inputDescription');
    const inputReference = document.getElementById('inputReference');
    const inputPrice = document.getElementById('inputPrice');
    const inputStock = document.getElementById('inputStock');
    const inputDiscount = document.getElementById('inputDiscount');
    const inputBrand = document.getElementById('inputBrand');


    const btnFormCreate = document.getElementById('btnFormCreate');
    const btnFormUpdate = document.getElementById('btnFormUpdate');

    btnFormCreate.style.display = "none";
    btnFormUpdate.style.display = "inline-block";

    try {
        let response = await fetch(`${URLAPI}/${objectId}`);

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();

        const {
            _id,
            name,
            description,
            price,
            stock,
            reference,
            available,
            images,
            sizes,
            colors,
            discount,
            brand,
            category,
            gender,
            season,
        } = data;

        inputName.value = name;
        inputDescription.value = description;
        inputReference.value = reference;
        inputPrice.value = price
        inputStock.value = stock
        inputDiscount.value = discount;
        inputBrand.value = brand;

        sizesListArr = sizes;
        colorsListArr = colors;

        ListDataSizesColors(sizesListArr, 'sizesList');
        ListDataSizesColors(colorsListArr, 'colorsList');

        dataSelects(category.name, gender.name, season.name);

    } catch (error) {
        console.error('Error al consultar los pedidos:', error.message);
        throw new Error(`Error al consultar los pedidos:`, error.message);
    }
}



const detailsProduct = async (objectId) => {
    const detailsTable = document.getElementById('detailsTable');
    detailsTable.innerHTML = `<tr><td colspan="8"> Consultando datos... </td></tr>`

    const response = await fetch(`${URLAPI}/${objectId}`);

    if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();

    if (!data) {
        detailsTable.innerHTML = `<tbody> <tr> <td colspan="4"> Sin datos para mostrar </td> </tr> </tbody>`
        return
    }

    const {
        _id,
        name,
        description,
        price,
        stock,
        reference,
        available,
        images,
        sizes,
        colors,
        discount,
        brand,
        category,
        gender,
        season,
    } = data;

    const btnEdit = document.getElementById('btnEdit');
    btnEdit.setAttribute("data-id", objectId);

    let imagesHTML = ``;
    if (images.length > 0) {
        images.forEach((image) => {
            imagesHTML += `<img src="${image}" alt="${name}" width="80px">`
        });
    } else {
        imagesHTML = `N/A`;
    }

    if (data) {
        let tdata = `<tbody>
            <tr>
                <th scope="row">Nombre</th>
                <td>${name}</td>
                <th scope="row">Disponible</th>
                <td> ${(available) ? "Si" : "No"} </td>
            </tr>
            <tr>
                <th scope="row">Descripción</th>
                <td colspan="3"> ${description}</td>
            </tr>
            <tr>
                <th scope="row">Precio</th>
                <td>$ ${price}</td>
                <th scope="row">Stock</th>
                <td> ${stock} </td>
            </tr>
            <tr>
                <th scope="row">Marca</th>
                <td> ${brand} </td>
                <th scope="row">Referencia</th>
                <td> ${reference} </td>
            </tr>
            <tr>
                <th scope="row">Tallas</th>
                <td> ${sizes} </td>
                <th scope="row">Colores</th>
                <td> ${colors}  </td>
            </tr>
            <tr>
                <th scope="row">Categoria</th>
                <td>${category.name}</td>
                <th scope="row">Genero</th>
                <td> ${gender.name} </td>
            </tr>
            <tr>
                <th scope="row">Temporada</th>
                <td>${season.name}</td>
                <th scope="row">Descuento</th>
                <td> ${discount} % </td>
            </tr>

            <tr>
                <th scope="row">
                    Imagenes
                    <button type="button" class="btn btn-warning btn-sm ml-2" data-bs-toggle="modal"
                        data-bs-target="#imagesModal" data-id="${objectId}" id="btnCreateImagesModal">
                        <i class="fa-solid fa-plus"></i>
                        Modificar imagenes
                    </button>
                </th>
                <td  colspan="3">
                    ${imagesHTML}
                </td>
            </tr>

        </tbody>`;


        detailsTable.innerHTML = tdata;


        const btnCreateImagesModal = document.getElementById('btnCreateImagesModal');
        btnCreateImagesModal.addEventListener('click', () => {
            const btnImagesSave = document.getElementById('btnImagesSave');
            btnImagesSave.setAttribute("data-id", objectId);

            const btnCloseDetailsModal = document.getElementById('btnCloseDetailsModal');
            btnCloseDetailsModal.click();
            preloadImages();
        })


        const btnImagesSave = document.getElementById('btnImagesSave');
        btnImagesSave.addEventListener('click', () => {
            let objectId = btnImagesSave.getAttribute('data-id');
            uploadImages(objectId);
        })


        btnEdit.addEventListener('click', () => {
            let objectId = btnEdit.getAttribute('data-id');
            const btnCloseDetailsModal = document.getElementById('btnCloseDetailsModal');
            btnCloseDetailsModal.click();
            editProduct(objectId);
            saveSizes();
            saveColors();
        })

    } else {
        console.log('No se pudieron obtener los pedidos.');
        // Tomar medidas alternativas si no se pudieron obtener los pedidos
    }

}

const createActionsOrderBtns = () => {
    const btnsDetails = document.querySelectorAll('.btnDetails');
    const btnsEliminar = document.querySelectorAll('.btnEliminar');

    // Edit buttons, in each of the rows of the records.
    btnsDetails.forEach(btnDetail => {
        btnDetail.addEventListener('click', () => {
            let objectId = btnDetail.getAttribute('data-id');
            console.log(objectId)
            const urlInvoice = `/invoice.html?idOrder=${objectId}`;
            window.location.href = urlInvoice;
        })
    })

    // delete buttons, in each of the rows of the records.
    btnsEliminar.forEach(btnEliminar => {
        btnEliminar.addEventListener('click', () => {
            let objectId = btnEliminar.getAttribute('data-id');
            console.log(objectId)
            // deleteProduct(objectId);
        })
    })

}

const createDataTable = () => {
    const tableBody = document.getElementById('tbody');
    tableBody.innerHTML = `<tr><td colspan="8"> Consultando datos... </td></tr>`

    getOrders()
        .then(data => {
            console.log(data)
            if (!data) {
                tableBody.innerHTML = `<tr><td colspan="8"> Error al consultar los datos, póngase en contacto con el administrador. </td></tr>`
                return null;
            }

            const { orders } = data;
            if (!orders || orders?.length == 0) {
                tableBody.innerHTML = `<tr><td colspan="8"> Sin datos para mostrar </td></tr>`
            }

            if (orders?.length > 0) {
                console.log('123')
                let tdata = ``;
                let cont = 1;
                orders.forEach(order => {
                    tdata += `<tr> 
                        <td>${cont}</td>
                        <td>Efectivo</td>
                        <td> ${(order?.couponDiscount > 0) ? order.couponDiscount : '0'} %</td>
                        <td> ${order.orderStatus}</td>
                        <td>${order.total}</td>
                        <td>${order.date}</td>
                        <td>
                            <button  class="btn btn-warning btn-sm btnDetails" data-bs-toggle="modal" id="btnDetailsOrder"
                            data-bs-target="#detailsModal" title="Ver detalles pedido" data-id="${order._id}">
                                <i class="fa-solid fa-pen-to-square m-1"></i>
                                Ver detalles
                            </button>
                        </td>
                    </tr>`;

                    cont++;
                });

                tableBody.innerHTML = tdata;

                createActionsOrderBtns();

            } else {
                console.log('No hay pedidos.');
                // Tomar medidas alternativas si no se pudieron obtener los pedidos
            }
        });
}





createDataTable();