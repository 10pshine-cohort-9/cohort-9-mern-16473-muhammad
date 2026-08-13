const { expect } = require('chai');
const sinon = require('sinon');
const Note = require('../models/note.model');
const notesService = require('../services/notes.service');
const AppError = require('../utils/AppError');

describe('Notes Service', () => {
  afterEach(() => sinon.restore());

  it('returns only notes belonging to the given user', async () => {
    const fakeNotes = [{ id: 1, title: 'Note 1', user_id: 42 }];
    const findAllStub = sinon.stub(Note, 'findAll').resolves(fakeNotes);

    const notes = await notesService.getAllNotesForUser(42);

    // Confirm the query was actually scoped to this user, not just that it returned something
    expect(findAllStub.calledWithMatch({ where: { user_id: 42 } })).to.be.true;
    expect(notes).to.deep.equal(fakeNotes);
  });

  it('throws 404 when a note is not found or not owned by the user', async () => {
    sinon.stub(Note, 'findOne').resolves(null);

    try {
      await notesService.getNoteById(999, 42);
      expect.fail('Expected getNoteById to throw');
    } catch (err) {
      expect(err).to.be.instanceOf(AppError);
      expect(err.statusCode).to.equal(404);
    }
  });

  it('creates a note scoped to the requesting user', async () => {
    const createStub = sinon.stub(Note, 'create').resolves({ id: 1, title: 'Hello', user_id: 42 });

    const note = await notesService.createNote({ title: 'Hello', content: 'World', userId: 42 });

    expect(createStub.calledWithMatch({ title: 'Hello', content: 'World', user_id: 42 })).to.be.true;
    expect(note.title).to.equal('Hello');
  });

  it('updates a note only if it belongs to the requesting user', async () => {
    const saveStub = sinon.stub().resolves();
    sinon.stub(Note, 'findOne').resolves({
      id: 1,
      title: 'Old title',
      content: 'Old content',
      user_id: 42,
      save: saveStub,
    });

    const updated = await notesService.updateNote(1, 42, { title: 'New title', content: 'New content' });

    expect(updated.title).to.equal('New title');
    expect(saveStub.calledOnce).to.be.true;
  });

  it('deletes a note only after verifying ownership', async () => {
    const destroyStub = sinon.stub();
    sinon.stub(Note, 'findOne').resolves({ id: 1, user_id: 42, destroy: destroyStub });

    await notesService.deleteNote(1, 42);

    expect(destroyStub.calledOnce).to.be.true;
  });
});