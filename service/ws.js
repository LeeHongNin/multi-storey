const ws = require('ws')
const http = require('http')
const { executeQuery } = require('./dao')

const http_server = http.createServer()
const ws_server = new ws.Server({ server: http_server })
http_server.listen(8000)

ws_server.on('connection', async (connection, request) => {
    connection.send(JSON.stringify({ type: 'connection', data: true }))
    const level = await executeQuery('SELECT * FROM level')
    if (!level || (level.length === undefined) || (level.length === 0)) {
        broadcast({ type: 'storey', data: [] })
    } else if (level.length > 1) {
        broadcast({ type: 'storey', data: level })
    }
    console.log('Web Socket Connected: ', request.connection.remoteAddress, ':', request.connection.remotePort)
})

const broadcast = data => {
    ws_server.clients.forEach(client => { if (client.readyState === 1) client.send(JSON.stringify(data)) })
}

module.exports = {
    ws_server,
    broadcast
}
