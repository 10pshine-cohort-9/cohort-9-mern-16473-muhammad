import { createContext, useContext, useState, useCallback } from 'react';
import { getAllNotes, toggleFavorite as toggleFavoriteApi } from '../services/notesApi';

const NotesContext = createContext(null);

export const NotesProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refreshNotes = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllNotes();
      setNotes(data);
      setError('');
    } catch {
      setError('Could not load your notes.');
    } finally {
      setLoading(false);
    }
  }, []);

  const addNoteLocal = (note) => setNotes((prev) => [note, ...prev]);
  const updateNoteLocal = (note) =>
    setNotes((prev) => prev.map((n) => (n.id === note.id ? note : n)));
  const removeNoteLocal = (id) => setNotes((prev) => prev.filter((n) => n.id !== id));

  // Optimistic-ish: calls the API, then syncs the returned note into local state
  // so the sidebar, dashboard, and command palette all update together.
  const toggleFavorite = useCallback(async (id) => {
    const updated = await toggleFavoriteApi(id);
    setNotes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
    return updated;
  }, []);

  return (
    <NotesContext.Provider
      value={{
        notes,
        loading,
        error,
        refreshNotes,
        addNoteLocal,
        updateNoteLocal,
        removeNoteLocal,
        toggleFavorite,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => useContext(NotesContext);