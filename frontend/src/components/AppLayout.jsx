import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import WelcomeModal from './WelcomeModal';
import { useAuth } from '../context/AuthContext';

const AppLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      // Always leave the protected area, even if the server-side logout
      // request itself failed — local auth state is already cleared either way.
      navigate('/login', { replace: true });
    }
  };

  return (
    <div className="flex min-h-screen">
      <WelcomeModal />
      <Sidebar />
      <main className="flex-1 min-w-0 relative">
        <button
          onClick={handleLogout}
          className="fixed top-4 right-4 sm:top-6 sm:right-6 z-30 flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.06] backdrop-blur-xl border border-white/10 text-slate-300 hover:text-red-400 hover:border-red-400/30 text-sm font-medium transition-colors"
        >
          <svg
            viewBox="0 0 24 24"
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Logout
        </button>
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;