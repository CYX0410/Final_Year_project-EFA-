// eco-backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/', userController.createUser);
router.get('/:uid', userController.getUserByUid);
router.get('/profile/:uid', userController.getProfile);
router.put('/profile/:uid', userController.updateProfile);

module.exports = router;