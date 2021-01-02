const { getStatPro, addContentPro, parseDataPro } = require('./utils');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const LOGGER = require('../utils/logger');
let loggerData = null;
const fs = require('fs');
const fd = fs.openSync(process.env.FILEPATH, 'r');

const app = async (type) => {
	try {
		const newStat = await getStatPro(process.env.FILEPATH);

		if (type === 'init') {
			loggerData = new LOGGER(newStat);
		} else {
			await loggerData.init(newStat);
			if (loggerData.currStat.size === 0) return;
			console.log(loggerData.currStat.size, loggerData.preStat.size);
			const accessersData_raw = await addContentPro(
				fd,
				loggerData.buffer,
				loggerData.offset,
				loggerData.len,
				loggerData.position,
			);
			if (accessersData_raw[0] === '') return;
			const accessersData_pro = await parseDataPro(accessersData_raw);
			console.log(accessersData_pro);
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

module.exports = {
	app,
	fsWatchPro,
};
