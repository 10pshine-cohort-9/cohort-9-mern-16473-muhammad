import { useEffect, useState } from 'react';
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
  const [filter, setFilter] = useState('all'); // 'all' | 'favorites'

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

  const visibleNotes = filter === 'favorites' ? notes.filter((n) => n.is_favorite) : notes;

  return (
    <div className="p-6 sm:p-10">
      <div className="max-w-6xl mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-white">
            Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}
          </h1>
          <p className="text-slate-400 mt-1">
            {notes.length} note{notes.length !== 1 ? 's' : ''}
          </p>
        </header>

        <div className="flex items-center gap-2 mb-8">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white'
                : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            All Notes
          </button>
          <button
            onClick={() => setFilter('favorites')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === 'favorites'
                ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white'
                : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            Favorites
          </button>
        </div>

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

        {!loading && !error && notes.length > 0 && visibleNotes.length === 0 && (
          <p className="text-slate-400 text-center py-20">
            No favorite notes yet — star a note to see it here.
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence>
            {visibleNotes.map((note) => (
              <NoteCard key={note.id} note={note} onDelete={handleDelete} />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;