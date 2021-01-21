const express = require('express');
const accesserController = require('./../controllers/accesserController');
const authController = require('../controllers/authController');
// const reviewController = require('../controllers/reviewController');
const reviewRoutes = require('../routes/reviewRoutes');

const router = express.Router();

router.use('/:accesserId/reviews', reviewRoutes);

router
	.route('/top-5-latest')
	.get(
		accesserController.aliasTopAccessers,
		accesserController.getAllAccessers,
	);

router.route('/daily-stats').get(accesserController.getDailyAccessers);

router.route('/monthly-stats').get(accesserController.getMonthlyAccessers);

router
	.route('/')
	.get(authController.protect, accesserController.getAllAccessers);

router
	.route('/:id')
	.get(accesserController.getAccesser)
	.patch(
		authController.protect,
		authController.restrictTo('admin', 'shelby'),
		accesserController.updateAccesser,
	)
	.delete(
		authController.protect,
		authController.restrictTo('admin', 'shelby'),
		accesserController.deleteAccesser,
	);

// router
// 	.route('/:accesserId/reviews')
// 	.post(
// 		authController.protect,
// 		authController.restrictTo('admin'),
// 		reviewController.createReview,
// 	);

module.exports = router;
