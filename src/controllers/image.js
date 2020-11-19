const path = require('path');
const { promises: fsPromises } = require('fs');

const extractZip = require('extract-zip');
const { IncomingForm } = require('formidable');

const dockerService = require('../services/docker');
const Image = require('../models/image');

const BASE_URL = `http://${process.env.APP_HOST}:${process.env.APP_PORT}`;
const PUBLIC_DIR_PATH = path.join(__dirname, '..', '..', 'public');
const DOCKER_DIR_PATH = path.join(__dirname, '..', '..', 'docker');

module.exports.add = async (req, res, next) => {
    let { userId, imageId } = req.body;
    let inspectImage = await dockerService.inspectImage(imageId);

    let image = await Image.create({
        imageCreated: inspectImage.Created,
        imageId: inspectImage.Id,
        imageParentId: inspectImage.Parent,
        imageRepoTag: inspectImage.RepoTags[0],
        imageSize: inspectImage.Size,
        imageVirtualSize: inspectImage.VirtualSize,
        imageExposePort: inspectImage.ContainerConfig.ExposedPorts ? Object.keys(inspectImage.ContainerConfig.ExposedPorts)[0].split("/")[0] : null,
        userId,
    });

    req.apiData = image.id;
    req.apiError = null;
    req.apiStatus = 200;
    next();
};

module.exports.uploadPic = async (req, res, next) => {
    let { id } = req.params;
    let image = await Image.findByPk(id);
    let form = new IncomingForm({
        keepExtensions: true,
        uploadDir: path.join(PUBLIC_DIR_PATH, 'pictures')
    });

    form.parse(req);
    form.on('file', (field, file) => {
        image.pic = `${BASE_URL}/pictures/${file.path.split('/public/pictures/')[1]}`;
    });
    form.on('error', next);
    form.on('end', async () => {
        await image.save();
        req.apiData = null;
        req.apiError = null;
        req.apiStatus = 200;
        next();
    });
};

module.exports.inspect = async (req, res, next) => {
    let { id } = req.params;
    let image = await Image.findByPk(id);

    req.apiData = image;
    req.apiError = null;
    req.apiStatus = 200;
    next();
};

module.exports.list = async (req, res, next) => {
    let images = await Image.findAll();

    req.apiData = images;
    req.apiError = null;
    req.apiStatus = 200;
    next();
};

module.exports.remove = async (req, res, next) => {
    let { id } = req.params;
    let image = await Image.findByPk(id);

    await dockerService.removeImage(image.imageId);
    await image.destroy();

    req.apiData = null;
    req.apiError = null;
    req.apiStatus = 200;
    next();
};

module.exports.build = async (req, res, next) => {
    let { id } = req.params;
    let { exposePort, userId } = req.body;
    let newImage = await Image.create({});
    let baseImage = await Image.findByPk(id);
    let imageDirectory = path.join(DOCKER_DIR_PATH, newImage.id);
    let imageName = baseImage.imageRepoTag.split(':')[0];
    let dockerfile = await fsPromises.readFile(path.join(DOCKER_DIR_PATH, 'Dockerfile'), 'utf8');
    
    dockerfile = dockerfile.replace(/REPO_TAG/g, baseImage.imageRepoTag);
    await fsPromises.mkdir(imageDirectory);
    switch (imageName) {
        case 'node':
            dockerfile = dockerfile.replace(/IMAGE_WORKDIR/g, '/app');
            dockerfile = dockerfile.replace(/RUN_COMMAND/g, 'npm install && npm build');
            dockerfile = dockerfile.replace(/EXPOSE_PORT/g, exposePort);
            dockerfile = dockerfile.replace(/CMD_COMMAND/g, '["npm", "start"]');
            break;
    };
    await fsPromises.writeFile(path.join(imageDirectory, 'Dockerfile'), dockerfile, 'utf8');
    
    req.apiData = newImage.id;
    req.apiError = null;
    req.apiStatus = 200;
    next();
};

module.exports.uploadZip = async (req, res, next) => {
    let result, { id } = req.params;
    // let image = await Image.findByPk(id);
    let form = new IncomingForm({
        keepExtensions: true,
        uploadDir: DOCKER_DIR_PATH
    });

    form.parse(req);
    form.on('file', async (field, file) => {
        let imageDirectory = path.join(DOCKER_DIR_PATH, id);
        await extractZip(file.path, { dir: imageDirectory });
        await fsPromises.rm(file.path);
        result = await dockerService.buildImage(`${BASE_URL}/Dockerfile`, `${imageDirectory}:${Date.now()}`);
    });
    form.on('error', error => {
        next(error);
    });
    form.on('end', async () => {
        req.apiData = result;
        req.apiError = null;
        req.apiStatus = 200;
        next();
    });
};