const router = require('express').Router();

const serviceController = require('../controllers/service');
const { middlewareHandler } = require('../utils/promise');

// /services
router
    .route('/')
    .get(middlewareHandler(serviceController.servicesList));

router
    .route('/upload')
    .post(middlewareHandler(serviceController.uploadZipFile));

module.exports = router;