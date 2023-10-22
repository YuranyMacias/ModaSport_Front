const URLAPI = `${URL_API}/users`;

const getUsers = async () => {
    try {

        let token = await getToken();

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
        console.error('Error al consultar los usuarios:', error.message);
        throw new Error(`Error al consultar los usuarios:`, error.message);
    }
}

const createUser = async () => {
    try {
        const inputName = document.getElementById('inputName').value;
        const inputLastname = document.getElementById('inputLastname').value;
        const inputEmail = document.getElementById('inputEmail').value;
        const inputPassword = document.getElementById('inputPassword').value;
        const inputPhone = document.getElementById('inputPhone').value;
        const selectRole = document.getElementById('selectRole').value;

        if (!isPasswordMatch()) {
            alert('Por favor! verificar Clave, es incorrecta, no coinciden!')
            return;
        }

        if (selectRole === '') {
            alert('Por favor! verificar ROL de usuario, es incorrecto.')
            return;
        }

        // Data to send in the POST request
        const data = {
            name: inputName,
            lastname: inputLastname,
            email: inputEmail,
            password: inputPassword,
            phone: inputPhone,
            role: selectRole
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

        const user = await response.json();

        if (!response.ok) {
            alert(`Alerta: ${user.message ? user.message : user.errors[0].msg}`);
            console.log('Error : ', user.message ? user.message : user.errors[0].msg )
            return
        }

        console.log(user)

        location.reload();
        alert(`Usuario ${user.email} creado con éxito! `)
        closeModal();

    } catch (error) {
        console.error('Error al crear el usuario:', error);
        throw new Error(`Error al crear el usuario:`, error);
    }
}

const updateUser = async (objectId) => {
    try {
        const inputName = document.getElementById('inputName').value;
        const inputLastname = document.getElementById('inputLastname').value;
        const inputEmail = document.getElementById('inputEmail').value;
        const inputPhone = document.getElementById('inputPhone').value;
        const selectRole = document.getElementById('selectRole').value;

        if (selectRole === '') {
            alert('Por favor! verificar ROL de usuario, es incorrecto.')
            return;
        }

        // Data to send in the POST request
        const data = {
            name: inputName,
            lastname: inputLastname,
            email: inputEmail,
            phone: inputPhone,
            role: selectRole
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

        const user = await response.json();

        if (!response.ok) {
            alert(`Alerta: ${user.message ? user.message : user.errors[0].msg}`);
            console.log('Error : ', user.message ? user.message : user.errors[0].msg )
            return
        }

        console.log(user)

        location.reload();
        alert(`Usuario ${user.email} actualizada con éxito! `)
        closeModal();

    } catch (error) {
        console.error('Error al crear el usuario:', error);
        throw new Error(`Error al crear el usuario:`, error);
    }
}

const deleteUser = async (objectId) => {

    const confirmDelete = confirm('Desea eliminar el usuario?');
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
            alert(`Usuario ${data.email} eliminada con éxito! `)

        } catch (error) {
            console.error('Error al eliminar el usuario:', error.message);
            throw new Error(`Error al eliminar el usuario:`, error.message);
        }
    }
}

const editUser = async (objectId) => {
    const btnFormCreate = document.getElementById('btnFormCreate');
    const btnFormUpdate = document.getElementById('btnFormUpdate');

    btnFormCreate.style.display = "none";
    btnFormUpdate.style.display = "inline-block";

    const inputPassword = document.getElementById('inputPassword');
    const inputConfirmPassword = document.getElementById('inputConfirmPassword');
    inputPassword.value = '';
    inputConfirmPassword.value = '';
    inputPassword.disabled = true;
    inputConfirmPassword.disabled = true;

    try {

        let token = await getToken();

        let response = await fetch(`${URLAPI}/${objectId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-token': `${token}`
            }
        })

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`);
        }

        let user = await response.json();
        const inputName = document.getElementById('inputName').value = user.name;
        const inputLastname = document.getElementById('inputLastname').value = user.lastname;
        const inputEmail = document.getElementById('inputEmail').value = user.email;
        const inputPhone = document.getElementById('inputPhone').value = user.phone;
        const selectRole = document.getElementById('selectRole').value = user.role;

    } catch (error) {
        console.error('Error al consultar los usuarios:', error.message);
        throw new Error(`Error al consultar los usuarios:`, error.message);
    }
}

