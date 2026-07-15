import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../lib/axios';
import { Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title
} from 'chart.js';
import { RiBarChartLine } from 'react-icons/ri';

ChartJS.register(ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Analytics = () => {
  const { data: adherence, isLoading: isLoadingAdherence } = useQuery({
    queryKey: ['analyticsAdherence'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/analytics/adherence');
      return data.data;
    }
  });

  const { data: health, isLoading: isLoadingHealth } = useQuery({
    queryKey: ['analyticsHealth'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/analytics/health');
      return data.data;
    }
  });

  // Pie Chart Data (Taken vs Missed)
  const pieData = {
    labels: ['Taken', 'Missed'],
    datasets: [
      {
        data: [
          adherence?.pieData?.Taken || 0,
          adherence?.pieData?.Missed || 0,
        ],
        backgroundColor: ['#10b981', '#ef4444'],
        borderWidth: 0,
      }
    ]
  };

  // Line Chart Data (Weight and Water Intake)
  const healthLabels = health?.map(h => h.date) || [];
  const weightData = health?.map(h => h.weight) || [];
  const waterData = health?.map(h => h.waterIntake) || [];

  const lineData = {
    labels: healthLabels,
    datasets: [
      { label: 'Weight (kg)', data: weightData, borderColor: '#6366f1', backgroundColor: '#6366f1', tension: 0.3 },
      { label: 'Water (Liters)', data: waterData, borderColor: '#06b6d4', backgroundColor: '#06b6d4', tension: 0.3 }
    ]
  };

  const hasData = adherence?.pieData?.Taken > 0 || adherence?.pieData?.Missed > 0 || health?.length > 0;

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)' }}>Analytics</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 4 }}>Your health and adherence trends</p>
      </motion.div>

      {isLoadingAdherence || isLoadingHealth ? (
        <p style={{ textAlign: 'center', marginTop: 40 }}>Loading your analytics...</p>
      ) : hasData ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'var(--bg-surface)', padding: 24, borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, alignSelf: 'flex-start' }}>Adherence Overview</h2>
            <div style={{ width: '100%', maxWidth: 300 }}>
              <Pie data={pieData} />
            </div>
            <p style={{ marginTop: 16, fontSize: 13, color: 'var(--text-muted)' }}>
              Total Taken: <strong style={{ color: '#10b981' }}>{adherence?.pieData?.Taken || 0}</strong> • Total Missed: <strong style={{ color: '#ef4444' }}>{adherence?.pieData?.Missed || 0}</strong>
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ background: 'var(--bg-surface)', padding: 24, borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Health Trends (Weight & Water)</h2>
            <div style={{ position: 'relative', height: '300px' }}>
              <Line data={lineData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top' } } }} />
            </div>
          </motion.div>

        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{ background: 'var(--bg-surface)', borderRadius: 'var(--radius-xl)', padding: '60px 40px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)', textAlign: 'center' }}>
          <div style={{ width: 80, height: 80, background: 'rgba(245,158,11,0.1)', borderRadius: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <RiBarChartLine size={40} color="#f59e0b" />
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>No analytics data yet</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Log your medicines and track your health to see beautiful charts and trends here.</p>
        </motion.div>
      )}
    </div>
  );
};

export default Analytics;
