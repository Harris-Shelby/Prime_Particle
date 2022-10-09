const mongoose = require('mongoose');

const epaperImgSchema = new mongoose.Schema({
	EpaperImgData: {
		type: Array,
	},
});

const epaperImg = mongoose.model('epaperImg', epaperImgSchema);

module.exports = epaperImg;