const createActionsBtns = () => {
    const btnsEdit = document.querySelectorAll('.btnEdit');
    const btnsEliminar = document.querySelectorAll('.btnEliminar');

    const btnCreateModal = document.getElementById('btnCreateModal');

    const formModal = document.getElementById("formUser");
    const btnFormCreate = document.getElementById('btnFormCreate');
    const btnFormUpdate = document.getElementById('btnFormUpdate');

    const inputPassword = document.getElementById('inputPassword');
    const inputConfirmPassword = document.getElementById('inputConfirmPassword');

    // Edit buttons, in each of the rows of the records.
    btnsEdit.forEach(btnEdit => {
        btnEdit.addEventListener('click', () => {
            let objectId = btnEdit.getAttribute('data-id');
            btnFormUpdate.setAttribute("data-id", objectId);
            editUser(objectId);
        })
    })

    // delete buttons, in each of the rows of the records.
    btnsEliminar.forEach(btnEliminar => {
        btnEliminar.addEventListener('click', () => {
            let objectId = btnEliminar.getAttribute('data-id');
            deleteUser(objectId);
        })
    })


    formModal.addEventListener("submit", (event) => {
        event.preventDefault();
    })

    btnCreateModal.addEventListener("click", () => {
        formModal.reset();
        btnFormCreate.style.display = "inline-block";
        btnFormUpdate.style.display = "none";

        inputPassword.disabled = false;
        inputConfirmPassword.disabled = false;
    });

    btnFormCreate.addEventListener('click', () => {
        createUser();
    })

    btnFormUpdate.addEventListener('click', () => {
        let objectId = btnFormUpdate.getAttribute('data-id');
        updateUser(objectId);
    })

}

const createDataTable = () => {
    const tableBody = document.getElementById('tbody');
    tableBody.innerHTML = `<tr><td colspan="4"> Consultando datos... </td></tr>`

    getUsers()
        .then(data => {
            const { totalUsers, users } = data;

            if (users.length === 0) {
                tableBody.innerHTML = `<tr><td colspan="4"> Sin datos para mostrar </td></tr>`
            }

            if (users) {
                console.log('Usuarios:', totalUsers);
                console.log('Usuarios:', users);
                // Hacer algo con los usuarios recibidas
                let tdata = ``;
                let cont = 1;
                users.forEach(user => {
                    tdata += `<tr> 
                        <td>${cont}</td>
                        <td>${user.email}</td>
                        <td>${user.role}</td>
                        <td>${user.name}</td>
                        <td>${(user.google) ? `SI` : 'NO'}</td>
                        <td>${(user.image) ? `<img src="${user.image}" alt="${user.name}" width="50px"/>` : 'N/A'}</td>
                        <td>
                            <button  class="btn btn-warning btn-sm btnEdit" data-bs-target="#exampleModal" data-bs-toggle="modal" title="Editar usuario" data-id="${user.uid}">
                                <i class="fa-solid fa-pen-to-square m-1"></i>
                                Editar
                            </button>
                        </td>
                        <td>
                            <button class="btn btn-danger btn-sm btnEliminar" title="Eliminar usuario"  data-id="${user.uid}">
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
                console.log('No se pudieron obtener los usuarios.');
                // Tomar medidas alternativas si no se pudieron obtener los usuarios
            }
        });
}

const closeModal = () => {
    const btnCloseModal = document.getElementById('btnCloseModal')
    btnCloseModal.click();
}


createDataTable();