import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { authService } from '@/services/authService';
import { tripService } from '@/services/tripService';
import { updateProfile, logout } from '@/store/slices/authSlice';
import { fetchTrips } from '@/store/slices/tripSlice';
import { getErrorMessage, uniqueCitiesFromTrips } from '@/utils/helpers';

export default function UserProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const trips = useSelector((state) => state.trips.trips);
  const [form, setForm] = useState({ name: '', email: '', photoUrl: '' });
  const [passForm, setPassForm] = useState({ oldPassword: '', newPassword: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    dispatch(fetchTrips());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        photoUrl: user.photoUrl || '',
      });
    }
  }, [user]);

  const savedDestinations = useMemo(() => uniqueCitiesFromTrips(trips), [trips]);

  const save = async () => {
    if (!form.name.trim()) return toast.error('Name is required');
    if (!form.email.trim()) return toast.error('Email is required');
    try {
      setSaving(true);
      const updated = await authService.updateMe(form);
      dispatch(updateProfile(updated));
      toast.success('Profile updated');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  const deleteAccount = async () => {
    if (!window.confirm('Delete your account permanently?')) return;
    try {
      await authService.deleteMe();
      dispatch(logout());
      toast.success('Account deleted');
      navigate('/login');
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <h1 className="text-3xl font-black">User Profile</h1>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <div className="rounded-3xl border border-white/20 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-xl font-bold">Edit Profile</h2>
            <div className="mt-5 grid gap-4">
              <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-950" />
              <input value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-950" />
              <input value={form.photoUrl} onChange={(e) => setForm((p) => ({ ...p, photoUrl: e.target.value }))} placeholder="Photo URL" className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-950" />
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <button onClick={save} disabled={saving} className="rounded-full bg-teal-500 px-5 py-3 font-semibold text-white shadow-soft transition hover:-translate-y-1">
                {saving ? 'Saving...' : 'Update profile'}
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-white/20 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-xl font-bold">Security</h2>
            <p className="mt-1 text-sm text-slate-500">Update your password to keep your account secure.</p>
            <div className="mt-5 grid gap-4">
              <input type="password" placeholder="Old Password" value={passForm.oldPassword} onChange={(e) => setPassForm((p) => ({ ...p, oldPassword: e.target.value }))} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-950" />
              <input type="password" placeholder="New Password" value={passForm.newPassword} onChange={(e) => setPassForm((p) => ({ ...p, newPassword: e.target.value }))} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-950" />
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <button onClick={async () => {
                try {
                  await authService.updatePassword(passForm);
                  toast.success('Password updated');
                  setPassForm({ oldPassword: '', newPassword: '' });
                } catch (err) {
                  toast.error(getErrorMessage(err));
                }
              }} className="rounded-full bg-slate-900 px-5 py-3 font-semibold text-white shadow-soft dark:bg-slate-800">
                Change Password
              </button>
              <button onClick={deleteAccount} className="rounded-full border border-rose-200 px-5 py-3 font-semibold text-rose-600 dark:border-rose-900/50 dark:text-rose-300">
                Delete Account
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="overflow-hidden rounded-3xl border border-white/20 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900">
            <div className="p-6 text-center">
              <img
                src={form.photoUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(form.name || 'U')}`}
                alt={form.name}
                className="mx-auto h-28 w-28 rounded-full object-cover"
              />
              <h3 className="mt-4 text-2xl font-bold">{form.name}</h3>
              <p className="text-sm text-slate-500">{form.email}</p>
            </div>
          </div>

          <div className="rounded-3xl border border-white/20 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-xl font-bold">Saved destinations</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {savedDestinations.length ? (
                savedDestinations.map((city) => (
                  <span key={`${city.name}-${city.country}`} className="rounded-full bg-blue-500/10 px-3 py-1 text-sm font-semibold text-blue-700 dark:text-blue-300">
                    {city.name}, {city.country}
                  </span>
                ))
              ) : (
                <p className="text-sm text-slate-500">No saved destinations yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
