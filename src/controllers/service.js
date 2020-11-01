const fs = require('fs');
const path = require('path');

const formidable = require('formidable');

module.exports.servicesList = async (req, res, next) => {
    res.json({
        apiData: null,
        apiError: null,
        apiStatus: 200
    });
};

module.exports.uploadZipFile = async (req, res, next) => {
};

/*
console.log(req.headers); 
    let form = formidable({
        keepExtensions: true,
        uploadDir: path.join(__dirname, '..',  '..', 'public', 'uploads')
    });
    form.parse(req);
    form.on('fileBegin', (name, file) => {
        file.path = path.join(__dirname, '..',  '..', 'public', 'uploads', `${Date.now()}_${file.name}`);
    });
    form.on('file', (name, file) => {
        console.log('Uploaded ' + file.name);
    });
    form.on('aborted', () => {
        res.json({
            apiData: null,
            apiError: null,
            apiStatus: 200
        });
    });
    form.on('error', error => {
        console.error(error);
        res.json({ error })
    });
    form.on('end', () => {
        res.json({
            apiData: null,
            apiError: null,
            apiStatus: 200
        });
    });
*/