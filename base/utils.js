const fs = require('fs');
const ACCESSER = require('../utils/accesser');
const Accesser = require('../models/accesserModel');

exports.getStatPro = (file) => {
	// eslint-disable-next-line no-undef
	return new Promise((resolve, reject) => {
		fs.stat(file, (err, stat) => {
			if (err) reject('Could not get stat');
			resolve(stat);
		});
	});
};

exports.addContentPro = (fd, buffer, offset, length, position) => {
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

exports.parseDataPro = (data) => {
	// eslint-disable-next-line no-undef
	return new Promise((resolve, reject) => {
		if (!data) reject('LogData is empty! 😢');
		// console.log(data[0] === '');
		const accessersData_pro = data.map((singleAccesser) => {
			const OBJ_singleAccesser = new ACCESSER(JSON.parse(singleAccesser));
			// console.log(OBJ_singleAccesser)
			saveData(OBJ_singleAccesser);
			// Accesser.create(OBJ_singleAccesser);
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
			console.log('Yep!');
		})
		.catch((err) => {
			console.log(err);
		});
};
