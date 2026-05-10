import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiFilter, FiUserCheck } from 'react-icons/fi';
import AgentCard from '@/components/AgentCard';
import AgentRequestModal from '@/components/AgentRequestModal';
import api from '@/services/api';
import toast from 'react-hot-toast';

export default function AgentMarketplace() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Demo agents for enterprise feel if DB is empty
  const demoAgents = [
    { _id: '1', name: 'Sophia Chen', specialty: 'Luxury Europe Tours', rating: 4.9, reviewCount: 215, isVerified: true },
    { _id: '2', name: 'Marcus Miller', specialty: 'Budget Backpacking', rating: 4.7, reviewCount: 89, isVerified: true },
    { _id: '3', name: 'Elena Rodriguez', specialty: 'Family Roadtrips', rating: 4.8, reviewCount: 156, isVerified: false },
    { _id: '4', name: 'David Kim', specialty: 'Solo Adventure', rating: 4.6, reviewCount: 42, isVerified: true },
  ];

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/api/admin/agents'); // Or dedicated agent route
        setAgents(res.data.length ? res.data : demoAgents);
      } catch (error) {
        setAgents(demoAgents);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[3rem] bg-slate-900 p-12 text-white shadow-soft">
        <div className="absolute right-0 top-0 h-full w-1/2 opacity-20">
          <div className="h-full w-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-teal-500 to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-teal-500/20 px-4 py-1 text-sm font-bold text-teal-400">
            <FiUserCheck /> VERIFIED TRIP AGENTS
          </div>
          <h1 className="text-4xl font-black sm:text-6xl">Hire a Professional <span className="bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">Trip Agent</span></h1>
          <p className="mt-4 text-lg text-slate-400">Get a custom itinerary, local secrets, and special group discounts by hiring one of our top-rated planning experts.</p>
        </div>
      </section>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Search by name or specialty..." className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-12 pr-4 outline-none focus:border-teal-500 dark:border-slate-800 dark:bg-slate-900" />
        </div>
        <button className="flex items-center gap-2 rounded-2xl bg-white px-6 py-4 font-bold shadow-soft dark:bg-slate-900">
          <FiFilter /> Filters
        </button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {agents.map(agent => (
          <AgentCard key={agent._id} agent={agent} onHire={() => setIsModalOpen(true)} />
        ))}
      </div>

      <AgentRequestModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
