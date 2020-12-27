const Accesser = require('../models/accesserModel');

exports.getAllAccessers = async (req, res) => {
	try {
		const accessers = await Accesser.find();

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
