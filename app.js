const express = require('express')
const application = express()
const http_server = require('http').createServer(application)
const path = require('path')

const { http_port } = require('./config.json')

let tcp
require('./service/tcp').then(tcp_ => tcp = tcp_)
require('./service/ws')

const { header } = require('./service/header')
const { result } = require('./service/result')
const { error } = require('./service/error')
const { api_router } = require('./router/api_router')

application.use(express.static(path.join(__dirname, 'service')))
application.use(header)
application.use('/api', api_router)
application.use(result)
application.use(error)

http_server.listen(http_port, () => { console.log(`HTTP Server is listening at Port: ${http_port}`) })