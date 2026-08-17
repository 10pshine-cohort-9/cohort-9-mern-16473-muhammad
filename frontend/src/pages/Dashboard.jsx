import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { getAllNotes, deleteNote } from '../services/notesApi';
import NoteCard from '../components/NoteCard';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const loadNotes = async () => {
    try {
      const data = await getAllNotes();
      setNotes(data);
    } catch (err) {
      setError('Could not load your notes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const handleDelete = async (id) => {
    // Optimistically remove it from the UI, then confirm with the server
    setNotes((prev) => prev.filter((n) => n.id !== id));
    try {
      await deleteNote(id);
    } catch (err) {
      // If the delete actually failed, restore the list from the server
      loadNotes();
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen p-6 sm:p-10">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}
            </h1>
            <p className="text-slate-400 mt-1">
              {notes.length} note{notes.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/notes/new')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-105 active:scale-95 transition-all"
            >
              + New Note
            </button>
            <button
              onClick={handleLogout}
              className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
            >
              Logout
            </button>
          </div>
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