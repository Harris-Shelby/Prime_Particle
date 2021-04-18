const moment = require('moment');

class CALENDAR {
	constructor(day) {
		this.currDay = moment(day).format('E') * 1;
		this.currWeek = [];
		this.getCurrWeek(day);
	}
	async getPreWeek() {
		const newcurrWeek = await this.currWeek.map((day) => {
			day.newDay = day.newDay.subtract(7, 'days');
			day.dayofWeek = day.newDay.format('ddd');
			day.monofYear = day.newDay.format('MMM');
			day.dayofMonth = day.newDay.format('DD');
		});
		this.currWeek = newcurrWeek;
	}
	async getNextWeek() {
		const newcurrWeek = await this.currWeek.map((day) => {
			day.newDay = day.newDay.add(7, 'days');
			day.dayofWeek = day.newDay.format('ddd');
			day.monofYear = day.newDay.format('MMM');
			day.dayofMonth = day.newDay.format('DD');
		});
		this.currWeek = newcurrWeek;
	}
	getCurrWeek(dayy) {
		[...Array(this.currDay)].forEach((day, index) => {
			const today = false;
			const id = this.currDay - index;
			const newDay = moment(dayy).subtract(id, 'days');
			const dayofWeek = newDay.format('ddd');
			const monofYear = newDay.format('MMM');
			const dayofMonth = newDay.format('DD');
			this.currWeek.push({
				today,
				dayofWeek,
				monofYear,
				dayofMonth,
				newDay,
			});
		});
		if (this.currDay === 7) {
			const today = true;
			const newDay = moment(dayy);
			const dayofWeek = moment(dayy).format('ddd');
			const monofYear = moment(dayy).format('MMM');
			const dayofMonth = moment(dayy).format('DD');
			this.currWeek.push({
				today,
				dayofWeek,
				monofYear,
				dayofMonth,
				newDay,
			});
			this.currWeek.splice(0, 1);
		} else {
			[...Array(7 - this.currDay)].forEach((day, index) => {
				let today;
				index === 0 ? (today = true) : (today = false);
				const newDay = moment(dayy).add(index, 'days');
				const dayofWeek = newDay.format('ddd');
				const monofYear = newDay.format('MMM');
				const dayofMonth = newDay.format('DD');
				this.currWeek.push({
					today,
					dayofWeek,
					monofYear,
					dayofMonth,
					newDay,
				});
			});
		}
	}
}

module.exports = CALENDAR;
