const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

const filterObj = (obj, ...allowFields) => {
	const newObj = {};
	Object.keys(obj).forEach((el) => {
		if (allowFields.includes(el)) newObj[el] = obj[el];
	});
	return newObj;
};

exports.updateMe = catchAsync(async (req, res, next) => {
	// Create err if user posts password data
	if (req.body.password || req.body.passwordConfirm) {
		return next(
			new AppError(
				'The route is not for password update. Please use /updateMyPassword',
				400,
			),
		);
	}
	// Fliter out unwanted fields names that are not allowed to be updated
	const filteredBody = filterObj(req.body, 'name', 'email');
	// update user document

	const updateUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
		new: true,
		runValidators: true,
	});

	res.status(200).json({
		status: 'success',
		data: {
			user: updateUser,
		},
	});
});

exports.deleteMe = catchAsync(async (req, res) => {
	await User.findByIdAndUpdate(req.user.id, { active: false });

	res.status(204).json({
		status: 'success',
		data: null,
	});
});
exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);

// Do not update password with this
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
