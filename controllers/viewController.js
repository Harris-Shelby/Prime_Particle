const catchAsync = require('../utils/catchAsync');
const Calender = require('../utils/calendar');
const moment = require('moment');
const Accesser = require('../models/accesserModel');

const getDailyAccessers = async () => {
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
	return stats;
};

const getMonthlyAccessers = async () => {
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
	return stats;
};

exports.getOverview = catchAsync(async (req, res) => {
	const dailyStats = await getDailyAccessers();
	const monthlyStats = await getMonthlyAccessers();
	const calendar = new Calender(Date.now());
	res.status(200).render('overview', {
		title: 'overviews',
		calendar,
		dailyStats,
		monthlyStats,
	});
});

exports.getLoginForm = (req, res) => {
	res.status(200).render('login');
};

exports.getAccount = (req, res) => {
	res.status(200).render('account', {
		title: 'Your account',
	});
};
