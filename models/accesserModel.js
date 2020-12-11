const mongoose = require('mongoose');

const accesserSchema = new mongoose.Schema({
	name: {
		type: Number,
		unique: false,
	},
	level: String,
	status: Number,
	ts: String,
	duration: Number,
	size: Number,
	common_log: String,
	proto: String,
	method: String,
	host: String,
	url: String,
	User_Agent: {
		type: Array,
		default: ['robot'],
	},
	remote_addr: {
		type: String,
		required: [true, 'An accesser must have a IP'],
	},
	relegation: {
		type: Object,
		required: [true, 'An accesser must have IPRegin'],
	},
});

const Accesser = mongoose.model('Accesser', accesserSchema);

module.exports = Accesser;
