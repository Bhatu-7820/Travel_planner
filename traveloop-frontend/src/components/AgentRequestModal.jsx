import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSend, FiX } from 'react-icons/fi';
import api from '@/services/api';
import toast from 'react-hot-toast';
import { getErrorMessage } from '@/utils/helpers';

export default function AgentRequestModal({ isOpen, onClose, tripId }) {
  const [type, setType] = useState('Planning');
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/api/user/requests', { tripId, type, details });
      toast.success('Request sent to agents!');
      onClose();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md rounded-[2rem] bg-white p-8 shadow-2xl dark:bg-slate-900"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black">Choose Agent Help</h2>
          <button onClick={onClose} className="rounded-full bg-slate-100 p-2 dark:bg-slate-800"><FiX /></button>
        </div>
        <p className="mt-2 text-sm text-slate-500">Professional agents will help you optimize your trip itinerary or provide special discounts.</p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Request Type</label>
            <select 
              value={type} 
              onChange={e => setType(e.target.value)}
              className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-teal-500 dark:border-slate-800 dark:bg-slate-950"
            >
              <option>Planning</option>
              <option>Discount</option>
              <option>Support</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Details / Special Requirements</label>
            <textarea 
              value={details}
              onChange={e => setDetails(e.target.value)}
              rows="4"
              placeholder="e.g. I need help finding budget hotels in Paris or I'm traveling for a honeymoon."
              className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-teal-500 dark:border-slate-800 dark:bg-slate-950"
            ></textarea>
          </div>
          <button 
            disabled={loading}
            className="w-full rounded-2xl bg-gradient-to-r from-teal-500 to-blue-500 py-4 font-bold text-white shadow-soft transition hover:-translate-y-0.5"
          >
            {loading ? 'Sending...' : 'Send Request to Agents'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
