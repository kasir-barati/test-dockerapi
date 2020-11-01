const fs = require('fs');
const path = require('path');

const formidable = require('formidable');

const User = require('../models/user');
const dockerService = require('../services/docker');

module.exports.servicesList = async (req, res, next) => {
    let services = await dockerService.servicesList();
    req.apiData = services;
    req.apiError = null;
    req.apiStatus = 200;
    next();
};

module.exports.createBaseImageService = async (req, res, next) => {
    let { userId } = req;
    let { imageName, imageVersion, cpu, ram, storage } = req.body;
    let user = await User.findByPk(userId);
    let serviceId = await dockerService.createBaseImageService(imageName, imageVersion, cpu, ram, storage, user.networkId);

    req.apiData = serviceId;
    req.apiError = null;
    req.apiStatus = 200;
    next();
};

module.exports.createUserImageService = async (req, res, next) => {};
module.exports.createService = async (req, res, next) => {};

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