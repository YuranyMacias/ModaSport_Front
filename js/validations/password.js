const validatePasswordMatch = (inputPassword, inputConfirmPassword) => {
    inputConfirmPassword.addEventListener('keyup', () => {
        if (inputPassword.value === inputConfirmPassword.value) {
            inputConfirmPassword.classList.add('form-control-success');
            inputConfirmPassword.classList.remove('form-control-warning');
        } else {
            inputConfirmPassword.classList.add('form-control-warning');
            inputConfirmPassword.classList.remove('form-control-success');
        }
    })
}

const isPasswordMatch = (inputPassword, inputConfirmPassword) => {
    return Boolean(inputPassword != '' && inputPassword === inputConfirmPassword)
}
