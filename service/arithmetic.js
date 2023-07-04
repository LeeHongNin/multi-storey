const { executeQuery } = require('./dao')

const housekeep = async storey => {
    try {
        let level = await executeQuery(`SELECT * FROM level WHERE storey=${storey}`)
        if (!level || (level.length === 0)) {
            await executeQuery(`INSERT INTO level (storey, lot_occupied) VALUES (${storey}, 0)`)
        } else if (level.length > 1) {
            level = await executeQuery(`SELECT * FROM level WHERE storey=${storey} ORDER BY id DESC LIMIT 1`)
            await executeQuery(`DELETE FROM level WHERE (storey=${storey}) AND (id<>${level.id})`)
        }
    } catch (error) {
        throw error
    }
}

const increment = async data => {
    try {
        const { storey } = data
        await housekeep(storey)
        await executeQuery(`UPDATE level SET lot_occupied=lot_occupied+1 WHERE storey=${storey}`)
        const level = await executeQuery(`SELECT * FROM level WHERE storey=${storey}`)
        if (!level || (level.length === 0)) return { storey, lot_occupied: 0 }
        let { lot_occupied, lot_total } = level[0]
        if (lot_occupied < 1) {
            await executeQuery(`UPDATE level SET lot_occupied=1 WHERE storey=${storey}`)
            lot_occupied = 1
        }
        return { storey, lot_available: ((lot_total - lot_occupied) < 0) ? 0 : (lot_total - lot_occupied) }
    } catch (error) {
        throw error
    }
}

const decrement = async data => {
    try {
        const { storey } = data
        await housekeep(storey)
        await executeQuery(`UPDATE level SET lot_occupied=lot_occupied-1 WHERE storey=${storey}`)
        const level = await executeQuery(`SELECT * FROM level WHERE storey=${storey}`)
        if (!level || (level.length === 0)) return { storey, lot_occupied: 0 }
        let { lot_occupied, lot_total } = level[0]
        if (lot_occupied < 0) {
            await executeQuery(`UPDATE level SET lot_occupied=0 WHERE storey=${storey}`)
            lot_occupied = 0
        }
        return { storey, lot_available: ((lot_total - lot_occupied) < 0) ? 0 : (lot_total - lot_occupied) }
    } catch (error) {
        throw error
    }
}

module.exports = {
    increment,
    decrement
}
