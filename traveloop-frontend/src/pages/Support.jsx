import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSend, FiLifeBuoy, FiClock, FiCheckCircle } from 'react-icons/fi';
import api from '@/services/api';
import toast from 'react-hot-toast';
import { getErrorMessage } from '@/utils/helpers';

export default function Support() {
  const [tickets, setTickets] = useState([]);
  const [formData, setFormData] = useState({ subject: '', message: '', priority: 'Medium' });
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      const res = await api.get('/api/support/tickets/me');
      setTickets(res.data);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/api/support/tickets', formData);
      toast.success('Ticket submitted successfully!');
      setFormData({ subject: '', message: '', priority: 'Medium' });
      load();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
        <div className="rounded-[2.5rem] bg-white p-8 shadow-soft dark:bg-slate-900">
          <h2 className="text-3xl font-black">Help & Support</h2>
          <p className="mt-2 text-slate-500">Need help with your trip or have a technical issue? Open a support ticket and our team will get back to you.</p>
          
          <form onSubmit={submit} className="mt-8 space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Subject</label>
              <input 
                value={formData.subject}
                onChange={e => setFormData({...formData, subject: e.target.value})}
                placeholder="e.g. Payment not reflected" 
                className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 outline-none focus:border-teal-500 dark:border-slate-800 dark:bg-slate-950" 
                required 
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Priority</label>
              <select 
                value={formData.priority}
                onChange={e => setFormData({...formData, priority: e.target.value})}
                className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 outline-none focus:border-teal-500 dark:border-slate-800 dark:bg-slate-950"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Urgent</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Message</label>
              <textarea 
                value={formData.message}
                onChange={e => setFormData({...formData, message: e.target.value})}
                rows="5"
                placeholder="Describe your issue in detail..." 
                className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 outline-none focus:border-teal-500 dark:border-slate-800 dark:bg-slate-950" 
                required 
              />
            </div>
            <button 
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 py-4 font-bold text-white shadow-soft transition hover:-translate-y-1 dark:bg-teal-600"
            >
              <FiSend /> {loading ? 'Submitting...' : 'Submit Ticket'}
            </button>
          </form>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
        <h3 className="mb-4 text-xl font-bold">Your Tickets</h3>
        <div className="space-y-4">
          {tickets.length === 0 ? (
            <div className="rounded-3xl border border-dashed p-12 text-center text-slate-500 glass-panel">
              No tickets found.
            </div>
          ) : (
            tickets.map(tk => (
              <div key={tk._id} className="rounded-3xl bg-white p-6 shadow-soft dark:bg-slate-900">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`grid h-10 w-10 place-items-center rounded-full ${tk.status === 'Open' ? 'bg-rose-100 text-rose-600' : tk.status === 'Resolved' ? 'bg-teal-100 text-teal-600' : 'bg-slate-100 text-slate-500'}`}>
                      {tk.status === 'Open' ? <FiLifeBuoy /> : tk.status === 'Resolved' ? <FiCheckCircle /> : <FiClock />}
                    </div>
                    <div>
                      <h4 className="font-bold">{tk.subject}</h4>
                      <p className="text-xs text-slate-400 uppercase tracking-widest font-black">{tk.status}</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400">{new Date(tk.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}
