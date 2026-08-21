import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useNotes } from '../context/NotesContext';
import { useAuth } from '../context/AuthContext';
import StarIcon from './StarIcon';

const Sidebar = () => {
  const { notes, loading, refreshNotes, toggleFavorite } = useNotes();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { id: activeId } = useParams();
  const [query, setQuery] = useState('');

  useEffect(() => {
    refreshNotes();
  }, [refreshNotes]);

  const filtered = notes.filter((n) => n.title.toLowerCase().includes(query.toLowerCase()));
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
          <span className="font-bold text-white">Notes</span>
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
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

      <div className="p-4 border-t border-white/10 flex items-center justify-between gap-2">
        <span className="text-sm text-slate-400 truncate">{user?.email}</span>
        <button
          onClick={handleLogout}
          className="text-slate-500 hover:text-red-400 text-sm transition-colors shrink-0"
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;