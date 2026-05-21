import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchTrips } from '@/store/slices/tripSlice';
import { cityService } from '@/services/cityService';
import { estimateTripBudget, getErrorMessage, sortTripsByStartDate, upcomingTrips } from '@/utils/helpers';
import TripCard from '@/components/TripCard';
import AdSection from '@/components/AdSection';
import SafeImage from '@/components/SafeImage';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { trips, status } = useSelector((state) => state.trips);
  const [cities, setCities] = useState([]);
  const [loadingCities, setLoadingCities] = useState(false);

  useEffect(() => {
    dispatch(fetchTrips());
  }, [dispatch]);

  useEffect(() => {
    const loadCities = async () => {
      try {
        setLoadingCities(true);
        const data = await cityService.getCities();
        setCities(data.slice(0, 15));
      } catch (error) {
        toast.error(getErrorMessage(error));
      } finally {
        setLoadingCities(false);
      }
    };
    loadCities();
  }, []);

  const upTrips = useMemo(() => upcomingTrips(trips).slice(0, 3), [trips]);
  const budgetTotal = useMemo(
    () => upcomingTrips(trips).reduce((sum, trip) => sum + estimateTripBudget(trip).total, 0),
    [trips]
  );

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <section className="rounded-[2rem] bg-gradient-to-br from-teal-500 via-blue-500 to-orange-400 p-8 text-white shadow-soft relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-20 text-9xl font-black select-none pointer-events-none">TRAVELOOP</div>
        <div className="max-w-3xl relative z-10">
          <p className="text-sm uppercase tracking-[0.3em] text-white/80">Premium Travel Experience</p>
          <h1 className="mt-2 text-4xl font-black sm:text-6xl">Hello, {user?.name || 'Traveler'} 👋</h1>
          <p className="mt-3 max-w-2xl text-white/90 text-lg">
            Your intelligent assistant for multi-city journeys, secure payments, and AI-driven safety.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <button
              onClick={() => navigate('/create-trip')}
              className="rounded-full bg-white px-8 py-4 font-bold text-slate-900 shadow-xl transition hover:-translate-y-1 hover:shadow-2xl"
            >
              Start Planning
            </button>
            <button
              onClick={() => document.getElementById('quick-planner').scrollIntoView({ behavior: 'smooth' })}
              className="rounded-full bg-white/20 backdrop-blur px-8 py-4 font-bold text-white transition hover:bg-white/30"
            >
              Quick Planner
            </button>
          </div>
        </div>
      </section>

      <AdSection />

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl p-5 glass-panel relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <p className="text-sm font-semibold tracking-wide text-slate-500 relative z-10">UPCOMING TRIPS</p>
          <p className="mt-2 text-4xl font-black bg-gradient-to-r from-teal-500 to-blue-500 bg-clip-text text-transparent relative z-10">{upTrips.length}</p>
        </div>
        <div className="rounded-3xl p-5 glass-panel relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <p className="text-sm font-semibold tracking-wide text-slate-500 relative z-10">BUDGET HIGHLIGHT</p>
          <p className="mt-2 text-4xl font-black bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent relative z-10">₹{budgetTotal.toFixed(0)}</p>
        </div>
        <div className="rounded-3xl p-5 glass-panel relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <p className="text-sm font-semibold tracking-wide text-slate-500 relative z-10">TOTAL TRIPS</p>
          <p className="mt-2 text-4xl font-black bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent relative z-10">{trips.length}</p>
        </div>
      </section>

      <section id="quick-planner" className="rounded-[2.5rem] bg-white p-8 shadow-soft dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-md">
            <h2 className="text-3xl font-black">AI Trip Planner</h2>
            <p className="mt-2 text-slate-500">Just enter a destination and let our AI agents draft a perfect multi-city plan for you.</p>
          </div>
          <div className="flex flex-1 gap-2 max-w-xl">
            <input type="text" placeholder="Where do you want to go?" className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-6 py-4 outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-950" />
            <button onClick={() => navigate('/create-trip')} className="rounded-2xl bg-slate-900 px-8 py-4 font-bold text-white dark:bg-teal-500">Draft Itinerary</button>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-black">Next trips</h2>
            <p className="text-sm text-slate-500">Sorted by start date.</p>
          </div>
        </div>
        <div className="grid gap-5">
          {status === 'loading' && <div className="rounded-3xl border border-dashed p-8 text-center text-slate-500 glass-panel">Loading trips...</div>}
          {sortTripsByStartDate(upTrips).map((trip) => (
            <TripCard
              key={trip.id}
              trip={trip}
              compact
              onBuilder={() => navigate(`/trip/${trip.id}/builder`)}
              onView={() => navigate(`/trip/${trip.id}/view`)}
            />
          ))}
          {!upTrips.length && status !== 'loading' && (
            <div className="rounded-3xl border border-dashed border-slate-300 p-8 text-center text-slate-500 dark:border-slate-700 glass-panel">
              No upcoming trips yet. Create your first itinerary.
            </div>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-black">Popular destinations</h2>
        <p className="text-sm text-slate-500">Explore top cities around the world.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {(loadingCities ? Array.from({ length: 10 }) : cities).map((city, index) =>
            loadingCities ? (
              <div key={index} className="h-64 animate-pulse rounded-3xl bg-slate-200 dark:bg-slate-800" />
            ) : (
              <div key={city.id} className="overflow-hidden rounded-3xl border border-white/20 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900">
                <SafeImage
                  src={city.image}
                  alt={city.name}
                  className="h-40 w-full object-cover"
                  fallbackText={city.name}
                />
                <div className="p-4">
                  <h3 className="font-bold">{city.name}</h3>
                  <p className="text-sm text-slate-500">{city.country}</p>
                </div>
              </div>
            )
          )}
        </div>
      </section>
    </motion.div>
  );
}
