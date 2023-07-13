module.exports = {
    error: (error_, request, response, next) => {
        if (!error_) return
        console.log(error_)
        let { statusCode, message } = error_
        statusCode = statusCode || 404
        const response_ = { status: "error", statusCode, message }
        response.status(statusCode).json(response_)
    }
}