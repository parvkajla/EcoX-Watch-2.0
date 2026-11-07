import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { ToastContainer } from '../ui/Toast';
import { useAppStore } from '../../store/appStore';
import { motion } from 'framer-motion';

export function AppLayout() {
  const sidebarCollapsed = useAppStore((s) => s.sidebarCollapsed);

  return (
    <div className="min-h-screen bg-[#F5F6F2]">
      <Sidebar collapsed={sidebarCollapsed} />
      <Topbar sidebarCollapsed={sidebarCollapsed} />
      <motion.main
        initial={false}
        animate={{ paddingLeft: sidebarCollapsed ? 64 : 240 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="pt-[58px] min-h-screen"
      >
        <div className="p-6 max-w-[1600px] mx-auto">
          <Outlet />
        </div>
      </motion.main>
      <ToastContainer />
    </div>
  );
}
