import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RiDashboardLine, RiMedicineBottleLine, RiBellLine,
  RiHeartPulseLine, RiBarChartLine, RiUserLine,
  RiMenuLine, RiCloseLine, RiMoonLine, RiSunLine, RiLogoutBoxLine
} from 'react-icons/ri';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';

const navItems = [
  { to: '/dashboard', icon: RiDashboardLine, label: 'Dashboard' },
  { to: '/medicines', icon: RiMedicineBottleLine, label: 'Medicines' },
  { to: '/reminders', icon: RiBellLine, label: 'Reminders' },
  { to: '/health', icon: RiHeartPulseLine, label: 'Health Tracker' },
  { to: '/analytics', icon: RiBarChartLine, label: 'Analytics' },
  { to: '/profile', icon: RiUserLine, label: 'Profile' },
];

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-base)' }}>
      {/* ---- SIDEBAR ---- */}
      <AnimatePresence>
        {(sidebarOpen || true) && (
          <>
            {/* Mobile Overlay */}
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setSidebarOpen(false)}
                style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 40, display: 'none' }}
                className="mobile-overlay"
              />
            )}

            <motion.aside
              initial={{ x: -260 }} animate={{ x: 0 }} exit={{ x: -260 }}
              style={{
                width: 'var(--sidebar-width)', background: 'var(--bg-surface)',
                borderRight: '1px solid var(--border-color)', display: 'flex',
                flexDirection: 'column', padding: '24px 16px',
                position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50,
                boxShadow: 'var(--shadow-md)',
              }}
            >
              {/* Logo */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32, padding: '0 8px' }}>
                <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <RiHeartPulseLine color="white" size={20} />
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>MediCare</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: -2 }}>Reminder</div>
                </div>
              </div>

              {/* Navigation */}
              <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                {navItems.map(({ to, icon: Icon, label }) => (
                  <NavLink key={to} to={to} style={{ textDecoration: 'none' }}>
                    {({ isActive }) => (
                      <motion.div
                        whileHover={{ x: 4 }} whileTap={{ scale: 0.97 }}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 12,
                          padding: '10px 12px', borderRadius: 10, cursor: 'pointer',
                          background: isActive ? 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))' : 'transparent',
                          color: isActive ? 'var(--color-primary)' : 'var(--text-secondary)',
                          borderLeft: isActive ? '3px solid var(--color-primary)' : '3px solid transparent',
                          fontWeight: isActive ? 600 : 400, fontSize: 14,
                          transition: 'all 0.2s',
                        }}
                      >
                        <Icon size={18} />
                        {label}
                      </motion.div>
                    )}
                  </NavLink>
                ))}
              </nav>

              {/* User & Actions */}
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 10, background: 'var(--bg-surface-2)' }}>
                  <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: 'white', flexShrink: 0 }}>
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name || 'User'}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email || ''}</div>
                  </div>
                </div>

                <motion.button whileTap={{ scale: 0.97 }}
                  onClick={toggleTheme}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', border: 'none', background: 'transparent', color: 'var(--text-secondary)', borderRadius: 10, fontSize: 14, cursor: 'pointer', width: '100%' }}
                >
                  {theme === 'dark' ? <RiSunLine size={18} /> : <RiMoonLine size={18} />}
                  {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </motion.button>

                <motion.button whileTap={{ scale: 0.97 }}
                  onClick={handleLogout}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', border: 'none', background: 'transparent', color: 'var(--color-danger)', borderRadius: 10, fontSize: 14, cursor: 'pointer', width: '100%' }}
                >
                  <RiLogoutBoxLine size={18} />
                  Logout
                </motion.button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ---- MAIN CONTENT ---- */}
      <main style={{ flex: 1, marginLeft: 'var(--sidebar-width)', minHeight: '100vh', padding: '32px', overflowY: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
