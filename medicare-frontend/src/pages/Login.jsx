import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { RiEyeLine, RiEyeOffLine, RiMailLine, RiLockLine } from 'react-icons/ri';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await login(data);
      toast.success('Welcome back! 👋');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 6 }}>Welcome back</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 32, fontSize: 15 }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Sign up</Link>
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Email */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Email</label>
            <div style={{ position: 'relative' }}>
              <RiMailLine style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 18 }} />
              <input
                type="email"
                placeholder="you@example.com"
                {...register('email', { required: 'Email is required' })}
                style={{
                  width: '100%', padding: '12px 14px 12px 44px', borderRadius: 'var(--radius-md)',
                  border: `1.5px solid ${errors.email ? '#ef4444' : 'var(--border-color)'}`,
                  background: 'var(--bg-surface)', color: 'var(--text-primary)', fontSize: 14, outline: 'none', transition: 'all 0.2s',
                }}
              />
            </div>
            {errors.email && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Password</label>
            <div style={{ position: 'relative' }}>
              <RiLockLine style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 18 }} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                {...register('password', { required: 'Password is required' })}
                style={{
                  width: '100%', padding: '12px 44px 12px 44px', borderRadius: 'var(--radius-md)',
                  border: `1.5px solid ${errors.password ? '#ef4444' : 'var(--border-color)'}`,
                  background: 'var(--bg-surface)', color: 'var(--text-primary)', fontSize: 14, outline: 'none', transition: 'all 0.2s',
                }}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                {showPassword ? <RiEyeOffLine size={18} /> : <RiEyeLine size={18} />}
              </button>
            </div>
            {errors.password && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{errors.password.message}</p>}
          </div>

          <div style={{ textAlign: 'right', marginBottom: 24 }}>
            <Link to="/forgot-password" style={{ fontSize: 13, color: 'var(--color-primary)', fontWeight: 500 }}>Forgot password?</Link>
          </div>

          <motion.button
            type="submit" disabled={loading} whileTap={{ scale: 0.98 }}
            style={{
              width: '100%', padding: '13px', borderRadius: 'var(--radius-md)', border: 'none',
              background: loading ? 'var(--text-muted)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: 'white', fontWeight: 700, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 14px rgba(99,102,241,0.4)', transition: 'all 0.2s',
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
