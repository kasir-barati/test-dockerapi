const ErrorResponse = require('../utils/error-response');
const Logger = require('../utils/logger');
const logger = new Logger('500');

const NODE_ENV = process.env.NODE_ENV;

module.exports = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    } else {
        let error;
        let meta = {
            "ip": req.ip,
            "body": req.body,
            "method": req.method,
            "headers": req.headers,
            "originalUrl": req.originalUrl,
            "errorName": err.name,
            "errorStack": err.stack,
            "errorMessage": err.message,
        };

        // if error thrown because of database goes down you must send email to the admin
        switch (err.name) {
            case 'ValidationError': 
                error = new ErrorResponse('ValidationError', err.message, 400);;
                break;
            case 'Error':
            case 'TypeError':
            case 'DockerError':
            case 'ReferenceError':
                error = new ErrorResponse('ServerError', `Server error.`, 500);
                break;
            case 'SyntaxError': 
                error = new ErrorResponse('badRequest', `Something sent wrong.`, 400);
                break;
            case 'SequelizeDatabaseError':
                error = new ErrorResponse('DatabaseError', `Server error.`, 500);
                // meta.sequelizeErrors = [];
                // meta.sequelizeErrors.push(meta.errorMessage);
                break;
            case 'AssertionError':
            case 'MongoParseError':
            case 'SequelizeConnectionError':
            case 'MongoServerSelectionError':
            case 'SequelizeUniqueConstraintError':
            case 'SequelizeConnectionRefusedError':
                meta.sequelizeErrors = [];
                for (let item of err.errors) {
                    meta.sequelizeErrors.push({
                        type: item.type,
                        value: item.value,
                        message: item.message
                    });
                };
                error = new ErrorResponse('DatabaseError', `Some kind of mistake happened in backend, please report it to the admin.`, 500);
                // await mail.sendMail('admin <ADMIN@GMAIL.COM>', 'node.js.developers.kh@gmail.com', 'Your database goes down', '<h1>please go there</h1>');
                break;
        };

        if (err.statusCode >= 400 && err.statusCode <= 422) {
            logger.warn('Validation error occured.', { meta });
        } else {
            logger.error('Server side error occured.', { meta });
        };
        res.status(err.statusCode === 401 ? 401 : 200).json({
            apiData: null,
            apiError: NODE_ENV === 'develop' ? err.message : error.message,
            apiStatus: error.statusCode
        });
    };
};