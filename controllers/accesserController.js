const Accesser = require('../models/accesserModel');
const APIFeatures = require('./../utils/apiFeatures');
const moment = require('moment');

exports.aliasTopAccessers = (req, res, next) => {
	req.query.limit = '5';
	req.query.sort = '-ts,-duration';
	req.query.fields = 'User_Agent,ts,host,url,remote_addr,relegation';
	next();
};

exports.getAllAccessers = async (req, res) => {
	try {
		console.log(req.query);

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
	} catch (err) {
		res.status(400).json({
			status: 'fail',
			message: err,
		});
	}
};

exports.getAccesser = async (req, res) => {
	try {
		const accesser = await Accesser.findById(req.params.id);

		res.status(202).json({
			status: 'success',
			data: {
				accesser,
			},
		});
	} catch (err) {
		res.status(400).json({
			status: 'fail',
			message: err,
		});
	}
};

exports.updateAccesser = async (req, res) => {
	try {
		const accesser = await Accesser.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});

		res.status(203).json({
			status: 'success',
			data: {
				accesser,
			},
		});
	} catch (err) {
		res.status(400).json({
			status: 'fail',
			message: err,
		});
	}
};

exports.deleteAccesser = async (req, res) => {
	try {
		await Accesser.findByIdAndDelete(req.params.id);

		res.status(204).json({
			status: 'success',
			data: null,
		});
	} catch (err) {
		res.status(400).json({
			status: 'fail',
			message: err,
		});
	}
};

exports.getAccesserStats = async (req, res) => {
	try {
		console.log(req.query);
		// if (CreateAt) {
		// let d1 = new Date(moment(new Date(parseInt(CreateAt, 10))).format('YYYY-MM-DD'));
		// let d2 = new Date(moment(new Date(parseInt(CreateAt, 10))).add(1, 'days').format('YYYY-MM-DD'));
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
				},
			},
		]);

		res.status(203).json({
			status: 'success',
			data: {
				stats,
			},
		});
	} catch (err) {
		res.status(400).json({
			status: 'fail',
			message: err,
		});
	}
};
