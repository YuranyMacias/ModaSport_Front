const URLAPI = `${URL_API}/products`;

let sizesListArr = [];
let colorsListArr = [];

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

const createProduct = async () => {
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

        console.log(data)

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

        const product = await response.json();

        if (!response.ok) {
            alert(`Alerta: ${product.message}`);
            console.log(product.message)
        }


        location.reload();
        alert(`Producto ${product.name} creada con éxito! `)
        closeModal();

    } catch (error) {
        console.error('Error al crear el producto:', error);
        throw new Error(`Error al crear el producto:`, error);
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

        const product = await response.json();

        if (!response.ok) {
            alert(`Alerta: ${product.message}`);
            console.log((product.message ? product.message : product.errors))
            return
        }

        console.log(product)

        location.reload();
        alert(`Producto ${product.name} actualizada con éxito! `)
        closeModal();

    } catch (error) {
        console.error('Error al crear el producto:', error);
        throw new Error(`Error al crear el producto:`, error);
    }
}

const deleteProduct = async (objectId) => {

    const confirmDelete = confirm('Desea eliminar el producto?');
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
            console.error('Error al eliminar el producto:', error.message);
            throw new Error(`Error al eliminar el producto:`, error.message);
        }
    }
}

const preloadImages = async () => {
    // Obtén una referencia al campo de entrada de archivos y al contenedor de vista previa
    const images = document.getElementById('inputImages');
    const imagesListDiv = document.getElementById('imagesList');
    imagesListDiv.innerHTML = '';

    // Escucha el evento 'change' en el campo de entrada de archivos
    images.addEventListener('change', function () {
        // Limpia cualquier vista previa existente
        imagesListDiv.innerHTML = '';

        // Recorre los archivos seleccionados
        for (let i = 0; i < images.files.length; i++) {
            const file = images.files[i];

            // Verifica si el archivo es una imagen
            if (file.type.match('image.*')) {
                let reader = new FileReader();

                reader.onload = function (e) {
                    // Crea un elemento de imagen para la vista previa
                    let img = document.createElement('img');
                    img.src = e.target.result;
                    img.style.maxWidth = '200px'; // Establece el tamaño máximo de la vista previa
                    img.classList.add('m-1');

                    // Agrega la imagen a la vista previa
                    imagesListDiv.appendChild(img);
                };

                // Lee el archivo como una URL de datos
                reader.readAsDataURL(file);
            }
        }
    });
}

const uploadImages = async (objectId) => {
    try {
        let images = document.getElementById('inputImages');

        if (!images.files.length) {
            alert('Sin archivos selecionados');
            return;
        }

        let fileImages = [];
        for (let i = 0; i < images.files.length; i++) {
            fileImages.push(images.files[i]);
        }

        fileImages.forEach((file) => {
            // Verifica si el archivo es una imagen
            if (file.type.match('image.*')) {

            } else {
                alert('Archivo no es una imagen.');
                return;
            }
        })


        const formData = new FormData();
        for (let i = 0; i < images.files.length; i++) {
            formData.append('file', images.files[i]);
        }


        // const formData = new FormData();
        // formData.append('files', fileImages[0]);

        console.log(fileImages)

        let token = await getToken();

        // Realizar la petición POST
        const response = await fetch(`${URL_API}/uploads/products/${objectId}`, {
            method: 'PUT',
            headers: {
                // 'Content-Type': 'multipart/form-data',
                'x-token': `${token}`
            },
            body: formData
        })

        const product = await response.json();

        if (!response.ok) {
            alert(`Alerta: ${product.message}`);
            console.log((product.message ? product.message : product.errors))
            return
        }

        console.log(product)

        location.reload();
        alert(`Imagenes de producto actualizada con éxito! `)

    } catch (error) {
        console.error('Error al crear el producto:', error);
        throw new Error(`Error al crear el producto:`, error);
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
        console.error('Error al consultar los productos:', error.message);
        throw new Error(`Error al consultar los productos:`, error.message);
    }
}

const dataSelects = async (category = '', gender = '', season = '') => {
    try {
        let [resCategories, resGenders, resSeasons] = await Promise.all([
            fetch(`${URL_API}/categories`),
            fetch(`${URL_API}/genders`),
            fetch(`${URL_API}/seasons`)
        ]);

        const { categories } = await resCategories.json();
        const { genders } = await resGenders.json();
        const { seasons } = await resSeasons.json();

        const selectCategory = document.getElementById('selectCategory');
        selectCategory.innerHTML = `<option value="">Seleccione uno</option>`;
        categories.forEach(categoryDB => {
            const categoryName = categoryDB.name;
            const option = document.createElement("option");
            option.value = categoryDB._id;
            option.text = categoryName;
            selectCategory.appendChild(option);
            if (category === categoryName) {
                option.selected = true;
            }
        });

        const selectGender = document.getElementById('selectGender');
        selectGender.innerHTML = `<option value="">Seleccione uno</option>`;
        genders.forEach(genderDB => {
            const genderName = genderDB.name;
            const option = document.createElement("option");
            option.value = genderDB._id;
            option.text = genderName;
            selectGender.appendChild(option);
            if (gender === genderName) {
                option.selected = true;
            }
        });

        const selectSeason = document.getElementById('selectSeason');
        selectSeason.innerHTML = `<option value="">Seleccione uno</option>`;
        seasons.forEach(seasonDB => {
            const seasonName = seasonDB.name;
            const option = document.createElement("option");
            option.value = seasonDB._id;
            option.text = seasonName;
            selectSeason.appendChild(option);
            if (season === seasonName) {
                option.selected = true;
            }
        });

    } catch (error) {
        console.error("Error:", error);
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
        console.log('No se pudieron obtener los productos.');
        // Tomar medidas alternativas si no se pudieron obtener los productos
    }

}

