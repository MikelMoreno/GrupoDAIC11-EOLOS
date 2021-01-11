
const genericError = (error, req, res, next) => {
    return res.json({
        error: error
    })
}

module.exports.genericError = genericError;