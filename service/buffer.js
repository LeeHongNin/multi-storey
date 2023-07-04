const { structures } = require('./structure')

const parseHexidecimal = buffer => {
    const string = buffer.toString('hex')
    let array = []
    for (let i = 0; i < string.length - 1; i += 2) {
        array.push(string[i] + string[i + 1])
    }
    array = array.map(e => parseInt(e, 16))
    return array
}

const parseStructure = buffer => {
    const array = parseHexidecimal(buffer.slice(0, 4))
    return {
        source_id: array[0],
        destination_id: array[1],
        packet_type: array[2],
        length: array[3],
        data: buffer.slice(4, 4 + array[3]),
        crc: parseHexidecimal(buffer.slice(-2))
    }
}

const readInteger = buffer => {
    const string = buffer.toString('hex')
    let result = ''
    for (let i = string.length; i > 0; i -= 2) {
        result += `${string[i - 2]}${string[i - 1]}`
    }
    return parseInt(result, 16)
}

const readString = buffer => {
    let string = buffer.toString().replace(/\0/g, '')
    if (!string) return ''
    else if (+string === 0) return ''
    else return string.trim()
}

const readHexidecimal = buffer => parseInt(buffer.toString('hex'), 16)

const readStringInteger = buffer => {
    return readString(buffer) === '' ? 0 : parseInt(readString(buffer))
}

const readData = data => {
    const { buffer, type, length } = data
    //console.log(buffer, type, length)
    return type === 'i' ? readInteger(buffer) :
           type === 's' ? readString(buffer, length) :
           type === 'h' ? readHexidecimal(buffer) :
           type === 'si' ? readStringInteger(buffer) :
           buffer
}

const readStructure = structure => {
    const { packet_type, data } = structure
    if (!packet_type || !data || (data.length === 0)) return undefined
    const format = structures[packet_type]
    let architecture = {}
    Object.keys(format).forEach(e => {
        architecture[e] = readData({ buffer: data.slice(format[e].position, format[e].position + format[e].length),
                                     type: format[e].type,
                                     length: format[e].length })
    })
    return architecture
}

const writeLength = (integer, length) => {
    let string = integer ? integer.toString(16) : ''
    if (string.length < length * 2) string = `${'0'.repeat(length * 2 - string.length)}${string}`
    let result = []
    for (let i = length * 2; i > 0; i -= 2) {
        result.push(parseInt(`${string[i - 2]}${string[i - 1]}`, 16))
    }
    return result
}

module.exports = {
    parseHexidecimal,
    parseStructure,
    readInteger,
    readString,
    readHexidecimal,
    readStringInteger,
    readData,
    readStructure,
    writeLength
}
