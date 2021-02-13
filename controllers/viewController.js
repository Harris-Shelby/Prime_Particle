const catchAsync = require('../utils/catchAsync');
const Calender = require('../utils/calendar');

const calendar = new Calender(Date.now());

exports.getOverview = catchAsync(async (req, res) => {
	res.status(200).render('overview', {
		title: 'overviews',
		calendar,
	});
});
