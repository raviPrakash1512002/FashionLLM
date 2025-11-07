const express = require('express');
const router = express.Router();
const llmController = require('../controllers/llmController');

router.post('/text-query', llmController.textQuery);

module.exports = router;
