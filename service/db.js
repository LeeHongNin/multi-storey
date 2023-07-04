const mysql = require('mysql')
const { db } = require('../config.json')

const pool = mysql.createPool(db)

const query = (sql, data = undefined) => {
    return new Promise((resolve, reject) => {
        pool.query(sql, data, (error, rows) => {
            if (error) { reject(error) }
            resolve(rows)
        })
    }).catch(error => { throw error })
}

module.exports = {
    pool,
    query
}