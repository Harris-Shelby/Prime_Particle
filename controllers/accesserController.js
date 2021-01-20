const Accesser = require('../models/accesserModel');
const moment = require('moment');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.aliasTopAccessers = (req, res, next) => {
	req.query.limit = '5';
	req.query.sort = '-ts,-duration';
	req.query.fields = 'User_Agent,ts,host,url,remote_addr,relegation';
	next();
};

exports.getAllAccessers = factory.getAll(Accesser);
exports.getAccesser = factory.getOne(Accesser, { path: 'reviews' });
exports.updateAccesser = factory.updateOne(Accesser);
exports.deleteAccesser = factory.deleteOne(Accesser);

exports.getDailyAccessers = catchAsync(async (req, res) => {
	const d1 = new Date(moment(new Date()).format('YYYY-MM-DD'));
	const d2 = new Date(moment(new Date()).add(1, 'days').format('YYYY-MM-DD'));
	const stats = await Accesser.aggregate([
		{
			$match: {
				ts: {
					$gte: d1,
					$lt: d2,
				},
			},
		},
		{
			$group: {
				_id: '$User_Agent',
				numofAccessers: { $sum: 1 },
				avgDuration: { $avg: '$duration' },
				ts: { $push: '$ts' },
				url: { $push: '$url' },
				remote_addr: { $push: '$remote_addr' },
				relegation: { $push: '$relegation' },
			},
		},
		{
			$addFields: { User_Agent: '$_id' },
		},
		{
			$project: {
				_id: 0,
			},
		},
		{
			$sort: { numofAccessers: -1 },
		},
	]);

	res.status(203).json({
		status: 'success',
		data: {
			stats,
		},
	});
});

exports.getMonthlyAccessers = catchAsync(async (req, res) => {
	const m1 = new Date(moment(new Date()).format('YYYY-MM'));
	const m2 = new Date(moment(new Date()).add(1, 'months').format('YYYY-MM-DD'));

	const stats = await Accesser.aggregate([
		{
			$match: {
				ts: {
					$gte: m1,
					$lt: m2,
				},
			},
		},
		{
			$group: {
				_id: { $dayOfMonth: '$ts' },
				numofAccessers: { $sum: 1 },
				avgDuration: { $avg: '$duration' },
				User_Agent: { $push: '$User_Agent' },
				relegation: { $push: '$relegation' },
			},
		},
		{
			$addFields: { day: '$_id' },
		},
		{
			$project: {
				_id: 0,
			},
		},
		{
			$sort: { numofAccessers: -1 },
		},
		{
			$limit: 7,
		},
	]);

	res.status(203).json({
		status: 'success',
		data: {
			stats,
		},
	});
});
