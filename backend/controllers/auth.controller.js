const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const authService = require('../services/auth.service');

const EMAIL_REGEX = /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,63}$/;

const signup = catchAsync(async (req, res) => {
  const { name, email, password } = req.body || {};

  if (!name || !email || !password) {
    throw new AppError('Name, email and password are required', 400);
  }

  if (!EMAIL_REGEX.test(email)) {
    throw new AppError('Please provide a valid email address', 400);
  }

  const user = await authService.signup({ name, email, password });

  res.status(201).json({ message: 'Account created successfully', user });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    throw new AppError('Email and password are required', 400);
  }

  const { token, user } = await authService.login({ email, password });

  res.cookie(process.env.COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.status(200).json({ message: 'Logged in successfully', user });
});

module.exports = { signup, login };