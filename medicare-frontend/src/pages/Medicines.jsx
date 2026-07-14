import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RiMedicineBottleLine, RiAddLine, RiCloseLine, RiDeleteBinLine } from 'react-icons/ri';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../lib/axios';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const Medicines = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  // Fetch medicines from backend
  const { data: medicines, isLoading } = useQuery({
    queryKey: ['medicines'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/medicines');
      return data.data;
    }
  });

  // Add medicine mutation
  const addMutation = useMutation({
    mutationFn: async (newMed) => {
      const formattedData = {
        name: newMed.name,
        category: 'Pill',
        dosage: newMed.dosage,
        frequency: [newMed.frequency],
        reminderTimes: [newMed.time],
        duration: {
          startDate: new Date(newMed.startDate),
          endDate: new Date(newMed.endDate)
        }
      };
      return axiosInstance.post('/medicines', formattedData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicines'] }); // Refresh list
      toast.success('Medicine added successfully! 🎉');
      setShowForm(false);
      reset();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to add medicine');
    }
  });

  // Delete medicine mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => axiosInstance.delete(`/medicines/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicines'] });
      toast.success('Medicine deleted');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to delete medicine');
    }
  });

  const onSubmit = (data) => addMutation.mutate(data);

  const inputStyle = { width: '100%', padding: '12px', borderRadius: 8, border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)', outline: 'none' };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)' }}>Medicines</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 4 }}>Manage your medication schedule</p>
        </div>
        {!showForm && (
          <motion.button onClick={() => setShowForm(true)} whileTap={{ scale: 0.97 }} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', borderRadius: 'var(--radius-md)', color: 'white', fontWeight: 700, fontSize: 14, cursor: 'pointer', boxShadow: '0 4px 14px rgba(99,102,241,0.4)' }}>
            <RiAddLine size={18} /> Add Medicine
          </motion.button>
        )}
      </motion.div>

      <AnimatePresence mode="wait">
        {showForm ? (
          <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
            style={{ background: 'var(--bg-surface)', padding: 30, borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>Add New Medicine</h2>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><RiCloseLine size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Medicine Name</label>
                <input {...register('name', { required: true })} placeholder="e.g. Paracetamol" style={inputStyle} />
                {errors.name && <span style={{ color: '#ef4444', fontSize: 12 }}>Required</span>}
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Dosage</label>
                <input {...register('dosage', { required: true })} placeholder="e.g. 500mg" style={inputStyle} />
                {errors.dosage && <span style={{ color: '#ef4444', fontSize: 12 }}>Required</span>}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Time</label>
                <input type="time" {...register('time', { required: true })} style={inputStyle} />
                {errors.time && <span style={{ color: '#ef4444', fontSize: 12 }}>Required</span>}
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Frequency</label>
                <select {...register('frequency', { required: true })} style={inputStyle}>
                  <option value="">Select Frequency</option>
                  <option value="Morning">Morning</option>
                  <option value="Afternoon">Afternoon</option>
                  <option value="Night">Night</option>
                </select>
                {errors.frequency && <span style={{ color: '#ef4444', fontSize: 12 }}>Required</span>}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Start Date</label>
                <input type="date" {...register('startDate', { required: true })} style={inputStyle} />
                {errors.startDate && <span style={{ color: '#ef4444', fontSize: 12 }}>Required</span>}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>End Date</label>
                <input type="date" {...register('endDate', { required: true })} style={inputStyle} />
                {errors.endDate && <span style={{ color: '#ef4444', fontSize: 12 }}>Required</span>}
              </div>
              
              <motion.button type="submit" disabled={addMutation.isPending} whileTap={{ scale: 0.98 }}
                style={{ gridColumn: '1 / -1', padding: '14px', background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: 8, fontWeight: 600, cursor: addMutation.isPending ? 'not-allowed' : 'pointer', marginTop: 10 }}>
                {addMutation.isPending ? 'Saving...' : 'Save Medicine'}
              </motion.button>
            </form>
          </motion.div>
        ) : (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {isLoading ? (
               <p style={{ textAlign: 'center', marginTop: 40 }}>Loading medicines...</p> 
            ) : medicines?.length > 0 ? (
              <div style={{ display: 'grid', gap: 16 }}>
                {medicines.map(med => (
                  <div key={med._id} style={{ padding: 20, background: 'var(--bg-surface)', borderRadius: 16, border: '1px solid var(--border-color)', display: 'flex', gap: 16, alignItems: 'center' }}>
                    <div style={{ width: 48, height: 48, background: 'rgba(99,102,241,0.1)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <RiMedicineBottleLine size={24} color="var(--color-primary)" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>{med.name}</h3>
                      <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                        {med.dosage} • {med.frequency?.join(', ')} • at {med.reminderTimes?.join(', ')}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right', fontSize: 12, color: 'var(--text-muted)' }}>
                      <div>Start: {new Date(med.duration?.startDate).toLocaleDateString()}</div>
                      <div>End: {new Date(med.duration?.endDate).toLocaleDateString()}</div>
                    </div>
                    <motion.button 
                      whileHover={{ scale: 1.1 }} 
                      whileTap={{ scale: 0.9 }} 
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this medicine?')) {
                          deleteMutation.mutate(med._id);
                        }
                      }} 
                      style={{ background: 'rgba(239,68,68,0.1)', border: 'none', borderRadius: 10, padding: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444', marginLeft: 8 }}
                      title="Delete Medicine"
                    >
                      <RiDeleteBinLine size={20} />
                    </motion.button>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ background: 'var(--bg-surface)', borderRadius: 'var(--radius-xl)', padding: '60px 40px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)', textAlign: 'center' }}>
                <div style={{ width: 80, height: 80, background: 'rgba(99,102,241,0.1)', borderRadius: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <RiMedicineBottleLine size={40} color="var(--color-primary)" />
                </div>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>No medicines yet</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24 }}>Start by adding your first medication to track and get reminders for.</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Medicines;
