module.exports = (req, res, next) => {
    console.error('404 error');
    res.json({
        apiData: null,
        apiStatus: 404,
        apiError: 'page not found'
    });
};