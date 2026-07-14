import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RiBellLine, RiAddLine, RiCheckLine, RiCloseLine } from 'react-icons/ri';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../lib/axios';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const Reminders = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const { register, handleSubmit, reset } = useForm();
  
  // Fetch medicines for the dropdown
  const { data: medicines } = useQuery({
    queryKey: ['medicines'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/medicines');
      return data.data;
    }
  });

  // Fetch reminder logs
  const { data: logs, isLoading } = useQuery({
    queryKey: ['reminders'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/reminders');
      return data.data;
    }
  });

  const saveMutation = useMutation({
    mutationFn: async (formData) => {
      return axiosInstance.post('/reminders', {
        medicineId: formData.medicineId,
        scheduledTime: formData.time,
        status: formData.status
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] }); // refresh dashboard
      toast.success('Reminder logged successfully! 🎉');
      setShowForm(false);
      reset();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to log reminder');
    }
  });

  const onSubmit = (data) => saveMutation.mutate(data);

  const inputStyle = { width: '100%', padding: '12px', borderRadius: 8, border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)', outline: 'none' };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)' }}>Reminders</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 4 }}>Track your medication schedule and adherence</p>
        </div>
        {!showForm && (
          <motion.button onClick={() => setShowForm(true)} whileTap={{ scale: 0.97 }} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', borderRadius: 'var(--radius-md)', color: 'white', fontWeight: 700, fontSize: 14, cursor: 'pointer', boxShadow: '0 4px 14px rgba(16,185,129,0.4)' }}>
            <RiAddLine size={18} /> Log Reminder
          </motion.button>
        )}
      </motion.div>

      <AnimatePresence mode="wait">
        {showForm ? (
          <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
            style={{ background: 'var(--bg-surface)', padding: 30, borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>Log Medicine Status</h2>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><RiCloseLine size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Medicine</label>
                <select {...register('medicineId', { required: true })} style={inputStyle}>
                  <option value="">Select a Medicine</option>
                  {medicines?.map(med => (
                    <option key={med._id} value={med._id}>{med.name} ({med.dosage})</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Reminder Time</label>
                <input type="time" {...register('time', { required: true })} style={inputStyle} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Status</label>
                <select {...register('status', { required: true })} style={inputStyle}>
                  <option value="Taken">Taken</option>
                  <option value="Missed">Missed</option>
                </select>
              </div>
              
              <motion.button type="submit" disabled={saveMutation.isPending} whileTap={{ scale: 0.98 }}
                style={{ padding: '14px', background: '#10b981', color: 'white', border: 'none', borderRadius: 8, fontWeight: 600, cursor: saveMutation.isPending ? 'not-allowed' : 'pointer', marginTop: 10 }}>
                {saveMutation.isPending ? 'Saving...' : 'Save Log'}
              </motion.button>
            </form>
          </motion.div>
        ) : (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {isLoading ? (
               <p style={{ textAlign: 'center', marginTop: 40 }}>Loading logs...</p> 
            ) : logs?.length > 0 ? (
              <div style={{ display: 'grid', gap: 16 }}>
                {logs.map(log => (
                  <div key={log._id} style={{ padding: 20, background: 'var(--bg-surface)', borderRadius: 16, border: '1px solid var(--border-color)', display: 'flex', gap: 16, alignItems: 'center' }}>
                    <div style={{ width: 48, height: 48, background: log.status === 'Taken' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {log.status === 'Taken' ? <RiCheckLine size={24} color="#10b981" /> : <RiCloseLine size={24} color="#ef4444" />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>{log.medicine?.name || 'Unknown Medicine'}</h3>
                      <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                        Scheduled for: {log.scheduledTime}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700, background: log.status === 'Taken' ? '#10b98122' : '#ef444422', color: log.status === 'Taken' ? '#10b981' : '#ef4444' }}>
                        {log.status}
                      </span>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                        {new Date(log.dateLogged).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ background: 'var(--bg-surface)', borderRadius: 'var(--radius-xl)', padding: '60px 40px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)', textAlign: 'center' }}>
                <div style={{ width: 80, height: 80, background: 'rgba(16,185,129,0.1)', borderRadius: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <RiBellLine size={40} color="#10b981" />
                </div>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>No reminders logged</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24 }}>Click "Log Reminder" to track when you take or miss your medicines.</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Reminders;
