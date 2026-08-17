import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Strips HTML tags from rich-text content so the card preview shows plain text
const stripHtml = (html) => html?.replace(/<[^>]*>/g, '') || '';

const NoteCard = ({ note, onDelete }) => {
  const navigate = useNavigate();

  const handleDelete = (e) => {
    e.stopPropagation(); // don't trigger the card's own click (which opens the note)
    onDelete(note.id);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4 }}
      onClick={() => navigate(`/notes/${note.id}`)}
      className="group relative bg-white/[0.06] backdrop-blur-xl border border-white/10 rounded-2xl p-6 cursor-pointer hover:border-violet-400/40 hover:bg-white/[0.09] transition-colors"
    >
      <h3 className="text-lg font-semibold text-white mb-2 truncate">{note.title}</h3>
      <p className="text-slate-400 text-sm line-clamp-3 mb-4">
        {stripHtml(note.content) || 'No content yet...'}
      </p>
      <div className="flex items-center justify-between">
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