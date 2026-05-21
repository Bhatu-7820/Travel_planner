import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowDown, FiArrowUp, FiPlus, FiTrash2, FiActivity, FiCalendar, FiEye } from 'react-icons/fi';
import toast from 'react-hot-toast';
import CitySearchModal from '@/components/CitySearchModal';
import ActivityPicker from '@/components/ActivityPicker';
import AgentRequestModal from '@/components/AgentRequestModal';
import { fetchTripById } from '@/store/slices/tripSlice';
import { tripService } from '@/services/tripService';
import { formatDateRange, getErrorMessage } from '@/utils/helpers';

export default function ItineraryBuilder() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const trip = useSelector((state) => state.trips.currentTrip);
  const [loading, setLoading] = useState(true);
  const [cityModal, setCityModal] = useState(false);
  const [activityStop, setActivityStop] = useState(null);
  const [agentModal, setAgentModal] = useState(false);

  const loadTrip = async () => {
    try {
      setLoading(true);
      await dispatch(fetchTripById(id)).unwrap();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrip();
  }, [id]);

  const reorder = async (index, direction) => {
    const stops = [...(trip?.stops || [])];
    const target = index + direction;
    if (target < 0 || target >= stops.length) return;
    [stops[index], stops[target]] = [stops[target], stops[index]];
    try {
      await tripService.reorderStops(trip.id, stops.map((stop) => stop.id));
      toast.success('Stop order updated');
      loadTrip();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const deleteStop = async (stop) => {
    if (!window.confirm(`Delete stop ${stop.city}?`)) return;
    try {
      await tripService.deleteStop(trip.id, stop.id);
      toast.success('Stop deleted');
      loadTrip();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {loading && <div className="rounded-3xl border border-dashed p-8 text-center text-slate-500">Loading itinerary...</div>}
      {trip && (
        <>
          <div className="overflow-hidden rounded-[2rem] border border-white/20 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900">
            <div className="grid gap-0 lg:grid-cols-3">
              <img src={trip.coverPhoto} alt={trip.name} className="h-64 w-full object-cover lg:col-span-1 lg:h-full" />
              <div className="p-6 lg:col-span-2">
                <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Itinerary Builder</p>
                <h1 className="mt-2 text-4xl font-black">{trip.name}</h1>
                <p className="mt-3 text-slate-600 dark:text-slate-300">{trip.description}</p>
                <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-2"><FiCalendar /> {formatDateRange(trip.startDate, trip.endDate)}</span>
                  <span className="flex items-center gap-2"><FiActivity /> {trip.stops?.length || 0} stops</span>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Members</label>
                    <input type="number" defaultValue={trip.members || 1} min="1" className="mt-1 w-full bg-transparent text-xl font-bold outline-none" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Vehicle Option</label>
                    <select className="mt-1 w-full bg-transparent text-lg font-bold outline-none dark:bg-slate-900">
                      <option>Car</option><option>Bus</option><option>Train</option><option>Flight</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Hotel Type</label>
                    <select className="mt-1 w-full bg-transparent text-lg font-bold outline-none dark:bg-slate-900">
                      <option>Standard</option><option>Budget</option><option>Premium</option><option>Luxury</option>
                    </select>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <button onClick={() => setCityModal(true)} className="inline-flex items-center gap-2 rounded-full bg-teal-500 px-5 py-3 font-semibold text-white shadow-soft">
                    <FiPlus /> Add Stop
                  </button>
                  <button onClick={() => navigate(`/trip/${trip.id}/view`)} className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-5 py-3 font-semibold dark:border-slate-700">
                    <FiEye /> Review Itinerary
                  </button>
                  <button onClick={() => setAgentModal(true)} className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-3 font-semibold text-white shadow-soft">
                    Choose Agents for Trip (Optional)
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-5">
            {trip.stops?.map((stop, index) => (
              <div key={stop.id} className="rounded-3xl border border-white/20 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-xl font-bold">{stop.city}</h3>
                      <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-300">{stop.country}</span>
                    </div>
                    <p className="mt-1 text-sm text-slate-500">{stop.dateFrom} → {stop.dateTo}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {(stop.activities || []).map((activity) => (
                        <span key={activity.id} className="rounded-full bg-teal-500/10 px-3 py-1 text-xs font-semibold text-teal-700 dark:text-teal-300">
                          {activity.name}
                        </span>
                      ))}
                      {!stop.activities?.length && <span className="text-sm text-slate-500">No activities yet.</span>}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => reorder(index, -1)} className="rounded-full border border-slate-200 p-2 dark:border-slate-700"><FiArrowUp /></button>
                    <button onClick={() => reorder(index, 1)} className="rounded-full border border-slate-200 p-2 dark:border-slate-700"><FiArrowDown /></button>
                    <button onClick={() => setActivityStop(stop)} className="rounded-full bg-blue-500 px-4 py-2 font-semibold text-white">Add Activity</button>
                    <button onClick={() => deleteStop(stop)} className="rounded-full border border-rose-200 px-4 py-2 font-semibold text-rose-600">Delete</button>
                  </div>
                </div>
              </div>
            ))}
            {!trip.stops?.length && (
              <div className="rounded-3xl border border-dashed border-slate-300 p-8 text-center text-slate-500 dark:border-slate-700">
                Add stops to build your itinerary.
              </div>
            )}
          </div>
        </>
      )}

      {trip && (
        <CitySearchModal
          isOpen={cityModal}
          onClose={() => setCityModal(false)}
          trip={trip}
          onAdded={loadTrip}
        />
      )}

      {trip && activityStop && (
        <ActivityPicker
          isOpen={!!activityStop}
          onClose={() => setActivityStop(null)}
          tripId={trip.id}
          stopId={activityStop.id}
          city={activityStop.city}
          onAdded={loadTrip}
        />
      )}

      {trip && (
        <AgentRequestModal
          isOpen={agentModal}
          onClose={() => setAgentModal(false)}
          tripId={trip.id}
        />
      )}
    </motion.div>
  );
}
