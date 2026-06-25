import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import TripCard from '@/components/TripCard';
import { deleteTrip, fetchTrips } from '@/store/slices/tripSlice';
import { tripService } from '@/services/tripService';
import { formatDateRange, getErrorMessage } from '@/utils/helpers';

export default function MyTrips() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { trips, status } = useSelector((state) => state.trips);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', startDate: '', endDate: '', description: '', coverPhoto: '' });

  useEffect(() => {
    dispatch(fetchTrips());
  }, [dispatch]);

  const openEdit = (trip) => {
    setEditing(trip);
    setForm({
      name: trip.name || '',
      startDate: trip.startDate || '',
      endDate: trip.endDate || '',
      description: trip.description || '',
      coverPhoto: trip.coverPhoto || '',
    });
  };

  const saveEdit = async () => {
    if (!form.name.trim()) return toast.error('Trip name is required');
    if (form.endDate < form.startDate) return toast.error('End date must be after start date');
    try {
      setSaving(true);
      await tripService.updateTrip(editing.id, form);
      toast.success('Trip updated');
      setEditing(null);
      dispatch(fetchTrips());
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  const removeTrip = async (trip) => {
    if (!window.confirm(`Delete ${trip.name}?`)) return;
    try {
      await dispatch(deleteTrip(trip.id)).unwrap();
      toast.success('Trip deleted');
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="safe-container space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-black sm:text-3xl">My Trips</h1>
          <p className="text-sm text-slate-500">Manage your trips, stops, and details.</p>
        </div>
        <button onClick={() => navigate('/create-trip')} className="rounded-full bg-teal-500 px-5 py-3 font-semibold text-white shadow-soft">
          New Trip
        </button>
      </div>

      {status === 'loading' && <div className="rounded-3xl border border-dashed p-8 text-center text-slate-500">Loading trips...</div>}
      <div className="grid gap-5">
        {trips.map((trip) => (
          <TripCard
            key={trip.id}
            trip={trip}
            onEdit={openEdit}
            onDelete={removeTrip}
            onView={() => navigate(`/trip/${trip.id}/view`)}
          />
        ))}
        {!trips.length && status !== 'loading' && (
          <div className="rounded-3xl border border-dashed border-slate-300 p-8 text-center text-slate-500 dark:border-slate-700">
            No trips yet. Create one to get started.
          </div>
        )}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-3 sm:p-4">
          <div className="responsive-card my-auto max-h-[calc(100dvh-2rem)] w-full max-w-2xl overflow-y-auto border border-white/50 bg-white/80 p-4 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/85 sm:p-6">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">Edit Trip</h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{formatDateRange(form.startDate, form.endDate)}</p>
            <div className="mt-5 grid gap-4">
              <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className="rounded-2xl border border-slate-300/60 dark:border-white/10 bg-slate-900/5 dark:bg-white/5 px-4 py-3 text-slate-900 dark:text-white focus:border-teal-500 focus:outline-none transition-all backdrop-blur-sm" />
              <div className="grid gap-4 sm:grid-cols-2">
                <input type="date" value={form.startDate} onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))} className="rounded-2xl border border-slate-300/60 dark:border-white/10 bg-slate-900/5 dark:bg-white/5 px-4 py-3 text-slate-900 dark:text-white focus:border-teal-500 focus:outline-none transition-all backdrop-blur-sm" />
                <input type="date" value={form.endDate} onChange={(e) => setForm((p) => ({ ...p, endDate: e.target.value }))} className="rounded-2xl border border-slate-300/60 dark:border-white/10 bg-slate-900/5 dark:bg-white/5 px-4 py-3 text-slate-900 dark:text-white focus:border-teal-500 focus:outline-none transition-all backdrop-blur-sm" />
              </div>
              <textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows="4" className="rounded-2xl border border-slate-300/60 dark:border-white/10 bg-slate-900/5 dark:bg-white/5 px-4 py-3 text-slate-900 dark:text-white focus:border-teal-500 focus:outline-none transition-all backdrop-blur-sm" />
              <input value={form.coverPhoto} onChange={(e) => setForm((p) => ({ ...p, coverPhoto: e.target.value }))} className="rounded-2xl border border-slate-300/60 dark:border-white/10 bg-slate-900/5 dark:bg-white/5 px-4 py-3 text-slate-900 dark:text-white focus:border-teal-500 focus:outline-none transition-all backdrop-blur-sm" />
            </div>
            <div className="responsive-action-row mt-6 justify-end">
              <button onClick={() => setEditing(null)} className="rounded-full border border-slate-200 px-5 py-2 font-semibold dark:border-slate-700">Cancel</button>
              <button onClick={saveEdit} disabled={saving} className="rounded-full bg-teal-500 px-5 py-2 font-semibold text-white">
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
