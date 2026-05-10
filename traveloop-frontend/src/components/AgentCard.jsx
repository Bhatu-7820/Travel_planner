import { motion } from 'framer-motion';
import { FiStar, FiCheckCircle, FiMessageCircle } from 'react-icons/fi';

export default function AgentCard({ agent, onHire }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="overflow-hidden rounded-[2.5rem] border border-white/20 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="flex items-center gap-4">
        <img src={agent.image || `https://ui-avatars.com/api/?name=${agent.name}&background=random`} className="h-16 w-16 rounded-2xl object-cover" alt={agent.name} />
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold">{agent.name}</h3>
            {agent.isVerified && <FiCheckCircle className="text-teal-500" />}
          </div>
          <p className="text-sm text-slate-500">{agent.specialty || 'General Trip Planner'}</p>
          <div className="mt-1 flex items-center gap-1 text-xs font-bold text-amber-500">
            <FiStar className="fill-current" /> {agent.rating || '4.8'} ({agent.reviewCount || '120'} reviews)
          </div>
        </div>
      </div>
      
      <p className="mt-4 text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
        {agent.bio || 'Expert in planning luxury and budget-friendly multi-city trips across the globe.'}
      </p>

      <div className="mt-6 flex gap-2">
        <button onClick={onHire} className="flex-1 rounded-2xl bg-slate-900 py-3 text-sm font-bold text-white shadow-soft transition hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-500">
          Hire Agent
        </button>
        <button className="grid w-12 place-items-center rounded-2xl border border-slate-100 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
          <FiMessageCircle />
        </button>
      </div>
    </motion.div>
  );
}
