import { motion } from 'framer-motion';
import authBackground from '../assets/auth-background.png';

const PHOTO_URL = authBackground;

const AuthLayout = ({ title, subtitle, children }) => {
  return (
<div className="flex h-screen">
  {/* Left: real photo with dark overlay + branding text on top */}
  <div className="hidden lg:flex lg:w-1/2 h-full relative overflow-hidden">
        <img
          src={PHOTO_URL}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/70 to-violet-950/60" />

        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative z-10 flex flex-col justify-center px-16"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <span className="text-2xl">✦</span>
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">Notes</span>
          </div>
          <h1 className="text-5xl font-bold text-white leading-tight mb-6 drop-shadow-lg">
            Your thoughts,<br />
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              beautifully organized.
            </span>
          </h1>
          <p className="text-lg text-slate-300 max-w-md drop-shadow-md">
            A private, secure space to capture ideas, plans, and everything in between.
          </p>
        </motion.div>
      </div>

      {/* Right: form panel */}
      <div className="w-full lg:w-1/2 h-full overflow-y-auto flex items-center justify-center p-6 sm:p-12 bg-black">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full max-w-md bg-white/[0.06] backdrop-blur-2xl border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl"
        >
          <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
          <p className="text-slate-400 mb-8">{subtitle}</p>
          {children}
        </motion.div>
      </div>
    </div>
  );
};

export default AuthLayout;