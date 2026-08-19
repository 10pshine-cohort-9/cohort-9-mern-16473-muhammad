import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNotes } from '../context/NotesContext';
import { deleteNote } from '../services/notesApi';
import NoteCard from '../components/NoteCard';

const Dashboard = () => {
  const { user } = useAuth();
  const { notes, loading, error, refreshNotes, removeNoteLocal } = useNotes();
  const navigate = useNavigate();

  useEffect(() => {
    refreshNotes();
  }, [refreshNotes]);

  const handleDelete = async (id) => {
    removeNoteLocal(id);
    try {
      await deleteNote(id);
    } catch {
      refreshNotes();
    }
  };

  return (
    <div className="p-6 sm:p-10">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-white">
            Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}
          </h1>
          <p className="text-slate-400 mt-1">
            {notes.length} note{notes.length !== 1 ? 's' : ''}
          </p>
        </header>

        {loading && <p className="text-slate-400">Loading your notes...</p>}
        {error && <p className="text-red-400">{error}</p>}

        {!loading && !error && notes.length === 0 && (
          <div className="text-center py-20">
            <p className="text-slate-400 text-lg mb-4">You don't have any notes yet.</p>
            <button
              onClick={() => navigate('/notes/new')}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold"
            >
              Create your first note
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence>
            {notes.map((note) => (
              <NoteCard key={note.id} note={note} onDelete={handleDelete} />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;