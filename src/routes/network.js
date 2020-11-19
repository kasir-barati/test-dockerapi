const router = require('express').Router();

const networkController = require('../controllers/network');
const { middlewareHandler } = require('../utils/promise');

// /networks
router
    .route('/')
    .get(middlewareHandler(networkController.list))
    .post(middlewareHandler(networkController.create));
    
router
    .route('/:id')
    .get(middlewareHandler(networkController.inspect))

router
    .route('/:id')
    .delete(middlewareHandler(networkController.remove));

module.exports = router;