const express = require('express');
const { signup, login } = require('../controllers/auth.controller');
const authenticate = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

router.get('/me', authenticate, (req, res) => {
  res.status(200).json({ user: req.user });
});

module.exports = router;