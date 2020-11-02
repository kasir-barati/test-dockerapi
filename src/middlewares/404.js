const Logger = require('../utils/logger');
const logger = new Logger('404');

module.exports = (req, res, next) => {
    if (!req.apiStatus) {
        logger.warn('endpoint-not-found', {
            meta: {
                "ip": req.ip,
                "body": req.body,
                "method": req.method,
                "headers": req.headers,
                "originalUrl": req.originalUrl,
            }
        });
        res.json({
            apiData: null,
            apiStatus: 404,
            apiError: 'page not found'
        });
    };
    next();
};