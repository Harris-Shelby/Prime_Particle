const express = require('express');
const ipRegionController = require('./../controllers/ipRegionController');

const ipRegionRouter = express.Router();

ipRegionRouter.route('/:remote').get(ipRegionController.getIpRegion);

module.exports = ipRegionRouter;
