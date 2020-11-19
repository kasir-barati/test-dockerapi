const router = require('express').Router();

const imageController = require('../controllers/image');
const { middlewareHandler } = require('../utils/promise');
// const imageValidator = require('../validators/image');

// /images/
    
router
    .route('/')
    .get(middlewareHandler(imageController.list))
    .post(middlewareHandler(imageController.add));

router
    .route('/:id/upload-zip')
    .post(middlewareHandler(imageController.uploadZip));

router
    .route('/:id/build')
    .post(middlewareHandler(imageController.build));

router
    .route('/:id/inspect')
    .get(middlewareHandler(imageController.inspect));

router
    .route('/:id/remove')
    .delete(middlewareHandler(imageController.remove));

router
    .route('/:id/upload-pic')
    .post(middlewareHandler(imageController.uploadPic));

module.exports = router;