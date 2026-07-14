import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { RiUserLine, RiMailLine, RiCalendarLine } from 'react-icons/ri';

const Profile = () => {
  const { user } = useAuth();
  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)' }}>Profile</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 4 }}>Your account information</p>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        style={{ background: 'var(--bg-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-color)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', padding: '40px 32px', textAlign: 'center' }}>
          <div style={{ width: 80, height: 80, background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 32, fontWeight: 800, color: 'white' }}>
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: 'white', marginBottom: 4 }}>{user?.name}</h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 14 }}>{user?.email}</p>
        </div>
        {/* Info */}
        <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 20 }}>
          {[
            { icon: RiUserLine, label: 'Full Name', value: user?.name },
            { icon: RiMailLine, label: 'Email Address', value: user?.email },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', background: 'var(--bg-surface-2)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ width: 40, height: 40, background: 'rgba(99,102,241,0.12)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={18} color="var(--color-primary)" />
              </div>
              <div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 2 }}>{label}</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>{value || '—'}</div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
