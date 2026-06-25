import { FiCalendar, FiMapPin, FiEdit2, FiTrash2, FiEye, FiChevronRight } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { formatDateRange } from '@/utils/helpers';

export default function TripCard({ trip, onEdit, onDelete, onView, onBuilder, compact = false }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      whileTap={{ scale: 0.99 }}
      className="mobile-card group overflow-hidden border border-white/50 bg-white/45 shadow-soft backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-teal-500/30 hover:shadow-xl dark:border-white/10 dark:bg-slate-950/45"
    >
      <div className="grid gap-0 md:grid-cols-3">
        <div className="relative min-h-32 overflow-hidden sm:min-h-48 md:col-span-1">
          <img
            src={trip.coverPhoto}
            alt={trip.name}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent" />
        </div>
        <div className="mobile-card-body flex flex-col justify-between md:col-span-2">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-teal-500/10 px-2.5 py-1 text-[11px] font-semibold text-teal-700 dark:text-teal-300 sm:px-3 sm:text-xs">
                {trip.stops?.length || 0} stops
              </span>
              <span className="rounded-full bg-blue-500/10 px-2.5 py-1 text-[11px] font-semibold text-blue-700 dark:text-blue-300 sm:px-3 sm:text-xs">
                {compact ? 'Trip' : 'Upcoming'}
              </span>
            </div>
            <h3 className="mt-2 text-fluid-wrap text-lg font-bold leading-tight sm:mt-3 sm:text-xl">{trip.name}</h3>
            <p className="mt-1.5 line-clamp-2 text-xs text-slate-600 dark:text-slate-300 sm:mt-2 sm:text-sm">{trip.description || 'No description yet.'}</p>
            <div className="mt-3 flex flex-col gap-1.5 text-xs text-slate-500 dark:text-slate-400 sm:mt-4 sm:flex-row sm:flex-wrap sm:gap-4 sm:text-sm">
              <span className="flex min-w-0 items-center gap-2"><FiCalendar className="shrink-0" /> <span className="truncate">{formatDateRange(trip.startDate, trip.endDate)}</span></span>
              <span className="flex min-w-0 items-center gap-2"><FiMapPin className="shrink-0" /> <span className="truncate">{(trip.stops || []).map((s) => s.city).slice(0, 2).join(', ') || 'No stops yet'}</span></span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 sm:mt-5 sm:flex sm:flex-wrap">
            {onBuilder && (
              <button onClick={() => onBuilder(trip)} className="inline-flex items-center justify-center gap-2 rounded-full bg-teal-500 px-3 py-2 text-xs font-semibold text-white shadow-soft transition hover:-translate-y-0.5 sm:px-4 sm:text-sm">
                Builder <FiChevronRight />
              </button>
            )}
            {onView && (
              <button onClick={() => onView(trip)} className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300/60 bg-slate-900/5 px-3 py-2 text-xs font-semibold text-slate-700 transition-all hover:bg-slate-900/10 hover:text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/15 dark:hover:text-white sm:px-4 sm:text-sm">
                View <FiEye />
              </button>
            )}
            {onEdit && (
              <button onClick={() => onEdit(trip)} className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300/60 bg-slate-900/5 px-3 py-2 text-xs font-semibold text-slate-700 transition-all hover:bg-slate-900/10 hover:text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/15 dark:hover:text-white sm:px-4 sm:text-sm">
                Edit <FiEdit2 />
              </button>
            )}
            {onDelete && (
              <button onClick={() => onDelete(trip)} className="inline-flex items-center justify-center gap-2 rounded-full border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-600 transition-all hover:bg-rose-50 dark:border-rose-900/50 dark:text-rose-300 dark:hover:bg-rose-950/60 sm:px-4 sm:text-sm">
                Delete <FiTrash2 />
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}
