console.log('11');

const signUpButton = document.getElementById('signup');
const signInButton = document.getElementById('signin');
const container = document.getElementById('formContainer');

signUpButton.addEventListener('click', () => {
	console.log(1);
	container.classList.add('right-panel-active');
});

signInButton.addEventListener('click', () => {
	console.log(2);
	container.classList.remove('right-panel-active');
});
