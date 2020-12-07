const express = require('express');
const axios = require('axios');
const redis = require('redis');
const responseTime = require('response-time');
const {promisify} = require('util');

const server = express();
server.use(responseTime());

const Client = redis.createClient({
    host: '172.18.0.4',
    port: 6379
})

const GET_ASYNC = promisify(Client.get).bind(Client);
const SET_ASYNC = promisify(Client.set).bind(Client);

server.get('/relegations/:remote', async(req, res, next) => {
    try {
        const { remote } = req.params;
        const reply = await GET_ASYNC(remote)
        if (reply) {
            console.log('using cached data')
            res.send(JSON.parse(reply))
            return
        }
        const respone = await axios.get(
            `http://ip-api.com/json/${remote}`
        )

        const saveResult = await SET_ASYNC(
            remote,
            JSON.stringify(respone.data),
            'EX',
            30)
        console.log('new data cached', saveResult)
        res.send(respone.data)
    } catch (err) {
        console.log(err.message)
    }
})

module.exports = {
    server
}