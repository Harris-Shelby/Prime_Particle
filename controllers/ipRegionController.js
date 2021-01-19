const axios = require('axios');
const redis = require('redis');
const { promisify } = require('util');

const Client = redis.createClient({
	host: process.env.REDIS_IP,
	port: process.env.REIDS_PORT,
});

const GET_ASYNC = promisify(Client.get).bind(Client);
const SET_ASYNC = promisify(Client.set).bind(Client);

exports.getIpRegion = async (remote) => {
	try {
		const reply = await GET_ASYNC(remote);
		if (reply) {
			return JSON.parse(reply);
		}
		const respone = await axios.get(`http://ip-api.com/json/${remote}`);

		const saveResult = await SET_ASYNC(
			remote,
			JSON.stringify(respone.data),
			'EX',
			300,
		);
		return saveResult;
	} catch (err) {
		console.log(err.message);
	}
};
