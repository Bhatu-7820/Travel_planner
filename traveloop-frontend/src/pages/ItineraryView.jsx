import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { addDays, format, isWithinInterval, parseISO } from 'date-fns';
import { FiCopy, FiShare2, FiPrinter, FiUser } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { fetchTripById, updateTrip } from '@/store/slices/tripSlice';
import { formatDateRange, daysInTrip, getErrorMessage, getTripStopForDay } from '@/utils/helpers';
import PaymentModal from '@/components/PaymentModal';
import PackingList from '@/components/PackingList';

export default function ItineraryView({ readOnly = false }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const trip = useSelector((state) => state.trips.currentTrip);
  const user = useSelector((state) => state.auth.user);
  const [mode, setMode] = useState('day');
  const [loading, setLoading] = useState(true);
  const [payModal, setPayModal] = useState(false);

  const loadTrip = async () => {
    try {
      setLoading(true);
      await dispatch(fetchTripById(id)).unwrap();
    } catch (error) {
      toast.error(getErrorMessage(error));
      navigate('/my-trips');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrip();
  }, [id]);

  const shareTrip = () => {
    const url = `${window.location.origin}/public/${trip._id || trip.id}`;
    navigator.clipboard.writeText(url);
    toast.success('Public share link copied to clipboard!');
  };

  const printPage = () => window.print();

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {loading && <div className="rounded-3xl border border-dashed p-8 text-center text-slate-500">Loading trip view...</div>}
      {trip && (
        <>
          <div className="overflow-hidden rounded-[2rem] border border-white/20 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900">
            <img
              src={trip.coverPhoto}
              alt={trip.name}
              className="h-64 w-full object-cover"
              onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(trip.name)}&background=14b8a6&color=fff&size=800&format=png`; }}
            />
            <div className="p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <h1 className="text-4xl font-black">{trip.name}</h1>
                  <p className="mt-2 text-slate-500">{formatDateRange(trip.startDate, trip.endDate)}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <div className="flex flex-wrap gap-2 print:hidden">
                    <button onClick={async () => {
                      const email = prompt('Enter collaborator email:');
                      if (email) {
                        try {
                          await api.post(`/api/trips/${trip._id || trip.id}/invite`, { email });
                          toast.success('Collaborator invited!');
                        } catch (err) {
                          toast.error(getErrorMessage(err));
                        }
                      }
                    }} className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-5 py-3 font-semibold dark:border-slate-700">
                      <FiUser /> Invite
                    </button>
                    <button onClick={shareTrip} className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-5 py-3 font-semibold dark:border-slate-700">
                      <FiShare2 /> Share
                    </button>
                    <button onClick={printPage} className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-5 py-3 font-semibold dark:border-slate-700">
                      <FiPrinter /> Print
                    </button>
                  </div>
                  {trip && !trip.isPaid && (
                    <button onClick={() => setPayModal(true)} className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 font-semibold text-white shadow-soft dark:bg-teal-600">
                      💳 Pay Now
                    </button>
                  )}
                  {trip?.isPaid && (
                    <span className="inline-flex items-center gap-2 rounded-full bg-teal-100 px-5 py-3 font-bold text-teal-700">
                      ✓ Fully Paid
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {['day', 'city', 'expenses', 'packing'].map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`rounded-full px-5 py-2 text-sm font-bold uppercase tracking-widest transition ${
                      mode === m ? 'bg-teal-500 text-white shadow-soft' : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>

              <div className="mt-6">
                {mode === 'expenses' && (
                  <div className="space-y-6">
                    <div className="grid gap-6 lg:grid-cols-3">
                      <div className="rounded-3xl bg-white p-6 shadow-soft dark:bg-slate-900">
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Total Spent</p>
                        <p className="mt-2 text-3xl font-black">₹{trip.expenses?.reduce((s, e) => s + e.amount, 0) || 0}</p>
                      </div>
                      <div className="rounded-3xl bg-white p-6 shadow-soft dark:bg-slate-900">
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Budget Limit</p>
                        <p className="mt-2 text-3xl font-black">₹{trip.budgetLimit || 0}</p>
                      </div>
                      <div className="rounded-3xl bg-white p-6 shadow-soft dark:bg-slate-900">
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Remaining</p>
                        <p className={`mt-2 text-3xl font-black ${(trip.budgetLimit - (trip.expenses?.reduce((s, e) => s + e.amount, 0) || 0)) < 0 ? 'text-rose-500' : 'text-teal-500'}`}>
                          ₹{trip.budgetLimit - (trip.expenses?.reduce((s, e) => s + e.amount, 0) || 0)}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-[2.5rem] bg-white p-8 shadow-soft dark:bg-slate-900">
                      <h3 className="text-xl font-bold">Log New Expense</h3>
                      <form onSubmit={async (e) => {
                        e.preventDefault();
                        const title = e.target.title.value;
                        const amount = Number(e.target.amount.value);
                        const category = e.target.category.value;
                        if (!title || !amount) return;
                        try {
                          const newExpenses = [...(trip.expenses || []), { title, amount, category, date: new Date() }];
                          await api.put(`/api/trips/${trip._id}`, { expenses: newExpenses });
                          toast.success('Expense logged!');
                          loadTrip();
                          e.target.reset();
                        } catch (err) {
                          toast.error(getErrorMessage(err));
                        }
                      }} className="mt-6 flex flex-wrap gap-4">
                        <input name="title" placeholder="Item/Service" className="flex-1 min-w-[200px] rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-teal-500 dark:border-slate-800 dark:bg-slate-950" required />
                        <input name="amount" type="number" placeholder="Amount" className="w-32 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-teal-500 dark:border-slate-800 dark:bg-slate-950" required />
                        <select name="category" className="w-40 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-teal-500 dark:border-slate-800 dark:bg-slate-950">
                          {['Transport', 'Food', 'Stay', 'Activity', 'Shopping', 'Misc'].map(c => <option key={c}>{c}</option>)}
                        </select>
                        <button type="submit" className="rounded-2xl bg-teal-500 px-8 py-3 font-bold text-white shadow-soft">Add</button>
                      </form>

                      <div className="mt-12 space-y-4">
                        <h4 className="font-bold">Transaction History</h4>
                        {trip.expenses?.length === 0 ? (
                          <p className="text-slate-500 italic">No expenses logged yet.</p>
                        ) : (
                          <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {trip.expenses?.map((ex, i) => (
                              <div key={i} className="flex items-center justify-between py-4">
                                <div>
                                  <p className="font-bold">{ex.title}</p>
                                  <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">{ex.category} · {new Date(ex.date).toLocaleDateString()}</p>
                                </div>
                                <p className="font-black">₹{ex.amount}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                {mode === 'day' && (
                  <div className="grid gap-4">
                    {daysInTrip(trip).map((day) => {
                      const stop = getTripStopForDay(trip, day);
                      return (
                        <div key={format(day, 'yyyy-MM-dd')} className="rounded-3xl border border-slate-100 p-5 dark:border-slate-800 print-break">
                          <h3 className="text-lg font-bold">{format(day, 'EEE, dd MMM yyyy')}</h3>
                          {stop ? (
                            <div className="mt-3">
                              <p className="font-semibold">{stop.city}, {stop.country}</p>
                              <div className="mt-2 flex flex-wrap gap-2">
                                {(stop.activities || []).map((activity) => (
                                  <span key={activity.id} className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-300">{activity.name}</span>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <p className="mt-3 text-sm text-slate-500">No stop planned for this day.</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
                {mode === 'city' && (
                  <div className="grid gap-4">
                    {trip.stops?.map((stop) => (
                      <div key={stop.id} className="rounded-3xl border border-slate-100 p-5 dark:border-slate-800 print-break">
                        <h3 className="text-xl font-bold">{stop.city}, {stop.country}</h3>
                        <p className="mt-1 text-sm text-slate-500">{stop.dateFrom} → {stop.dateTo}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {(stop.activities || []).map((activity) => (
                            <span key={activity.id} className="rounded-full bg-teal-500/10 px-3 py-1 text-xs font-semibold text-teal-700 dark:text-teal-300">{activity.name}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {mode === 'packing' && (
                  <PackingList trip={trip} onUpdate={loadTrip} />
                )}
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-[2rem] bg-amber-50 p-6 border border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/50">
              <h3 className="text-xl font-bold text-amber-800 dark:text-amber-400">Scam Alerts & Safety</h3>
              <p className="mt-1 text-sm text-amber-700 dark:text-amber-500">Travel safe with these community-verified alerts.</p>
              <div className="mt-4 space-y-4">
                <div className="rounded-2xl bg-white p-4 shadow-sm dark:bg-slate-900">
                  <p className="font-bold text-slate-800 dark:text-slate-200">The Friendship Bracelet Scam</p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Common in European capitals. Someone will tie a "free" bracelet on your wrist and then demand money aggressively.</p>
                </div>
                <div className="rounded-2xl bg-white p-4 shadow-sm dark:bg-slate-900">
                  <p className="font-bold text-slate-800 dark:text-slate-200">Fake Taxi Meters</p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Always use official taxi stands or ride-sharing apps like Uber/Grab/Ola. Confirm the fare before starting the ride.</p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] bg-slate-900 p-6 text-white shadow-soft">
              <h3 className="text-xl font-bold">Weather Forecast</h3>
              <p className="mt-1 text-sm text-slate-400">AI-predicted forecast for {trip.stops?.[0]?.city || 'your destination'}.</p>
              <div className="mt-6 flex justify-between px-2">
                {['Today', 'Mon', 'Tue', 'Wed', 'Thu'].map((day, i) => (
                  <div key={day} className="flex flex-col items-center gap-2">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-500">{day}</p>
                    <span className="text-2xl">{i % 2 === 0 ? '☀️' : '⛅'}</span>
                    <p className="text-sm font-black">{24 + i}°</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] bg-white p-6 shadow-soft dark:bg-slate-900 overflow-hidden">
              <h3 className="text-xl font-bold">Trip Map</h3>
              <p className="mt-1 text-sm text-slate-500">Visualize your route across destinations.</p>
              <div className="mt-4 h-64 w-full rounded-2xl bg-slate-100 dark:bg-slate-800">
                <iframe 
                  title="Trip Map"
                  width="100%" 
                  height="100%" 
                  frameBorder="0" 
                  scrolling="no" 
                  marginHeight="0" 
                  marginWidth="0" 
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=-180,-85,180,85&layer=mapnik&marker=${trip.stops?.[0]?.city || ''}`}
                  style={{ border: 0, borderRadius: '1rem' }}
                ></iframe>
              </div>
            </div>
          </div>
        </>
      )}

      {trip && (
        <PaymentModal 
          isOpen={payModal} 
          onClose={() => setPayModal(false)} 
          trip={trip} 
          onSuccess={() => {
            dispatch(updateTrip({ id: trip.id, payload: { isPaid: true } }));
            loadTrip();
          }}
        />
      )}
    </motion.div>
  );
}
