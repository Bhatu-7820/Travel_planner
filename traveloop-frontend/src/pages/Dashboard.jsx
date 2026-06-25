import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiArrowRight, FiMapPin, FiCompass, FiStar, FiSearch, FiGlobe,
  FiCalendar, FiDollarSign, FiTrendingUp
} from 'react-icons/fi';
import { fetchTrips } from '@/store/slices/tripSlice';
import { estimateTripBudget, sortTripsByStartDate, upcomingTrips } from '@/utils/helpers';
import TripCard from '@/components/TripCard';
import AdSection from '@/components/AdSection';
import { WORLD_DESTINATIONS, CONTINENTS } from '@/data/worldDestinations';
import Globe3D from '@/components/Globe3D';

/* ─── Scroll-triggered reveal wrapper ─── */
function Reveal({ children, delay = 0, direction = 'up' }) {
  const variants = {
    up:    { hidden: { opacity: 0, y: 40 },  visible: { opacity: 1, y: 0 } },
    left:  { hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0 } },
    right: { hidden: { opacity: 0, x: 40 },  visible: { opacity: 1, x: 0 } },
    scale: { hidden: { opacity: 0, scale: 0.92 }, visible: { opacity: 1, scale: 1 } },
  };
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      variants={variants[direction] || variants.up}
    >
      {children}
    </motion.div>
  );
}

const VIDEO_LOOPS = [
  'https://assets.mixkit.co/videos/preview/mixkit-beautiful-tropical-beach-and-sea-background-48866-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-beautiful-island-48906-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-traffic-in-a-futuristic-city-at-night-44368-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-underwater-shot-of-a-coral-reef-with-fish-49807-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-scenic-view-of-a-mountain-lake-48908-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-walking-on-a-busy-city-street-44372-large.mp4'
];

