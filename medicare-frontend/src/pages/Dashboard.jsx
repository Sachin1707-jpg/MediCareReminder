import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { RiHeartPulseLine, RiMedicineBottleLine, RiBellLine, RiDropLine, RiArrowRightLine, RiCheckLine, RiCloseLine, RiTimeLine } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../lib/axios';
import { useEffect, useState } from 'react';
import { requestNotificationPermission, startReminderChecker } from '../lib/notificationService';
import toast from 'react-hot-toast';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.4 } }),
};

const StatCard = ({ icon: Icon, label, value, color, subtitle, index }) => (
  <motion.div
    custom={index} variants={cardVariants} initial="hidden" animate="visible"
    whileHover={{ y: -4, boxShadow: 'var(--shadow-lg)' }}
    style={{
      background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', padding: 24,
      border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)', transition: 'all 0.2s',
    }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
      <div style={{ width: 44, height: 44, background: `${color}18`, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={22} color={color} />
      </div>
    </div>
    <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>{value}</div>
    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{label}</div>
    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{subtitle}</div>
  </motion.div>
);

const QuickAction = ({ icon: Icon, label, to, color }) => (
  <Link to={to}>
    <motion.div
      whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
        background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', padding: '20px 16px',
        border: '1px solid var(--border-color)', cursor: 'pointer', textAlign: 'center', boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div style={{ width: 48, height: 48, background: `${color}18`, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={24} color={color} />
      </div>
      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{label}</span>
    </motion.div>
  </Link>
);

const Dashboard = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const [loggedKeys, setLoggedKeys] = useState(new Set());

  // Fetch dashboard stats + upcoming medicines from API
  const { data: dashData, isLoading } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/dashboard/stats');
      return data.data;
    },
    refetchInterval: 60000, // auto-refresh every minute
  });

  // Fetch all medicines for notification service
  const { data: medicines } = useQuery({
    queryKey: ['medicines'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/medicines');
      return data.data;
    }
  });

  // Log adherence (Taken or Missed) directly from Dashboard
  const logMutation = useMutation({
    mutationFn: async ({ medicineId, scheduledTime, status }) => {
      return axiosInstance.post('/reminders', { medicineId, scheduledTime, status });
    },
    onSuccess: (_, variables) => {
      const key = `${variables.medicineId}-${variables.scheduledTime}`;
      setLoggedKeys(prev => new Set([...prev, key]));
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
      queryClient.invalidateQueries({ queryKey: ['analyticsAdherence'] });
      toast.success(variables.status === 'Taken' ? '✅ Marked as Taken!' : '⚠️ Marked as Missed');
    },
    onError: () => toast.error('Failed to log. Please try again.')
  });

  // Request notification permission and start checker on load
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  useEffect(() => {
    if (!medicines) return;
    const stop = startReminderChecker(medicines, (med, time) => {
      toast(`🔔 Time to take ${med.name} (${med.dosage})!`, { duration: 8000, icon: '💊' });
    });
    return stop;
  }, [medicines]);

  const m = dashData?.metrics || { totalScheduledToday: 0, upcomingCount: 0, missedCount: 0, completionPercentage: 0 };
  const upcomingMeds = dashData?.upcomingMedicines || [];
  const missedMeds = dashData?.missedMedicines || [];

  const stats = [
    { icon: RiMedicineBottleLine, label: "Today's Medicines", value: isLoading ? '...' : m.totalScheduledToday.toString(), subtitle: 'Total doses today', color: '#6366f1', index: 0 },
    { icon: RiBellLine, label: 'Upcoming', value: isLoading ? '...' : m.upcomingCount.toString(), subtitle: 'Reminders scheduled', color: '#10b981', index: 1 },
    { icon: RiHeartPulseLine, label: 'Missed', value: isLoading ? '...' : m.missedCount.toString(), subtitle: 'Past due today', color: '#ef4444', index: 2 },
    { icon: RiDropLine, label: 'Completion', value: isLoading ? '...' : `${m.completionPercentage}%`, subtitle: 'Daily adherence rate', color: '#f59e0b', index: 3 },
  ];

  const quickActions = [
    { icon: RiMedicineBottleLine, label: 'Add Medicine', to: '/medicines', color: '#6366f1' },
    { icon: RiBellLine, label: 'View Reminders', to: '/reminders', color: '#10b981' },
    { icon: RiHeartPulseLine, label: 'Log Health', to: '/health', color: '#ef4444' },
    { icon: RiDropLine, label: 'Analytics', to: '/analytics', color: '#f59e0b' },
  ];

  const MedicineCard = ({ item, status }) => {
    const key = `${item.medicine._id}-${item.time}`;
    const isLogged = loggedKeys.has(key);
    const isMissed = status === 'missed';

    return (
      <motion.div
        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
        style={{
          display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
          borderRadius: 12, background: isMissed ? 'rgba(239,68,68,0.05)' : 'rgba(99,102,241,0.05)',
          border: `1px solid ${isMissed ? 'rgba(239,68,68,0.2)' : 'rgba(99,102,241,0.2)'}`,
          marginBottom: 10,
        }}
      >
        <div style={{ width: 40, height: 40, borderRadius: 10, background: isMissed ? 'rgba(239,68,68,0.1)' : 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <RiMedicineBottleLine size={20} color={isMissed ? '#ef4444' : '#6366f1'} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{item.medicine.name}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <RiTimeLine size={12} /> {item.time} {isMissed ? '— Overdue' : '— Upcoming'}
          </div>
        </div>
        {isLogged ? (
          <span style={{ fontSize: 12, fontWeight: 600, color: '#10b981', padding: '4px 10px', background: '#10b98120', borderRadius: 20 }}>Logged ✓</span>
        ) : (
          <div style={{ display: 'flex', gap: 8 }}>
            <motion.button
              whileTap={{ scale: 0.95 }}
              disabled={logMutation.isPending}
              onClick={() => logMutation.mutate({ medicineId: item.medicine._id, scheduledTime: item.time, status: 'Taken' })}
              style={{ padding: '6px 14px', background: '#10b981', border: 'none', borderRadius: 8, color: 'white', fontWeight: 700, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
            >
              <RiCheckLine size={14} /> Taken
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              disabled={logMutation.isPending}
              onClick={() => logMutation.mutate({ medicineId: item.medicine._id, scheduledTime: item.time, status: 'Missed' })}
              style={{ padding: '6px 14px', background: '#ef444420', border: '1px solid #ef4444', borderRadius: 8, color: '#ef4444', fontWeight: 700, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
            >
              <RiCloseLine size={14} /> Missed
            </motion.button>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)',
          borderRadius: 'var(--radius-xl)', padding: '32px 36px', marginBottom: 28,
          color: 'white', position: 'relative', overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', top: -30, right: -30, width: 160, height: 160, background: 'rgba(255,255,255,0.08)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: -40, right: 80, width: 120, height: 120, background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ fontSize: 14, opacity: 0.8, marginBottom: 4 }}>{greeting} 👋</p>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>{user?.name || 'Welcome'}</h1>
          <p style={{ fontSize: 14, opacity: 0.75 }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 28 }}>
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Today's Schedule — Upcoming & Missed with Taken/Missed buttons */}
      <AnimatePresence>
        {(upcomingMeds.length > 0 || missedMeds.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            transition={{ delay: 0.3 }}
            style={{ background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', padding: 24, marginBottom: 28, border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}
          >
            <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20 }}>Today's Schedule</h2>

            {missedMeds.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#ef4444', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>⚠ Overdue</div>
                {missedMeds.map((item, i) => (
                  <MedicineCard key={`missed-${i}`} item={item} status="missed" />
                ))}
              </div>
            )}

            {upcomingMeds.length > 0 && (
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#10b981', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>⏰ Upcoming</div>
                {upcomingMeds.map((item, i) => (
                  <MedicineCard key={`upcoming-${i}`} item={item} status="upcoming" />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        style={{ background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', padding: 24, marginBottom: 28, border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)' }}>Quick Actions</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 12 }}>
          {quickActions.map((a) => <QuickAction key={a.label} {...a} />)}
        </div>
      </motion.div>

      {/* Getting Started */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        style={{ background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', padding: 24, border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}
      >
        <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>Getting Started</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { step: '1', text: 'Add your first medicine', to: '/medicines' },
            { step: '2', text: 'Mark medicines as Taken or Missed each day', to: '/reminders' },
            { step: '3', text: 'Log your daily health vitals', to: '/health' },
            { step: '4', text: 'View your analytics and adherence charts', to: '/analytics' },
          ].map(({ step, text, to }) => (
            <Link key={step} to={to}>
              <motion.div whileHover={{ x: 4 }}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface-2)', cursor: 'pointer' }}
              >
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ color: 'white', fontSize: 12, fontWeight: 700 }}>{step}</span>
                </div>
                <span style={{ fontSize: 14, color: 'var(--text-primary)', flex: 1 }}>{text}</span>
                <RiArrowRightLine color="var(--text-muted)" />
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
