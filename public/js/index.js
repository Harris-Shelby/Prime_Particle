/*eslint-disable*/
import '@babel/polyfill'
import { displayMap } from './mapbox'
import { login } from './login'

// DOM elememt
const signUpButton = document.getElementById('signup');
const signInButton = document.getElementById('signin');
const container = document.getElementById('formContainer');
const loginForm = document.getElementById('loginForm');
const mapBox = document.getElementById('map')
// Values


if (mapBox) {
    const locations = JSON.parse(mapBox.dataset.locations);
    displayMap(locations)
}
if (signInButton || signUpButton) {
    signUpButton.addEventListener('click', () => {
        container.classList.add('right-panel-active');
    });
    signInButton.addEventListener('click', () => {
        container.classList.remove('right-panel-active');
    });
}




if(loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPasswd').value;
        login(email, password);
    });
}

