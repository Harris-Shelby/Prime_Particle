const Accesser = require('../models/accesserModel');
const APIFeatures = require('../utils/apiFeatures');
const moment = require('moment');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.aliasTopAccessers = (req, res, next) => {
	req.query.limit = '5';
	req.query.sort = '-ts,-duration';
	req.query.fields = 'User_Agent,ts,host,url,remote_addr,relegation';
	next();
};

exports.getAllAccessers = catchAsync(async (req, res) => {
	const features = new APIFeatures(Accesser.find(), req.query)
		.filter()
		.sort()
		.limitFields()
		.paginate();
	const accessers = await features.query;

	res.status(201).json({
		status: 'success',
		results: accessers.length,
		data: {
			accessers,
		},
	});
});

exports.getAccesser = catchAsync(async (req, res, next) => {
	const accesser = await Accesser.findById(req.params.id);

	if (!accesser) {
		return next(new AppError('Nothing found with that ID', 404));
	}

	res.status(200).json({
		status: 'success',
		data: {
			accesser,
		},
	});
});

exports.updateAccesser = catchAsync(async (req, res, next) => {
	const accesser = await Accesser.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});

	if (!accesser) {
		return next(new AppError('Nothing found with that ID', 404));
	}

	res.status(200).json({
		status: 'success',
		data: {
			accesser,
		},
	});
});

exports.deleteAccesser = catchAsync(async (req, res, next) => {
	const accesser = await Accesser.findByIdAndDelete(req.params.id);

	if (!accesser) {
		return next(new AppError('Nothing found with that ID', 404));
	}

	res.status(204).json({
		status: 'success',
		data: null,
	});
});

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
