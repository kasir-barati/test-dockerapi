const router = require('express').Router();

const serviceController = require('../controllers/service');
const { middlewareHandler } = require('../utils/promise');

// /services
router
    .route('/')
    .get(middlewareHandler(serviceController.servicesList))
    .post(middlewareHandler(serviceController.createBaseImageService));
    
router
    .route('/:id')
    .post(middlewareHandler(serviceController.createUserImageService));

router
    .route('/upload')
    .post(middlewareHandler(serviceController.uploadZipFile));

module.exports = router;