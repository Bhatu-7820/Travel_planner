import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { tripService } from '@/services/tripService';
import { format } from 'date-fns';
import { getErrorMessage } from '@/utils/helpers';

export default function TripNotes() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [notes, setNotes] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', content: '', stopId: '' });

  const load = async () => {
    try {
      const tripData = await tripService.getTripById(id);
      setTrip(tripData);
      const noteData = await tripService.getNotes(id);
      setNotes(noteData);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const openAdd = () => {
    setEditing(null);
    setForm({ title: '', content: '', stopId: '' });
    setOpen(true);
  };

  const openEdit = (note) => {
    setEditing(note);
    setForm({ title: note.title, content: note.content, stopId: note.stopId || '' });
    setOpen(true);
  };

  const save = async () => {
    if (!form.title.trim() || !form.content.trim()) return toast.error('Title and content are required');
    try {
      if (editing) await tripService.updateNote(id, { ...editing, ...form });
      else await tripService.addNote(id, form);
      toast.success(editing ? 'Note updated' : 'Note added');
      setOpen(false);
      load();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const remove = async (note) => {
    if (!window.confirm('Delete this note?')) return;
    try {
      await tripService.deleteNote(id, { id: note.id });
      toast.success('Note deleted');
      load();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-black">Trip Notes</h1>
          <p className="text-sm text-slate-500">Capture reminders and ideas for your itinerary.</p>
        </div>
        <button onClick={openAdd} className="inline-flex items-center gap-2 rounded-full bg-teal-500 px-5 py-3 font-semibold text-white">
          <FiPlus /> Add Note
        </button>
      </div>

      <div className="grid gap-4">
        {notes.map((note) => (
          <div key={note.id} className="rounded-3xl border border-white/20 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <h3 className="text-xl font-bold">{note.title}</h3>
                <p className="mt-1 text-sm text-slate-500">{format(new Date(note.timestamp), 'dd MMM yyyy, p')}</p>
                {note.stopName && <p className="mt-2 text-sm text-blue-600 dark:text-blue-300">Stop: {note.stopName}</p>}
                <p className="mt-3 whitespace-pre-line text-slate-700 dark:text-slate-200">{note.content}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(note)} className="rounded-full border border-slate-200 p-2 dark:border-slate-700"><FiEdit2 /></button>
                <button onClick={() => remove(note)} className="rounded-full border border-rose-200 p-2 text-rose-600 dark:border-rose-900/50 dark:text-rose-300"><FiTrash2 /></button>
              </div>
            </div>
          </div>
        ))}
        {!notes.length && <div className="rounded-3xl border border-dashed p-8 text-center text-slate-500">No notes yet.</div>}
      </div>

      {open && trip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900">
            <h3 className="text-2xl font-black">{editing ? 'Edit note' : 'Add note'}</h3>
            <div className="mt-5 grid gap-4">
              <input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="Title" className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-950" />
              <textarea value={form.content} onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))} rows="5" placeholder="Note content" className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-950" />
              <select value={form.stopId} onChange={(e) => setForm((p) => ({ ...p, stopId: e.target.value }))} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-950">
                <option value="">Optional stop</option>
                {trip.stops?.map((stop) => (
                  <option key={stop.id} value={stop.id}>{stop.city}</option>
                ))}
              </select>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setOpen(false)} className="rounded-full border border-slate-200 px-5 py-2 font-semibold dark:border-slate-700">Cancel</button>
              <button onClick={save} className="rounded-full bg-teal-500 px-5 py-2 font-semibold text-white">Save</button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
