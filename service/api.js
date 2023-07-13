const { executeQuery } = require('./dao')
const { broadcast } = require('./ws')

const readLevel = async (request, database) => {
    try {
        let { storey } = request
        let level = await executeQuery(`SELECT * FROM level WHERE storey=${storey} ORDER BY id DESC LIMIT 1`)
        console.log(level)
        if (!level || (level.length === 0)) {
            return { storey, lot_occupied: -1, lot_total: -1 }
        } else {
            return { storey: level[0].storey, lot_occupied: level[0].lot_occupied, lot_total: level[0].lot_total }
        }
    } catch (error) {
        throw error
    }
}

const createLevel = async (request, database) => {
    try {
        let { storey, lot_occupied, lot_total } = request
        await executeQuery(`INSERT INTO level (storey, lot_occupied, lot_total) VALUES (${storey}, ${lot_occupied}, ${lot_total})`)
        const level = await executeQuery('SELECT * FROM level')
        if (!level || (level.length === undefined) || (level.length === 0)) {
            broadcast({ type: 'storey', data: [] })
        } else if (level.length > 1) {
            broadcast({ type: 'storey', data: level })
        }
        return { storey, lot_occupied, lot_total }
    } catch (error) {
        throw error
    }
}

const editLevel = async (request, database) => {
    try {
        let { storey, lot_occupied, lot_total } = request
        await executeQuery(`UPDATE level SET lot_occupied=${lot_occupied}, lot_total=${lot_total} WHERE storey=${storey}`)
        const level = await executeQuery('SELECT * FROM level')
        if (!level || (level.length === undefined) || (level.length === 0)) {
            broadcast({ type: 'storey', data: [] })
        } else if (level.length > 1) {
            broadcast({ type: 'storey', data: level })
        }
        return { storey, lot_occupied, lot_total }
    } catch (error) {
        throw error
    }
}

const removeLevel = async (request, database) => {
    try {
        let { storey } = request
        await executeQuery(`DELETE FROM level WHERE storey=${storey}`)
        const level = await executeQuery('SELECT * FROM level')
        if (!level || (level.length === undefined) || (level.length === 0)) {
            broadcast({ type: 'storey', data: [] })
        } else if (level.length > 1) {
            broadcast({ type: 'storey', data: level })
        }
        return { storey }
    } catch (error) {
        throw error
    }
}

module.exports = {
    readLevel,
    createLevel,
    editLevel,
    removeLevel
}