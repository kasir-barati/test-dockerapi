module.exports = (logger) => {
    process.on('uncaughtException', console.error);
    process.on('unhandledRejection', console.error);
};