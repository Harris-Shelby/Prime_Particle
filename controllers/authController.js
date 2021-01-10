const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

const signToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
};

exports.signup = catchAsync(async (req, res) => {
	const newUser = await User.create(req.body);

	const token = signToken(newUser._id);
	res.status(201).json({
		status: 'success',
		token,
		data: {
			user: newUser,
		},
	});
});

exports.login = catchAsync(async (req, res, next) => {
	const { email, password } = req.body;

	// Check if email and password exist
	if (!email || !password) {
		return next(new AppError('Please provide email and password', 400));
	}
	// Check if user exists && password is correct
	const user = await User.findOne({ email }).select('+password');

	if (!user || !(await user.correctPassword(password, user.password))) {
		return next(new AppError('Incorrect email or password', 401));
	}
	// If everything ok, send token to client
	const token = signToken(user._id);
	res.status(200).json({
		status: 'success',
		token,
	});
});

exports.protect = catchAsync(async (req, res, next) => {
	// Getting the token and check of it's there
	let token;
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	) {
		token = req.headers.authorization.split(' ')[1];
	}
	if (!token) {
		return next(
			new AppError('You are not logged in Please log in to get access', 401),
		);
	}
	// Validate token
	const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
	// Check if user still exists
	const currentUser = await User.findById(decoded.id);
	if (!currentUser) {
		return next(
			new AppError('The token belonging to this user does not longger exist.'),
		);
	}
	// Check if user changed password after the token is issued
	if (currentUser.changedPasswordAfter(decoded.iat)) {
		return next(
			new AppError('User recently changed password! Please log in again', 401),
		);
	}
	// Grant access to protected routes
	req.user = currentUser;
	next();
});

exports.restrictTo = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			return next(
				new AppError('You do not have permission to perform this action.', 403),
			);
		}
		next();
	};
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
	// Get user base on posted email
	const user = await User.findOne({ email: req.body.email });

	if (!user) {
		return next(new AppError('There is no user with email address.', 404));
	}
	// generate the radom reset token
	const resetToken = user.createPasswordResetToken();
	await user.save({ validateBeforeSave: false });
	// send it to user's email
	const resetUrl = `${req.protocol}://${req.get(
		'host',
	)}/api/v1/users/resetPassword/${resetToken}`;

	const message = `Forget your password? Submit a Patch request with your new password and passwordConfirm to ${resetUrl}.\nIf you didn't forget your password please ignore this email!`;
	try {
		await sendEmail({
			email: user.email,
			subject: 'Your password reset token only valid for 10min',
			message,
		});

		res.status(200).json({
			status: 'success',
			message: 'Token sent to email!',
		});
	} catch (err) {
		user.passwordResetToken = undefined;
		user.passwordResetExpires = undefined;
		await user.save({ validateBeforeSave: false });

		return next(
			new AppError(
				'There was an error sending the email, try again later!',
				500,
			),
		);
	}
});

exports.resetPassword = async (req, res, next) => {
	// Get user base on the token
	const hashedToken = crypto
		.createHash('sha256')
		.update(req.params.token)
		.digest('hex');

	const user = await User.findOne({
		passwordResetToken: hashedToken,
		passwordResetExpires: { $gt: Date.now() },
	});
	// if token has not expired, and there is user, set the new password
	if (!user) {
		return next(new AppError('Token is invalid or has expired!', 400));
	}
	user.password = req.body.password;
	user.passwordConfirm = req.body.passwordConfirm;
	user.passwordResetToken = undefined;
	user.passwordResetExpires = undefined;
	await user.save();
	// Update changedPasswordAt property for the user
	const token = signToken(user._id);
	res.status(200).json({
		status: 'success',
		token,
	});
	//Log the user in, send JWT
};
