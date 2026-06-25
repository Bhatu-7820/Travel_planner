import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCopy, FiShare2 } from 'react-icons/fi';
import { FaFacebookF, FaXTwitter } from 'react-icons/fa6';
import toast from 'react-hot-toast';
import api from '@/services/api';
import { tripService } from '@/services/tripService';
import { formatDateRange, daysInTrip, getTripStopForDay, getErrorMessage } from '@/utils/helpers';
import { format } from 'date-fns';

export default function PublicItinerary() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const isLoggedIn = !!localStorage.getItem('traveloop_token');

  const loadTrip = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/api/public/trips/${tripId}`);
      setTrip(data);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrip();
  }, [tripId]);

  const copyTrip = async () => {
    try {
      const copied = await tripService.copyTrip(tripId);
      toast.success('Trip copied');
      navigate(`/trip/${copied.id}/builder`);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const share = (network) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Check out this trip on Traveloop`);
    const shareUrl =
      network === 'twitter'
        ? `https://twitter.com/intent/tweet?url=${url}&text=${text}`
        : `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {loading && <div className="rounded-3xl border border-dashed p-8 text-center text-slate-500">Loading public itinerary...</div>}
      {trip && (
        <div className="overflow-hidden rounded-[2rem] border border-white/20 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <img
            src={trip.coverPhoto}
            alt={trip.name}
            loading="lazy"
            decoding="async"
            className="h-72 w-full object-cover"
            onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(trip.name)}&background=14b8a6&color=fff&size=800&format=png`; }}
          />
          <div className="p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Public itinerary</p>
                <h1 className="mt-2 text-4xl font-black">{trip.name}</h1>
                <p className="mt-2 text-slate-500">{formatDateRange(trip.startDate, trip.endDate)}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                {isLoggedIn && (
                  <button onClick={copyTrip} className="inline-flex items-center gap-2 rounded-full bg-teal-500 px-5 py-3 font-semibold text-white">
                    <FiCopy /> Copy Trip
                  </button>
                )}
                <button onClick={() => share('twitter')} className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-5 py-3 font-semibold dark:border-slate-700">
                  <FaXTwitter /> Twitter
                </button>
                <button onClick={() => share('facebook')} className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-5 py-3 font-semibold dark:border-slate-700">
                  <FaFacebookF /> Facebook
                </button>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {daysInTrip(trip).map((day) => {
                const stop = getTripStopForDay(trip, day);
                return (
                  <div key={format(day, 'yyyy-MM-dd')} className="rounded-3xl border border-slate-100 p-5 dark:border-slate-800">
                    <h3 className="font-bold">{format(day, 'EEE, dd MMM yyyy')}</h3>
                    {stop ? (
                      <div className="mt-2">
                        <p className="font-semibold">{stop.city}, {stop.country}</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {(stop.activities || []).map((activity) => (
                            <span key={activity.id} className="rounded-full bg-teal-500/10 px-3 py-1 text-xs font-semibold text-teal-700 dark:text-teal-300">{activity.name}</span>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="mt-2 text-sm text-slate-500">No stop planned.</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
