const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const notesService = require('../services/notes.service');

const getAllNotes = catchAsync(async (req, res) => {
  const notes = await notesService.getAllNotesForUser(req.user.id);
  res.status(200).json({ notes });
});

const getNoteById = catchAsync(async (req, res) => {
  const note = await notesService.getNoteById(req.params.id, req.user.id);
  res.status(200).json({ note });
});

const createNote = catchAsync(async (req, res) => {
  const { title, content } = req.body || {};

  if (!title) {
    throw new AppError('Title is required', 400);
  }

  const note = await notesService.createNote({ title, content, userId: req.user.id });
  res.status(201).json({ message: 'Note created', note });
});

const updateNote = catchAsync(async (req, res) => {
  const { title, content } = req.body || {};

  if (title === '') {
    throw new AppError('Title cannot be empty', 400);
  }

  const note = await notesService.updateNote(req.params.id, req.user.id, { title, content });
  res.status(200).json({ message: 'Note updated', note });
});

const toggleFavorite = catchAsync(async (req, res) => {
  const note = await notesService.toggleFavorite(req.params.id, req.user.id);
  res.status(200).json({ message: 'Favorite status updated', note });
});

const deleteNote = catchAsync(async (req, res) => {
  await notesService.deleteNote(req.params.id, req.user.id);
  res.status(200).json({ message: 'Note deleted' });
});

module.exports = { getAllNotes, getNoteById, createNote, updateNote, toggleFavorite, deleteNote };