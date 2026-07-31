const bcrypt = require('bcrypt');
const User = require('../models/user.model');

const SALT_ROUNDS = 10;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'An account with this email already exists' });
    }

    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({ name, email, password_hash });

    res.status(201).json({
      message: 'Account created successfully',
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'An account with this email already exists' });
    }

    console.error('Signup error:', err.message);
    res.status(500).json({ message: 'Something went wrong. Please try again later.' });
  }
};

module.exports = { signup };