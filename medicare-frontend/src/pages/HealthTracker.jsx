import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../lib/axios';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend
} from 'chart.js';
import { RiHeartPulseLine } from 'react-icons/ri';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const HealthTracker = () => {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm();
  
  const { data: logs, isLoading } = useQuery({
    queryKey: ['healthLogs'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/health');
      return data.data;
    }
  });

  const saveMutation = useMutation({
    mutationFn: async (formData) => {
      const [sys, dia] = formData.bloodPressure.split('/');
      const payload = {
        date: new Date().toISOString().split('T')[0], // Today's date YYYY-MM-DD
        weight: Number(formData.weight),
        waterIntake: Number(formData.water),
        sleepHours: Number(formData.sleep),
        bloodPressure: { systolic: Number(sys) || 0, diastolic: Number(dia) || 0 }
      };
      return axiosInstance.post('/health', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['healthLogs'] });
      toast.success('Health logged successfully! 🎉');
      reset();
    },
    onError: () => {
      toast.error('Failed to save health data. Please check format (e.g. 120/80).');
    }
  });

  const onSubmit = (data) => saveMutation.mutate(data);

  // Graph Data Processing
  const labels = logs?.map(l => l.date) || [];
  const weightData = logs?.map(l => l.weight) || [];
  const sleepData = logs?.map(l => l.sleepHours) || [];

  const chartData = {
    labels,
    datasets: [
      { label: 'Weight (kg)', data: weightData, borderColor: '#6366f1', backgroundColor: '#6366f1', tension: 0.3 },
      { label: 'Sleep (hrs)', data: sleepData, borderColor: '#10b981', backgroundColor: '#10b981', tension: 0.3 }
    ]
  };

  const chartOptions = { 
    responsive: true, 
    plugins: { legend: { position: 'top' } },
    scales: { y: { beginAtZero: false } }
  };

  const inputStyle = { width: '100%', padding: '12px', borderRadius: 8, border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)', outline: 'none' };

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)' }}>Health Tracker</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 4 }}>Log today's details and watch your progress.</p>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
        
        {/* Form Section */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} style={{ background: 'var(--bg-surface)', padding: 24, borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Log Today's Health</h2>
          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Weight (kg)</label>
              <input {...register('weight', { required: true })} placeholder="e.g. 72" style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Water Intake (Liters)</label>
              <input {...register('water', { required: true })} placeholder="e.g. 2" style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Sleep (Hours)</label>
              <input {...register('sleep', { required: true })} placeholder="e.g. 7" style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Blood Pressure</label>
              <input {...register('bloodPressure', { required: true })} placeholder="e.g. 120/80" style={inputStyle} />
            </div>
            <button type="submit" disabled={saveMutation.isPending} style={{ padding: '14px', background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: 8, fontWeight: 600, cursor: saveMutation.isPending ? 'not-allowed' : 'pointer', marginTop: 10 }}>
              {saveMutation.isPending ? 'Saving...' : 'Save Health Data'}
            </button>
          </form>
        </motion.div>

        {/* Graph Section */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} style={{ background: 'var(--bg-surface)', padding: 24, borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Your Progress Trends</h2>
          
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {isLoading ? (
              <p>Loading charts...</p>
            ) : logs?.length > 0 ? (
              <div style={{ width: '100%' }}>
                 <Line options={chartOptions} data={chartData} />
                 
                 <div style={{ marginTop: 24, padding: 16, background: 'rgba(99,102,241,0.05)', borderRadius: 12 }}>
                   <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>Today's Latest Log:</h3>
                   <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-secondary)' }}>
                     <span>Weight: {logs[logs.length-1].weight}kg</span>
                     <span>Water: {logs[logs.length-1].waterIntake}L</span>
                     <span>Sleep: {logs[logs.length-1].sleepHours}h</span>
                     <span>BP: {logs[logs.length-1].bloodPressure?.systolic}/{logs[logs.length-1].bloodPressure?.diastolic}</span>
                   </div>
                 </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ width: 64, height: 64, background: 'rgba(239,68,68,0.1)', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <RiHeartPulseLine size={32} color="#ef4444" />
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700 }}>No data yet</h3>
                <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Fill out the form today to start seeing your graphs!</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HealthTracker;
