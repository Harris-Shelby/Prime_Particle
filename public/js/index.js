/*eslint-disable*/
import '@babel/polyfill';
import moment from 'moment';
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
const monOfYearRange = document.getElementById('monOfYearRange');
const preWeek = document.getElementById('preWeek');
const nextWeek = document.getElementById('nextWeek');
const reportsList = document.querySelectorAll('.overview-size');
const devicesList = document.querySelector('.devices-list');

const mapBox = document.getElementById('map');

const html =
	'<li class="devices__item"><span>{{deviceInfo}}</span><span>{{city}}</span></li>';

const timeLineboxHtml =
	'<a class="section-timelinebox__item {{DayClass}}" href="#" id={{newDay}}><div class="day">{{dayofWeek}}</div><div class="day-number">{{dayofMonth}}</div><div class="day-dot"></div></a>';
// Values
let timeLineboxData = new CALENDAR(Date.now());

const updateTimelineBoxUI = () => {
	// if calendar.currWeek[0].monofYear === calendar.currWeek[6].monofYear
	//     h2.heading-secondary#MonOfYearRange= `${calendar.currWeek[0].monofYear} ${calendar.currWeek[0].dayofMonth}-${calendar.currWeek[6].dayofMonth}`
	// else
	//     h2.heading-secondary#MonOfYearRange= `${calendar.currWeek[0].monofYear} ${calendar.currWeek[0].dayofMonth}-${calendar.currWeek[6].monofYear} ${calendar.currWeek[6].dayofMonth}`

	let newDayHtml = '';
	let html1 = '';
	timelinebox.querySelectorAll('*').forEach((n) => n.remove());
	// console.log(timeLineboxData)
	timeLineboxData.currWeek.forEach((e) => {
		// console.log(e.newDay.utc().toString())
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
		console.log(e.newDay.format().toString());
		let html2 = html1.replace('{{newDay}}', e.newDay.format());
		let html3 = html2.replace('{{dayofMonth}}', e.dayofMonth);
		let html4 = html3.replace('{{dayofWeek}}', e.dayofWeek);
		newDayHtml += html4;
	});
	timelinebox.insertAdjacentHTML('afterbegin', newDayHtml);
	if (
		timeLineboxData.currWeek[0].monofYear ===
		timeLineboxData.currWeek[6].monofYear
	) {
		monOfYearRange.textContent = `${timeLineboxData.currWeek[0].monofYear} ${timeLineboxData.currWeek[0].dayofMonth}-${timeLineboxData.currWeek[6].dayofMonth}`;
	} else {
		monOfYearRange.textContent = `${timeLineboxData.currWeek[0].monofYear} ${timeLineboxData.currWeek[0].dayofMonth}-${timeLineboxData.currWeek[6].monofYear} ${timeLineboxData.currWeek[6].dayofMonth}`;
	}
};

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
			const { stats, numOfPageViews, numOfRobot } = await getAccesser(
				e.target.id,
			);
			console.log(numOfPageViews, numOfRobot);
			const newLocationData = stats.map((accesser) => {
				return accesser.relegation[0];
			});
			reportsList[0].innerHTML = `${stats.length} Pe`;
			reportsList[1].innerHTML = `${numOfPageViews} Co`;
			reportsList[2].innerHTML = `${numOfRobot} Co`;
			reportsList[3].innerHTML = `${stats.length - numOfRobot} Co`;
			devicesList.querySelectorAll('*').forEach((n) => n.remove());
			stats.forEach((e) => {
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
			const { stats, numOfPageViews, numOfRobot } = await getAccesser(
				e.target.parentNode.id,
			);
			reportsList[0].innerHTML = `${stats.length} Pe`;
			reportsList[1].innerHTML = `${numOfPageViews} Co`;
			reportsList[2].innerHTML = `${numOfRobot} Co`;
			reportsList[3].innerHTML = `${stats.length - numOfRobot} Co`;
			const newLocationData = stats.map((accesser) => {
				return accesser.relegation[0];
			});
			displayMap(newLocationData);
			devicesList.querySelectorAll('*').forEach((n) => n.remove());
			stats.forEach((e) => {
				let html1 = html.replace('{{deviceInfo}}', e.deviceInfo[0]);
				let html2 = html1.replace('{{city}}', e.city[0]);
				newHTML += html2;
			});
			devicesList.insertAdjacentHTML('afterbegin', newHTML);
		}
	});
}

if (preWeek) {
	preWeek.addEventListener('click', async function (e) {
		await timeLineboxData.getPreWeek();
		updateTimelineBoxUI();
	});
}

if (nextWeek) {
	nextWeek.addEventListener('click', async function (e) {
		await timeLineboxData.getNextWeek();
		updateTimelineBoxUI();
	});
}
