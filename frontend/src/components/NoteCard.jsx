import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useNotes } from '../context/NotesContext';
import StarIcon from './StarIcon';
import { stripHtml } from '../utils/stripHtml';

const NoteCard = ({ note, onDelete }) => {
  const navigate = useNavigate();
  const { toggleFavorite } = useNotes();

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(note.id);
  };

  const handleToggleFavorite = (e) => {
    e.stopPropagation();
    toggleFavorite(note.id).catch(() => {
      // Swallow here — NotesContext already leaves local state unchanged on failure.
    });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4 }}
      className="group relative bg-white/[0.06] backdrop-blur-xl border border-white/10 rounded-2xl hover:border-violet-400/40 hover:bg-white/[0.09] transition-colors overflow-hidden"
    >
      {/* Native button carries the navigation so keyboard/screen-reader users
          can open a note — this is a sibling of the favorite/delete buttons
          below, not a wrapper around them, to avoid nested interactive controls. */}
      <button
        onClick={() => navigate(`/notes/${note.id}`)}
        className="w-full text-left p-6 pb-0"
        aria-label={`Open note: ${note.title || 'Untitled'}`}
      >
        <div className="pr-8">
          <h3 className="text-lg font-semibold text-white truncate">{note.title}</h3>
        </div>
        <p className="text-slate-400 text-sm line-clamp-3 mt-2 mb-4">
          {stripHtml(note.content) || 'No content yet...'}
        </p>
      </button>

      <button
        onClick={handleToggleFavorite}
        className="absolute top-6 right-6 p-1 rounded hover:scale-110 transition-transform"
        aria-label={note.is_favorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        <StarIcon filled={note.is_favorite} className="w-5 h-5" />
      </button>

      <div className="flex items-center justify-between px-6 pb-6">
        <span className="text-xs text-slate-500">
          {new Date(note.updatedAt).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
          })}
        </span>
        <button
          onClick={handleDelete}
          className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 text-sm transition-opacity"
        >
          Delete
        </button>
      </div>
    </motion.div>
  );
};

export default NoteCard;