const moment = require('moment');

class CALENDAR {
	constructor(day) {
		this.currtDay = moment(day).format('E') * 1;
		this.currWeek = [];
		this.getCurrWeek();
	}
	getCurrWeek() {
		[...Array(this.currtDay)].forEach((day, index) => {
			const today = false;
			const id = this.currtDay - index;
			const newDay = moment(new Date()).subtract(index + 1, 'days');
			const dayofWeek = newDay.format('ddd');
			const monofYear = newDay.format('MMM');
			const dayofMonth = newDay.format('DD');
			this.currWeek.push({
				id,
				today,
				dayofWeek,
				monofYear,
				dayofMonth,
			});
		});
		[...Array(8 - this.currtDay)].forEach((day, index) => {
			let today, id;
			index === 0 ? (today = true) : (today = false);
			id = this.currtDay + index;
			const newDay = moment(new Date()).add(index, 'days');
			const dayofWeek = newDay.format('ddd');
			const monofYear = newDay.format('MMM');
			const dayofMonth = newDay.format('DD');
			this.currWeek.push({
				id,
				today,
				dayofWeek,
				monofYear,
				dayofMonth,
			});
		});
	}
}

console.log(new CALENDAR(Date.now()));
