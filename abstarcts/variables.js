const HASH = require('../modules/hash');
const RAW = require('../modules/raw');
const STAT = require('../modules/stat');

module.exports = {
    inputPath: '../test.json',
    outPutPath: './data.json',
    md5Hash: new HASH(),
    raw: new RAW(),
    stat: new STAT()
}