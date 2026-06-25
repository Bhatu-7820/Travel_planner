import { motion } from 'framer-motion';
import { memo } from 'react';
import { FiStar, FiCheckCircle, FiMessageCircle } from 'react-icons/fi';

function AgentCard({ agent, onHire }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 14, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      className="mobile-card overflow-hidden border border-white/20 bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-900 sm:p-6"
    >
      <div className="flex items-center gap-3 sm:gap-4">
        <img src={agent.image || `https://ui-avatars.com/api/?name=${agent.name}&background=random`} loading="lazy" decoding="async" className="h-12 w-12 rounded-2xl object-cover sm:h-16 sm:w-16" alt={agent.name} />
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-bold">{agent.name}</h3>
            {agent.isVerified && <FiCheckCircle className="text-teal-500" />}
          </div>
          <p className="text-sm text-slate-500">{agent.specialty || 'General Trip Planner'}</p>
          <div className="mt-1 flex items-center gap-1 text-xs font-bold text-amber-500">
            <FiStar className="fill-current" /> {agent.rating || '4.8'} ({agent.reviewCount || '120'} reviews)
          </div>
        </div>
      </div>
      
      <p className="mt-3 line-clamp-2 text-xs text-slate-600 dark:text-slate-400 sm:mt-4 sm:text-sm">
        {agent.bio || 'Expert in planning luxury and budget-friendly multi-city trips across the globe.'}
      </p>

      <div className="mt-4 flex gap-2 sm:mt-6">
        <button onClick={onHire} className="flex-1 rounded-2xl bg-slate-900 py-2.5 text-xs font-bold text-white shadow-soft transition hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-500 sm:py-3 sm:text-sm">
          Hire Agent
        </button>
        <button className="grid w-11 place-items-center rounded-2xl border border-slate-100 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400 sm:w-12">
          <FiMessageCircle />
        </button>
      </div>
    </motion.div>
  );
}

export default memo(AgentCard);
