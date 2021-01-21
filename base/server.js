const path = require('path');
const express = require('express');
const responseTime = require('response-time');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('../utils/appError');
const globalErrorHandler = require('../controllers/errorController');
const accessersRoute = require('../routes/accesserRoutes');
const usersRoute = require('../routes/userRoutes');
const reviewRoute = require('../routes/reviewRoutes');

const server = express();
// Global middleware
// Set security http header
server.use(express.static(path.join(`${__dirname}/../`, 'public')));

server.use(helmet());

server.set('view engine', 'pug');
server.set('views', path.join(`${__dirname}/../`, 'views'));
// Development logger
if (process.env.NODE_ENV === 'development') {
	server.use(morgan('dev'));
}
// Limit requests from same API
const limiter = rateLimit({
	max: 1000,
	windowMs: 60 * 60 * 1000,
	message: 'Too many request from this IP, please try again in an hour!',
});
server.use('/api', limiter);

server.use(responseTime());

// Body parser, reading data from body into req.body
server.use(express.json({ limit: '10kb' }));

// Data sanitization against NOSQL query injection
server.use(mongoSanitize());

// Data sanitization against XSS
server.use(xss());

// Prevent params pollution
server.use(
	hpp({
		whitelist: [
			'duration',
			'isp',
			'country',
			'city',
			'isp',
			'remote_addr',
			'url',
			'User_Agent',
		],
	}),
);

// Routes
server.get('/', (req, res) => {
	res.status(200).render('base');
});

server.use('/api/v1/accessers', accessersRoute);
server.use('/api/v1/users', usersRoute);
server.use('/api/v1/reviews', reviewRoute);

server.all('*', (req, res, next) => {
	next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

server.use(globalErrorHandler);

module.exports = server;
