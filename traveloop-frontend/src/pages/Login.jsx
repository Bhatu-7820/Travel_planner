import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, setCredentials } from '@/store/slices/authSlice';
import { getErrorMessage } from '@/utils/helpers';
import { authService } from '@/services/authService';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/config/firebase';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const status = useSelector((state) => state.auth.status);
  
  const [view, setView] = useState('choice'); // 'choice' or 'form'
  const [role, setRole] = useState('user'); // 'user' or 'admin'
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const next = {};
    if (!form.email.trim()) next.email = 'Email is required';
    if (!form.password.trim()) next.password = 'Password is required';
    setErrors(next);
    return !Object.keys(next).length;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const payload = await authService.login(form);
      dispatch(setCredentials(payload));
      toast.success(`Welcome back, ${payload.user.name}!`);
      
      // Direct admins to dashboard and users to dashboard (different features will show)
      navigate(location.state?.from?.pathname || '/');
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const selectRole = (r) => {
    setRole(r);
    setForm(r === 'admin' ? { email: 'girase@gmail.com', password: '12bh34at' } : { email: 'demo@traveloop.com', password: 'password123' });
    setView('form');
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      const payload = await authService.firebaseLogin(idToken);
      dispatch(setCredentials(payload));
      toast.success(`Welcome, ${payload.user.name}!`);
      navigate(location.state?.from?.pathname || '/');
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className={`hidden lg:flex lg:flex-col lg:justify-between p-10 text-white transition-all duration-700 ${role === 'admin' ? 'bg-gradient-to-br from-indigo-600 via-blue-700 to-slate-900' : 'bg-gradient-to-br from-teal-500 via-blue-500 to-orange-400'}`}>
        <div>
          <div className="inline-flex rounded-3xl bg-white/15 px-4 py-2 text-sm font-semibold">Traveloop SaaS</div>
          <h1 className="mt-10 max-w-xl text-5xl font-black leading-tight">
            {role === 'admin' ? 'Total Control Over Every Journey.' : 'Plan Every Journey in One Beautiful Flow.'}
          </h1>
          <p className="mt-4 max-w-lg text-white/90">
            {role === 'admin' ? 'Manage users, approve requests, and monitor system-wide travel trends from your command center.' : 'Create trips, build itineraries, track budgets, and keep your packing list organized.'}
          </p>
        </div>
        <div className="rounded-3xl bg-white/10 p-6 backdrop-blur">
          <p className="text-sm uppercase tracking-widest text-white/80">{role.toUpperCase()} CONSOLE</p>
          <div className="mt-4 flex gap-4">
             <div className="h-10 w-10 rounded-full bg-white/20 animate-pulse"></div>
             <div className="h-10 w-10 rounded-full bg-white/20 animate-pulse delay-150"></div>
             <div className="h-10 w-10 rounded-full bg-white/20 animate-pulse delay-300"></div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center px-4 py-10 sm:px-6 lg:px-8 relative z-10 bg-slate-50 dark:bg-slate-950 overflow-hidden">
        {/* Beautiful high-resolution world map background image theme overlay */}
        <div className="absolute inset-0 -z-20 opacity-[0.14] dark:opacity-[0.08] pointer-events-none bg-[url('https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center bg-no-repeat bg-fixed" />
        <AnimatePresence mode="wait">
          {view === 'choice' ? (
            <motion.div
              key="choice"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full max-w-lg text-center"
            >
              <h2 className="text-4xl font-black text-slate-800 dark:text-white">Choose your path</h2>
              <p className="mt-2 text-slate-500">Sign in as a traveler or system administrator.</p>
              
              <div className="mt-10 grid gap-6 sm:grid-cols-2">
                <button 
                  onClick={() => selectRole('user')}
                  className="group relative flex flex-col items-center rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-white/10 p-8 shadow-soft transition-all hover:-translate-y-2 hover:shadow-xl hover:border-teal-500/30 text-white"
                >
                  <div className="mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-teal-500/10 text-3xl text-teal-600 transition-colors group-hover:bg-teal-500 group-hover:text-white">🌍</div>
                  <h3 className="text-xl font-bold">Traveler</h3>
                  <p className="mt-2 text-xs text-slate-400 text-center">Plan trips, share itineraries, and explore 100+ cities.</p>
                </button>
 
                <button 
                  onClick={() => selectRole('admin')}
                  className="group relative flex flex-col items-center rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-white/10 p-8 shadow-soft transition-all hover:-translate-y-2 hover:shadow-xl hover:border-indigo-500/30 text-white"
                >
                  <div className="mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-blue-500/10 text-3xl text-blue-600 transition-colors group-hover:bg-blue-500 group-hover:text-white">🛡️</div>
                  <h3 className="text-xl font-bold">Admin</h3>
                  <p className="mt-2 text-xs text-slate-400 text-center">Manage requests, oversee users, and view analytics.</p>
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full max-w-md rounded-[2.5rem] p-8 glass-panel shadow-[0_0_40px_rgba(20,184,166,0.1)]"
            >
              <button onClick={() => setView('choice')} className="mb-6 text-sm font-bold text-teal-600 hover:underline">← Change Role</button>
              <h2 className="text-4xl font-black bg-gradient-to-r from-teal-500 to-blue-500 bg-clip-text text-transparent">
                {role === 'admin' ? 'Admin Login' : 'Traveler Login'}
              </h2>
              <p className="mt-2 text-sm text-slate-500">Enter your credentials to continue.</p>

              <form onSubmit={onSubmit} className="mt-8 space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-teal-500 dark:border-slate-800 dark:bg-slate-950"
                  />
                  {errors.email && <p className="mt-1 text-sm text-rose-500">{errors.email}</p>}
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label className="mb-1 block text-sm font-medium">Password</label>
                    <Link to="/forgot-password" className="text-xs font-bold text-teal-600 hover:underline">Forgot Password?</Link>
                  </div>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-teal-500 dark:border-slate-800 dark:bg-slate-950"
                  />
                  {errors.password && <p className="mt-1 text-sm text-rose-500">{errors.password}</p>}
                </div>

                <button
                  disabled={status === 'loading'}
                  className={`w-full rounded-2xl py-4 font-bold text-white shadow-soft transition hover:-translate-y-0.5 disabled:opacity-70 ${role === 'admin' ? 'bg-blue-600' : 'bg-teal-500'}`}
                >
                  {status === 'loading' ? 'Authenticating...' : 'Login Now'}
                </button>
              </form>

              {role === 'user' && (
                <div className="mt-6">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-slate-800"></div></div>
                    <div className="relative flex justify-center text-xs uppercase"><span className="bg-white dark:bg-slate-900 px-2 text-slate-500">Or continue with</span></div>
                  </div>
                  <button
                    onClick={handleGoogleLogin}
                    className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white py-3 font-semibold shadow-soft transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Google
                  </button>
                </div>
              )}

              <p className="mt-6 text-center text-sm text-slate-500">
                New here? <Link to="/register" className="font-semibold text-teal-600">Create account</Link>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
