const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
	//Create a transporter
	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: process.env.EMAIL_USERNAME,
			pass: process.env.EMAIL_PASSWORD,
		},
		// Activate in gmail 'less secure app' option
	});
	// Define the email option
	const mailOptions = {
		from: 'Harris Shelby<qsobiaolian@gmail.com>',
		to: options.email,
		subject: options.subject,
		text: options.message,
	};
	//Actually send the email
	await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
