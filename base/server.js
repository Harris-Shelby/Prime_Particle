const express = require('express');
const responseTime = require('response-time');

const ipReginRoute = require('../routes/ipRegionRoute');
const accessersRoute = require('../routes/accesserRoutes');
const server = express();

server.use(responseTime());
server.use(express.json());

server.use('/api/v1/ipRegion', ipReginRoute);
server.use('/api/v1/accessers', accessersRoute);

module.exports = server;
