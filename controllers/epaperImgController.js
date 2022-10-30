const multer = require('multer');
 const sharp = require('sharp');
 // const User = require('../models/userModel');
 const AppError = require('../utils/appError');
 const catchAsync = require('../utils/catchAsync');
 const fs = require('fs');
 const floydSteinberg = require('floyd-steinberg');
 const PNG = require('pngjs').PNG;
 const getPixels = require('get-pixels');
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
			if (!req.file) return next();

			req.file.filename = `img-${Date.now()}.jpeg`;

			// console.log(req.file.buffer);
			await sharp(req.file.buffer)
				.resize({
					width: 128,
					height: 296,
				})
				.toFormat('jpeg')
				.png({ quality: 90 })
				.toFile(`./sharpImg.png`);

			let OriginImgData = fs.readFileSync('./sharpImg.png');
			let pngImgData = PNG.sync.read(OriginImgData);
			let ditherImage = floydSteinberg(pngImgData);
			let buffer = PNG.sync.write(ditherImage);

			fs.writeFileSync('./ditherImg.png', buffer);

			let pixelImgData = await getPixelsPro('./ditherImg.png');
			let RGBAImgData = await formatRGBAs(pixelImgData);
			let b = [];
			let c = '';
			RGBAImgData.forEach((e, i) => {
				if (`${e.join('')}` === '1111') {
					b.push(1);
				} else {
					b.push(0);
				}
			});
			let BinImgData = group(b, 8);
			BinImgData.forEach((e, i) => {
				let bre = `${e[0]}${e[1]}${e[2]}${e[3]}`;
				let pre = `${e[4]}${e[5]}${e[6]}${e[7]}`;
				let newBre = setHex(bre);
				let newPre = setHex(pre);
				c += `${newBre}${newPre}`;
			});
			cacheData = c;
			// fs.writeFile(__dirname + './out.txt', c, { flag: 'w' }, function (err) {
			// 	if (err) {
			// 		console.error(err);
			// 	} else {
			// 		console.log('写入成功');
			// 	}
			// });
		} catch (error) {
			console.log(error);
		}

		next();
 };

 // const filterObj = (obj, ...allowFields) => {
 // 	const newObj = {};
 // 	Object.keys(obj).forEach((el) => {
 // 		if (allowFields.includes(el)) newObj[el] = obj[el];
 // 	});
 // 	return newObj;
 // };

 exports.saveEpaperImg = catchAsync(async (req, res, next) => {
		console.log({ EpaperImgData: cacheData });
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

 const getPixelsPro = (formatImageUrl) => {
		return new Promise((resolve, reject) => {
			getPixels(formatImageUrl, function (err, pixels) {
				if (err) reject('Bad image path');
				resolve(pixels.data.slice());
			});
		});
 };

 const formatRGBAs = (imagePixel) => {
		return new Promise((resolve, reject) => {
			if (!imagePixel) reject('Bad image pixels');
			let a = imagePixel.map((e) => {
				if (e === 255) return 1;
				return 0;
			});
			let b = group(a, 4);
			resolve(b);
		});
 };

 const group = (arr, num) => {
		num = num * 1 || 1;
		let ret = [];
		arr.forEach(function (item, i) {
			if (i % num === 0) {
				ret.push([]);
			}
			ret[ret.length - 1].push(item);
		});
		return ret;
 };

 const setHex = (key) => {
		switch (key) {
			case '0001':
				return '1';
				break;
			case '0010':
				return '2';
				break;
			case '0011':
				return '3';
				break;
			case '0100':
				return '4';
				break;
			case '0101':
				return '5';
				break;
			case '0110':
				return '6';
				break;
			case '0111':
				return '7';
				break;
			case '1000':
				return '8';
				break;
			case '1001':
				return '9';
				break;
			case '1010':
				return 'A';
				break;
			case '1011':
				return 'B';
				break;
			case '1100':
				return 'C';
				break;
			case '1101':
				return 'D';
				break;
			case '1110':
				return 'E';
				break;
			case '1111':
				return 'F';
				break;
			default:
				return '0';
				break;
		}
 };