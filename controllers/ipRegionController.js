const axios = require('axios');
const redis = require('redis');
const { promisify } = require('util');

const Client = redis.createClient({
	host: '172.18.0.4',
	port: 6379,
});

const GET_ASYNC = promisify(Client.get).bind(Client);
const SET_ASYNC = promisify(Client.set).bind(Client);

exports.getIpRegion = async (req, res) => {
	try {
		const { remote } = req.params;
		const reply = await GET_ASYNC(remote);
		if (reply) {
			console.log('using cached data');
			res.send(JSON.parse(reply));
			return;
		}
		const respone = await axios.get(`http://ip-api.com/json/${remote}`);

		const saveResult = await SET_ASYNC(
			remote,
			JSON.stringify(respone.data),
			'EX',
			30,
		);
		console.log('new data cached', saveResult);
		res.send(respone.data);
	} catch (err) {
		console.log(err.message);
	}
};
