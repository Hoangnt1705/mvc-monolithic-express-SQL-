let formPostRegister = document.getElementById('formPostRegister');
let email = document.getElementById('formPostRegister').email;
let username = document.getElementById('formPostRegister').username;
let password = document.getElementById('formPostRegister').password;
let role = document.getElementById('formPostRegister').role;
let confirmPassword = document.getElementById('formPostRegister').confirmPassword;
let API = 'http://localhost:3700/router/api/v1/user-register';
console.log(email);
formPostRegister.addEventListener('submit', e => {
    e.preventDefault();
    fetchPostRegister(API);
});

let fetchPostRegister = (file) => {
    fetch(file, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email.value,
            username: username.value,
            password: password.value,
            confirmPassword: confirmPassword.value,
            role: role.value
        })
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            window.location.href = 'http://localhost:3700/router/login';
        })
        .catch(err => console.log(err));
} 
