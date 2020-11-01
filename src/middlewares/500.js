module.exports = (error, req, res, next) => {
    console.error(error);
    res.json({
        apiData: null,
        apiStatus: 500,
        apiError: 'server error'
    });
};