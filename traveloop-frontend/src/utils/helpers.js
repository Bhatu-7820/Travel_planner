import {
  addDays,
  differenceInCalendarDays,
  eachDayOfInterval,
  format,
  isAfter,
  isBefore,
  parseISO,
} from 'date-fns';

export const cn = (...classes) => classes.filter(Boolean).join(' ');

export const formatDate = (date) => {
  try {
    return format(typeof date === 'string' ? parseISO(date) : date, 'dd MMM yyyy');
  } catch {
    return '';
  }
};

export const formatDateRange = (startDate, endDate) => `${formatDate(startDate)} - ${formatDate(endDate)}`;

export const getInitials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

export const starString = (value = 0) => '★'.repeat(Math.max(1, Math.min(5, Number(value) || 1)));

export const sortTripsByStartDate = (trips = []) =>
  [...trips].sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

export const upcomingTrips = (trips = []) => {
  const today = new Date();
  return sortTripsByStartDate(trips).filter((trip) => !isBefore(parseISO(trip.endDate), today));
};

export const tripDurationDays = (trip) =>
  Math.max(1, differenceInCalendarDays(parseISO(trip.endDate), parseISO(trip.startDate)) + 1);

export const daysInTrip = (trip) =>
  eachDayOfInterval({ start: parseISO(trip.startDate), end: parseISO(trip.endDate) });

export const getTripStopForDay = (trip, day) => {
  const d = typeof day === 'string' ? parseISO(day) : day;
  return (trip.stops || []).find((stop) => {
    const start = parseISO(stop.dateFrom);
    const end = parseISO(stop.dateTo);
    return !isBefore(d, start) && !isAfter(d, end);
  });
};

export const estimateTripBudget = (trip) => {
  const stops = trip.stops || [];
  const days = tripDurationDays(trip);
  const stay = stops.reduce((sum, stop) => {
    const nights = Math.max(1, differenceInCalendarDays(parseISO(stop.dateTo), parseISO(stop.dateFrom)) || 1);
    return sum + nights * 100;
  }, 0);
  const meals = days * 50;
  const transport = Math.max(0, stops.length - 1) * 20 + days * 10;
  const activities = stops.reduce(
    (sum, stop) => sum + (stop.activities || []).reduce((a, activity) => a + Number(activity.cost || 0), 0),
    0
  );
  return {
    stay,
    meals,
    transport,
    activities,
    total: stay + meals + transport + activities,
  };
};

export const getDailyCosts = (trip) => {
  const days = daysInTrip(trip);
  const stopTransitions = new Set((trip.stops || []).slice(1).map((stop) => stop.dateFrom));
  const allActivities = (trip.stops || []).flatMap((stop) =>
    (stop.activities || []).map((activity) => ({
      ...activity,
      stopId: stop.id,
      stopDateFrom: stop.dateFrom,
      stopDateTo: stop.dateTo,
    }))
  );

  return days.map((day) => {
    const stop = getTripStopForDay(trip, day);
    const dayKey = format(day, 'yyyy-MM-dd');
    const activityCost = allActivities
      .filter((activity) => {
        const start = parseISO(activity.stopDateFrom);
        const end = parseISO(activity.stopDateTo);
        return !isBefore(day, start) && !isAfter(day, end);
      })
      .reduce((sum, activity) => sum + Number(activity.cost || 0) / Math.max(1, differenceInCalendarDays(parseISO(activity.stopDateTo), parseISO(activity.stopDateFrom)) + 1), 0);

    return {
      date: dayKey,
      total:
        50 +
        10 +
        (stop ? 100 : 0) +
        (stopTransitions.has(dayKey) ? 20 : 0) +
        activityCost,
    };
  });
};

export const uniqueCitiesFromTrips = (trips = []) => {
  const seen = new Map();
  trips.forEach((trip) => {
    (trip.stops || []).forEach((stop) => {
      const key = `${stop.city || stop.cityName || ''}-${stop.country || ''}`;
      if (key && !seen.has(key)) {
        seen.set(key, { name: stop.city || stop.cityName, country: stop.country, cityId: stop.cityId });
      }
    });
  });
  return Array.from(seen.values());
};

export const groupByCategory = (items = []) =>
  items.reduce((acc, item) => {
    const key = item.category || 'other';
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

export const safeJsonParse = (value, fallback = null) => {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

export const getErrorMessage = (error) =>
  error?.response?.data?.message || error?.message || 'Something went wrong.';

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
