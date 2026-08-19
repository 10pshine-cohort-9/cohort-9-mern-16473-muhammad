
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNotes } from '../context/NotesContext';

const stripHtml = (html) => html?.replace(/<[^>]*>/g, '') || '';

const CommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { user, logout } = useAuth();
  const { notes, refreshNotes } = useNotes();
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen && user) {
      refreshNotes();
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen, user, refreshNotes]);

  const staticActions = useMemo(
    () => [
      { id: 'new-note', label: 'Create new note', icon: '✦', action: () => navigate('/notes/new') },
      { id: 'dashboard', label: 'Go to dashboard', icon: '⌂', action: () => navigate('/dashboard') },
      { id: 'logout', label: 'Log out', icon: '⏻', action: async () => { await logout(); navigate('/login'); } },
    ],
    [navigate, logout]
  );

  const filteredActions = useMemo(() => {
    const q = query.trim().toLowerCase();
    const actions = q ? staticActions.filter((a) => a.label.toLowerCase().includes(q)) : staticActions;

    const matchingNotes = q
      ? notes.filter(
          (n) => n.title.toLowerCase().includes(q) || stripHtml(n.content).toLowerCase().includes(q)
        )
      : notes.slice(0, 5);

    const noteItems = matchingNotes.map((n) => ({
      id: `note-${n.id}`,
      label: n.title,
      icon: '📝',
      subtitle: stripHtml(n.content).slice(0, 60),
      action: () => navigate(`/notes/${n.id}`),
    }));

    return [...actions, ...noteItems];
  }, [query, notes, staticActions, navigate]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const runSelected = useCallback(() => {
    const item = filteredActions[selectedIndex];
    if (item) {
      item.action();
      setIsOpen(false);
    }
  }, [filteredActions, selectedIndex]);

  const handleInputKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, filteredActions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      runSelected();
    }
  };

  if (!user) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="fixed top-[15vh] left-1/2 -translate-x-1/2 w-full max-w-xl z-50 px-4"
          >
            <div className="bg-[#0d0a14]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
              <div className="flex items-center px-4 border-b border-white/10">
                <span className="text-slate-500 mr-3">⌕</span>
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleInputKeyDown}
                  placeholder="Search notes or type a command..."
                  className="w-full bg-transparent text-white placeholder-slate-500 py-4 outline-none"
                />
                <kbd className="text-xs text-slate-500 border border-white/10 rounded px-1.5 py-0.5">esc</kbd>
              </div>

              <div className="max-h-80 overflow-y-auto py-2">
                {filteredActions.length === 0 && (
                  <p className="px-4 py-6 text-center text-slate-500 text-sm">No results found.</p>
                )}
                {filteredActions.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedIndex(index);
                      runSelected();
                    }}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                      index === selectedIndex ? 'bg-violet-500/15' : ''
                    }`}
                  >
                    <span className="text-lg w-6 text-center">{item.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{item.label}</p>
                      {item.subtitle && <p className="text-slate-500 text-xs truncate">{item.subtitle}</p>}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;