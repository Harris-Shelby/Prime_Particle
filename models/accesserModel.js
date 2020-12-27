const mongoose = require('mongoose');

const accesserSchema = new mongoose.Schema({
	name: {
		type: Number,
		unique: true,
	},
	level: {
		type: String,
		trim: true,
	},
	status: Number,
	ts: Date,
	duration: Number,
	size: Number,
	common_log: {
		type: String,
		trim: true,
	},
	proto: {
		type: String,
		trim: true,
	},
	method: {
		type: String,
		trim: true,
	},
	host: {
		type: String,
		trim: true,
	},
	url: {
		type: String,
		trim: true,
	},
	User_Agent: {
		type: Array,
		default: ['robot'],
	},
	remote_addr: {
		type: String,
		trim: true,
		required: [true, 'An accesser must have a IP'],
	},
	relegation: {
		type: Object,
		required: [true, 'An accesser must have IPRegin'],
	},
});

const Accesser = mongoose.model('Accesser', accesserSchema);

module.exports = Accesser;
