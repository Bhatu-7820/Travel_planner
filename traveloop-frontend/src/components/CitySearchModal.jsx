import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { FiSearch, FiX, FiStar } from 'react-icons/fi';
import { cityService } from '@/services/cityService';
import { tripService } from '@/services/tripService';
import { starString, getErrorMessage } from '@/utils/helpers';
import SafeImage from '@/components/SafeImage';
import toast from 'react-hot-toast';

export default function CitySearchModal({ isOpen, onClose, trip, onAdded }) {
  const [query, setQuery] = useState('');
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addingId, setAddingId] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    const handle = setTimeout(async () => {
      try {
        setLoading(true);
        const data = await cityService.getCities(query);
        setCities(data);
      } catch (error) {
        toast.error(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(handle);
  }, [query, isOpen]);

  useEffect(() => {
    if (isOpen) setQuery('');
  }, [isOpen]);

  const addCity = async (city) => {
    try {
      setAddingId(city.id);
      await tripService.addStop(trip.id, {
        cityId: city.id,
        city: city.name,
        country: city.country,
        dateFrom: trip.startDate,
        dateTo: trip.startDate,
      });
      toast.success(`${city.name} added to trip`);
      onAdded?.();
      onClose();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setAddingId(null);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-3 backdrop-blur-sm sm:p-4">
      <div className="responsive-card my-auto max-h-[calc(100dvh-2rem)] w-full max-w-2xl overflow-y-auto border border-white/20 bg-white p-4 shadow-2xl dark:border-slate-800 dark:bg-slate-900 sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-bold">Add a city</h3>
            <p className="text-sm text-slate-500">Search from the mock city database.</p>
          </div>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-800">
            <FiX />
          </button>
        </div>

        <div className="relative">
          <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search city or country..."
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-950"
          />
        </div>

        <div className="mt-4 max-h-[min(60vh,28rem)] space-y-3 overflow-auto pr-1">
          {loading && <p className="text-sm text-slate-500">Searching cities...</p>}
          {!loading && cities.map((city) => (
            <div key={city.id} className="flex flex-col gap-3 rounded-2xl border border-slate-100 p-3 dark:border-slate-800 min-[460px]:flex-row min-[460px]:items-center min-[460px]:gap-4">
              <SafeImage src={city.image} alt={city.name} className="h-36 w-full rounded-2xl object-cover min-[460px]:h-16 min-[460px]:w-20" fallbackText={city.name[0]} />
              <div className="min-w-0 flex-1">
                <h4 className="font-semibold">{city.name}</h4>
                <p className="text-sm text-slate-500">{city.country}</p>
                <div className="mt-1 flex items-center gap-1 text-amber-500">
                  {starString(city.costIndex).split('').map((char, idx) => <FiStar key={idx} />)}
                </div>
              </div>
              <button
                disabled={addingId === city.id}
                onClick={() => addCity(city)}
                className="rounded-full bg-teal-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                {addingId === city.id ? 'Adding...' : 'Add to Trip'}
              </button>
            </div>
          ))}
          {!loading && !cities.length && (
            <p className="text-sm text-slate-500">No cities found.</p>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
