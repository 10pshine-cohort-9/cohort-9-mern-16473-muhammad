const Note = require('../models/note.model');

// Shared helper: finds a note by id, scoped to the requesting user.
// Returns null if not found or not owned by this user — callers handle the 404 response.
const findUserNote = async (noteId, userId) => {
  return Note.findOne({ where: { id: noteId, user_id: userId } });
};

const getAllNotes = async (req, res) => {
  try {
    const notes = await Note.findAll({
      where: { user_id: req.user.id },
      order: [['updated_at', 'DESC']],
    });
    res.status(200).json({ notes });
  } catch (err) {
    console.error('Get notes error:', err.message);
    res.status(500).json({ message: 'Something went wrong. Please try again later.' });
  }
};

const getNoteById = async (req, res) => {
  try {
    const note = await findUserNote(req.params.id, req.user.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.status(200).json({ note });
  } catch (err) {
    console.error('Get note error:', err.message);
    res.status(500).json({ message: 'Something went wrong. Please try again later.' });
  }
};

const createNote = async (req, res) => {
  try {
    const { title, content } = req.body || {};

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const note = await Note.create({ title, content, user_id: req.user.id });
    res.status(201).json({ message: 'Note created', note });
  } catch (err) {
    console.error('Create note error:', err.message);
    res.status(500).json({ message: 'Something went wrong. Please try again later.' });
  }
};

const updateNote = async (req, res) => {
  try {
    const { title, content } = req.body || {};

    if (title === '') {
      return res.status(400).json({ message: 'Title cannot be empty' });
    }

    const note = await findUserNote(req.params.id, req.user.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    note.title = title ?? note.title;
    note.content = content ?? note.content;
    await note.save();

    res.status(200).json({ message: 'Note updated', note });
  } catch (err) {
    console.error('Update note error:', err.message);
    res.status(500).json({ message: 'Something went wrong. Please try again later.' });
  }
};

const deleteNote = async (req, res) => {
  try {
    const note = await findUserNote(req.params.id, req.user.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    await note.destroy();
    res.status(200).json({ message: 'Note deleted' });
  } catch (err) {
    console.error('Delete note error:', err.message);
    res.status(500).json({ message: 'Something went wrong. Please try again later.' });
  }
};

module.exports = { getAllNotes, getNoteById, createNote, updateNote, deleteNote };