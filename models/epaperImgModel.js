const mongoose = require('mongoose');

 const epaperImgSchema = new mongoose.Schema({
		EpaperImgData: {
			type: String,
			required: [true, 'Review can not be empty!'],
		},
 });

 const epaperImg = mongoose.model('epaperImg', epaperImgSchema);

 module.exports = epaperImg;