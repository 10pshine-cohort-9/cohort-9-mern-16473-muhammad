const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

const SALT_ROUNDS = 10;

const signup = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new AppError('An account with this email already exists', 409);
  }

  let user;
  try {
    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
    user = await User.create({ name, email, password_hash });
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      throw new AppError('An account with this email already exists', 409);
    }
    throw err;
  }

  logger.info({ userId: user.id }, 'New user registered');
  return { id: user.id, name: user.name, email: user.email };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    throw new AppError('Invalid email or password', 401);
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  logger.info({ userId: user.id }, 'User logged in');
  return { token, user: { id: user.id, name: user.name, email: user.email } };
};

module.exports = { signup, login };