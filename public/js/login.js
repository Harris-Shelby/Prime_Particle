/*eslint-disable*/
const signUpButton = document.getElementById('signup');
const signInButton = document.getElementById('signin');
const container = document.getElementById('formContainer');
const form = document.getElementById('loginForm');

const login = async (email, password) => {
	console.log(email, password);
	try {
		const res = await axios({
			method: 'POST',
			url: 'http://penguin.linux.test:4000/api/v1/users/login',
			data: {
				email,
				password
			}
		})
		console.log(res);
	} catch (err) {
		console.log(err.response.data)
	}

};
signUpButton.addEventListener('click', () => {
	container.classList.add('right-panel-active');
});

signInButton.addEventListener('click', () => {
	container.classList.remove('right-panel-active');
});

form.addEventListener('submit', (e) => {
	e.preventDefault();
	const email = document.getElementById('loginEmail').value;
	const password = document.getElementById('loginPasswd').value;
	login(email, password);
});
