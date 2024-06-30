const express = require('express');
const { registerUser, loginUser} = require('../controllers/userController');

const router = express.Router();

router.get('/register', (req, res) => {
    res.send('Register');
});
router.post('/register', registerUser);

router.get('/login', (req, res) => {
    res.send('Login');

});
router.post('/login', loginUser);
module.exports = router;