const express = require('express');
const { getNews, askNews } = require('../controllers/newsController');
const { validateGetNews, validateAskNews } = require('../middleware/validateRequest');

const router = express.Router();

router.get('/getNews', validateGetNews, getNews);
router.post('/askNews', validateAskNews, askNews);

module.exports = router;
