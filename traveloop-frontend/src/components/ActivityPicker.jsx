import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { FiX, FiPlus } from 'react-icons/fi';
import { activityService } from '@/services/activityService';
import { tripService } from '@/services/tripService';
import { aiService } from '@/services/aiService';
import { getErrorMessage } from '@/utils/helpers';
import toast from 'react-hot-toast';

const types = ['All', 'Sightseeing', 'Culture', 'Food', 'Relaxation', 'Adventure', 'Transport', 'Nightlife'];

export default function ActivityPicker({ isOpen, onClose, tripId, stopId, city, onAdded }) {
  const [activities, setActivities] = useState([]);
  const [type, setType] = useState('All');
  const [maxCost, setMaxCost] = useState(5000);
  const [custom, setCustom] = useState({ name: '', cost: '' });
  const [loading, setLoading] = useState(false);
  const [generatingAI, setGeneratingAI] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const load = async () => {
      try {
        setLoading(true);
        const data = await activityService.getActivities({
          city,
          ...(type !== 'All' ? { type } : {}),
          ...(maxCost < 10000 ? { maxCost } : {}),
        });
        setActivities(data);
      } catch (error) {
        toast.error(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [isOpen, type, maxCost, city]);

  if (!isOpen) return null;

  const addActivity = async (activity) => {
    try {
      await tripService.addActivityToStop(tripId, stopId, {
        name: activity.name,
        cost: activity.cost || 0,
        type: activity.type || 'Sightseeing',
        duration: activity.duration || '2h',
        description: activity.description || ''
      });
      toast.success('Activity added');
      onAdded?.();
      onClose();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const addCustomActivity = async () => {
    if (!custom.name.trim()) return toast.error('Activity name is required');
    try {
      await tripService.addActivityToStop(tripId, stopId, {
        name: custom.name.trim(),
        cost: Number(custom.cost || 0),
        type: 'Custom',
        duration: '1h',
        description: 'Custom activity added by user',
      });
      toast.success('Custom activity added');
      onAdded?.();
      onClose();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const generateAIActivities = async () => {
    try {
      setGeneratingAI(true);
      const targetCity = city || prompt("Which city are you looking for activities in?");
      if (!targetCity) return;
      
      const data = await aiService.generateActivities({ city: targetCity, duration: '2 days' });
      
      const aiActivities = data.map(a => ({ ...a, id: `ai_${Math.random()}` }));
      setActivities(prev => [...aiActivities, ...prev]);
      toast.success('AI generated new ideas!');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setGeneratingAI(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 backdrop-blur-sm">
      <div className="w-full max-w-3xl rounded-3xl border border-white/20 bg-white p-5 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold">Add activities</h3>
            <p className="text-sm text-slate-500">Filter and add activities to this stop.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={generateAIActivities} disabled={generatingAI} className="rounded-full bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-purple-500/30 transition hover:bg-purple-700">
              {generatingAI ? 'Thinking...' : '✨ Ask AI'}
            </button>
            <button onClick={onClose} className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-800">
              <FiX />
            </button>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <select value={type} onChange={(e) => setType(e.target.value)} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-950">
            {types.map((t) => <option key={t}>{t}</option>)}
          </select>
          <label className="md:col-span-2">
            <div className="mb-1 flex items-center justify-between text-sm text-slate-500">
              <span>Maximum cost</span>
              <span>{maxCost >= 10000 ? 'Any budget' : `₹${maxCost}`}</span>
            </div>
            <input type="range" min="0" max="10000" step="500" value={maxCost} onChange={(e) => setMaxCost(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-teal-500" />
          </label>
        </div>

        <div className="mt-4 max-h-[45vh] space-y-3 overflow-auto pr-1">
          {loading && <p className="text-sm text-slate-500">Loading activities...</p>}
          {activities.map((activity) => (
            <div key={activity.id} className="rounded-2xl border border-slate-100 p-4 dark:border-slate-800">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-semibold">{activity.name}</h4>
                    <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-xs font-semibold text-blue-600 dark:text-blue-300">{activity.type}</span>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">{activity.description}</p>
                  <p className="mt-1 text-sm text-slate-500">{activity.duration} · ₹{activity.cost}</p>
                </div>
                <button onClick={() => addActivity(activity)} className="inline-flex items-center gap-2 rounded-full bg-teal-500 px-4 py-2 text-sm font-semibold text-white">
                  <FiPlus /> Add
                </button>
              </div>
            </div>
          ))}
          {!loading && !activities.length && <p className="text-sm text-slate-500">No activities found.</p>}
        </div>

        <div className="mt-5 rounded-3xl border border-dashed border-slate-300 p-4 dark:border-slate-700">
          <h4 className="font-semibold">Add custom activity</h4>
          <div className="mt-3 grid gap-3 md:grid-cols-[1fr_140px_auto]">
            <input
              value={custom.name}
              onChange={(e) => setCustom((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Activity name"
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
            />
            <input
              type="number"
              min="0"
              value={custom.cost}
              onChange={(e) => setCustom((prev) => ({ ...prev, cost: e.target.value }))}
              placeholder="Cost"
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
            />
            <button onClick={addCustomActivity} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-500 px-4 py-3 font-semibold text-white">
              <FiPlus /> Add
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
