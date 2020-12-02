const fs = require('fs')

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
        resolve(JSON.parse(byteResult.toString().trim().split('\n')))
      })
    })
}