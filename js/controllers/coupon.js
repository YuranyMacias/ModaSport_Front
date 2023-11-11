const URLAPI = `${URL_API}/coupons`;

const getCoupons = async () => {
    try {
        let token = await getToken();
        console.log(token)

        const response = await fetch(`${URLAPI}`, {
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
        return data;
    } catch (error) {
        console.error('Error al consultar los cupones:', error.message);
        throw new Error(`Error al consultar los cupones:`, error.message);
    }
}

const createCoupon = async () => {
    try {
        const inputDiscount = document.getElementById('inputDiscount').value;
        const inputMaxUses = document.getElementById('inputMaxUses').value;
        const inputExpiration = document.getElementById('inputExpiration').value;

        // Data to send in the POST request
        const data = {
            discount: inputDiscount,
            expirationDate: inputExpiration,
            maxUses: inputMaxUses,
        };

        let token = await getToken();

        // Realizar la petición POST
        const response = await fetch(`${URLAPI}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-token': `${token}`
            },
            body: JSON.stringify(data)
        })

        const coupon = await response.json();

        if (!response.ok) {
            alert(`Alerta: ${coupon.message}`);
            console.log(coupon.message)
            return
        }

        console.log(coupon)

        location.reload();
        alert(`Cupón ${coupon.code} creada con éxito! `)
        closeModal();

    } catch (error) {
        console.error('Error al crear el cupón:', error);
        throw new Error(`Error al crear el cupón:`, error);
    }
}

const updateCoupon = async (objectId) => {
    try {
        const inputDiscount = document.getElementById('inputDiscount').value;
        const inputMaxUses = document.getElementById('inputMaxUses').value;
        const inputExpiration = document.getElementById('inputExpiration').value;

        // Data to send in the POST request
        const data = {
            discount: inputDiscount,
            expirationDate: inputExpiration,
            maxUses: inputMaxUses,
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

        const coupon = await response.json();

        if (!response.ok) {
            alert(`Alerta: ${coupon.message}`);
            console.log(coupon.message)
            return
        }

        console.log(coupon)

        location.reload();
        alert(`Cupón ${coupon.code} actualizada con éxito! `)
        closeModal();

    } catch (error) {
        console.error('Error al crear el cupón:', error);
        throw new Error(`Error al crear el cupón:`, error);
    }
}

const deleteCoupon = async (objectId) => {

    const confirmDelete = confirm('Desea eliminar el cupón?');
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
            alert(`Cupón ${data.code} eliminada con éxito! `)

        } catch (error) {
            console.error('Error al eliminar el cupón:', error.message);
            throw new Error(`Error al eliminar el cupón:`, error.message);
        }
    }
}

const editCoupon = async (objectId) => {
    const inputDiscount = document.getElementById('inputDiscount');
    const inputMaxUses = document.getElementById('inputMaxUses');
    const inputExpiration = document.getElementById('inputExpiration');
    const btnFormCreate = document.getElementById('btnFormCreate');
    const btnFormUpdate = document.getElementById('btnFormUpdate');

    btnFormCreate.style.display = "none";
    btnFormUpdate.style.display = "inline-block";

    try {
        let token = await getToken();
        console.log(token)

        const response = await fetch(`${URLAPI}/${objectId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-token': `${token}`
            }
        })

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`);
        }

        let { discount, expirationDate, maxUses } = await response.json();
        inputDiscount.value = discount;
        inputMaxUses.value = maxUses;
        inputExpiration.value = dateFormatted(expirationDate);

    } catch (error) {
        console.error('Error al consultar las cupones:', error.message);
        throw new Error(`Error al consultar las cupones:`, error.message);
    }
}

const createActionsBtnsCoupons = () => {
    const btnsEdit = document.querySelectorAll('.btnEdit');
    const btnsEliminar = document.querySelectorAll('.btnEliminar');

    const btnCreateModal = document.getElementById('btnCreateModal');

    const formModal = document.getElementById("formCoupon");
    const btnFormCreate = document.getElementById('btnFormCreate');
    const btnFormUpdate = document.getElementById('btnFormUpdate');

    // Edit buttons, in each of the rows of the records.
    btnsEdit.forEach(btnEdit => {
        btnEdit.addEventListener('click', () => {
            let objectId = btnEdit.getAttribute('data-id');
            btnFormUpdate.setAttribute("data-id", objectId);
            editCoupon(objectId);
        })
    })

    // delete buttons, in each of the rows of the records.
    btnsEliminar.forEach(btnEliminar => {
        btnEliminar.addEventListener('click', () => {
            let objectId = btnEliminar.getAttribute('data-id');
            deleteCoupon(objectId);
        })
    })


    formModal.addEventListener("submit", (event) => {
        event.preventDefault();
    })

    btnCreateModal.addEventListener("click", () => {
        formModal.reset();
        btnFormCreate.style.display = "inline-block";
        btnFormUpdate.style.display = "none";
    });

    btnFormCreate.addEventListener('click', () => {
        createCoupon();
    })

    btnFormUpdate.addEventListener('click', () => {
        let objectId = btnFormUpdate.getAttribute('data-id');
        updateCoupon(objectId);
    })


}

const dateFormatted = (expirationDate) => {
    const fecha = new Date(expirationDate);
    return fecha.toISOString().split('T')[0];
}

const createDataTable = () => {
    const tableBody = document.getElementById('tbody');
    tableBody.innerHTML = `<tr><td colspan="4"> Consultando datos... </td></tr>`

    getCoupons()
        .then(data => {
            const { totalCoupons, coupons } = data;

            if (coupons.length === 0) {
                tableBody.innerHTML = `<tr><td colspan="4"> Sin datos para mostrar </td></tr>`
            }

            if (coupons) {
                console.log('Cupones:', totalCoupons);
                console.log('Cupones:', coupons);
                // Hacer algo con las cupones recibidas
                let tdata = ``;
                coupons.forEach(coupon => {



                    tdata += `<tr> 
                        <td>${coupon.code}</td>
                        <td>${coupon.discount} %</td>
                        <td>${coupon.uses} / ${coupon.maxUses} </td>
                        <td>${dateFormatted(coupon.expirationDate)}</td>
                        <td>
                            <button  class="btn btn-warning btn-sm btnEdit" data-bs-target="#exampleModal" data-bs-toggle="modal" title="Editar cupón" data-id="${coupon._id}">
                                <i class="fa-solid fa-pen-to-square m-1"></i>
                                Editar
                            </button>
                        </td>
                        <td>
                            <button class="btn btn-danger btn-sm btnEliminar" title="Eliminar cupón"  data-id="${coupon._id}">
                                <i class="fa-solid fa-trash m-1"></i>
                                Eliminar
                            </button>
                        </td>
                    </tr>`;

                });

                tableBody.innerHTML = tdata;

                createActionsBtnsCoupons();

            } else {
                console.log('No se pudieron obtener los cupones.');
                // Tomar medidas alternativas si no se pudieron obtener los cupones
            }
        });
}



const closeModal = () => {
    const btnCloseModal = document.getElementById('btnCloseModal')
    btnCloseModal.click();
}


createDataTable();