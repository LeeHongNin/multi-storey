const send_types = {
    1: { message: 'Lot Occupied After Increment', type: 3 },
    2: { message: 'Lot Occupied After Decrement', type: 3 },
    100: { message: 'Heart Beat', type: 100 }
}

const send = (data, socket) => {
    try {
        let { packet_type, destination_id, replied_data } = data
        let crc = [0xFF, 0xFF]
        const { message, type } = send_types[packet_type]
        const packet = Buffer.from([0, destination_id, type, replied_data.length, ...replied_data, ...crc])
        //console.log(packet)
        socket.write(packet)
    } catch (error) {
        console.log(`TCP Send Error, ${error.message}`)
        throw error
    }
}

module.exports = {
    send
}
