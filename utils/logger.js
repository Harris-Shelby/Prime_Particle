class LOGGER {
	constructor(newStat) {
		this.init(newStat);
	}
	init(newStat) {
		if (newStat.size === 0) return;
		this.preStat = this.currStat || { size: 0 };
		this.currStat = newStat;
		this.len = Math.abs(this.currStat.size - this.preStat.size);
		this.buffer = Buffer.alloc(this.len);
		(this.offset = 0), (this.position = this.preStat.size);
	}
}

module.exports = LOGGER;
