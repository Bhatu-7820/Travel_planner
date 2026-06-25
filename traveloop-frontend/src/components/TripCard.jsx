import { FiCalendar, FiMapPin, FiEdit2, FiTrash2, FiEye, FiChevronRight } from 'react-icons/fi';
import { formatDateRange } from '@/utils/helpers';

export default function TripCard({ trip, onEdit, onDelete, onView, onBuilder, compact = false }) {
  return (
    <article className="group overflow-hidden rounded-[2rem] border border-white/50 dark:border-white/10 bg-white/40 dark:bg-slate-950/40 shadow-soft backdrop-blur-xl hover:-translate-y-1 hover:shadow-xl hover:border-teal-500/30 transition-all duration-300">
      <div className="grid gap-0 md:grid-cols-3">
        <div className="relative min-h-48 md:col-span-1 overflow-hidden">
          <img
            src={trip.coverPhoto}
            alt={trip.name}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent" />
        </div>
        <div className="flex flex-col justify-between p-5 md:col-span-2">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-teal-500/10 px-3 py-1 text-xs font-semibold text-teal-700 dark:text-teal-300">
                {trip.stops?.length || 0} stops
              </span>
              <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-700 dark:text-blue-300">
                {compact ? 'Trip' : 'Upcoming'}
              </span>
            </div>
            <h3 className="mt-3 text-xl font-bold">{trip.name}</h3>
            <p className="mt-2 line-clamp-2 text-sm text-slate-600 dark:text-slate-300">{trip.description || 'No description yet.'}</p>
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-2"><FiCalendar /> {formatDateRange(trip.startDate, trip.endDate)}</span>
              <span className="flex items-center gap-2"><FiMapPin /> {(trip.stops || []).map((s) => s.city).slice(0, 2).join(', ') || 'No stops yet'}</span>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {onBuilder && (
              <button onClick={() => onBuilder(trip)} className="inline-flex items-center gap-2 rounded-full bg-teal-500 px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5">
                Builder <FiChevronRight />
              </button>
            )}
            {onView && (
              <button onClick={() => onView(trip)} className="inline-flex items-center gap-2 rounded-full border border-slate-300/60 dark:border-white/10 bg-slate-900/5 dark:bg-white/5 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-900/10 dark:hover:bg-white/15 hover:text-slate-900 dark:hover:text-white transition-all">
                View <FiEye />
              </button>
            )}
            {onEdit && (
              <button onClick={() => onEdit(trip)} className="inline-flex items-center gap-2 rounded-full border border-slate-300/60 dark:border-white/10 bg-slate-900/5 dark:bg-white/5 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-900/10 dark:hover:bg-white/15 hover:text-slate-900 dark:hover:text-white transition-all">
                Edit <FiEdit2 />
              </button>
            )}
            {onDelete && (
              <button onClick={() => onDelete(trip)} className="inline-flex items-center gap-2 rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 dark:border-rose-900/50 dark:text-rose-300 dark:hover:bg-rose-950/60 transition-all">
                Delete <FiTrash2 />
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
