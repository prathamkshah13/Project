// // src/routes/profileRoutes.js
const express = require('express');
const { getUserProfile } = require('../controllers/profileController');

const router = express.Router();

router.get('/:id', getUserProfile);
module.exports = router;
