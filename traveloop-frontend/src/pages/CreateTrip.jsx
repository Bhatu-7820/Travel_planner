import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { tripService } from '@/services/tripService';
import { getErrorMessage } from '@/utils/helpers';
import toast from 'react-hot-toast';

const today = new Date().toISOString().slice(0, 10);

export default function CreateTrip() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    startDate: today,
    endDate: today,
    description: '',
    coverPhoto: '',
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Trip name is required';
    if (!form.startDate) next.startDate = 'Start date is required';
    if (!form.endDate) next.endDate = 'End date is required';
    if (form.startDate && form.endDate && form.endDate < form.startDate) next.endDate = 'End date must be after or equal to start date';
    setErrors(next);
    return !Object.keys(next).length;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      setSaving(true);
      const trip = await tripService.createTrip(form);
      toast.success('Trip created');
      navigate(`/trip/${trip.id}/builder`);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-3xl">
      <div className="responsive-card border border-white/50 bg-white/40 p-4 shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/40 sm:p-6">
        <h1 className="text-2xl font-black sm:text-3xl">Create a new trip</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Set the foundation before building the itinerary.</p>

        <form onSubmit={submit} className="mt-8 grid gap-5">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Trip name</label>
            <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className="w-full rounded-2xl border border-slate-300/60 dark:border-white/10 bg-slate-900/5 dark:bg-white/5 px-4 py-3 focus:border-teal-500 focus:outline-none transition-all backdrop-blur-sm" />
            {errors.name && <p className="mt-1 text-sm text-rose-500">{errors.name}</p>}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Start date</label>
              <input type="date" value={form.startDate} onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))} className="w-full rounded-2xl border border-slate-300/60 dark:border-white/10 bg-slate-900/5 dark:bg-white/5 px-4 py-3 focus:border-teal-500 focus:outline-none transition-all backdrop-blur-sm" />
              {errors.startDate && <p className="mt-1 text-sm text-rose-500">{errors.startDate}</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">End date</label>
              <input type="date" value={form.endDate} onChange={(e) => setForm((p) => ({ ...p, endDate: e.target.value }))} className="w-full rounded-2xl border border-slate-300/60 dark:border-white/10 bg-slate-900/5 dark:bg-white/5 px-4 py-3 focus:border-teal-500 focus:outline-none transition-all backdrop-blur-sm" />
              {errors.endDate && <p className="mt-1 text-sm text-rose-500">{errors.endDate}</p>}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
            <textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows="4" className="w-full rounded-2xl border border-slate-300/60 dark:border-white/10 bg-slate-900/5 dark:bg-white/5 px-4 py-3 focus:border-teal-500 focus:outline-none transition-all backdrop-blur-sm" />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Cover photo URL (optional)</label>
            <input value={form.coverPhoto} onChange={(e) => setForm((p) => ({ ...p, coverPhoto: e.target.value }))} placeholder="https://..." className="w-full rounded-2xl border border-slate-300/60 dark:border-white/10 bg-slate-900/5 dark:bg-white/5 px-4 py-3 focus:border-teal-500 focus:outline-none transition-all backdrop-blur-sm" />
          </div>

          <button disabled={saving} className="rounded-2xl bg-teal-500 px-5 py-3 font-semibold text-white shadow-soft transition-colors hover:bg-teal-600">
            {saving ? 'Creating...' : 'Create trip'}
          </button>
        </form>
      </div>
    </motion.div>
  );
}
