import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '@/services/api';
import toast from 'react-hot-toast';
import { getErrorMessage } from '@/utils/helpers';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/api/auth/forgotpassword', { email });
      setSent(true);
      toast.success('Reset link generated!');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-traveloop-gradient p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md rounded-[2.5rem] bg-white p-8 shadow-2xl dark:bg-slate-900">
        <h2 className="text-3xl font-black">Reset Password</h2>
        <p className="mt-2 text-slate-500">Enter your email and we'll send you a link to reset your password.</p>

        {sent ? (
          <div className="mt-8 rounded-2xl bg-teal-50 p-6 text-center text-teal-700 dark:bg-teal-900/30 dark:text-teal-400">
            <p className="font-bold">Check your response!</p>
            <p className="mt-2 text-sm">Since this is a demo, the reset token is returned in the API response or console.</p>
            <Link to="/login" className="mt-4 inline-block font-bold underline">Back to Login</Link>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-8 space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com" 
                className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 outline-none focus:border-teal-500 dark:border-slate-800 dark:bg-slate-950" 
                required 
              />
            </div>
            <button 
              disabled={loading}
              className="w-full rounded-2xl bg-slate-900 py-4 font-bold text-white shadow-soft transition hover:-translate-y-1 dark:bg-teal-600"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
            <div className="text-center">
              <Link to="/login" className="text-sm font-bold text-slate-500 hover:text-teal-600">Back to Login</Link>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}
