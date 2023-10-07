const URLAPI = `${URL_API}/genders`;

const getGenders = async () => {
    try {
        const response = await fetch(URLAPI);

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al consultar los géneros:', error.message);
        throw new Error(`Error al consultar los géneros:`, error.message);
    }
}

const createGender = async () => {
    try {
        const inputName = document.getElementById('inputName').value;
        console.log({ inputName })

        // Data to send in the POST request
        const data = {
            name: inputName
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

        const gender = await response.json();

        if (!response.ok) {
            alert(`Alerta: ${gender.message}`);
            console.log(gender.message)
            return
        }

        console.log(gender)

        location.reload();
        alert(`Género ${gender.name} creada con éxito! `)
        closeModal();

    } catch (error) {
        console.error('Error al crear el género:', error);
        throw new Error(`Error al crear el género:`, error);
    }
}

const updateGender = async (objectId) => {
    try {
        const inputName = document.getElementById('inputName').value;
        console.log({ inputName })

        // Data to send in the POST request
        const data = {
            name: inputName
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

        const gender = await response.json();

        if (!response.ok) {
            alert(`Alerta: ${gender.message}`);
            console.log(gender.message)
            return
        }

        console.log(gender)

        location.reload();
        alert(`Género ${gender.name} actualizada con éxito! `)
        closeModal();

    } catch (error) {
        console.error('Error al crear el género:', error);
        throw new Error(`Error al crear el género:`, error);
    }
}

const deleteGender = async (objectId) => {

    const confirmDelete = confirm('Desea eliminar el género?');
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
            console.error('Error al eliminar el género:', error.message);
            throw new Error(`Error al eliminar el género:`, error.message);
        }
    }
}

const editGender = async (objectId) => {
    const inputName = document.getElementById('inputName');
    const btnFormCreate = document.getElementById('btnFormCreate');
    const btnFormUpdate = document.getElementById('btnFormUpdate');

    btnFormCreate.style.display = "none";
    btnFormUpdate.style.display = "inline-block";

    try {
        let response = await fetch(`${URLAPI}/${objectId}`);

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`);
        }

        let { name } = await response.json();
        inputName.value = name;

    } catch (error) {
        console.error('Error al consultar los géneros:', error.message);
        throw new Error(`Error al consultar los géneros:`, error.message);
    }
}

const createActionsBtns = () => {
    const btnsEdit = document.querySelectorAll('.btnEdit');
    const btnsEliminar = document.querySelectorAll('.btnEliminar');

    const btnCreateModal = document.getElementById('btnCreateModal');

    const formModal = document.getElementById("formGender");
    const btnFormCreate = document.getElementById('btnFormCreate');
    const btnFormUpdate = document.getElementById('btnFormUpdate');

    // Edit buttons, in each of the rows of the records.
    btnsEdit.forEach(btnEdit => {
        btnEdit.addEventListener('click', () => {
            let objectId = btnEdit.getAttribute('data-id');
            btnFormUpdate.setAttribute("data-id", objectId);
            editGender(objectId);
        })
    })

    // delete buttons, in each of the rows of the records.
    btnsEliminar.forEach(btnEliminar => {
        btnEliminar.addEventListener('click', () => {
            let objectId = btnEliminar.getAttribute('data-id');
            deleteGender(objectId);
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
        createGender();
    })

    btnFormUpdate.addEventListener('click', () => {
        let objectId = btnFormUpdate.getAttribute('data-id');
        updateGender(objectId);
    })


}


const createDataTable = () => {
    const tableBody = document.getElementById('tbody');
    tableBody.innerHTML = `<tr><td colspan="4"> Consultando datos... </td></tr>`

    getGenders()
        .then(data => {
            const { totalGenders, genders } = data;

            if (genders.length === 0) {
                tableBody.innerHTML = `<tr><td colspan="4"> Sin datos para mostrar </td></tr>`
            }

            if (genders) {
                console.log('Géneros:', totalGenders);
                console.log('Géneros:', genders);
                // Hacer algo con los géneros recibidas
                let tdata = ``;
                let cont = 1;
                genders.forEach(gender => {
                    tdata += `<tr> 
                        <td>${cont}</td>
                        <td>${gender.name}</td>
                        <td>
                            <button  class="btn btn-warning btn-sm btnEdit" data-bs-target="#exampleModal" data-bs-toggle="modal" title="Editar género" data-id="${gender._id}">
                                <i class="fa-solid fa-pen-to-square m-1"></i>
                                Editar
                            </button>
                        </td>
                        <td>
                            <button class="btn btn-danger btn-sm btnEliminar" title="Eliminar género"  data-id="${gender._id}">
                                <i class="fa-solid fa-trash m-1"></i>
                                Eliminar
                            </button>
                        </td>
                    </tr>`;

                    cont++;
                });

                tableBody.innerHTML = tdata;

                createActionsBtns();

            } else {
                console.log('No se pudieron obtener los géneros.');
                // Tomar medidas alternativas si no se pudieron obtener los géneros
            }
        });
}

const getDataLocalStorage = (nameItem) => {
    return localStorage.getItem(nameItem);
}

const setDataLocalStorage = (nameItem, item) => {
    localStorage.setItem(nameItem, item)
}

const closeModal = () => {
    const btnCloseModal = document.getElementById('btnCloseModal')
    btnCloseModal.click();
}


createDataTable();