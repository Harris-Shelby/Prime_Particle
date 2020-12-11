const express = require('express');
const responseTime = require('response-time');

const ipReginRoute = require('../routes/ipRegionRoute');

const server = express();

server.use(responseTime());
server.use(express.json());

server.use('/api/v1/ipRegion', ipReginRoute);
module.exports = server;
