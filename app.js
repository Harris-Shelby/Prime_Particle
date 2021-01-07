const { app, fsWatchPro } = require('./base/schedule');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const server = require('./base/server');

const DB = process.env.DATABASE.replace(
	'<PASSWORD>',
	process.env.DATABASE_PASSWORD,
);

process.on('uncaughtException', (err) => {
	console.log('UNCAUGHT EXCEPTION!, shutting down...');
	console.log(err.name, err.message);

	process.exit(1);
});

(async () => {
	try {
		// Init

		await app('init');

		// Accesser APi listen

		server.listen(4000, () => {
			console.log('APP run on port 4000');
		});

		// mongoose connection
		mongoose
			.connect(DB, {
				useUnifiedTopology: true,
				useNewUrlParser: true,
				useCreateIndex: true,
				useFindAndModify: false,
			})
			.then(() => {
				console.log('DB connection successful!');
			});
		// File watcher

		fsWatchPro();
	} catch (err) {
		console.log(err);
	}
})();

process.on('unhandledRejection', (err) => {
	console.log('UNHANDLED REJECTION!, shutting down...');
	console.log(err.name, err.message);

	process.exit(1);
});
