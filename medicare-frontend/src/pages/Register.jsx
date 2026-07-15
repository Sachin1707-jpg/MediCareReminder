import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { RiEyeLine, RiEyeOffLine, RiMailLine, RiLockLine, RiUserLine } from 'react-icons/ri';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch('password');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await registerUser({ name: data.name, email: data.email, password: data.password });
      toast.success('Account created successfully! 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (hasError) => ({
    width: '100%', padding: '12px 14px 12px 44px', borderRadius: 'var(--radius-md)',
    border: `1.5px solid ${hasError ? '#ef4444' : 'var(--border-color)'}`,
    background: 'var(--bg-surface)', color: 'var(--text-primary)', fontSize: 14, outline: 'none',
  });

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <h2 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 6 }}>Create account</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 32, fontSize: 15 }}>
        Already have an account? <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Sign in</Link>
      </p>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Name */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Full Name</label>
          <div style={{ position: 'relative' }}>
            <RiUserLine style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 18 }} />
            <input placeholder="John Doe" {...register('name', { required: 'Name is required' })} style={inputStyle(errors.name)} />
          </div>
          {errors.name && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{errors.name.message}</p>}
        </div>

        {/* Email */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Email</label>
          <div style={{ position: 'relative' }}>
            <RiMailLine style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 18 }} />
            <input type="email" placeholder="you@example.com" {...register('email', { required: 'Email is required' })} style={inputStyle(errors.email)} />
          </div>
          {errors.email && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Password</label>
          <div style={{ position: 'relative' }}>
            <RiLockLine style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 18 }} />
            <input type={showPassword ? 'text' : 'password'} placeholder="Min. 6 characters" {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min. 6 characters' } })} style={{ ...inputStyle(errors.password), paddingRight: 44 }} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              {showPassword ? <RiEyeOffLine size={18} /> : <RiEyeLine size={18} />}
            </button>
          </div>
          {errors.password && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{errors.password.message}</p>}
        </div>

        {/* Confirm Password */}
        <div style={{ marginBottom: 28 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Confirm Password</label>
          <div style={{ position: 'relative' }}>
            <RiLockLine style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 18 }} />
            <input type="password" placeholder="Repeat password" {...register('confirmPassword', { required: true, validate: v => v === password || 'Passwords do not match' })} style={inputStyle(errors.confirmPassword)} />
          </div>
          {errors.confirmPassword && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{errors.confirmPassword.message}</p>}
        </div>

        <motion.button type="submit" disabled={loading} whileTap={{ scale: 0.98 }}
          style={{
            width: '100%', padding: '13px', borderRadius: 'var(--radius-md)', border: 'none',
            background: loading ? 'var(--text-muted)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: 'white', fontWeight: 700, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 14px rgba(99,102,241,0.4)',
          }}
        >
          {loading ? 'Creating account...' : 'Create Account'}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default Register;
