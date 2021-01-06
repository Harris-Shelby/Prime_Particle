const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const LOGGER = require('../utils/logger');
const ACCESSER = require('../utils/accesser');
const Accesser = require('../models/accesserModel');
let loggerData = null;
const fd = fs.openSync(process.env.FILEPATH, 'r');

const app = async (type) => {
	try {
		const newStat = await getStatPro(process.env.FILEPATH);

		if (type === 'init') {
			loggerData = new LOGGER(newStat);
		} else {
			await loggerData.init(newStat);
			if (loggerData.currStat.size === 0) return;
			const accessersData_raw = await addContentPro(
				fd,
				loggerData.buffer,
				loggerData.offset,
				loggerData.len,
				loggerData.position,
			);
			if (accessersData_raw[0] === '') return;
			parseDataPro(accessersData_raw);
		}
	} catch (err) {
		console.log(err);
		throw err;
	}
	return console.log('Ready🐶 !');
};

const fsWatchPro = () => {
	// eslint-disable-next-line no-undef
	return new Promise((resolve, reject) => {
		fs.watch(process.env.FILEPATH, () => {
			if (!process.env.FILEPATH) reject('we could not get file');
			resolve(app('update'));
		});
	});
};

const getStatPro = (file) => {
	// eslint-disable-next-line no-undef
	return new Promise((resolve, reject) => {
		fs.stat(file, (err, stat) => {
			if (err) reject('Could not get stat');
			resolve(stat);
		});
	});
};

const addContentPro = (fd, buffer, offset, length, position) => {
	// eslint-disable-next-line no-undef
	return new Promise((resolve, reject) => {
		fs.read(
			fd,
			buffer,
			offset,
			length,
			position,
			(err, bytesRead, byteResult) => {
				if (err) reject('Could not get buffer');
				resolve(byteResult.toString().trim().split('\n'));
			},
		);
	});
};

const parseDataPro = (data) => {
	// eslint-disable-next-line no-undef
	return new Promise((resolve, reject) => {
		if (!data) reject('LogData is empty! 😢');
		const accessersData_pro = data.map((singleAccesser) => {
			const OBJ_singleAccesser = new ACCESSER(JSON.parse(singleAccesser));
			saveData(OBJ_singleAccesser);
			return OBJ_singleAccesser;
		});
		// eslint-disable-next-line no-undef
		resolve(Promise.all(accessersData_pro));
	});
};

const saveData = (data) => {
	const newAccesser = new Accesser(data);
	newAccesser
		.save()
		.then(() => {
			console.log('Yep,Accesser data saved!');
		})
		.catch((err) => {
			console.log(err);
		});
};

module.exports = {
	app,
	fsWatchPro,
};
