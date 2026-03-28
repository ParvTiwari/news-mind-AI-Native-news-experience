const express = require('express');
const { getProfile, updateInterests } = require('../controllers/profileController');

const router = express.Router();

router.get('/:userId', getProfile);
router.post('/interests', updateInterests);

module.exports = router;
