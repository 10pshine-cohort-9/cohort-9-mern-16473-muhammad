const express = require('express');
const notesController = require('../controllers/notes.controller');
const authenticate = require('../middlewares/auth.middleware');

const router = express.Router();

// Every note route requires a logged-in user
router.use(authenticate);

router.get('/', notesController.getAllNotes);
router.get('/:id', notesController.getNoteById);
router.post('/', notesController.createNote);
router.put('/:id', notesController.updateNote);
router.delete('/:id', notesController.deleteNote);

module.exports = router;