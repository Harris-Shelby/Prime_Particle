const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const filterObj = (obj, ...allowFields) => {
	const newObj = {};
	Object.keys(obj).forEach((el) => {
		if (allowFields.includes(el)) newObj[el] = obj[el];
	});
	return newObj;
};

exports.getAllUsers = catchAsync(async (req, res) => {
	const users = await User.find();

	res.status(201).json({
		status: 'success',
		results: users.length,
		data: {
			users,
		},
	});
});

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
