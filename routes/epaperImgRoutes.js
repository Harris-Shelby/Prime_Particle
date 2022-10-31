const express = require('express');

const epaperImgController = require('../controllers/epaperImgController');

const router = express.Router();

router.patch(
	'/uploadImg',
	epaperImgController.uploadEpaperImg,
	epaperImgController.formatEpaperImg,
	epaperImgController.saveEpaperImg,
);

router.route('/').get(epaperImgController.getAllEpaperImg);

router
	.route('/:id')
	.get(epaperImgController.getEpaperImg)
	.delete(epaperImgController.deleteEpaperImg);

module.exports = router;
