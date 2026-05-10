import { useState } from 'react';
import { FiPlus, FiTrash2, FiCheckSquare, FiSquare } from 'react-icons/fi';
import api from '@/services/api';
import toast from 'react-hot-toast';

export default function PackingList({ trip, onUpdate }) {
  const [newItem, setNewItem] = useState('');

  const items = trip.packing || [];

  const toggleItem = async (index) => {
    const newList = [...items];
    newList[index].packed = !newList[index].packed;
    try {
      await api.put(`/api/trips/${trip._id || trip.id}/packing`, newList);
      onUpdate();
    } catch (err) {
      toast.error('Failed to update packing list');
    }
  };

  const addItem = async (e) => {
    e.preventDefault();
    if (!newItem.trim()) return;
    const newList = [...items, { item: newItem, packed: false }];
    try {
      await api.put(`/api/trips/${trip._id || trip.id}/packing`, newList);
      setNewItem('');
      onUpdate();
    } catch (err) {
      toast.error('Failed to add item');
    }
  };

  const removeItem = async (index) => {
    const newList = items.filter((_, i) => i !== index);
    try {
      await api.put(`/api/trips/${trip._id || trip.id}/packing`, newList);
      onUpdate();
    } catch (err) {
      toast.error('Failed to remove item');
    }
  };

  return (
    <div className="rounded-[2.5rem] bg-white p-8 shadow-soft dark:bg-slate-900">
      <h3 className="text-2xl font-black">Packing Checklist</h3>
      <p className="mt-1 text-slate-500">Stay organized and never forget your essentials.</p>

      <form onSubmit={addItem} className="mt-6 flex gap-2">
        <input 
          value={newItem}
          onChange={e => setNewItem(e.target.value)}
          placeholder="Add item (e.g. Passport, Charger)" 
          className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 outline-none focus:border-teal-500 dark:border-slate-800 dark:bg-slate-950" 
        />
        <button type="submit" className="grid h-12 w-12 place-items-center rounded-2xl bg-teal-500 text-white shadow-soft">
          <FiPlus />
        </button>
      </form>

      <div className="mt-8 space-y-2">
        {items.length === 0 ? (
          <p className="py-8 text-center text-slate-400 italic">Your packing list is empty.</p>
        ) : (
          items.map((it, i) => (
            <div key={i} className="group flex items-center justify-between rounded-2xl border border-slate-50 p-4 transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50">
              <div onClick={() => toggleItem(i)} className="flex cursor-pointer items-center gap-3">
                {it.packed ? <FiCheckSquare className="text-teal-500" /> : <FiSquare className="text-slate-300" />}
                <span className={it.packed ? 'text-slate-400 line-through' : 'font-medium'}>{it.item}</span>
              </div>
              <button onClick={() => removeItem(i)} className="opacity-0 transition group-hover:opacity-100 text-rose-500">
                <FiTrash2 />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
