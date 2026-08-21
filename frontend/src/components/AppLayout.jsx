import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import WelcomeModal from './WelcomeModal';

const AppLayout = () => {
  return (
    <div className="flex min-h-screen">
      <WelcomeModal />
      <Sidebar />
      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;