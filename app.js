const { app, fsWatchPro } = require('./base/schedule');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
	'<PASSWORD>',
	process.env.DATABASE_PASSWORD,
);

(async () => {
	try {
		// Init

		await app('init');

		// Accesser APi listen

		// server.listen(4000, () => {
		// 	console.log('APP run on port 3000');
		// });

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
