import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 text-white text-center">
        <h1 className="text-2xl font-bold mb-6">
          Dashboard page (placeholder)
        </h1>

        <button
          onClick={handleLogout}
          className="px-5 py-2 rounded-lg bg-red-500 hover:bg-red-600 transition font-medium"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;