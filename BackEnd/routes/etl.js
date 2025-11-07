const express = require('express');
const router = express.Router();
const etlController = require('../controllers/etlController');

router.get('/status', etlController.status);
router.post('/refresh', etlController.refresh);

module.exports = router;