const createActionsBtns = () => {

    const btnsDetails = document.querySelectorAll('.btnDetails');
    const btnsEliminar = document.querySelectorAll('.btnEliminar');

    const btnCreateModal = document.getElementById('btnCreateModal');

    const formModal = document.getElementById("formProduct");
    const formImagesModal = document.getElementById("formImagesProduct");
    const btnFormCreate = document.getElementById('btnFormCreate');
    const btnFormUpdate = document.getElementById('btnFormUpdate');

    // Edit buttons, in each of the rows of the records.
    btnsDetails.forEach(btnDetail => {
        btnDetail.addEventListener('click', () => {
            let objectId = btnDetail.getAttribute('data-id');
            btnFormUpdate.setAttribute("data-id", objectId);
            detailsProduct(objectId);
        })
    })

    // delete buttons, in each of the rows of the records.
    btnsEliminar.forEach(btnEliminar => {
        btnEliminar.addEventListener('click', () => {
            let objectId = btnEliminar.getAttribute('data-id');
            deleteProduct(objectId);
        })
    })

    formModal.addEventListener("submit", (event) => {
        event.preventDefault();
    })


    formImagesModal.addEventListener("submit", (event) => {
        event.preventDefault();
    })

    btnCreateModal.addEventListener("click", () => {
        formModal.reset();
        // inputName.value = '';
        btnFormCreate.style.display = "inline-block";
        btnFormUpdate.style.display = "none";
        dataSelects();
        saveSizes();
        saveColors();
    });

    btnFormCreate.addEventListener('click', () => {
        createProduct();
    })

    btnFormUpdate.addEventListener('click', () => {
        let objectId = btnFormUpdate.getAttribute('data-id');
        updateProduct(objectId);
    })


}

const createDataTable = () => {
    const tableBody = document.getElementById('tbody');
    tableBody.innerHTML = `<tr><td colspan="8"> Consultando datos... </td></tr>`

    getProducts()
        .then(data => {
            const { totalProducts, products } = data;

            if (products.length === 0) {
                tableBody.innerHTML = `<tr><td colspan="8"> Sin datos para mostrar </td></tr>`
            }

            if (products) {

                // Hacer algo con los productos recibidas
                let tdata = ``;
                let cont = 1;
                products.forEach(product => {
                    tdata += `<tr> 
                        <td>${cont}</td>
                        <td> 
                        ${(product.images.length > 0) ? `<img src="${product.images[0]}" alt="${product.name}" width="80px"/>` : 'N/A'}
                        </td>
                        <td>${product.name}</td>
                        <td>$ ${product.price}</td>
                        <td> ${(product.available) ? "Si" : "No"}</td>
                        <td>${product.stock}</td>
                        <td>
                            <button  class="btn btn-warning btn-sm btnDetails" data-bs-toggle="modal"
                            data-bs-target="#detailsModal" title="Ver detalles producto" data-id="${product._id}">
                                <i class="fa-solid fa-pen-to-square m-1"></i>
                                Ver detalles
                            </button>
                        </td>
                        <td>
                            <button class="btn btn-danger btn-sm btnEliminar" title="Eliminar producto"  data-id="${product._id}">
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
                console.log('No se pudieron obtener los productos.');
                // Tomar medidas alternativas si no se pudieron obtener los productos
            }
        });
}

const closeModal = () => {
    const btnCloseModal = document.getElementById('btnCloseModal')
    btnCloseModal.click();
}


const saveSizes = () => {
    const inputSizes = document.getElementById("inputSizes");

    inputSizes.addEventListener("input", () => {
        let texto = inputSizes.value.trim();

        if (texto.endsWith(",")) {
            let words = texto.split(",");

            let wordPrevious = words[words.length - 2].trim().toUpperCase();

            if (wordPrevious) {
                sizesListArr.push(wordPrevious);
                inputSizes.value = "";

                ListDataSizesColors(sizesListArr, 'sizesList');
            }
        }
    });
}

const saveColors = () => {
    const inputColors = document.getElementById("inputColors");


    inputColors.addEventListener("input", () => {
        let texto = inputColors.value.trim();

        if (texto.endsWith(",")) {
            let words = texto.split(",");

            let wordPrevious = words[words.length - 2].trim().toUpperCase();

            if (wordPrevious) {
                colorsListArr.push(wordPrevious);
                inputColors.value = "";

                ListDataSizesColors(colorsListArr, 'colorsList');
            }
        }
    });

}

const ListDataSizesColors = (listArr, nameListDiv) => {
    const ListDiv = document.getElementById(`${nameListDiv}`);
    ListDiv.innerHTML = "";

    listArr.forEach((palabra, index) => {
        let div = document.createElement("div");
        div.className = "m-1 btn btn-outline-dark btn-sm";

        let palabraElemento = document.createElement("span");
        palabraElemento.textContent = palabra;

        let botonEliminar = document.createElement("button");
        botonEliminar.className = "btn btn-outline-danger btn-sm mx-1 p-1";
        botonEliminar.textContent = "x";
        botonEliminar.onclick = () => {
            deleteDataSizesColors(listArr, nameListDiv, index);
        };

        div.appendChild(palabraElemento);
        div.appendChild(botonEliminar);

        ListDiv.appendChild(div);
    });
}

const deleteDataSizesColors = (listArr, nameListDiv, index) => {
    listArr.splice(index, 1);
    ListDataSizesColors(listArr, nameListDiv);
}

createDataTable();