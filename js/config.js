const URL_API = `https://moda-sport.vercel.app/api`;
// const URL_API = `http://localhost:8080/api`;
let btnLoginMenu;

const saveToken = (token) => {
    const tokenData = {
        token: token,
        fechaCreacion: Date.now() // Obtener el tiempo actual en milisegundos
    };
    localStorage.setItem('accessToken', JSON.stringify(tokenData));
}

const saveUserImage = (image) => {
    localStorage.setItem('userImage', image);
}

const getUserImage = async () => {
    const image = localStorage.getItem('userImage');
    if (!isValidToken() || !image) {
        return null;
    }
    return image;
}

const removeToken = () => {
    localStorage.removeItem('accessToken');
}

const removeUserImage = () => {
    localStorage.removeItem('userImage');
}

// Función para verificar si el token existe y si ha pasado menos de 4 horas
function isValidToken() {
    const tokenDataStr = localStorage.getItem('accessToken');
    if (!tokenDataStr) {
        return false; // El token no existe en LocalStorage
    }

    const tokenData = JSON.parse(tokenDataStr);
    const tiempoTranscurrido = Date.now() - tokenData.fechaCreacion;
    const horasTranscurridas = tiempoTranscurrido / (1000 * 60 * 60); // Convertir milisegundos a horas

    if (horasTranscurridas < 4) {
        return true; // El token es válido
    }

    // El token ha expirado, eliminarlo
    removeToken();
    removeUserImage();
    return false;
}


const login = async (email = "yeiimaccdev@gmail.com", password = 'yeiimaccdev_') => {
    try {
        const res = await fetch(`${URL_API}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password
            })
        })
        const { token } = await res.json()
        saveToken(token);
        return token
    } catch (error) {
        console.error('Hubo un error en la solicitud de Login:', error);
    }
}

const getToken = async () => {
    if (!isValidToken()) {
        console.log(btnLoginMenu)
        btnLoginMenu.click();
        return null;
    }
    const tokenDataStr = localStorage.getItem('accessToken');
    const {token} = JSON.parse(tokenDataStr);
    return token;
}

const getOptionalToken = () => {
    if (isValidToken()) {
        const tokenDataStr = localStorage.getItem('accessToken');
        const {token} = JSON.parse(tokenDataStr);
        return token;
    }
    return null;
}

window.addEventListener('load', function () { 
    btnLoginMenu = document.getElementById('btnLogin');
});