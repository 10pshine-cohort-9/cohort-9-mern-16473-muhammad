const request = require('supertest');
const sinon = require('sinon');
const { expect } = require('chai');
const jwt = require('jsonwebtoken');

const app = require('../../app');
const notesService = require('../../services/notes.service');
const AppError = require('../../utils/AppError');

const authCookie = () => {
  const token = jwt.sign({ id: 7, email: 'amina@example.com' }, process.env.JWT_SECRET);
  return `${process.env.COOKIE_NAME}=${token}`;
};

describe('Notes routes', () => {
  afterEach(() => sinon.restore());

  it('rejects any notes request without a valid session', async () => {
    const res = await request(app).get('/api/notes');
    expect(res.status).to.equal(401);
  });

  describe('GET /api/notes', () => {
    it("returns the logged-in user's notes", async () => {
      const notes = [{ id: 1, title: 'First' }];
      const stub = sinon.stub(notesService, 'getAllNotesForUser').resolves(notes);

      const res = await request(app).get('/api/notes').set('Cookie', authCookie());

      expect(res.status).to.equal(200);
      expect(res.body.notes).to.deep.equal(notes);
      expect(stub.calledWith(7)).to.be.true;
    });
  });

  describe('GET /api/notes/:id', () => {
    it('returns a single note', async () => {
      const note = { id: 5, title: 'Detail' };
      sinon.stub(notesService, 'getNoteById').resolves(note);

      const res = await request(app).get('/api/notes/5').set('Cookie', authCookie());
      expect(res.status).to.equal(200);
      expect(res.body.note).to.deep.equal(note);
    });

    it('propagates a not-found AppError as 404', async () => {
      sinon.stub(notesService, 'getNoteById').rejects(new AppError('Note not found', 404));
      const res = await request(app).get('/api/notes/999').set('Cookie', authCookie());
      expect(res.status).to.equal(404);
    });
  });

  describe('POST /api/notes', () => {
    it('creates a note and returns 201', async () => {
      const created = { id: 9, title: 'New note', content: 'body' };
      sinon.stub(notesService, 'createNote').resolves(created);

      const res = await request(app)
        .post('/api/notes')
        .set('Cookie', authCookie())
        .send({ title: 'New note', content: 'body' });

      expect(res.status).to.equal(201);
      expect(res.body.note).to.deep.equal(created);
    });

    it('rejects a missing title with 400', async () => {
      const res = await request(app)
        .post('/api/notes')
        .set('Cookie', authCookie())
        .send({ content: 'body' });
      expect(res.status).to.equal(400);
    });
  });

  describe('PUT /api/notes/:id', () => {
    it('updates a note', async () => {
      const updated = { id: 5, title: 'Updated' };
      sinon.stub(notesService, 'updateNote').resolves(updated);

      const res = await request(app)
        .put('/api/notes/5')
        .set('Cookie', authCookie())
        .send({ title: 'Updated' });

      expect(res.status).to.equal(200);
      expect(res.body.note).to.deep.equal(updated);
    });

    it('rejects an empty-string title with 400', async () => {
      const res = await request(app)
        .put('/api/notes/5')
        .set('Cookie', authCookie())
        .send({ title: '' });
      expect(res.status).to.equal(400);
    });
  });

  describe('PATCH /api/notes/:id/favorite', () => {
    it('toggles the favorite flag', async () => {
      const note = { id: 5, favorite: true };
      sinon.stub(notesService, 'toggleFavorite').resolves(note);

      const res = await request(app).patch('/api/notes/5/favorite').set('Cookie', authCookie());
      expect(res.status).to.equal(200);
      expect(res.body.note).to.deep.equal(note);
    });
  });

  describe('DELETE /api/notes/:id', () => {
    it('deletes a note', async () => {
      sinon.stub(notesService, 'deleteNote').resolves();
      const res = await request(app).delete('/api/notes/5').set('Cookie', authCookie());
      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal('Note deleted');
    });
  });
});