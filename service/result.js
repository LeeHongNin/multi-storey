module.exports = {
    result: (request, response) => {
        if ((request.data === undefined) || (request.data === null)) {
            throw new Error('No match for path: ' + request.url)
        } else if (request.data instanceof Error) {
            throw (request.data)
        } else {
            response.json({ success: true, data: request.data })
        }
    }
}