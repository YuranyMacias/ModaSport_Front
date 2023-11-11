const validationsUserLogged =  async() => {
    const tokenUser = await getOptionalToken();
    if (!tokenUser) {
        alert('Es necesaria la autenticación del usuario.');
        window.location.href = '/index.html'
    }

}

validationsUserLogged();