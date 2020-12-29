const Accesser = require('../models/accesserModel');

exports.getAllAccessers = async (req, res) => {
	try {
		console.log(req.query);
		// Build Query
		// 1A) filtering

		const queryObj = { ...req.query };
		const exculdedFields = ['page', 'sort', 'limit', 'fields'];
		exculdedFields.forEach((el) => delete queryObj[el]);

		// 1B) Advanced filtering
		let queryStr = JSON.stringify(queryObj);
		queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
		console.log(JSON.parse(queryStr));

		let query = Accesser.find(JSON.parse(queryStr));

		// 2) Sorting
		if (req.query.sort) {
			const sortBy = req.query.sort.split(',').join(' ');
			console.log(sortBy);
			query = query.sort(sortBy);
		}

		// 3) Fielding limiting
		if (req.query.fields) {
			const fields = req.query.fields.split(',').join(' ');
			query = query.select(fields);
		} else {
			query = query.select('-__v');
		}

		// 4) Pagination
		const page = req.query.page * 1 || 1;
		const limit = req.query.limit * 1 || 100;
		const skip = (page - 1) * limit;
		// page=3&limit=10 1-10, page 1, 11-20, page 2, 21-30, page 3
		query = query.skip(skip).limit(limit);

		if (req.query.page) {
			const numOfAccessers = await Accesser.countDocuments();
			if (skip >= numOfAccessers) throw new Error('This page does not exist ');
		}

		const accessers = await query;

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
