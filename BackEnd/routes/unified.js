const express = require('express');
const router = express.Router();
const unifiedController = require('../controllers/unifiedController');

router.post('/search', unifiedController.search);

module.exports = router;
