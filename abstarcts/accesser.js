module.exports = class ACCESSER {
    constructor (newLogger) {
        this.level = newLogger.level
        this.status = newLogger.status
        this.ts = newLogger.ts
        this.duration = newLogger.duration
        this.size = newLogger.size
        this.common_log = newLogger.common_log
        this.init(newLogger.request)

    }
    init (request) {
        this.remote_addr = request.remote_addr
        this.proto = request.proto
        this.method = request.method
        this.host = request.host
        this.url = request.uri
        this.User_Agent = request.headers['User-Agent']
    }
}