const Note = require('../models/note.model');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

const getAllNotesForUser = async (userId) => {
  return Note.findAll({
    where: { user_id: userId },
    order: [['updated_at', 'DESC']],
  });
};

const getNoteById = async (noteId, userId) => {
  const note = await Note.findOne({ where: { id: noteId, user_id: userId } });
  if (!note) {
    throw new AppError('Note not found', 404);
  }
  return note;
};

const createNote = async ({ title, content, userId }) => {
  const note = await Note.create({ title, content, user_id: userId });
  logger.info({ noteId: note.id, userId }, 'Note created');
  return note;
};

const updateNote = async (noteId, userId, { title, content }) => {
  const note = await getNoteById(noteId, userId); // throws 404 if not found/owned

  note.title = title ?? note.title;
  note.content = content ?? note.content;
  await note.save();

  logger.info({ noteId: note.id, userId }, 'Note updated');
  return note;
};

const toggleFavorite = async (noteId, userId) => {
  const note = await getNoteById(noteId, userId); // throws 404 if not found/owned

  note.is_favorite = !note.is_favorite;
  await note.save();

  logger.info({ noteId: note.id, userId, isFavorite: note.is_favorite }, 'Note favorite toggled');
  return note;
};

const deleteNote = async (noteId, userId) => {
  const note = await getNoteById(noteId, userId);
  await note.destroy();
  logger.info({ noteId, userId }, 'Note deleted');
};

module.exports = { getAllNotesForUser, getNoteById, createNote, updateNote, toggleFavorite, deleteNote };