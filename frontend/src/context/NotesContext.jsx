import { createContext, useContext, useState, useCallback } from 'react';
import { getAllNotes } from '../services/notesApi';

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

  return (
    <NotesContext.Provider
      value={{ notes, loading, error, refreshNotes, addNoteLocal, updateNoteLocal, removeNoteLocal }}
    >
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => useContext(NotesContext);