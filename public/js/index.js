/*eslint-disable*/
import '@babel/polyfill';
import { displayMap } from './mapbox';
import { getAccesser } from './getFun';
import { login, logout } from './login';
import { updateSetting } from './updateSettings';
import { CALENDAR } from './calendar';
// DOM elememt
const signUpButton = document.getElementById('signup');
const signInButton = document.getElementById('signin');
const container = document.getElementById('formContainer');
const loginForm = document.getElementById('loginForm');
const logOutBtn = document.getElementById('logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const timelinebox = document.querySelector('.section-timelinebox');
const preWeek = document.getElementById('preWeek');
const nextWeek = document.getElementById('nextWeek');
const devicesList = document.querySelector('.devices-list');

const mapBox = document.getElementById('map');

const html =
	'<li class="devices__item"><span>{{deviceInfo}}</span><span>{{city}}</span></li>';

const timeLineboxHtml =
	'<a class="section-timelinebox__item {{DayClass}}" href="#" id={{newDay}}><div class="day">{{dayofWeek}}</div><div class="day-number">{{dayofMonth}}</div><div class="day-dot"></div></a>';
// Values
let timeLineboxData = new CALENDAR();

if (mapBox) {
	const locations = JSON.parse(mapBox.dataset.locations);
	displayMap(locations);
}
if (signInButton || signUpButton) {
	signUpButton.addEventListener('click', () => {
		container.classList.add('right-panel-active');
	});
	signInButton.addEventListener('click', () => {
		container.classList.remove('right-panel-active');
	});
}

if (logOutBtn) {
	logOutBtn.addEventListener('click', logout);
}

if (loginForm) {
	loginForm.addEventListener('submit', (e) => {
		e.preventDefault();
		const email = document.getElementById('loginEmail').value;
		const password = document.getElementById('loginPasswd').value;
		login(email, password);
	});
}

if (userDataForm) {
	userDataForm.addEventListener('submit', (e) => {
		e.preventDefault();
		const form = new FormData();
		form.append('name', document.getElementById('name').value);
		form.append('email', document.getElementById('email').value);
		form.append('photo', document.getElementById('photo').files[0]);
		console.log(form);

		updateSetting(form, 'data');
	});
}

if (userPasswordForm) {
	userPasswordForm.addEventListener('submit', async function (e) {
		e.preventDefault();
		document.querySelector('.btn--save--password').textContent = 'Updating...';
		const passwordCurrent = document.getElementById('password-current').value;
		const password = document.getElementById('password').value;
		const passwordConfirm = document.getElementById('password-confirm').value;
		await updateSetting(
			{ passwordCurrent, password, passwordConfirm },
			'password',
		);

		document.querySelector('.btn--save--password').textContent =
			'Save password';
		document.getElementById('password-current').value = '';
		document.getElementById('password').value = '';
		document.getElementById('password-confirm').value = '';
	});
}

if (timelinebox) {
	let newDayHtml = '';
	let html1 = '';
	timeLineboxData.currWeek.forEach((e) => {
		if (e.today) {
			html1 = timeLineboxHtml.replace('{{DayClass}}', 'active');
		} else {
			switch (e.dayofWeek) {
				case 'Wed':
					html1 = timeLineboxHtml.replace('{{DayClass}}', 'danger');
					break;
				case 'Mon':
					html1 = timeLineboxHtml.replace('{{DayClass}}', 'warning');
					break;
				case 'Thu':
					html1 = timeLineboxHtml.replace('{{DayClass}}', 'warning');
					break;
				default:
					html1 = timeLineboxHtml.replace('{{DayClass}}', 'primary');
			}
		}
		let html2 = html1.replace('{{newDay}}', e.newDay);
		let html3 = html2.replace('{{dayofMonth}}', e.dayofMonth);
		let html4 = html3.replace('{{dayofWeek}}', e.dayofWeek);
		newDayHtml += html4;
	});
	timelinebox.insertAdjacentHTML('afterbegin', newDayHtml);
	timelinebox.addEventListener('click', async (e) => {
		let newHTML = '';
		e.preventDefault();
		const isTimelineboxItem = Object.values(e.target.classList).indexOf(
			'section-timelinebox__item',
		);
		const isTimelineboxItem_child = Object.values(
			e.target.parentNode.classList,
		).indexOf('section-timelinebox__item');
		if (isTimelineboxItem > -1) {
			document
				.querySelector('.section-timelinebox__item.active')
				.classList.remove('active');
			e.target.classList.add('active');
			const newDateAccesser = await getAccesser(e.target.id);
			const newLocationData = newDateAccesser.map((accesser) => {
				return accesser.relegation[0];
			});
			devicesList.querySelectorAll('*').forEach((n) => n.remove());
			newDateAccesser.forEach((e) => {
				let html1 = html.replace('{{deviceInfo}}', e.deviceInfo[0]);
				let html2 = html1.replace('{{city}}', e.city[0]);
				newHTML += html2;
			});
			displayMap(newLocationData);
			devicesList.insertAdjacentHTML('afterbegin', newHTML);
		} else if (isTimelineboxItem_child > -1) {
			document
				.querySelector('.section-timelinebox__item.active')
				.classList.remove('active');
			e.target.parentNode.classList.add('active');
			const newDateAccesser = await getAccesser(e.target.parentNode.id);
			const newLocationData = newDateAccesser.map((accesser) => {
				return accesser.relegation[0];
			});
			displayMap(newLocationData);
			devicesList.querySelectorAll('*').forEach((n) => n.remove());
			newDateAccesser.forEach((e) => {
				let html1 = html.replace('{{deviceInfo}}', e.deviceInfo[0]);
				let html2 = html1.replace('{{city}}', e.city[0]);
				newHTML += html2;
			});
			devicesList.insertAdjacentHTML('afterbegin', newHTML);
		}
	});
}

if (preWeek) {
	preWeek.addEventListener('click', (e) => {
		console.log(e.target);
	});
}