/* ─── Destination flip card ─── */
function DestCard({ dest, index, onClick }) {
  const [isHovered, setIsHovered] = useState(false);
  const videoUrl = VIDEO_LOOPS[index % VIDEO_LOOPS.length];

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -6, scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="cursor-pointer flip-card"
    >
      <div className="flip-card-inner">
        {/* Front */}
        <div className="flip-card-front overflow-hidden shadow-soft border border-white/30 dark:border-slate-800 bg-slate-900">
          <img
            src={dest.image}
            alt={dest.name}
            className="h-full w-full object-cover absolute inset-0 transition-opacity duration-300"
            style={{ opacity: isHovered ? 0.15 : 1 }}
            loading="lazy"
            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&fit=crop&q=80'; }}
          />
          {isHovered && (
            <video
              src={videoUrl}
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full object-cover absolute inset-0 opacity-80"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 p-3 pointer-events-none">
            <span className="text-lg mr-1">{dest.tag}</span>
            <h4 className="text-sm font-bold text-white leading-tight">{dest.name}</h4>
            <p className="text-[10px] text-white/70">{dest.country}</p>
          </div>
        </div>
        {/* Back */}
        <div className="flip-card-back overflow-hidden bg-slate-950 shadow-soft border border-slate-700 p-4 flex flex-col justify-between text-white relative">
          {/* Looping video as background of the back card */}
          {isHovered && (
            <video
              src={videoUrl}
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full object-cover absolute inset-0 opacity-25 pointer-events-none"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/85 pointer-events-none" />
          
          <div className="relative z-10">
            <span className="text-lg">{dest.tag}</span>
            <h4 className="font-bold text-sm mt-1">{dest.name}</h4>
            <p className="text-[10px] text-slate-200 mt-0.5 font-medium leading-relaxed">{dest.desc}</p>
          </div>
          
          <div className="relative z-10 space-y-1 text-[10px]">
            <div className="flex justify-between">
              <span className="text-slate-400">Budget/day</span>
              <span className="text-teal-400 font-bold">{dest.cost}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Best season</span>
              <span className="text-slate-200 font-medium">{dest.season}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Safety</span>
              <span className="text-green-400 font-bold">{dest.safety}</span>
            </div>
          </div>
          <span className="relative z-10 mt-2 text-[10px] text-center text-teal-400 font-bold tracking-wider uppercase">Click to plan →</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { trips, status } = useSelector((state) => state.trips);

  /* Destination filtering */
  const [continent, setContinent] = useState('All');
  const [search, setSearch] = useState('');
  const [showAll, setShowAll] = useState(false);

  useEffect(() => { dispatch(fetchTrips()); }, [dispatch]);

  const upTrips = useMemo(() => upcomingTrips(trips).slice(0, 3), [trips]);
  const budgetTotal = useMemo(
    () => upcomingTrips(trips).reduce((sum, trip) => sum + estimateTripBudget(trip).total, 0),
    [trips]
  );

  const filteredDests = useMemo(() => {
    let list = WORLD_DESTINATIONS;
    if (continent !== 'All') list = list.filter(d => d.continent === continent);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(d => d.name.toLowerCase().includes(q) || d.country.toLowerCase().includes(q));
    }
    return list;
  }, [continent, search]);

  const visibleDests = showAll ? filteredDests : filteredDests.slice(0, 18);

  return (
    <div className="safe-container relative space-y-8 sm:space-y-10">
      {/* Ambient background blurs */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-teal-500/[0.04] blur-3xl animate-float-slow" />
        <div className="absolute top-1/3 -right-40 h-[400px] w-[400px] rounded-full bg-indigo-500/[0.04] blur-3xl animate-float-reverse" />
        <div className="absolute bottom-20 left-1/4 h-[350px] w-[350px] rounded-full bg-orange-400/[0.03] blur-3xl animate-float-slow" />
      </div>

      {/* ══════════════════════════════════════════
          HERO BANNER
      ══════════════════════════════════════════ */}
      <Reveal>
        <section className="responsive-card relative overflow-hidden bg-white/40 p-4 text-slate-900 shadow-soft shadow-[0_0_50px_-12px_rgba(99,102,241,0.1)] backdrop-blur-xl border border-white/50 dark:border-white/10 dark:bg-slate-950/40 dark:text-white dark:shadow-[0_0_50px_-12px_rgba(99,102,241,0.25)] sm:p-6">
          <div className="absolute top-0 right-0 p-6 text-[8rem] font-black text-indigo-500/[0.04] dark:text-white/[0.02] select-none pointer-events-none leading-none">T</div>
          
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 dark:bg-white/10 border border-indigo-500/20 dark:border-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-700 dark:text-slate-200 mb-2.5">
                <FiGlobe className="animate-spin-slow text-teal-500 dark:text-teal-400" /> Premium Travel Experience
              </span>
              <h1 className="flex flex-wrap items-center gap-2 text-fluid-wrap text-2xl font-black leading-tight text-slate-900 dark:text-white sm:text-3xl">
                Hello, {user?.name || 'Traveler'}
                <motion.span
                  animate={{ rotate: [0, 20, -10, 20, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1 }}
                  className="inline-block origin-bottom-right"
                >
                  👋
                </motion.span>
              </h1>
              <p className="mt-2 max-w-lg text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
                Your smart companion for multi-city journeys, secure payments, and reliable travel planning.
              </p>
              <div className="responsive-action-row mt-4">
                <motion.button
                  onClick={() => navigate('/create-trip')}
                  whileHover={{ scale: 1.05, y: -2, boxShadow: '0 10px 20px -5px rgba(20,184,166,0.35)' }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 rounded-full bg-teal-500 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-teal-500/25 hover:bg-teal-600 transition-colors"
                >
                  Start Planning <FiArrowRight />
                </motion.button>
                <motion.button
                  onClick={() => document.getElementById('destinations')?.scrollIntoView({ behavior: 'smooth' })}
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  className="rounded-full border border-slate-300/60 dark:border-white/10 bg-slate-900/5 dark:bg-white/5 backdrop-blur-sm px-5 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-900/10 dark:hover:bg-white/15 hover:text-slate-900 dark:hover:text-white transition-all"
                >
                  Explore Destinations
                </motion.button>
              </div>
            </div>
            
            {/* Reduced 3D Globe inside the Welcome card */}
            <div className="mx-auto flex h-[150px] w-full max-w-[180px] shrink-0 items-center justify-center sm:h-[170px] lg:mx-0 lg:w-[170px]">
              <Globe3D />
            </div>
          </div>
        </section>
      </Reveal>

      {/* ══════════════════════════════════════════
          AD CAROUSEL
      ══════════════════════════════════════════ */}
      <Reveal delay={0.08}>
        <AdSection />
      </Reveal>

      {/* ══════════════════════════════════════════
          STATS ROW
      ══════════════════════════════════════════ */}
      <section className="grid gap-4 md:grid-cols-3">
        {[
          { label: 'UPCOMING TRIPS', value: upTrips.length, icon: FiCalendar, gradient: 'from-teal-500 to-cyan-500', glow: 'shadow-teal-500/10' },
          { label: 'BUDGET HIGHLIGHT', value: `₹${budgetTotal.toFixed(0)}`, icon: FiDollarSign, gradient: 'from-blue-500 to-indigo-500', glow: 'shadow-blue-500/10' },
          { label: 'TOTAL TRIPS', value: trips.length, icon: FiTrendingUp, gradient: 'from-orange-400 to-rose-400', glow: 'shadow-orange-400/10' },
        ].map((stat, i) => (
          <Reveal key={stat.label} delay={i * 0.08} direction="scale">
            <div className={`responsive-card group relative overflow-hidden border border-white/50 bg-white/40 p-5 shadow-soft backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-slate-950/40 sm:p-6 ${stat.glow}`}>
              <div className={`absolute -top-8 -right-8 h-24 w-24 rounded-full bg-gradient-to-br ${stat.gradient} opacity-10 group-hover:opacity-20 transition-opacity blur-xl`} />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <stat.icon className="text-slate-400" size={14} />
                  <p className="text-[10px] font-bold tracking-[0.15em] text-slate-500 uppercase">{stat.label}</p>
                </div>
                <p className={`text-3xl font-black bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>{stat.value}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </section>

      {/* ══════════════════════════════════════════
          AI QUICK PLANNER
      ══════════════════════════════════════════ */}
      <Reveal direction="up">
        <section className="responsive-card bg-white/40 p-4 text-slate-900 shadow-[0_0_50px_-12px_rgba(99,102,241,0.1)] backdrop-blur-xl border border-white/50 dark:border-white/10 dark:bg-slate-950/40 dark:text-white dark:shadow-[0_0_50px_-12px_rgba(99,102,241,0.2)] sm:p-6 lg:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-md">
              <div className="flex items-center gap-2 mb-1">
                <FiCompass className="text-teal-500 dark:text-teal-400" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-teal-500 dark:text-teal-400">Trip Planner</span>
              </div>
              <h2 className="text-2xl font-black">Itinerary Planner</h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Just enter a destination and let our automated planners draft a perfect multi-city plan for you.</p>
            </div>
            <div className="flex w-full flex-col gap-2 sm:flex-row lg:max-w-xl">
              <input
                type="text"
                placeholder="Where do you want to go?"
                className="min-w-0 flex-1 rounded-2xl border border-slate-300/60 bg-slate-900/5 px-4 py-3 text-sm text-slate-900 outline-none backdrop-blur-sm transition-all placeholder-slate-500 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder-slate-400 sm:px-6 sm:py-4"
              />
              <motion.button
                onClick={() => navigate('/create-trip')}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="rounded-2xl bg-teal-500 px-6 py-3 font-bold text-white shadow-md shadow-teal-500/25 transition-colors hover:bg-teal-600 sm:px-8 sm:py-4"
              >
                Draft Itinerary
              </motion.button>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ══════════════════════════════════════════
          UPCOMING TRIPS
      ══════════════════════════════════════════ */}
      <section>
        <Reveal>
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <FiCalendar className="text-teal-500" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-teal-500">Your Journeys</span>
              </div>
              <h2 className="text-2xl font-black">Next Trips</h2>
              <p className="text-sm text-slate-500">Sorted by start date.</p>
            </div>
            <motion.button
              onClick={() => navigate('/my-trips')}
              whileHover={{ x: 5 }}
              className="text-sm font-semibold text-teal-500 hover:text-teal-400 flex items-center gap-1"
            >
              View all <FiArrowRight />
            </motion.button>
          </div>
        </Reveal>
        <div className="grid gap-4">
          {status === 'loading' && (
            <div className="rounded-3xl border border-dashed border-slate-300 p-8 text-center text-slate-400 animate-pulse">
              Loading trips…
            </div>
          )}
          {sortTripsByStartDate(upTrips).map((trip, i) => (
            <Reveal key={trip.id} delay={i * 0.12} direction={i % 2 === 0 ? 'left' : 'right'}>
              <TripCard
                trip={trip}
                compact
                onBuilder={() => navigate(`/trip/${trip.id}/builder`)}
                onView={() => navigate(`/trip/${trip.id}/view`)}
              />
            </Reveal>
          ))}
          {!upTrips.length && status !== 'loading' && (
            <Reveal direction="scale">
              <div className="rounded-3xl border border-dashed border-slate-300 dark:border-white/10 bg-white/20 dark:bg-slate-950/20 backdrop-blur-md p-12 text-center text-slate-500 dark:text-slate-400">
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <FiCompass className="mx-auto text-4xl mb-3 text-slate-400" />
                </motion.div>
                No upcoming trips yet. Create your first itinerary.
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          WORLD DESTINATIONS — 57+ cities
      ══════════════════════════════════════════ */}
      <section id="destinations">
        <Reveal direction="up">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-1">
              <FiStar className="text-teal-500" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-teal-500">World Explorer</span>
            </div>
            <h2 className="text-2xl font-black">World Destinations</h2>
            <p className="text-sm text-slate-500">
              {WORLD_DESTINATIONS.length} cities · {CONTINENTS.length} continents · hover to reveal · click to plan
            </p>
          </div>
        </Reveal>

        {/* Filters */}
        <Reveal delay={0.06} direction="up">
          <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-start">
            <div className="relative w-full lg:max-w-xs">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              <input
                value={search}
                onChange={e => { setSearch(e.target.value); setShowAll(false); }}
                placeholder="Search destinations…"
                className="w-full rounded-2xl border border-white/50 dark:border-white/10 bg-white/40 dark:bg-slate-950/40 pl-10 pr-4 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:text-white transition-all backdrop-blur-xl"
              />
            </div>
            <div className="touch-scroll-x -mx-1 flex gap-2 px-1 pb-1 lg:flex-wrap lg:overflow-visible">
              {['All', ...CONTINENTS].map(c => (
                <motion.button
                  key={c}
                  onClick={() => { setContinent(c); setShowAll(false); }}
                  whileHover={{ scale: 1.07, y: -2 }}
                  whileTap={{ scale: 0.94 }}
                  className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                    continent === c
                      ? 'bg-gradient-to-r from-teal-500 to-indigo-600 text-white shadow-md shadow-teal-500/20 border-0'
                      : 'border border-white/50 dark:border-white/10 bg-white/30 dark:bg-slate-950/30 text-slate-600 dark:text-slate-300 hover:border-teal-400 hover:text-teal-500 backdrop-blur-xl'
                  }`}
                >
                  {c}
                </motion.button>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Count */}
        <Reveal delay={0.1}>
          <div className="mb-4 flex items-center gap-2">
            <AnimatePresence mode="wait">
              <motion.span
                key={filteredDests.length}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.25 }}
                className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 px-3 py-1 text-xs font-semibold text-teal-600 dark:text-teal-400"
              >
                <FiMapPin size={11} /> {filteredDests.length} destinations
              </motion.span>
            </AnimatePresence>
            {search && (
              <motion.button
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                onClick={() => setSearch('')}
                className="text-xs text-slate-400 hover:text-red-400 transition-colors"
              >
                ✕ Clear
              </motion.button>
            )}
          </div>
        </Reveal>

        {/* Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={continent + search}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="grid gap-3 min-[420px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 sm:gap-4"
          >
            {visibleDests.map((dest, i) => (
              <Reveal key={dest.id} delay={Math.min(i * 0.025, 0.35)} direction="scale">
                <DestCard dest={dest} index={i} onClick={() => navigate('/create-trip')} />
              </Reveal>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Show more */}
        {filteredDests.length > 18 && (
          <Reveal>
            <div className="mt-8 text-center">
              <motion.button
                whileHover={{ scale: 1.05, y: -3, boxShadow: '0 12px 28px -8px rgba(20,184,166,0.3)' }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowAll(!showAll)}
                className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-8 py-3 text-sm font-bold text-teal-500 hover:bg-teal-500/20 transition-all"
              >
                {showAll ? '↑ Show Less' : `Show all ${filteredDests.length} destinations ↓`}
              </motion.button>
            </div>
          </Reveal>
        )}

        {filteredDests.length === 0 && (
          <Reveal direction="scale">
            <div className="rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 py-16 text-center text-slate-400">
              <FiGlobe className="mx-auto text-4xl mb-3" />
              No destinations found. Try another search.
            </div>
          </Reveal>
        )}
      </section>

    </div>
  );
}
