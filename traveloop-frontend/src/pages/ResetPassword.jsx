import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '@/services/api';
import toast from 'react-hot-toast';
import { getErrorMessage } from '@/utils/helpers';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return toast.error('Passwords do not match');
    
    setLoading(true);
    try {
      await api.put(`/api/auth/resetpassword/${token}`, { password });
      toast.success('Password reset successful! Logging you in...');
      navigate('/login');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-traveloop-gradient p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md rounded-[2.5rem] bg-white p-8 shadow-2xl dark:bg-slate-900">
        <h2 className="text-3xl font-black">Set New Password</h2>
        <p className="mt-2 text-slate-500">Choose a strong password for your Traveloop account.</p>

        <form onSubmit={submit} className="mt-8 space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-slate-400">New Password</label>
            <input 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••" 
              className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 outline-none focus:border-teal-500 dark:border-slate-800 dark:bg-slate-950" 
              required 
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Confirm Password</label>
            <input 
              type="password" 
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="••••••••" 
              className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 outline-none focus:border-teal-500 dark:border-slate-800 dark:bg-slate-950" 
              required 
            />
          </div>
          <button 
            disabled={loading}
            className="w-full rounded-2xl bg-teal-500 py-4 font-bold text-white shadow-soft transition hover:-translate-y-1"
          >
            {loading ? 'Updating...' : 'Reset Password'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
