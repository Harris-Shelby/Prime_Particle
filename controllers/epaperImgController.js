const multer = require('multer');
 const sharp = require('sharp');
 // const User = require('../models/userModel');
 const AppError = require('../utils/appError');
 const catchAsync = require('../utils/catchAsync');
 const fs = require('fs');
 const floydSteinberg = require('floyd-steinberg');
 const PNG = require('pngjs').PNG;
 const getPixelsAsync = require('get-pixels');
 let cacheData = '';
 const multerStorage = multer.memoryStorage();

 const EpaperImg = require('../models/epaperImgModel');
 const factory = require('./handlerFactory');

 const multerFilter = (req, file, cb) => {
		if (file.mimetype.startsWith('image')) {
			cb(null, true);
		} else {
			cb(new AppError('Not a image! Please upload only image.', 400), false);
		}
 };

 const upload = multer({
		storage: multerStorage,
		fileFilter: multerFilter,
 });

 exports.uploadEpaperImg = upload.single('epaper-photo');

 exports.formatEpaperImg = async (req, res, next) => {
		try {
			if (!req.file) {
				return next();
			}

			const buffer = await sharp(req.file.buffer)
				.resize({
					width: 128,
					height: 296,
				})
				.toFormat('png')
				.png({ quality: 90 })
				.toBuffer();

			const pngImgData = PNG.sync.read(buffer);
			const ditherImage = floydSteinberg(pngImgData);
			const pixelImgData = ditherImage.data;
			const RGBAImgData = formatRGBAs(pixelImgData);
			const b = [];
			let c = '';

			for (let i = 0; i < RGBAImgData.length; i++) {
				const e = RGBAImgData[i];

				if (`${e.join('')}` === '1111') {
					b.push(1);
				} else {
					b.push(0);
				}
			}

			const BinImgData = group(b, 8);

			for (let i = 0; i < BinImgData.length; i++) {
				const e = BinImgData[i];
				const bre = `${e[0]}${e[1]}${e[2]}${e[3]}`;
				const pre = `${e[4]}${e[5]}${e[6]}${e[7]}`;
				const newBre = setHex(bre);
				const newPre = setHex(pre);
				c += `${newBre}${newPre}`;
			}

			cacheData = c;
		} catch (error) {
			console.log(error);
		}

		next();
 };

 const getPixelsPro = async (formatImageUrl) => {
		try {
			const pixels = await getPixelsAsync(formatImageUrl);
			return pixels.data.slice();
		} catch (error) {
			throw new Error('Bad image path');
		}
 };

 const formatRGBAs = (imagePixel) => {
		if (!imagePixel) throw new Error('Bad image pixels');
		const a = imagePixel.map((e) => (e === 255 ? 1 : 0));
		return group(a, 4);
 };

 const group = (arr, num) => {
		num = num * 1 || 1;
		const ret = [];

		for (let i = 0; i < arr.length; i += num) {
			ret.push(arr.slice(i, i + num));
		}

		return ret;
 };
 const setHex = (key) => {
		switch (key) {
			case '0001':
				return '1';
			case '0010':
				return '2';
			case '0011':
				return '3';
			case '0100':
				return '4';
			case '0101':
				return '5';
			case '0110':
				return '6';
			case '0111':
				return '7';
			case '1000':
				return '8';
			case '1001':
				return '9';
			case '1010':
				return 'A';
			case '1011':
				return 'B';
			case '1100':
				return 'C';
			case '1101':
				return 'D';
			case '1110':
				return 'E';
			case '1111':
				return 'F';
			default:
				return '0';
		}
 };

// const filterObj = (obj, ...allowFields) => {
// 	const newObj = {};
// 	Object.keys(obj).forEach((el) => {
// 		if (allowFields.includes(el)) newObj[el] = obj[el];
// 	});
// 	return newObj;
// };

exports.saveEpaperImg = catchAsync(async (req, res, next) => {
	// console.log({ EpaperImgData: cacheData });
	const newEpaperImg = new EpaperImg({ EpaperImgData: cacheData });
	newEpaperImg
		.save()
		.then(() => {
			console.log('Yep,EpaperImg data saved!');
		})
		.catch((err) => {
			console.log(err);
		});
	// const filteredBody = filterObj(req.body, 'name', 'email');
	// if (req.file) filteredBody.photo = req.file.filename;
	// const updateUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
	// 	new: true,
	// 	runValidators: true,
	// });
	res.status(200).json({
		status: 'success',
		data: {
			EpaperImg: cacheData,
		},
	});
});

exports.getAllEpaperImg = factory.getAll(EpaperImg);
exports.getEpaperImg = factory.getOne(EpaperImg);
exports.deleteEpaperImg = factory.deleteOne(EpaperImg);

