const crypto = require('crypto');

const LOGGER = class {
    constructor (newRawData, newStat) {
        this.nullMd5Hash = 'd41d8cd98f00b204e9800998ecf8427e'
        this.update(newRawData, newStat)
    }
    update (newRawData, newStat) {
        if(this.getMd5Hash(newRawData) === this.nullMd5Hash)  return
        this.preRawData = this.currRawData || null
        this.preStat = this.currStat || {size: 0}
        this.preMd5Hash = this.currMd5Hash || null
        this.currRawData = newRawData
        this.currStat = newStat
        this.currMd5Hash = this.getMd5Hash(newRawData)
        this.len = Math.abs(this.currStat.size - this.preStat.size)
        this.buffer = Buffer.alloc(this.len)
        this.offset = 0,
        this.position = this.preStat.size
    }
    getMd5Hash(newRawData) {
        return crypto.createHash('md5')
                .update(newRawData.toString())
                .digest('hex')
    }
}

module.exports = LOGGER