const express = require('express');
const viewController = require('../controllers/viewController');
// const authController = require('../controllers/authController');

const router = express.Router();

// router.get('/', (req, res) => {
// 	res.status(200).render('base');
// });

router.get('/', viewController.getOverview);
router.get('/login', viewController.getLoginForm);
module.exports = router;
