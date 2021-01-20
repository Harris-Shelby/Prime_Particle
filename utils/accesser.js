const moment = require('moment');

class ACCESSER {
	constructor(newLogger) {
		this.level = newLogger.level;
		this.status = newLogger.status;
		this.ts = this.ts = moment
			.unix(newLogger.ts + 28800)
			.format('YYYY-MM-DD HH:mm:ss');
		this.name = newLogger.ts;
		this.duration = newLogger.duration;
		this.size = newLogger.size;
		this.common_log = newLogger.common_log;
		this.init(newLogger.request);
		this.resp_headers = newLogger.resp_headers;
	}
	async init(request) {
		this.proto = request.proto;
		this.method = request.method;
		this.host = request.host;
		this.url = request.uri;
		this.User_Agent = request.headers['User-Agent'];
		this.req_headers = request.headers;
		request.headers['X-Forwarded-For']
			? (this.remote_addr = request.headers['X-Forwarded-For'][0])
			: (this.remote_addr = request.remote_addr.split(':')[0]);
	}
}

module.exports = ACCESSER;
