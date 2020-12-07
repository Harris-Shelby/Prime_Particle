const LOGGER = require('./abstarcts/logger')
const {app, fsWatchPro} = require('./base/schedule');
(async () => {
    try{                
        await app('init')
        fsWatchPro()
    } catch (err) {
        console.log(err)
    }
})();