import api from './api';

export const getAllNotes = () => api.get('/notes').then((res) => res.data.notes);
export const getNoteById = (id) => api.get(`/notes/${id}`).then((res) => res.data.note);
export const createNote = (title, content) =>
  api.post('/notes', { title, content }).then((res) => res.data.note);
export const updateNote = (id, title, content) =>
  api.put(`/notes/${id}`, { title, content }).then((res) => res.data.note);
export const toggleFavorite = (id) =>
  api.patch(`/notes/${id}/favorite`).then((res) => res.data.note);
export const deleteNote = (id) => api.delete(`/notes/${id}`);