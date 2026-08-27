import { render, screen, fireEvent } from '@testing-library/react';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));


const mockToggleFavorite = jest.fn().mockResolvedValue({});
jest.mock('../context/NotesContext', () => ({
  useNotes: () => ({ toggleFavorite: mockToggleFavorite }),
}));

import NoteCard from '../components/NoteCard';

const baseNote = {
  id: 1,
  title: 'Grocery List',
  content: '<p>Milk</p><p>Eggs</p>',
  is_favorite: false,
  updatedAt: '2026-08-20T00:00:00.000Z',
};

describe('NoteCard', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockToggleFavorite.mockClear();
  });

  it('renders the note title and a plain-text preview of the content', () => {
    render(<NoteCard note={baseNote} onDelete={jest.fn()} />);
    expect(screen.getByText('Grocery List')).toBeInTheDocument();
    expect(screen.getByText('Milk Eggs')).toBeInTheDocument();
  });

  it('shows a placeholder when there is no content', () => {
    render(<NoteCard note={{ ...baseNote, content: '' }} onDelete={jest.fn()} />);
    expect(screen.getByText('No content yet...')).toBeInTheDocument();
  });

  it('navigates to the note when the card is clicked', () => {
    render(<NoteCard note={baseNote} onDelete={jest.fn()} />);
    fireEvent.click(screen.getByText('Grocery List'));
    expect(mockNavigate).toHaveBeenCalledWith('/notes/1');
  });

  it('calls toggleFavorite (not navigate) when the star is clicked', () => {
    render(<NoteCard note={baseNote} onDelete={jest.fn()} />);
    fireEvent.click(screen.getByLabelText('Add to favorites'));
    expect(mockToggleFavorite).toHaveBeenCalledWith(1);
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('calls onDelete (not navigate) when Delete is clicked', () => {
    const handleDelete = jest.fn();
    render(<NoteCard note={baseNote} onDelete={handleDelete} />);
    fireEvent.click(screen.getByText('Delete'));
    expect(handleDelete).toHaveBeenCalledWith(1);
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
