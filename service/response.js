const { increment, decrement } = require('./arithmetic')
const { writeLength } = require('./buffer')

const responses = {
    1: {
        process: object => increment(object),
        reply: object => [...writeLength(object.storey, 1), ...writeLength(object.lot_available, 4)]
    },
    2: {
        process: object => decrement(object),
        reply: object => [...writeLength(object.storey, 1), ...writeLength(object.lot_available, 4)]
    }
}

module.exports = {
    responses
}
