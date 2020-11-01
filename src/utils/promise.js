module.exports.middlewareHandler = fn => (req, res, next) => 
    Promise.resolve(fn(req, res, next)).catch(next);