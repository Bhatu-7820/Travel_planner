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
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-black">My Trips</h1>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900">
            <h3 className="text-2xl font-black">Edit Trip</h3>
            <p className="mt-1 text-sm text-slate-500">{formatDateRange(form.startDate, form.endDate)}</p>
            <div className="mt-5 grid gap-4">
              <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-950" />
              <div className="grid gap-4 sm:grid-cols-2">
                <input type="date" value={form.startDate} onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-950" />
                <input type="date" value={form.endDate} onChange={(e) => setForm((p) => ({ ...p, endDate: e.target.value }))} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-950" />
              </div>
              <textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows="4" className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-950" />
              <input value={form.coverPhoto} onChange={(e) => setForm((p) => ({ ...p, coverPhoto: e.target.value }))} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-950" />
            </div>
            <div className="mt-6 flex flex-wrap justify-end gap-3">
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
