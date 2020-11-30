const fs = require('fs')
const app = require('./schedule')

exports.readFilePro = file => {
    return new Promise((resolve, reject) => {
        fs.readFile(file, 'utf-8',(err, data) => {
            if (err) reject('I could not find that file!😢');
            resolve(data.trim().split('\n'));
        });
    });
};

exports.getStatPro = file => {
    return new Promise((resolve, reject) => {
      fs.stat(file, (err, stat) => {
        if (err) reject("Could not get stat")
        resolve(stat)
      })
    })
}

exports.addContentPro = (fd, buffer, offset, length, position) => {
    return new Promise((resolve, reject) => {
      fs.read(fd, buffer, offset, length, position, (err, bytesRead, byteResult) => {
        if(err) reject("Could not get buffer")
        resolve(byteResult.toString())
      })
    })
}