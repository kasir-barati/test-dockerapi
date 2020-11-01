module.exports = class ErrorResponse extends Error {
    constructor(name, message, status) {
        super(message);
        this.name = name;
        this.statusCode = statusCode;
    };
};