import { render, screen, act } from '@testing-library/react';
import { NotesProvider, useNotes } from '../context/NotesContext';

jest.mock('../services/notesApi', () => ({
  getAllNotes: jest.fn(),
  toggleFavorite: jest.fn(),
}));

import { getAllNotes, toggleFavorite } from '../services/notesApi';

const TestConsumer = () => {
  const { notes, loading, refreshNotes, toggleFavorite: toggleFav } = useNotes();
  return (
    <div>
      <span data-testid="loading">{String(loading)}</span>
      <span data-testid="count">{notes.length}</span>
      {notes.map((n) => (
        <span key={n.id} data-testid={`note-${n.id}-fav`}>
          {String(n.is_favorite)}
        </span>
      ))}
      <button onClick={refreshNotes}>refresh</button>
      <button onClick={() => toggleFav(1)}>toggle</button>
    </div>
  );
};

describe('NotesContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads notes via refreshNotes and updates loading/notes state', async () => {
    getAllNotes.mockResolvedValueOnce([
      { id: 1, title: 'A', is_favorite: false },
      { id: 2, title: 'B', is_favorite: false },
    ]);

    render(
      <NotesProvider>
        <TestConsumer />
      </NotesProvider>
    );

    await act(async () => {
      screen.getByText('refresh').click();
    });

    expect(screen.getByTestId('count').textContent).toBe('2');
    expect(screen.getByTestId('loading').textContent).toBe('false');
  });

  it('toggleFavorite updates the matching note in local state', async () => {
    getAllNotes.mockResolvedValueOnce([{ id: 1, title: 'A', is_favorite: false }]);
    toggleFavorite.mockResolvedValueOnce({ id: 1, title: 'A', is_favorite: true });

    render(
      <NotesProvider>
        <TestConsumer />
      </NotesProvider>
    );

    await act(async () => {
      screen.getByText('refresh').click();
    });

    await act(async () => {
      screen.getByText('toggle').click();
    });

    expect(screen.getByTestId('note-1-fav').textContent).toBe('true');
  });
});
