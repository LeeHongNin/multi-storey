const net = require('net')
const buffer = require('./buffer')
const { executeQuery } = require('./dao')
const { send } = require('./command')
const { responses } = require('./response')
const { broadcast } = require('./ws')

const openConnection = (host, port) => {
    try {
        console.log('Connect to: ', host, ':', port)
        let socket = net.connect({ host, port })
        socket.on('connect', () => onConnect({ host, port }, socket))
        socket.on('data', buffer_ => onData(buffer_, socket))
        socket.on('error', error => onError({ error, host, port }, socket))
        socket.on('close', () => onClose({ host, port }, socket))
        socket.send = data => send({ ...data }, socket)
        return socket
    } catch (error) {
        console.log('TCP openConnection() Error', JSON.stringify(error))
    }
}

const onConnect = async (data, socket) => {
    try {
        const { host, port } = data
        console.log(host, ':', port, 'Connected')
        socket.connected = true
        return await executeQuery(`UPDATE station SET is_it_connected=1 WHERE (host='${host}') AND (port=${port})`)
    } catch (error) {
        console.log('TCP onConnect() Error', JSON.stringify(error))
        throw error
    }
}

const onData = async (buffer_, socket) => {
    try {
        const { source_id, packet_type, data } = buffer.parseStructure(buffer_)
        if (!responses[packet_type]) return
        const object = buffer.readStructure({ packet_type, data })
        const process = responses[packet_type].process ? await responses[packet_type].process({ ...object }) : object
        const replied_data = responses[packet_type].reply ? responses[packet_type].reply(process) : undefined
        if (replied_data) {
            socket.send({ packet_type, destination_id: source_id, replied_data })
            const level = await executeQuery('SELECT * FROM level')
            if (!level || (level.length === undefined) || (level.length === 0)) {
                broadcast({ type: 'storey', data: [] })
            } else if (level.length > 1) {
                broadcast({ type: 'storey', data: level })
            }
        }
    } catch (error) {
        console.log('TCP onData() Error', JSON.stringify(error))
        throw error
    }
}

const onError = async (data, socket) => {
    try {
        const { error, host, port } = data
        console.log(host, ':', port, 'Error ~ ', JSON.stringify(error))
        socket.connected = false
        return await executeQuery(`UPDATE station SET is_it_connected=0 WHERE (host='${host}') AND (port=${port})`)
    } catch (error) {
        console.log('TCP onError() Error', JSON.stringify(error))
        throw error
    }
}

const onClose = async (data, socket) => {
    try {
        const { host, port } = data
        console.log(host, ':', port, 'Closed')
        socket.connected = false
        return await executeQuery(`UPDATE station SET is_it_connected=0 WHERE (host='${host}') AND (port=${port})`)
    } catch (error) {
        console.log('TCP onClose() Error', JSON.stringify(error))
        throw error
    }
}

let sockets = []
let tcp = {}

setInterval(() => {
    sockets.forEach(s => {
        if (s.socket && s.socket.connected) {
            send({ packet_type: 100, destination_id: s.station_id, replied_data: [] }, s.socket)
        } else {
            s.reload()
        }
    })
}, 10000)

module.exports = (async () => {
    if (sockets.length === 0) {
        await executeQuery('SELECT * FROM station').then(stations => {
            sockets = [...stations.map(e => {
                return { station_id: e.station_id,
                         host: e.host,
                         port: e.port,
                         socket: openConnection(e.host, e.port),
                         reload: function() { this.socket = openConnection(this.host, this.port) } }
                })]
            stations.forEach(e => tcp[e.station_id] = sockets.find(s => s.station_id === e.station_id))
        })
    }
    return tcp
})()
