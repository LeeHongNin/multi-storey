const express = require('express')
const api_router = express.Router()
const api = require('../service/api')

api_router.route('/:path').get(async (request, response, next) => {
    try {
        const reply = await api[request.params.path](request.query)
        request.data = reply
        next()
    } catch (error) {
        request.data = error
        next()
    }
})

module.exports = {
    api_router
}