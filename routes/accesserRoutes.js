const express = require('express');
const accesserController = require('./../controllers/accesserController');

const router = express.Router();

router.route('/accessers').get(accesserController.getAllAccessers);

module.exports = router;
