const ws = require('ws')
const http = require('http')
const http_server = http.createServer()
const ws_server = new ws.Server({ http_server })
http_server.listen(8080)

ws_server.on('connection', async (connection, request) => {
    connection.send(JSON.stringify({ type: 'connection', res: true }))
    console.log('Web Socket Connected: ', request.connection.remoteAddress, ':', request.connection.remotePort)
})

const broadcast = data => {
    ws_server.clients.forEach(client => { if (client.readyState === 1) client.send(JSON.stringify(data)) })
}

module.exports = {
    ws_server,
    broadcast
}
