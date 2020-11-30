const { readFilePro, getStatPro, addContentPro } = require('./utils')
const inputPath = '../test.json';
const LOGGER = require('../abstarcts/logger')

let loggerData = null;
const fs = require('fs');
const fd = fs.openSync(inputPath, 'r');

const app = async (type) => {
    try{
        let newRawData = await readFilePro(inputPath)
        let newStat = await getStatPro(inputPath)

        if(type === 'init') {
            loggerData = new LOGGER(newRawData, newStat);
        } else {
            await loggerData.update(newRawData, newStat);
            if(loggerData.currMd5Hash === loggerData.preMd5Hash 
                            || loggerData.currMd5Hash === loggerData.nullMd5Hash || loggerData.preMd5Hash === null) return
                            console.log(loggerData.preMd5Hash, loggerData.currMd5Hash)
            const aa = await addContentPro(fd, loggerData.buffer, loggerData.offset, loggerData.len, loggerData.position)
            console.log(aa.trim().split('\n'))
        }

    } catch (err) {
        console.log(err)
        throw err;
    }
    return console.log('Ready🐶 !');
}

const fsWatchPro = () => {
    return new Promise((resolve, reject) => {
        fs.watch(inputPath, (eventType, fileName) => {
            if(!inputPath) reject('we could not get file');
            resolve(app('update'))
        })
    })
}

module.exports = {
    app,
    fsWatchPro
}