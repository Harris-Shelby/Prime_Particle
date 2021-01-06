const express = require('express');
const responseTime = require('response-time');
const morgan = require('morgan');

const AppError = require('../utils/appError');
const globalErrorHandler = require('../controllers/errorController');
const ipReginRoute = require('../routes/ipRegionRoute');
const accessersRoute = require('../routes/accesserRoutes');
const server = express();

if (process.env.NODE_ENV === 'delelopment') {
	server.use(morgan('dev'));
}

server.use(responseTime());
server.use(express.json());

server.use('/api/v1/ipRegion', ipReginRoute);
server.use('/api/v1/accessers', accessersRoute);

server.all('*', (req, res, next) => {
	next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

server.use(globalErrorHandler);

module.exports = server;
