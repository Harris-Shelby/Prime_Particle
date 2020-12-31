const { getStatPro, addContentPro, parseDataPro } = require('./utils');
const inputPath = '../log/love_caddy.json';
const LOGGER = require('../utils/logger');

let loggerData = null;
const fs = require('fs');
const fd = fs.openSync(inputPath, 'r');

const app = async (type) => {
	try {
		const newStat = await getStatPro(inputPath);

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
		fs.watch(inputPath, () => {
			if (!inputPath) reject('we could not get file');
			resolve(app('update'));
		});
	});
};

module.exports = {
	app,
	fsWatchPro,
};
