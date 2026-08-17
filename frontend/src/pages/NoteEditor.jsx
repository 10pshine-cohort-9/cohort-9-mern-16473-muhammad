import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { getNoteById, createNote, updateNote } from '../services/notesApi';

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

const NoteEditor = () => {
  const { id } = useParams(); // undefined when creating a new note
  const isNew = !id || id === 'new';
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isNew) return;
    getNoteById(id)
      .then((note) => {
        setTitle(note.title);
        setContent(note.content || '');
      })
      .catch(() => setError('Could not load this note.'))
      .finally(() => setLoading(false));
  }, [id, isNew]);

  const handleSave = async () => {
    if (!title.trim()) {
      setError('Title is required.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      if (isNew) {
        await createNote(title, content);
      } else {
        await updateNote(id, title, content);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save this note.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 sm:p-10">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/dashboard')}
          className="text-slate-400 hover:text-white mb-6 flex items-center gap-2 transition-colors"
        >
          ← Back to notes
        </button>

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

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 transition-all disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Note'}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NoteEditor;