import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotes } from '../context/NotesContext';
import { useAuth } from '../context/AuthContext';
import StarIcon from './StarIcon';
import { stripHtml } from '../utils/stripHtml';

const Sidebar = () => {
  const { notes, loading, refreshNotes, toggleFavorite } = useNotes();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { id: activeId } = useParams();
  const [query, setQuery] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    refreshNotes();
  }, [refreshNotes]);

  const filtered = notes.filter((n) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    const titleMatch = n.title.toLowerCase().includes(q);
    const contentMatch = stripHtml(n.content).toLowerCase().includes(q);
    return titleMatch || contentMatch;
  });
  const favorites = filtered.filter((n) => n.is_favorite);
  const rest = filtered.filter((n) => !n.is_favorite);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleToggleFavorite = (e, id) => {
    e.stopPropagation();
    toggleFavorite(id);
  };

  const initials = (user?.name || user?.email || '?').charAt(0).toUpperCase();

  const renderNoteButton = (note) => (
    <button
      key={note.id}
      onClick={() => navigate(`/notes/${note.id}`)}
      className={`w-full flex items-center justify-between gap-2 text-left px-3 py-2 rounded-lg text-sm transition-colors ${
        String(note.id) === activeId
          ? 'bg-violet-500/20 text-white'
          : 'text-slate-400 hover:bg-white/5 hover:text-white'
      }`}
    >
      <span className="truncate">{note.title || 'Untitled'}</span>
      <span
        role="button"
        tabIndex={0}
        onClick={(e) => handleToggleFavorite(e, note.id)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') handleToggleFavorite(e, note.id);
        }}
        className="shrink-0 p-0.5 rounded hover:scale-110 transition-transform"
        aria-label={note.is_favorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        <StarIcon filled={note.is_favorite} className="w-4 h-4" />
      </span>
    </button>
  );

  return (
    <aside className="w-72 shrink-0 h-screen sticky top-0 flex flex-col bg-white/[0.03] border-r border-white/10 backdrop-blur-xl">
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
            <StarIcon filled className="w-4 h-4" />
          </div>
          <span className="font-bold text-white">notex</span>
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search title or content..."
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-violet-400/50"
        />
      </div>

      <button
        onClick={() => navigate('/notes/new')}
        className="mx-4 mt-4 px-4 py-2 rounded-lg bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity"
      >
        + New Note
      </button>

      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-4">
        {loading && <p className="px-2 text-slate-500 text-sm">Loading...</p>}

        {!loading && favorites.length > 0 && (
          <div>
            <p className="px-2 mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Favorites
            </p>
            <div className="space-y-1">{favorites.map(renderNoteButton)}</div>
          </div>
        )}

        {!loading && (
          <div>
            {favorites.length > 0 && (
              <p className="px-2 mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                All Notes
              </p>
            )}
            <div className="space-y-1">
              {rest.length === 0 && favorites.length === 0 ? (
                <p className="px-2 text-slate-500 text-sm">No notes found.</p>
              ) : (
                rest.map(renderNoteButton)
              )}
            </div>
          </div>
        )}
      </nav>

      <div className="relative p-4 border-t border-white/10">
        <button
          onClick={() => setProfileOpen((v) => !v)}
          className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/5 transition-colors text-left"
        >
          <div className="w-9 h-9 shrink-0 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-sm font-bold text-white">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-white truncate">{user?.name || 'Account'}</p>
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          </div>
        </button>

        <AnimatePresence>
          {profileOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.15 }}
                className="absolute z-50 left-4 right-4 bottom-full mb-2 bg-[#1e1b2e] border border-white/10 rounded-2xl p-4 shadow-2xl"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 shrink-0 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-base font-bold text-white">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate">
                      {user?.name || 'Account'}
                    </p>
                    <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full px-3 py-2 rounded-lg bg-red-500/10 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-colors"
                >
                  Logout
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </aside>
  );
};

export default Sidebar;