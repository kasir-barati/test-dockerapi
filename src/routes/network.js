const router = require('express').Router();

const networkController = require('../controllers/network');
const { middlewareHandler } = require('../utils/promise');

// /networks
router
    .route('/')
    .get(middlewareHandler(networkController.networksList))
    .post(middlewareHandler(networkController.createNetwork));
    
router
    .route('/:id')
    .get(middlewareHandler(networkController.inspectNetwork))

router
    .route('/:id')
    .delete(middlewareHandler(networkController.removeNetwork));

module.exports = router;