const crypto = require('crypto');
const fs = require('fs');

const inputPath = '../test.json';
let loggerData = null;
const fd = fs.openSync(inputPath, 'r');

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


const readFilePro = file => {
    return new Promise((resolve, reject) => {
        fs.readFile(file, 'utf-8',(err, data) => {
        if (err) reject('I could not find that file!😢');
        resolve(data.trim().split('\n'));
        });
    });
};

const getStatPro = file => {
    return new Promise((resolve, reject) => {
      fs.stat(file, (err, stat) => {
        if (err) reject("Could not get stat")
        resolve(stat)
      })
    })
}

const fsWatchPro = file => {
    return new Promise((resolve, reject) => {
        fs.watch(file, (eventType, fileName) => {
            if(!file) reject('we could not get file');
            resolve(app('update'))
        })
    })
}


const addContentPro = (fd, buffer, offset, length, position) => {
    return new Promise((resolve, reject) => {
      fs.read(fd, buffer, offset, length, position, (err, bytesRead, byteResult) => {
        if(err) reject("Could not get buffer")
        resolve(byteResult.toString())
      })
    })
}

const app = async (type) => {
    try{
        let newRawData = await readFilePro(inputPath)
        let newStat = await getStatPro(inputPath)

        if(type === 'init') {
            loggerData = new LOGGER(newRawData, newStat);
        } else {
            await loggerData.update(newRawData, newStat);
            if(loggerData.currMd5Hash === loggerData.preMd5Hash 
                            || loggerData.currMd5Hash === loggerData.nullMd5Hash) return
            const aa = await addContentPro(fd, loggerData.buffer, loggerData.offset, loggerData.len, loggerData.position)
            console.log(aa.trim().split('\n'))
        }
        
    } catch (err) {
        console.log(err)
        throw err;
    }
    return console.log('Ready🐶 !');
}


(async () => {
    try{                
        await app('init')
        await fsWatchPro(inputPath)
    } catch (err) {
        console.log(err)
    }
})();
