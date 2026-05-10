import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, setCredentials } from '@/store/slices/authSlice';
import { getErrorMessage } from '@/utils/helpers';
import { authService } from '@/services/authService';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const status = useSelector((state) => state.auth.status);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Name is required';
    if (!form.email.trim()) next.email = 'Email is required';
    if (!form.password.trim() || form.password.length < 6) next.password = 'Password must be at least 6 characters';
    setErrors(next);
    return !Object.keys(next).length;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const payload = await authService.register(form);
      dispatch(setCredentials(payload));
      toast.success('Account created');
      navigate('/');
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden bg-gradient-to-br from-blue-600 via-teal-500 to-orange-400 p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div>
          <div className="inline-flex rounded-3xl bg-white/15 px-4 py-2 text-sm font-semibold">Traveloop</div>
          <h1 className="mt-10 max-w-xl text-5xl font-black leading-tight">Turn dream trips into organized plans.</h1>
          <p className="mt-4 max-w-lg text-white/90">Track stops, activities, packing, notes, and budgets with a polished mobile-friendly workflow.</p>
        </div>
      </div>

      <div className="flex items-center justify-center px-4 py-10 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md rounded-3xl p-8 glass-panel shadow-[0_0_40px_rgba(59,130,246,0.15)]"
        >
          <h2 className="text-4xl font-black bg-gradient-to-r from-blue-500 to-teal-500 bg-clip-text text-transparent">Create your account</h2>
          <p className="mt-2 text-sm text-slate-500">Start planning trips in seconds.</p>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-950"
              />
              {errors.name && <p className="mt-1 text-sm text-rose-500">{errors.name}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-950"
              />
              {errors.email && <p className="mt-1 text-sm text-rose-500">{errors.email}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-950"
              />
              {errors.password && <p className="mt-1 text-sm text-rose-500">{errors.password}</p>}
            </div>

            <button
              disabled={status === 'loading'}
              className="w-full rounded-2xl bg-blue-500 px-4 py-3 font-semibold text-white shadow-soft transition hover:-translate-y-0.5 disabled:opacity-70"
            >
              {status === 'loading' ? 'Creating account...' : 'Register'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account? <Link to="/login" className="font-semibold text-teal-600">Login</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
