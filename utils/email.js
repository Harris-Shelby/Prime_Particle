const nodemailer = require('nodemailer');
const pug = require('pug');
const { htmlToText } = require('html-to-text');

module.exports = class Email {
	constructor(user, url) {
		this.to = user.email;
		this.firstName = user.name.split(' ')[0];
		this.url = url;
		this.from = `Harris Shelby <${process.env.EMAIL_FORM}>`;
	}

	newTransport() {
		if (process.env.NODE_ENV === 'production') {
			// sendgrid
			return 1;
		}
		return nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: process.env.EMAIL_USERNAME,
				pass: process.env.EMAIL_PASSWORD,
			},
			// Activate in gmail 'less secure app' option
		});
	}

	async send(template, subject) {
		// 1) render Html base on a pug template
		const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
			firstName: this.firstName,
			url: this.url,
			subject,
		});
		// 2) defind email option
		const mailOptions = {
			from: this.from,
			to: this.to,
			subject,
			html,
			text: htmlToText(html, {
				wordwrap: 130,
			}),
		};

		// 3) create a transport and send email
		await this.newTransport().sendMail(mailOptions);
	}

	async sendWelcome() {
		await this.send('welcome', 'Welcome to the Shelby family!');
	}

	async sendPasswordReset() {
		await this.send(
			'passwordReset',
			'Your password reset token (only valid for 10min)',
		);
	}
};
