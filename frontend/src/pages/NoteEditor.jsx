import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { getNoteById, createNote, updateNote } from '../services/notesApi';
import { useNotes } from '../context/NotesContext';

const QUILL_MODULES = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['blockquote', 'code-block'],
    ['link'],
    ['clean'],
  ],
};

const AUTOSAVE_DELAY = 800; // ms after the user stops typing

const NoteEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addNoteLocal, updateNoteLocal } = useNotes();

  const [noteId, setNoteId] = useState(id && id !== 'new' ? id : null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(!!noteId);
  const [status, setStatus] = useState('idle'); // idle | saving | saved | error
  const [error, setError] = useState('');

  const debounceRef = useRef(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (!noteId) {
      setLoading(false);
      return;
    }
    getNoteById(noteId)
      .then((note) => {
        setTitle(note.title);
        setContent(note.content || '');
      })
      .catch(() => setError('Could not load this note.'))
      .finally(() => setLoading(false));
  }, [noteId]);

  const persist = useCallback(
    async (nextTitle, nextContent) => {
     
      if (!nextTitle.trim()) return; // don't save a titleless note
      setStatus('saving');
      try {
        if (!noteId) {
          const created = await createNote(nextTitle, nextContent);
          setNoteId(created.id);
          addNoteLocal(created);
          navigate(`/notes/${created.id}`, { replace: true });
        } else {
          const updated = await updateNote(noteId, nextTitle, nextContent);
          updateNoteLocal(updated);
        }
        setStatus('saved');
      } catch {
        setStatus('error');
      }
    },
    [noteId, addNoteLocal, updateNoteLocal, navigate]
  );

  useEffect(() => {
  
    if (loading) return;
    if (isFirstRender.current) {
      isFirstRender.current = false;
      
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      
      persist(title, content);
    }, AUTOSAVE_DELAY);

    return () => clearTimeout(debounceRef.current);
  }, [title, content, loading, persist]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  const statusLabel = {
    idle: '',
    saving: 'Saving...',
    saved: 'Saved',
    error: 'Could not save',
  }[status];

  return (
    <div className="p-6 sm:p-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-slate-400 hover:text-white flex items-center gap-2 transition-colors"
          >
            ← Back
          </button>
          <span className={`text-sm ${status === 'error' ? 'text-red-400' : 'text-slate-500'}`}>
            {statusLabel}
          </span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/[0.06] backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8"
        >
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title..."
            className="w-full bg-transparent text-3xl font-bold text-white placeholder-slate-600 outline-none mb-6 border-b border-white/10 pb-4"
          />

          <div className="quill-dark">
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              modules={QUILL_MODULES}
              placeholder="Start writing..."
            />
          </div>

          {error && <p className="text-red-400 mt-4">{error}</p>}
        </motion.div>
      </div>
    </div>
  );
};

export default NoteEditor;