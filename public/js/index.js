/*eslint-disable*/
import '@babel/polyfill'
import { displayMap } from './mapbox'
import { getAccesser } from './getFun'
import { login, logout} from './login'
import { updateSetting } from './updateSettings'
// DOM elememt
const signUpButton = document.getElementById('signup');
const signInButton = document.getElementById('signin');
const container = document.getElementById('formContainer');
const loginForm = document.getElementById('loginForm');
const logOutBtn = document.getElementById('logout')
const userDataForm = document.querySelector('.form-user-data')
const userPasswordForm = document.querySelector('.form-user-password');
const timelinebox = document.querySelector('.section-timelinebox');
const preWeek = document.getElementById('preWeek');
const nextWeek = document.getElementById('nextWeek');

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

if(logOutBtn) {
    logOutBtn.addEventListener('click', logout)
}


if(loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPasswd').value;
        login(email, password);
    });
}

if(userDataForm) {
    userDataForm.addEventListener('submit', e => {
        e.preventDefault();
        const form = new FormData();
        form.append('name', document.getElementById('name').value);
        form.append('email', document.getElementById('email').value)
        form.append('photo', document.getElementById('photo').files[0]);
        console.log(form);
        
        updateSetting(form, 'data');
    })
}

if(userPasswordForm) {
    userPasswordForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            document.querySelector('.btn--save--password').textContent = 'Updating...';
            const passwordCurrent = document.getElementById('password-current').value;
            const password = document.getElementById('password').value;
            const passwordConfirm = document.getElementById('password-confirm').value;
            await updateSetting({ passwordCurrent, password, passwordConfirm }, 'password');

            document.querySelector('.btn--save--password').textContent = 'Save password';
            document.getElementById('password-current').value = '';
            document.getElementById('password').value = '';
            document.getElementById('password-confirm').value = '';
        })
}

if (timelinebox) {
    timelinebox.addEventListener('click', async e => {
        e.preventDefault();
        const isTimelineboxItem = Object.values(e.target.classList).indexOf('section-timelinebox__item')
        const isTimelineboxItem_child = Object.values(e.target.parentNode.classList).indexOf('section-timelinebox__item')
        if (isTimelineboxItem > -1) {
            document.querySelector('.section-timelinebox__item.active').classList.remove('active');
            e.target.classList.add('active')
            const newDateAccesser = await getAccesser(e.target.id)
            const newLocationData = newDateAccesser.map((accesser) => {
                return accesser.relegation[0]
            })
            displayMap(newLocationData)
        } else if (isTimelineboxItem_child > -1) {
            document.querySelector('.section-timelinebox__item.active').classList.remove('active');
            e.target.parentNode.classList.add('active')
            const newDateAccesser = await getAccesser(e.target.parentNode.id)
            const newLocationData = newDateAccesser.map((accesser) => {
                return accesser.relegation[0]
            })
            displayMap(newLocationData)
        }

    });
}

if (preWeek) {
    preWeek.addEventListener('click', e => {
        console.log(e.target)
    })
}