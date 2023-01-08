const formPostLogin = document.getElementById('formPostLogin');
const username = document.getElementById('formPostLogin').username;
const password = document.getElementById('formPostLogin').password;
const API = 'http://localhost:3700/router/api/v1/users-login/'
formPostLogin.addEventListener('submit', e => {
    e.preventDefault();
    fetchPostLogin(API);
})

let fetchPostLogin = (file) => {
    fetch(file, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.value, password: password.value })
    })
        .then(response => response.json())
        .then(data => {
            alert(data);
            setTimeout(() => {
                window.location.href = 'http://localhost:3700/router/'
            }, 500);
        })
        .catch(err => alert(err));
}