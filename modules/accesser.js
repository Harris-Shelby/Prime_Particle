module.exports = class ACCESSER {
    constructor (level, status, ts, duration, size, remote, proto, 
        method, host, url, reqHeader, respHeader) {
        this.level = level
        this.status = status
        this.ts = ts
        this.duration = duration
        this.size = size
        this.remote = remote,
        this.proto = proto,
        this.method = method,
        this.host = host,
        this.url = url
        this.init(reqHeader, respHeader)
    }
    init (reqHeader, respHeader) {

    }
}