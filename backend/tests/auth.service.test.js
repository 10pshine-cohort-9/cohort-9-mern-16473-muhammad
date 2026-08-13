const { expect } = require('chai');
const sinon = require('sinon');
const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const authService = require('../services/auth.service');
const AppError = require('../utils/AppError');

describe('Auth Service', () => {
  afterEach(() => sinon.restore()); // undo stubs after each test so they don't leak between tests

  describe('signup', () => {
    it('creates a new user when the email is not already taken', async () => {
      sinon.stub(User, 'findOne').resolves(null); // pretend no existing user was found
      sinon.stub(User, 'create').resolves({ id: 1, name: 'Ada', email: 'ada@test.com' });

      const result = await authService.signup({
        name: 'Ada',
        email: 'ada@test.com',
        password: 'password123',
      });

      expect(result).to.deep.equal({ id: 1, name: 'Ada', email: 'ada@test.com' });
    });

    it('throws an AppError (409) if the email already exists', async () => {
      sinon.stub(User, 'findOne').resolves({ id: 1, email: 'ada@test.com' }); // pretend a user was found

      try {
        await authService.signup({ name: 'Ada', email: 'ada@test.com', password: 'x' });
        expect.fail('Expected signup to throw');
      } catch (err) {
        expect(err).to.be.instanceOf(AppError);
        expect(err.statusCode).to.equal(409);
      }
    });
  });

  describe('login', () => {
    it('throws 401 for a non-existent user', async () => {
      sinon.stub(User, 'findOne').resolves(null);

      try {
        await authService.login({ email: 'nobody@test.com', password: 'x' });
        expect.fail('Expected login to throw');
      } catch (err) {
        expect(err).to.be.instanceOf(AppError);
        expect(err.statusCode).to.equal(401);
      }
    });

    it('throws 401 when the password does not match', async () => {
      const hash = await bcrypt.hash('correct-password', 10);
      sinon.stub(User, 'findOne').resolves({ id: 1, email: 'ada@test.com', password_hash: hash });

      try {
        await authService.login({ email: 'ada@test.com', password: 'wrong-password' });
        expect.fail('Expected login to throw');
      } catch (err) {
        expect(err.statusCode).to.equal(401);
      }
    });

    it('returns a token and user on successful login', async () => {
      const hash = await bcrypt.hash('correct-password', 10);
      sinon.stub(User, 'findOne').resolves({
        id: 1,
        name: 'Ada',
        email: 'ada@test.com',
        password_hash: hash,
      });

      const result = await authService.login({ email: 'ada@test.com', password: 'correct-password' });

      expect(result).to.have.property('token');
      expect(result.user).to.deep.equal({ id: 1, name: 'Ada', email: 'ada@test.com' });
    });
  });
});
