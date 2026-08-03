const Note = require('../models/note.model');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const logger = require('../utils/logger');

// Shared helper: finds a note by id, scoped to the requesting user.
// Returns null if not found or not owned by this user — callers handle the 404 response.
const findUserNote = async (noteId, userId) => {
  return Note.findOne({ where: { id: noteId, user_id: userId } });
};

const getAllNotes = catchAsync(async (req, res) => {
  const notes = await Note.findAll({
    where: { user_id: req.user.id },
    order: [['updated_at', 'DESC']],
  });
  res.status(200).json({ notes });
});

const getNoteById = catchAsync(async (req, res) => {
  const note = await findUserNote(req.params.id, req.user.id);

  if (!note) {
    throw new AppError('Note not found', 404);
  }

  res.status(200).json({ note });
});

const createNote = catchAsync(async (req, res) => {
  const { title, content } = req.body || {};

  if (!title) {
    throw new AppError('Title is required', 400);
  }

  const note = await Note.create({ title, content, user_id: req.user.id });
  logger.info({ noteId: note.id, userId: req.user.id }, 'Note created');

  res.status(201).json({ message: 'Note created', note });
});

const updateNote = catchAsync(async (req, res) => {
  const { title, content } = req.body || {};

  if (title === '') {
    throw new AppError('Title cannot be empty', 400);
  }

  const note = await findUserNote(req.params.id, req.user.id);

  if (!note) {
    throw new AppError('Note not found', 404);
  }

  note.title = title ?? note.title;
  note.content = content ?? note.content;
  await note.save();

  logger.info({ noteId: note.id, userId: req.user.id }, 'Note updated');

  res.status(200).json({ message: 'Note updated', note });
});

const deleteNote = catchAsync(async (req, res) => {
  const note = await findUserNote(req.params.id, req.user.id);

  if (!note) {
    throw new AppError('Note not found', 404);
  }

  await note.destroy();
  logger.info({ noteId: req.params.id, userId: req.user.id }, 'Note deleted');

  res.status(200).json({ message: 'Note deleted' });
});

module.exports = { getAllNotes, getNoteById, createNote, updateNote, deleteNote };