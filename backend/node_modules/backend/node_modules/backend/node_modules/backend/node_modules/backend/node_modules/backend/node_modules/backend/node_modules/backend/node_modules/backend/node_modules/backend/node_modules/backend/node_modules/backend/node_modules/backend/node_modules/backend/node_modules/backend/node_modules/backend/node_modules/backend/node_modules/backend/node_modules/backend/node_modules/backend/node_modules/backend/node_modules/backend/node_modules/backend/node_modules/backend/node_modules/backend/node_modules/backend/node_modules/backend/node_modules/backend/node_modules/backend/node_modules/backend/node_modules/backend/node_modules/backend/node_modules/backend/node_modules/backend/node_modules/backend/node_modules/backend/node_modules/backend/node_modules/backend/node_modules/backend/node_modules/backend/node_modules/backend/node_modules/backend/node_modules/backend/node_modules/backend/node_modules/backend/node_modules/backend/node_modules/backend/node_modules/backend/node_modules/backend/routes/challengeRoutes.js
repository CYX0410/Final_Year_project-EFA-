const express = require('express');
const router = express.Router();
const challengeController = require('../controllers/challengeController');

router.get('/', challengeController.getAllChallenges);
router.get('/progress/:uid', challengeController.getUserChallenges);
router.post('/start', challengeController.startChallenge);
router.post('/checkin', challengeController.checkIn);

module.exports = router;