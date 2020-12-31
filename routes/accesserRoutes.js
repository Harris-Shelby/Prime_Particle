const express = require('express');
const accesserController = require('./../controllers/accesserController');

const router = express.Router();

router
	.route('/top-5-latest')
	.get(
		accesserController.aliasTopAccessers,
		accesserController.getAllAccessers,
	);

router.route('/accesser-Stats').get(accesserController.getAccesserStats);

router.route('/').get(accesserController.getAllAccessers);

router
	.route('/:id')
	.get(accesserController.getAccesser)
	.patch(accesserController.updateAccesser)
	.delete(accesserController.deleteAccesser);

module.exports = router;
