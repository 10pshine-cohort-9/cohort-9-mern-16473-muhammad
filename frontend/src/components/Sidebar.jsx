import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useNotes } from '../context/NotesContext';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { notes, loading, refreshNotes } = useNotes();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { id: activeId } = useParams();
  const [query, setQuery] = useState('');

  useEffect(() => {
    refreshNotes();
  }, [refreshNotes]);

  const filtered = notes.filter((n) => n.title.toLowerCase().includes(query.toLowerCase()));

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <aside className="w-72 shrink-0 h-screen sticky top-0 flex flex-col bg-white/[0.03] border-r border-white/10 backdrop-blur-xl">
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-sm">
            ✦
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

      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
        {loading && <p className="px-2 text-slate-500 text-sm">Loading...</p>}
        {!loading && filtered.length === 0 && (
          <p className="px-2 text-slate-500 text-sm">No notes found.</p>
        )}
        {filtered.map((note) => (
          <button
            key={note.id}
            onClick={() => navigate(`/notes/${note.id}`)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm truncate transition-colors ${
              String(note.id) === activeId
                ? 'bg-violet-500/20 text-white'
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <span className="mr-2">📝</span>
            {note.title || 'Untitled'}
          </button>
        ))}
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