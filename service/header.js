module.exports = {
    header: (request, response, next) => {
        response.header("Access-Control-Allow-Origin", "*")
        response.header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        next()
    }
}