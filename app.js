const fs = require('fs');

const LOGGER = require('./abstarcts/logger')
const {app, fsWatchPro} = require('./base/schedule');

(async () => {
    try{                
        await app('init')
        await fsWatchPro()
    } catch (err) {
        console.log(err)
    }
})();