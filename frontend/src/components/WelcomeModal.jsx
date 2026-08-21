import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NotebookIllustration from './NotebookIllustration';

const STORAGE_KEY = 'notex_welcome_seen';

const FEATURES = [
  'Persistent sidebar — all your notes, one click away',
  'Silent autosave — never lose a word, no Save button needed',
  'Favorites — star the notes that matter most',
  'Command palette — press Ctrl+K to jump anywhere instantly',
];

// Handwriting-style font loaded via Google Fonts in index.html
const HANDWRITING_FONT = { fontFamily: "'Caveat', cursive" };

const WelcomeModal = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem(STORAGE_KEY);
    if (!seen) setShow(true);
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-white/[0.06] backdrop-blur-xl border border-white/10 rounded-3xl p-6 text-center"
          >
            <div className="max-w-[200px] mx-auto mb-1">
              <NotebookIllustration />
            </div>

            <h2 className="text-2xl font-bold mb-1">
              <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                Welcome to notex
              </span>
            </h2>
            <p className="text-slate-400 text-xs mb-4">Capture ideas, beautifully.</p>

            <ul className="text-left space-y-1.5 mb-6">
              {FEATURES.map((feature) => (
                <li key={feature} className="flex items-center gap-2.5">
                  <span className="shrink-0 w-5 h-5 rounded-full bg-violet-500/20 flex items-center justify-center">
                    <svg
                      viewBox="0 0 24 24"
                      className="w-3 h-3 stroke-violet-300"
                      fill="none"
                      strokeWidth="3"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span
                    style={HANDWRITING_FONT}
                    className="text-lg sm:text-xl font-semibold text-white/90 leading-tight"
                  >
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            <button
              onClick={handleDismiss}
              className="w-full px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold hover:opacity-90 transition-opacity"
            >
              Get Started
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeModal;