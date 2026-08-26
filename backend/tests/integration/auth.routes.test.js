const request = require('supertest');
const sinon = require('sinon');
const { expect } = require('chai');
const jwt = require('jsonwebtoken');

const app = require('../../app');
const authService = require('../../services/auth.service');
const AppError = require('../../utils/AppError');

describe('Auth routes', () => {
  afterEach(() => sinon.restore());

  describe('POST /api/auth/signup', () => {
    it('creates an account and returns 201', async () => {
      const fakeUser = { id: 1, name: 'Amina', email: 'amina@example.com' };
      sinon.stub(authService, 'signup').resolves(fakeUser);

      const res = await request(app)
        .post('/api/auth/signup')
        .send({ name: 'Amina', email: 'amina@example.com', password: 'Password123!' });

      expect(res.status).to.equal(201);
      expect(res.body.user).to.deep.equal(fakeUser);
    });

    it('rejects missing fields with 400', async () => {
      const res = await request(app).post('/api/auth/signup').send({ email: 'a@b.com' });
      expect(res.status).to.equal(400);
    });

    it('rejects an invalid email with 400', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({ name: 'Amina', email: 'not-an-email', password: 'Password123!' });
      expect(res.status).to.equal(400);
    });

    it('passes through a duplicate-email AppError from the service', async () => {
      sinon.stub(authService, 'signup').rejects(new AppError('Email already in use', 409));

      const res = await request(app)
        .post('/api/auth/signup')
        .send({ name: 'Amina', email: 'amina@example.com', password: 'Password123!' });

      expect(res.status).to.equal(409);
      expect(res.body.message).to.equal('Email already in use');
    });
  });

  describe('POST /api/auth/login', () => {
    it('logs in and sets the auth cookie', async () => {
      sinon.stub(authService, 'login').resolves({
        token: 'signed.jwt.token',
        user: { id: 1, name: 'Amina', email: 'amina@example.com' },
      });

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'amina@example.com', password: 'Password123!' });

      expect(res.status).to.equal(200);
      expect(res.headers['set-cookie'][0]).to.include(`${process.env.COOKIE_NAME}=`);
    });

    it('rejects missing credentials with 400', async () => {
      const res = await request(app).post('/api/auth/login').send({ email: 'amina@example.com' });
      expect(res.status).to.equal(400);
    });

    it('surfaces invalid-credentials errors from the service', async () => {
      sinon.stub(authService, 'login').rejects(new AppError('Invalid email or password', 401));

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'amina@example.com', password: 'wrong' });

      expect(res.status).to.equal(401);
    });
  });

  describe('GET /api/auth/me', () => {
    it('rejects unauthenticated requests with 401', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.status).to.equal(401);
    });

    it('returns the decoded user for a valid token', async () => {
      const token = jwt.sign({ id: 1, email: 'amina@example.com' }, process.env.JWT_SECRET);

      const res = await request(app)
        .get('/api/auth/me')
        .set('Cookie', `${process.env.COOKIE_NAME}=${token}`);

      expect(res.status).to.equal(200);
      expect(res.body.user.email).to.equal('amina@example.com');
    });

    it('rejects a garbage token with 401', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Cookie', `${process.env.COOKIE_NAME}=not.a.valid.jwt`);
      expect(res.status).to.equal(401);
    });
  });

  describe('POST /api/auth/logout', () => {
    it('clears the cookie and returns 200', async () => {
      const res = await request(app).post('/api/auth/logout');
      expect(res.status).to.equal(200);
      expect(res.headers['set-cookie'][0]).to.include(`${process.env.COOKIE_NAME}=;`);
    });
  });
});