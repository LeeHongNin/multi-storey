const db = require('./db')

const executeQuery = async (sql = null) => {
    try {
        console.log(sql)
        const result = await db.query(sql)
        return result
    } catch (error) {
        throw error
    }
}

module.exports = {
    executeQuery
}
