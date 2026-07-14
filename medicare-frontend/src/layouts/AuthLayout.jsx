import { Outlet, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RiHeartPulseLine } from 'react-icons/ri';
import { useAuth } from '../context/AuthContext';

const AuthLayout = () => {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-base)' }}>
      {/* LEFT PANEL */}
      <motion.div
        initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
        style={{
          flex: 1, background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)',
          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
          padding: 48, color: 'white', position: 'relative', overflow: 'hidden',
        }}
        className="auth-left-panel"
      >
        {/* Background decorations */}
        <div style={{ position: 'absolute', top: -60, right: -60, width: 220, height: 220, background: 'rgba(255,255,255,0.07)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: -80, left: -40, width: 280, height: 280, background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 360 }}>
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 3 }}
            style={{ width: 72, height: 72, background: 'rgba(255,255,255,0.2)', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', backdropFilter: 'blur(10px)' }}
          >
            <RiHeartPulseLine size={36} color="white" />
          </motion.div>
          <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12, letterSpacing: -0.5 }}>MediCare Reminder</h1>
          <p style={{ fontSize: 16, opacity: 0.85, lineHeight: 1.7 }}>
            Your intelligent medication management platform. Track medicines, get reminders, and monitor your health — all in one place.
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 40 }}>
            {[
              { emoji: '💊', text: 'Smart medicine reminders' },
              { emoji: '📊', text: 'Health tracking & analytics' },
              { emoji: '🔔', text: 'Browser push notifications' },
            ].map(({ emoji, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,0.12)', borderRadius: 12, padding: '12px 16px', backdropFilter: 'blur(8px)', textAlign: 'left' }}>
                <span style={{ fontSize: 20 }}>{emoji}</span>
                <span style={{ fontSize: 14, fontWeight: 500 }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* RIGHT PANEL */}
      <motion.div
        initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40, background: 'var(--bg-base)' }}
        className="auth-right-panel"
      >
        <div style={{ width: '100%', maxWidth: 420 }}>
          <Outlet />
        </div>
      </motion.div>
    </div>
  );
};

export default AuthLayout;
