const express = require('express');
const viewController = require('../controllers/viewController');

const router = express.Router();

// router.get('/', (req, res) => {
// 	res.status(200).render('base');
// });

router.get('/', viewController.getOverview);

module.exports = router;
