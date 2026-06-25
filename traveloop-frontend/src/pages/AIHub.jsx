import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiTrendingUp, FiMap, FiDollarSign, FiCompass, FiBriefcase, FiNavigation, FiCheckSquare,
  FiActivity, FiCalendar, FiClock, FiPlus, FiArrowRight, FiPercent, FiInfo, FiLayers
} from 'react-icons/fi';
import { 
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, AreaChart, Area 
} from 'recharts';
import toast from 'react-hot-toast';

import { 
  generateItinerary, generateBudget, recommendDestinations, recommendHotels, 
  generatePackingList, optimizeTrip, fetchAIAnalytics, clearItinerary, clearBudget, 
  clearRecommendations, clearPackingList, clearOptimization
} from '@/store/slices/aiSlice';
import { fetchTrips } from '@/store/slices/tripSlice';
import { tripService } from '@/services/tripService';
import { getErrorMessage } from '@/utils/helpers';
import Skeleton from '@/components/Skeleton';
import { WORLD_DESTINATIONS } from '@/data/worldDestinations';

const getDestinationImage = (name) => {
  if (!name) return 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=500&h=350&fit=crop&q=80';
  const query = name.split(',')[0].trim().toLowerCase();
  const found = WORLD_DESTINATIONS.find(d => d.name.toLowerCase() === query);
  if (found) return found.image;
  
  const hash = query.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const fallbackIds = [
    '1507525428034-b723cf961d3e', // Beach
    '1469854523086-cc02fe5d8800', // Road trip
    '1476514525535-07fb3b4ae5f1', // Boat
    '1506744038136-46273834b3fb', // Valley
    '1533105079780-92b9be482077', // Santorini-like
    '1472214222555-d40058580337'  // Nature
  ];
  return `https://images.unsplash.com/photo-${fallbackIds[hash % fallbackIds.length]}?w=500&h=350&fit=crop&auto=format&q=80`;
};

const getHotelImage = (index) => {
  const hotelIds = [
    '1566073771259-6a8506099945', // Luxury room
    '1520250497591-112f2f40a3f4', // Resort pool
    '1584132967334-10e028bd69f7', // Bed/window
    '1540555700478-4be289fbecef', // Resort lounge
    '1571896349842-33c89424de2d'  // Poolside
  ];
  return `https://images.unsplash.com/photo-${hotelIds[index % hotelIds.length]}?w=500&h=350&fit=crop&auto=format&q=80`;
};

const COLORS = ['#0d9488', '#2563eb', '#4f46e5', '#db2777', '#f59e0b', '#dc2626'];

export default function AIHub() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux State
  const { trips } = useSelector((state) => state.trips);
  const { 
    generatedItinerary, generatedBudget, recommendedDestinations, recommendedHotels, 
    generatedPackingList, optimizedRoute, analytics,
    itineraryStatus, budgetStatus, destinationStatus, hotelStatus, packingStatus, optimizeStatus, analyticsStatus
  } = useSelector((state) => state.ai);

  // Active Tab State
  const [activeTab, setActiveTab] = useState('analytics');

  // Input states for forms
  // 1. Itinerary
  const [itineraryForm, setItineraryForm] = useState({
    destination: '', budget: 20000, days: 3, interests: [], travelStyle: 'Standard', groupType: 'Solo'
  });
  
  // 2. Budget
  const [budgetForm, setBudgetForm] = useState({
    destination: '', days: 5, budgetType: 'Standard'
  });

  // 3. Destination recommendation
  const [destForm, setDestForm] = useState({
    budget: 50000, weather: 'Warm', adventureLevel: 'Moderate', groupType: 'Solo', season: 'Summer', interests: []
  });

  // 4. Hotels
  const [hotelForm, setHotelForm] = useState({
    destination: '', budget: 'Standard', preferences: 'Wi-Fi, swimming pool', nearbyAttractions: 'city center'
  });

  // 5. Packing list
  const [packingForm, setPackingForm] = useState({
    destination: '', duration: 4, activities: 'swimming, dining out', season: 'Summer'
  });

  // 6. Optimizer
  const [selectedTripId, setSelectedTripId] = useState('');

  // 7. Save real trip modal state
  const [isSaveTripModalOpen, setIsSaveTripModalOpen] = useState(false);
  const [saveTripForm, setSaveTripForm] = useState({ name: '', startDate: '', endDate: '' });
  const [applyingTrip, setApplyingTrip] = useState(false);

  // Load trips and analytics on load
  useEffect(() => {
    dispatch(fetchTrips());
    dispatch(fetchAIAnalytics());
  }, [dispatch]);

  // Handle interest selection triggers
  const toggleInterest = (formType, interest) => {
    if (formType === 'itinerary') {
      const current = itineraryForm.interests;
      setItineraryForm(p => ({
        ...p,
        interests: current.includes(interest) ? current.filter(i => i !== interest) : [...current, interest]
      }));
    } else if (formType === 'destination') {
      const current = destForm.interests;
      setDestForm(p => ({
        ...p,
        interests: current.includes(interest) ? current.filter(i => i !== interest) : [...current, interest]
      }));
    }
  };

  // Submit handlers
  const handleGenerateItinerary = async (e) => {
    e.preventDefault();
    if (!itineraryForm.destination.trim()) return toast.error('Destination is required');
    dispatch(generateItinerary(itineraryForm));
  };

  const handleGenerateBudget = async (e) => {
    e.preventDefault();
    if (!budgetForm.destination.trim()) return toast.error('Destination is required');
    dispatch(generateBudget(budgetForm));
  };

  const handleRecommendDestinations = async (e) => {
    e.preventDefault();
    dispatch(recommendDestinations(destForm));
  };

  const handleRecommendHotels = async (e) => {
    e.preventDefault();
    if (!hotelForm.destination.trim()) return toast.error('Destination is required');
    dispatch(recommendHotels(hotelForm));
  };

  const handleGeneratePacking = async (e) => {
    e.preventDefault();
    if (!packingForm.destination.trim()) return toast.error('Destination is required');
    dispatch(generatePackingList(packingForm));
  };

  const handleOptimizeTrip = async (e) => {
    e.preventDefault();
    if (!selectedTripId) return toast.error('Please select a trip to optimize');
    dispatch(optimizeTrip({ tripId: selectedTripId }));
  };

  // Save generated itinerary to Mongoose DB as a real trip
  const openSaveTripModal = () => {
    if (!generatedItinerary) return;
    const today = new Date().toISOString().slice(0, 10);
    const end = new Date();
    end.setDate(end.getDate() + itineraryForm.days);
    const endStr = end.toISOString().slice(0, 10);

    setSaveTripForm({
      name: `Trip to ${itineraryForm.destination}`,
      startDate: today,
      endDate: endStr
    });
    setIsSaveTripModalOpen(true);
  };

  const saveItineraryAsRealTrip = async (e) => {
    e.preventDefault();
    if (!saveTripForm.name.trim()) return toast.error('Trip name is required');
    try {
      setApplyingTrip(true);
      // 1. Create trip base
      const newTrip = await tripService.createTrip({
        name: saveTripForm.name,
        startDate: saveTripForm.startDate,
        endDate: saveTripForm.endDate,
        budgetLimit: generatedItinerary.itinerary.totalEstimatedCost || itineraryForm.budget
      });

      // 2. Add stops sequentially for each generated day
      for (const day of generatedItinerary.itinerary.days) {
        const stopDate = new Date(saveTripForm.startDate);
        stopDate.setDate(stopDate.getDate() + (day.day - 1));
        const stopDateStr = stopDate.toISOString().slice(0, 10);

        const stopPayload = {
          city: itineraryForm.destination,
          country: 'Local',
          dateFrom: stopDateStr,
          dateTo: stopDateStr,
          activities: [
            {
              name: day.morning.activity,
              type: 'Sightseeing',
              duration: '3h',
              description: day.morning.description,
              cost: Math.round(day.estimatedCost * 0.3)
            },
            {
              name: day.afternoon.activity,
              type: 'Adventure',
              duration: '3h',
              description: day.afternoon.description,
              cost: Math.round(day.estimatedCost * 0.4)
            },
            {
              name: day.evening.activity,
              type: 'Relaxation',
              duration: '3h',
              description: day.evening.description,
              cost: Math.round(day.estimatedCost * 0.3)
            }
          ]
        };
        await tripService.addStop(newTrip.id || newTrip._id, stopPayload);
      }

      toast.success('Itinerary saved as a real interactive trip!');
      dispatch(fetchTrips());
      setIsSaveTripModalOpen(false);
      navigate(`/trip/${newTrip.id || newTrip._id}/view`);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setApplyingTrip(false);
    }
  };

  // Set generated budget as trip limit
  const applyBudgetLimitToTrip = async (tripId) => {
    if (!generatedBudget) return;
    try {
      await tripService.updateTrip(tripId, { budgetLimit: generatedBudget.budgetEstimation.total });
      toast.success(`Successfully set trip budget limit to ₹${generatedBudget.budgetEstimation.total.toLocaleString()}`);
      dispatch(fetchTrips());
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  // Import packing list to trip
  const importPackingListToTrip = async (tripId) => {
    if (!generatedPackingList) return;
    try {
      const trip = await tripService.getTripById(tripId);
      if (!trip) return toast.error('Trip not found');

      // Map generated categories to trip format
      const generatedList = generatedPackingList.packingList;
      const formattedItems = [];
      
      const categories = {
        clothes: 'Clothes',
        electronics: 'Electronics',
        essentials: 'Essentials',
        medical: 'Medical',
        documents: 'Documents'
      };

      Object.entries(categories).forEach(([key, categoryName]) => {
        if (Array.isArray(generatedList[key])) {
          generatedList[key].forEach(item => {
            formattedItems.push({
              item: `${item.item} (${item.qty})`,
              category: categoryName,
              isPacked: false
            });
          });
        }
      });

      // Merge with existing items
      const mergedPacking = [...(trip.packing || []), ...formattedItems];
      await tripService.updatePacking(tripId, mergedPacking);
      toast.success(`Imported ${formattedItems.length} items to ${trip.name}'s checklist!`);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="space-y-8 min-h-screen">
      {/* Glow Banner Header */}
      <section className="relative rounded-[2.5rem] bg-slate-900 p-8 text-white shadow-soft overflow-hidden border border-slate-800">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-teal-500/25 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl"></div>
        
        <div className="relative z-10 max-w-4xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-teal-500 to-indigo-600 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-soft">
            <FiActivity className="animate-pulse" /> Traveloop Travel Lab
          </span>
          <h1 className="mt-4 text-4xl sm:text-5xl font-black bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            Travel Planner Lab
          </h1>
          <p className="mt-3 text-slate-400 text-base max-w-2xl">
            Leverage advanced planning agents to plan budgets, design schedules, find ideal hotels, package packing checklists, and optimize city pathways.
          </p>
        </div>
      </section>

      {/* Main Grid: Tabs Menu & Content Container */}
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left Hand Tab Navigation Menu */}
        <aside className="lg:col-span-3">
          <div className="rounded-[2rem] border border-white/30 bg-white/75 p-4 shadow-soft dark:border-slate-800/85 dark:bg-slate-900/75 backdrop-blur-xl sticky top-24">
            <h2 className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Planner Menu</h2>
            <nav className="mt-3 space-y-1">
              {[
                { id: 'analytics', label: 'Travel Insights', icon: FiTrendingUp },
                { id: 'itinerary', label: 'Itinerary Planner', icon: FiMap },
                { id: 'budget', label: 'Budget Planner', icon: FiDollarSign },
                { id: 'destination', label: 'Discovery Engine', icon: FiCompass },
                { id: 'hotels', label: 'Hotel Recommender', icon: FiLayers },
                { id: 'packing', label: 'Packing Checklist', icon: FiCheckSquare },
                { id: 'optimize', label: 'Route Optimizer', icon: FiNavigation },
              ].map(tab => {
                const IconComponent = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
                      isActive 
                        ? 'bg-gradient-to-r from-teal-500 to-blue-600 text-white shadow-soft' 
                        : 'text-slate-700 hover:bg-white/40 dark:text-slate-300 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <IconComponent className={`text-base ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Right Hand Content Panel */}
        <main className="lg:col-span-9">
          <div className="rounded-[2rem] border border-white/30 bg-white/75 p-6 shadow-soft dark:border-slate-800/85 dark:bg-slate-900/75 backdrop-blur-xl min-h-[500px] flex flex-col justify-between">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* 1. TAB: AI ANALYTICS & INSIGHTS */}
                {activeTab === 'analytics' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-black">Travel Insights & Trends</h2>
                      <p className="text-sm text-slate-500">Statistics gathered from your travel habits and preferences.</p>
                    </div>

                    {analyticsStatus === 'loading' && (
                      <div className="grid gap-6 md:grid-cols-3">
                        <Skeleton className="h-28 rounded-3xl" />
                        <Skeleton className="h-28 rounded-3xl" />
                        <Skeleton className="h-28 rounded-3xl" />
                      </div>
                    )}

                    {analyticsStatus === 'succeeded' && analytics && (
                      <>
                        {/* Highlights Cards */}
                        <div className="grid gap-4 sm:grid-cols-3">
                          <div className="p-5 rounded-3xl border border-teal-500/10 bg-teal-500/5 dark:bg-teal-500/10">
                            <span className="text-xs uppercase font-bold text-teal-600 dark:text-teal-400 tracking-wider">Estimated Average Budget</span>
                            <h3 className="text-3xl font-black mt-1">₹{analytics.averageBudget.toLocaleString()}</h3>
                          </div>
                          <div className="p-5 rounded-3xl border border-blue-500/10 bg-blue-500/5 dark:bg-blue-500/10">
                            <span className="text-xs uppercase font-bold text-blue-600 dark:text-blue-400 tracking-wider">Itineraries Generated</span>
                            <h3 className="text-3xl font-black mt-1">{analytics.itinerariesCount}</h3>
                          </div>
                          <div className="p-5 rounded-3xl border border-indigo-500/10 bg-indigo-500/5 dark:bg-indigo-500/10">
                            <span className="text-xs uppercase font-bold text-indigo-600 dark:text-indigo-400 tracking-wider">Optimizations Requested</span>
                            <h3 className="text-3xl font-black mt-1">{analytics.recommendationsCount}</h3>
                          </div>
                        </div>

                        {/* Custom AI Insights Section */}
                        <div className="p-6 rounded-3xl bg-slate-900 text-white relative overflow-hidden border border-slate-800">
                          <div className="absolute top-0 right-0 p-4 opacity-5 text-8xl font-black">PLAN</div>
                          <h4 className="font-bold text-teal-400 flex items-center gap-1 text-sm uppercase tracking-wider">
                            <FiInfo /> Personalized Recommendations
                          </h4>
                          <ul className="mt-3 space-y-3">
                            {analytics.aiInsights.map((insight, idx) => (
                              <li key={idx} className="flex gap-2.5 items-start text-sm text-slate-300">
                                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-teal-500/20 text-xs font-bold text-teal-400">{idx+1}</span>
                                <p>{insight}</p>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Recharts Diagrams */}
                        <div className="grid gap-6 md:grid-cols-2 mt-6">
                          {/* Popular Destinations Bar Chart */}
                          <div className="p-5 rounded-3xl border border-white/20 bg-white/40 dark:bg-slate-950/40 backdrop-blur-md">
                            <h4 className="font-bold text-sm mb-4">Trending Global Destinations</h4>
                            <div className="h-64">
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={analytics.popularDestinations}>
                                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                  <Tooltip />
                                  <Bar dataKey="count" fill="#0d9488" radius={[4, 4, 0, 0]} />
                                </BarChart>
                              </ResponsiveContainer>
                            </div>
                          </div>

                          {/* Budget trends Area Chart */}
                          <div className="p-5 rounded-3xl border border-white/20 bg-white/40 dark:bg-slate-950/40 backdrop-blur-md">
                            <h4 className="font-bold text-sm mb-4">Estimated Travel Spending Curve (INR)</h4>
                            <div className="h-64">
                              <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={analytics.userTravelTrends}>
                                  <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                  <Tooltip />
                                  <Area type="monotone" dataKey="budget" stroke="#2563eb" fillOpacity={0.1} fill="#2563eb" />
                                </AreaChart>
                              </ResponsiveContainer>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* 2. TAB: AI ITINERARY GENERATOR */}
                {activeTab === 'itinerary' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-black">Itinerary Planner</h2>
                      <p className="text-sm text-slate-500">Draft full day-wise schedules with optimized sights, restaurants, and costs.</p>
                    </div>

                    {!generatedItinerary && itineraryStatus !== 'loading' && (
                      <form onSubmit={handleGenerateItinerary} className="space-y-4 max-w-2xl">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <label className="text-sm font-semibold mb-1 block">Destination City</label>
                            <input
                              type="text"
                              value={itineraryForm.destination}
                              onChange={e => setItineraryForm(p => ({ ...p, destination: e.target.value }))}
                              placeholder="e.g. Kyoto, Japan"
                              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-semibold mb-1 block">Trip Duration (Days)</label>
                            <input
                              type="number"
                              min="1"
                              max="14"
                              value={itineraryForm.days}
                              onChange={e => setItineraryForm(p => ({ ...p, days: parseInt(e.target.value) || 3 }))}
                              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
                            />
                          </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-3">
                          <div>
                            <label className="text-sm font-semibold mb-1 block">Budget (INR Limit)</label>
                            <input
                              type="number"
                              value={itineraryForm.budget}
                              onChange={e => setItineraryForm(p => ({ ...p, budget: parseInt(e.target.value) || 10000 }))}
                              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-semibold mb-1 block">Travel Style</label>
                            <select
                              value={itineraryForm.travelStyle}
                              onChange={e => setItineraryForm(p => ({ ...p, travelStyle: e.target.value }))}
                              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
                            >
                              <option value="Backpacker">Backpacker</option>
                              <option value="Standard">Standard (Comfort)</option>
                              <option value="Luxurious">Luxury Premium</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-sm font-semibold mb-1 block">Group Type</label>
                            <select
                              value={itineraryForm.groupType}
                              onChange={e => setItineraryForm(p => ({ ...p, groupType: e.target.value }))}
                              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
                            >
                              <option value="Solo">Solo</option>
                              <option value="Couple">Couple</option>
                              <option value="Family">Family (Kids)</option>
                              <option value="Friends">Friends Group</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-semibold mb-2 block">Interests</label>
                          <div className="flex flex-wrap gap-2">
                            {['Sightseeing', 'Food & Dining', 'Adventure Sports', 'Museums & Culture', 'Relaxation', 'Nightlife', 'Shopping'].map(interest => {
                              const selected = itineraryForm.interests.includes(interest);
                              return (
                                <button
                                  key={interest}
                                  type="button"
                                  onClick={() => toggleInterest('itinerary', interest)}
                                  className={`rounded-full px-4 py-1.5 text-xs font-semibold border transition ${
                                    selected 
                                      ? 'bg-teal-500 border-teal-500 text-white' 
                                      : 'border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-400'
                                  }`}
                                >
                                  {interest}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <button 
                          type="submit" 
                          className="w-full rounded-2xl bg-teal-500 py-3.5 font-bold text-white shadow-soft hover:bg-teal-600 transition"
                        >
                          Generate Itinerary
                        </button>
                      </form>
                    )}

                    {itineraryStatus === 'loading' && (
                      <div className="space-y-4">
                        <Skeleton className="h-8 w-1/3 rounded-xl" />
                        <Skeleton className="h-4 w-1/2 rounded-xl" />
                        <div className="mt-8 space-y-6">
                          <Skeleton className="h-32 rounded-3xl" />
                          <Skeleton className="h-32 rounded-3xl" />
                        </div>
                      </div>
                    )}

                    {itineraryStatus === 'succeeded' && generatedItinerary && (
                      <div className="space-y-6">
                        {/* Cover Image */}
                        <div className="h-48 w-full rounded-3xl overflow-hidden relative border border-slate-200 dark:border-slate-800 shadow-sm">
                          <img src={getDestinationImage(generatedItinerary.destination)} alt={generatedItinerary.destination} className="h-full w-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />
                          <div className="absolute bottom-4 left-6 text-white pr-6">
                            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-teal-400 bg-teal-500/10 border border-teal-500/25 px-2.5 py-1 rounded-full">Itinerary</span>
                            <h3 className="text-2xl font-black mt-2 leading-tight">{generatedItinerary.itinerary.tripName}</h3>
                            <p className="text-xs text-white/80 mt-1">Destination: {generatedItinerary.destination} | Budget limit: ₹{generatedItinerary.budget.toLocaleString()}</p>
                          </div>
                        </div>

                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => dispatch(clearItinerary())} 
                            className="rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2.5 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800"
                          >
                            Reset
                          </button>
                          <button 
                            onClick={openSaveTripModal} 
                            className="rounded-xl bg-teal-500 px-4 py-2.5 text-sm font-bold text-white shadow-soft hover:bg-teal-600"
                          >
                            Apply to My Trips
                          </button>
                        </div>

                        {/* General Optimization Tip */}
                        <div className="p-4 rounded-2xl bg-teal-500/5 dark:bg-teal-500/10 border border-teal-500/20 text-teal-700 dark:text-teal-400 text-sm flex gap-2">
                          <FiInfo className="shrink-0 text-lg" />
                          <p><b>Optimization Note:</b> {generatedItinerary.itinerary.generalOptimization}</p>
                        </div>

                        {/* Days timeline */}
                        <div className="space-y-8 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100 dark:before:bg-slate-800">
                          {generatedItinerary.itinerary.days.map((day) => (
                            <div key={day.day} className="relative pl-10 space-y-3">
                              {/* Timeline indicator node */}
                              <div className="absolute left-1.5 top-1.5 h-6.5 w-6.5 rounded-full border-4 border-white dark:border-slate-900 bg-teal-500 flex items-center justify-center text-[10px] font-black text-white">
                                {day.day}
                              </div>

                              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                                <h4 className="font-extrabold text-lg">Day {day.day}: {day.theme}</h4>
                                <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full text-slate-500 font-bold shrink-0 w-fit">
                                  Est. Day Cost: ₹{day.estimatedCost.toLocaleString()}
                                </span>
                              </div>

                              {/* Daily Schedules Grid */}
                              <div className="grid gap-3 sm:grid-cols-3">
                                <div className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20">
                                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
                                    <FiClock /> Morning
                                  </span>
                                  <h5 className="font-bold text-sm mt-1">{day.morning.activity}</h5>
                                  <p className="text-xs text-slate-500 mt-1">{day.morning.description}</p>
                                </div>
                                <div className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20">
                                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
                                    <FiClock /> Afternoon
                                  </span>
                                  <h5 className="font-bold text-sm mt-1">{day.afternoon.activity}</h5>
                                  <p className="text-xs text-slate-500 mt-1">{day.afternoon.description}</p>
                                </div>
                                <div className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20">
                                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
                                    <FiClock /> Evening
                                  </span>
                                  <h5 className="font-bold text-sm mt-1">{day.evening.activity}</h5>
                                  <p className="text-xs text-slate-500 mt-1">{day.evening.description}</p>
                                </div>
                              </div>

                              {/* Food suggestions */}
                              <div className="flex flex-wrap gap-2 text-xs text-slate-500 items-center">
                                <span className="font-bold text-slate-600 dark:text-slate-400">Food picks:</span>
                                {day.foodSuggestions.map((food, fIdx) => (
                                  <span key={fIdx} className="bg-slate-100 dark:bg-slate-800/60 px-2.5 py-1 rounded-lg">{food}</span>
                                ))}
                              </div>

                              {/* Day advice */}
                              <p className="text-xs text-slate-400 italic">💡 {day.optimizationTip}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 3. TAB: AI BUDGET PLANNER */}
                {activeTab === 'budget' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-black">Budget Planner</h2>
                      <p className="text-sm text-slate-500">Estimate hotel, food, transport, emergency buffer, and shopping costs automatically.</p>
                    </div>

                    {!generatedBudget && budgetStatus !== 'loading' && (
                      <form onSubmit={handleGenerateBudget} className="space-y-4 max-w-2xl">
                        <div className="grid gap-4 sm:grid-cols-3">
                          <div className="sm:col-span-2">
                            <label className="text-sm font-semibold mb-1 block">Destination City</label>
                            <input
                              type="text"
                              value={budgetForm.destination}
                              onChange={e => setBudgetForm(p => ({ ...p, destination: e.target.value }))}
                              placeholder="e.g. Zurich, Switzerland"
                              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-semibold mb-1 block">Days Duration</label>
                            <input
                              type="number"
                              min="1"
                              value={budgetForm.days}
                              onChange={e => setBudgetForm(p => ({ ...p, days: parseInt(e.target.value) || 5 }))}
                              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-semibold mb-1 block">Budget Tier</label>
                          <select
                            value={budgetForm.budgetType}
                            onChange={e => setBudgetForm(p => ({ ...p, budgetType: e.target.value }))}
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
                          >
                            <option value="Budget">Budget (Low cost, hostels, public transit)</option>
                            <option value="Standard">Standard (Comfortable hotels, restaurants)</option>
                            <option value="Luxury">Luxury (Premium, 5-star, private cabs)</option>
                          </select>
                        </div>

                        <button 
                          type="submit" 
                          className="w-full rounded-2xl bg-teal-500 py-3.5 font-bold text-white shadow-soft hover:bg-teal-600 transition"
                        >
                          Calculate Trip Budget
                        </button>
                      </form>
                    )}

                    {budgetStatus === 'loading' && (
                      <div className="space-y-4">
                        <Skeleton className="h-8 w-1/3 rounded-xl" />
                        <div className="grid gap-6 md:grid-cols-2 mt-8">
                          <Skeleton className="h-64 rounded-3xl" />
                          <Skeleton className="h-64 rounded-3xl" />
                        </div>
                      </div>
                    )}

                    {budgetStatus === 'succeeded' && generatedBudget && (
                      <div className="space-y-6">
                        {/* Cover Image */}
                        <div className="h-48 w-full rounded-3xl overflow-hidden relative border border-slate-200 dark:border-slate-800 shadow-sm">
                          <img src={getDestinationImage(generatedBudget.destination)} alt={generatedBudget.destination} className="h-full w-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />
                          <div className="absolute bottom-4 left-6 text-white pr-6">
                            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-teal-400 bg-teal-500/10 border border-teal-500/25 px-2.5 py-1 rounded-full">Budget Estimate</span>
                            <h3 className="text-2xl font-black mt-2 leading-tight">Cost Estimate: {generatedBudget.destination}</h3>
                            <p className="text-xs text-white/80 mt-1">Tier: {generatedBudget.budgetType} | Duration: {generatedBudget.days} days</p>
                          </div>
                        </div>

                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => dispatch(clearBudget())} 
                            className="rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800"
                          >
                            Reset
                          </button>
                          {trips.length > 0 && (
                            <select 
                              onChange={(e) => {
                                if (e.target.value) {
                                  applyBudgetLimitToTrip(e.target.value);
                                  e.target.value = '';
                                }
                              }}
                              className="rounded-xl bg-teal-500 text-white font-semibold text-sm px-4 py-2.5 outline-none hover:bg-teal-600 cursor-pointer"
                            >
                              <option value="">Apply limit to Trip...</option>
                              {trips.map(t => (
                                <option key={t.id || t._id} value={t.id || t._id}>{t.name}</option>
                              ))}
                            </select>
                          )}
                        </div>

                        {/* Value totals */}
                        <div className="grid gap-4 sm:grid-cols-4">
                          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/20 text-center">
                            <span className="text-xs text-slate-400 font-bold block uppercase">Grand Total Estimate</span>
                            <span className="text-2xl font-black text-teal-500 mt-1 block">₹{generatedBudget.budgetEstimation.total.toLocaleString()}</span>
                          </div>
                          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/20 text-center">
                            <span className="text-xs text-slate-400 font-bold block uppercase">Hotel Alloc</span>
                            <span className="text-2xl font-black text-slate-750 mt-1 block">₹{generatedBudget.budgetEstimation.hotel.toLocaleString()}</span>
                          </div>
                          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/20 text-center">
                            <span className="text-xs text-slate-400 font-bold block uppercase">Food & Drink</span>
                            <span className="text-2xl font-black text-slate-750 mt-1 block">₹{generatedBudget.budgetEstimation.food.toLocaleString()}</span>
                          </div>
                          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/20 text-center">
                            <span className="text-xs text-slate-400 font-bold block uppercase">Local Transit</span>
                            <span className="text-2xl font-black text-slate-750 mt-1 block">₹{generatedBudget.budgetEstimation.transport.toLocaleString()}</span>
                          </div>
                        </div>

                        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-white text-xs leading-relaxed">
                          <h4 className="font-bold text-teal-400 text-sm uppercase mb-2">Budget Analysis Reasoning</h4>
                          <p>{generatedBudget.budgetEstimation.reasoning}</p>
                        </div>

                        {/* Budget Charts */}
                        <div className="grid gap-6 md:grid-cols-2">
                          <div className="p-5 rounded-3xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20">
                            <h4 className="font-bold text-sm mb-4">Cost Category Distribution</h4>
                            <div className="h-64">
                              <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                  <Pie
                                    data={[
                                      { name: 'Hotel', value: generatedBudget.budgetEstimation.hotel },
                                      { name: 'Food', value: generatedBudget.budgetEstimation.food },
                                      { name: 'Transport', value: generatedBudget.budgetEstimation.transport },
                                      { name: 'Activities', value: generatedBudget.budgetEstimation.activities },
                                      { name: 'Buffer', value: generatedBudget.budgetEstimation.buffer },
                                      { name: 'Shopping', value: generatedBudget.budgetEstimation.shopping },
                                    ]}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={3}
                                    dataKey="value"
                                  >
                                    {[1,2,3,4,5,6].map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                  </Pie>
                                  <Tooltip />
                                  <Legend />
                                </PieChart>
                              </ResponsiveContainer>
                            </div>
                          </div>

                          <div className="p-5 rounded-3xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20">
                            <h4 className="font-bold text-sm mb-4">Estimated Day-by-Day Expenses</h4>
                            <div className="h-64">
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={generatedBudget.budgetEstimation.dailyBreakdown}>
                                  <XAxis dataKey="day" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} label={{ value: 'Days', position: 'insideBottom', offset: -5 }} />
                                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                  <Tooltip />
                                  <Bar dataKey="spent" fill="#2563eb" radius={[4, 4, 0, 0]} />
                                </BarChart>
                              </ResponsiveContainer>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 4. TAB: AI DESTINATION DISCOVERY */}
                {activeTab === 'destination' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-black">Destination Discovery Engine</h2>
                      <p className="text-sm text-slate-500">Uncover ideal cities based on weather preferences, budget bounds, and travel styles.</p>
                    </div>

                    {!recommendedDestinations && destinationStatus !== 'loading' && (
                      <form onSubmit={handleRecommendDestinations} className="space-y-4 max-w-2xl">
                        <div className="grid gap-4 sm:grid-cols-3">
                          <div>
                            <label className="text-sm font-semibold mb-1 block">Budget Cap (INR)</label>
                            <input
                              type="number"
                              value={destForm.budget}
                              onChange={e => setDestForm(p => ({ ...p, budget: parseInt(e.target.value) || 50000 }))}
                              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-semibold mb-1 block">Climate Preferences</label>
                            <select
                              value={destForm.weather}
                              onChange={e => setDestForm(p => ({ ...p, weather: e.target.value }))}
                              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
                            >
                              <option value="Warm">Sunny & Warm</option>
                              <option value="Cold">Snowy & Cold</option>
                              <option value="Mild">Mild & Moderate</option>
                              <option value="Tropical">Tropical Rainforest</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-sm font-semibold mb-1 block">Season</label>
                            <select
                              value={destForm.season}
                              onChange={e => setDestForm(p => ({ ...p, season: e.target.value }))}
                              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
                            >
                              <option value="Summer">Summer</option>
                              <option value="Winter">Winter</option>
                              <option value="Spring">Spring</option>
                              <option value="Autumn">Autumn</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <label className="text-sm font-semibold mb-1 block">Adventure Level</label>
                            <select
                              value={destForm.adventureLevel}
                              onChange={e => setDestForm(p => ({ ...p, adventureLevel: e.target.value }))}
                              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
                            >
                              <option value="Low">Low (Relaxed strolls, museums)</option>
                              <option value="Moderate">Moderate (Hiking, exploring sights)</option>
                              <option value="High">High (Skydiving, extreme nature)</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-sm font-semibold mb-1 block">Travelers Group</label>
                            <select
                              value={destForm.groupType}
                              onChange={e => setDestForm(p => ({ ...p, groupType: e.target.value }))}
                              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
                            >
                              <option value="Solo">Solo</option>
                              <option value="Couple">Couple</option>
                              <option value="Family">Family</option>
                              <option value="Friends">Friends Group</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-semibold mb-2 block">Interests</label>
                          <div className="flex flex-wrap gap-2">
                            {['Beaches', 'Mountains', 'Historical Sites', 'Theme Parks', 'Local Culinary', 'Nature Trails', 'Art Galleries'].map(interest => {
                              const selected = destForm.interests.includes(interest);
                              return (
                                <button
                                  key={interest}
                                  type="button"
                                  onClick={() => toggleInterest('destination', interest)}
                                  className={`rounded-full px-4 py-1.5 text-xs font-semibold border transition ${
                                    selected 
                                      ? 'bg-teal-500 border-teal-500 text-white' 
                                      : 'border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-400'
                                  }`}
                                >
                                  {interest}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <button 
                          type="submit" 
                          className="w-full rounded-2xl bg-teal-500 py-3.5 font-bold text-white shadow-soft hover:bg-teal-600 transition"
                        >
                          Discover Destinations
                        </button>
                      </form>
                    )}

                    {destinationStatus === 'loading' && (
                      <div className="grid gap-6 sm:grid-cols-3">
                        <Skeleton className="h-64 rounded-3xl" />
                        <Skeleton className="h-64 rounded-3xl" />
                        <Skeleton className="h-64 rounded-3xl" />
                      </div>
                    )}

                    {destinationStatus === 'succeeded' && recommendedDestinations && (
                      <div className="space-y-6">
                        <div className="flex justify-between items-center border-b pb-4">
                          <h3 className="text-xl font-bold">Matches Recommendations</h3>
                          <button 
                            onClick={() => dispatch(clearRecommendations())} 
                            className="rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800"
                          >
                            Reset Search
                          </button>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-3">
                          {recommendedDestinations.results.destinations.map((dest, idx) => (
                            <div key={idx} className="rounded-3xl border border-white/30 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl shadow-soft overflow-hidden flex flex-col justify-between hover-lift">
                              {/* Destination Image Cover */}
                              <div className="h-40 w-full overflow-hidden relative bg-slate-900">
                                <img src={getDestinationImage(dest.name)} alt={dest.name} className="h-full w-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent" />
                                <span className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm text-white text-[10px] px-2.5 py-1 rounded-full font-bold flex items-center gap-0.5 border border-white/10">
                                  <FiPercent /> {dest.matchPercentage} match
                                </span>
                              </div>
                              
                              <div className="p-5 space-y-3">
                                <div>
                                  <h4 className="font-extrabold text-lg">{dest.name}</h4>
                                  <span className="text-xs text-slate-400">{dest.country}</span>
                                </div>
                                <p className="text-xs text-slate-500 leading-relaxed">{dest.whyIdeal}</p>
                                <div className="text-xs space-y-1">
                                  <p>📅 <b>Best Visit:</b> {dest.bestTimeToVisit}</p>
                                  <p>💸 <b>Daily Expense:</b> ₹{dest.estimatedDailyCost.toLocaleString()}/day</p>
                                  <p>⛅ <b>Weather:</b> {dest.weatherForecast}</p>
                                </div>
                              </div>
                              <div className="p-4 bg-slate-50 dark:bg-slate-950/20 border-t border-slate-100 dark:border-slate-800">
                                <div className="flex flex-wrap gap-1">
                                  {dest.activityHighlights.map((act, aIdx) => (
                                    <span key={aIdx} className="bg-teal-500/10 text-teal-600 text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-md">
                                      {act}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 5. TAB: AI HOTEL RECOMMENDATION */}
                {activeTab === 'hotels' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-black">Hotel Recommendations</h2>
                      <p className="text-sm text-slate-500">Find properties with targeted rating ranges, nearby points of interest, and clear rationales.</p>
                    </div>

                    {!recommendedHotels && hotelStatus !== 'loading' && (
                      <form onSubmit={handleRecommendHotels} className="space-y-4 max-w-2xl">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <label className="text-sm font-semibold mb-1 block">Destination City</label>
                            <input
                              type="text"
                              value={hotelForm.destination}
                              onChange={e => setHotelForm(p => ({ ...p, destination: e.target.value }))}
                              placeholder="e.g. Barcelona, Spain"
                              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-semibold mb-1 block">Ideal Price Tier</label>
                            <select
                              value={hotelForm.budget}
                              onChange={e => setHotelForm(p => ({ ...p, budget: e.target.value }))}
                              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
                            >
                              <option value="Budget">Budget (Low-cost stays)</option>
                              <option value="Standard">Standard (Comfort hotel chains)</option>
                              <option value="Luxury">Luxury (5-star Boutique resorts)</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <label className="text-sm font-semibold mb-1 block">Proximity / Nearby Attractions</label>
                            <input
                              type="text"
                              value={hotelForm.nearbyAttractions}
                              onChange={e => setHotelForm(p => ({ ...p, nearbyAttractions: e.target.value }))}
                              placeholder="e.g. near Sagrada Familia or beach"
                              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-semibold mb-1 block">Amenities Preferences</label>
                            <input
                              type="text"
                              value={hotelForm.preferences}
                              onChange={e => setHotelForm(p => ({ ...p, preferences: e.target.value }))}
                              placeholder="e.g. rooftop pool, gym, free breakfast"
                              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
                            />
                          </div>
                        </div>

                        <button 
                          type="submit" 
                          className="w-full rounded-2xl bg-teal-500 py-3.5 font-bold text-white shadow-soft hover:bg-teal-600 transition"
                        >
                          Find Hotels
                        </button>
                      </form>
                    )}

                    {hotelStatus === 'loading' && (
                      <div className="grid gap-6 sm:grid-cols-3">
                        <Skeleton className="h-72 rounded-3xl" />
                        <Skeleton className="h-72 rounded-3xl" />
                        <Skeleton className="h-72 rounded-3xl" />
                      </div>
                    )}

                    {hotelStatus === 'succeeded' && recommendedHotels && (
                      <div className="space-y-6">
                        <div className="flex justify-between items-center border-b pb-4">
                          <h3 className="text-xl font-bold">Recommended Stays</h3>
                          <button 
                            onClick={() => dispatch(clearRecommendations())} 
                            className="rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800"
                          >
                            Reset Search
                          </button>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-3">
                          {recommendedHotels.results.hotels.map((hotel, idx) => (
                            <div key={idx} className="rounded-3xl border border-white/30 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl shadow-soft overflow-hidden flex flex-col justify-between hover-lift">
                              {/* Hotel Image Cover */}
                              <div className="h-40 w-full overflow-hidden relative bg-slate-900">
                                <img src={getHotelImage(idx)} alt={hotel.name} className="h-full w-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent" />
                                <span className="absolute top-3 right-3 bg-orange-500 text-white text-[10px] px-2.5 py-0.5 rounded-full font-bold flex items-center gap-0.5 shadow-md">
                                  ⭐ {hotel.rating}
                                </span>
                              </div>
                              
                              <div className="p-5 space-y-3">
                                <div className="flex justify-between items-start gap-1">
                                  <h4 className="font-extrabold text-base leading-tight">{hotel.name}</h4>
                                  <span className="bg-orange-500/10 text-orange-600 text-xs px-2 py-0.5 rounded-full font-bold">
                                    ⭐ {hotel.rating}
                                  </span>
                                </div>
                                <span className="inline-block text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md font-bold text-teal-600">
                                  {hotel.priceRange}
                                </span>
                                <p className="text-xs text-slate-500 leading-relaxed">{hotel.description}</p>
                                <p className="text-xs text-slate-400 bg-slate-50 dark:bg-slate-950/20 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 italic">
                                  💡 <b>Why:</b> {hotel.recommendationReason}
                                </p>
                              </div>
                              <div className="p-4 bg-slate-50 dark:bg-slate-950/20 border-t border-slate-100 dark:border-slate-800 text-xs space-y-2">
                                <div>
                                  <span className="font-bold text-slate-500 block text-[9px] uppercase">Amenities:</span>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {hotel.amenities.slice(0, 3).map((am, aIdx) => (
                                      <span key={aIdx} className="bg-slate-200 dark:bg-slate-850 px-2 py-0.5 rounded text-[10px]">{am}</span>
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <span className="font-bold text-slate-500 block text-[9px] uppercase">Walk to:</span>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {hotel.nearbyAttractions.map((att, aIdx) => (
                                      <span key={aIdx} className="bg-teal-500/5 text-teal-600 px-2 py-0.5 rounded text-[10px]">{att}</span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 6. TAB: SMART PACKING ASSISTANT */}
                {activeTab === 'packing' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-black">Smart Packing Assistant</h2>
                      <p className="text-sm text-slate-500">Prepare checklists categorized by clothes, essentials, electronics, documents, and medical needs.</p>
                    </div>

                    {!generatedPackingList && packingStatus !== 'loading' && (
                      <form onSubmit={handleGeneratePacking} className="space-y-4 max-w-2xl">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <label className="text-sm font-semibold mb-1 block">Destination City</label>
                            <input
                              type="text"
                              value={packingForm.destination}
                              onChange={e => setPackingForm(p => ({ ...p, destination: e.target.value }))}
                              placeholder="e.g. Reykjavik, Iceland"
                              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-semibold mb-1 block">Trip Length (Days)</label>
                            <input
                              type="number"
                              min="1"
                              value={packingForm.duration}
                              onChange={e => setPackingForm(p => ({ ...p, duration: parseInt(e.target.value) || 4 }))}
                              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
                            />
                          </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <label className="text-sm font-semibold mb-1 block">Season/Weather</label>
                            <select
                              value={packingForm.season}
                              onChange={e => setPackingForm(p => ({ ...p, season: e.target.value }))}
                              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
                            >
                              <option value="Summer">Summer (Warm & Humid)</option>
                              <option value="Winter">Winter (Freezing & Snow)</option>
                              <option value="Monsoon">Monsoon (Rainy)</option>
                              <option value="Autumn">Autumn / Spring (Mild & Breeze)</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-sm font-semibold mb-1 block">Activities Planned</label>
                            <input
                              type="text"
                              value={packingForm.activities}
                              onChange={e => setPackingForm(p => ({ ...p, activities: e.target.value }))}
                              placeholder="e.g. hiking, swimming, fine dining"
                              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
                            />
                          </div>
                        </div>

                        <button 
                          type="submit" 
                          className="w-full rounded-2xl bg-teal-500 py-3.5 font-bold text-white shadow-soft hover:bg-teal-600 transition"
                        >
                          Generate Packing List
                        </button>
                      </form>
                    )}

                    {packingStatus === 'loading' && (
                      <div className="space-y-4">
                        <Skeleton className="h-8 w-1/3 rounded-xl" />
                        <div className="grid gap-4 sm:grid-cols-2 mt-8">
                          <Skeleton className="h-40 rounded-3xl" />
                          <Skeleton className="h-40 rounded-3xl" />
                        </div>
                      </div>
                    )}

                    {packingStatus === 'succeeded' && generatedPackingList && (
                      <div className="space-y-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
                          <div>
                            <h3 className="text-xl font-bold">Checklist for {packingForm.destination}</h3>
                            <p className="text-sm text-slate-500">Duration: {packingForm.duration} days | Season: {packingForm.season}</p>
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => dispatch(clearPackingList())} 
                              className="rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2.5 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800"
                            >
                              Reset
                            </button>
                            {trips.length > 0 && (
                              <select 
                                onChange={(e) => {
                                  if (e.target.value) {
                                    importPackingListToTrip(e.target.value);
                                    e.target.value = '';
                                  }
                                }}
                                className="rounded-xl bg-teal-500 text-white font-semibold text-sm px-4 py-2.5 outline-none hover:bg-teal-600 cursor-pointer"
                              >
                                <option value="">Import checklist to Trip...</option>
                                {trips.map(t => (
                                  <option key={t.id || t._id} value={t.id || t._id}>{t.name}</option>
                                ))}
                              </select>
                            )}
                          </div>
                        </div>

                        {/* Packing Categories Grid */}
                        <div className="grid gap-6 sm:grid-cols-2">
                          {[
                            { key: 'clothes', title: '👕 Clothing', color: 'border-blue-500/20 bg-blue-500/5' },
                            { key: 'electronics', title: '🔌 Electronics', color: 'border-orange-500/20 bg-orange-500/5' },
                            { key: 'essentials', title: '🎒 Travel Essentials', color: 'border-teal-500/20 bg-teal-500/5' },
                            { key: 'medical', title: '💊 Medical & Toiletries', color: 'border-rose-500/20 bg-rose-500/5' },
                            { key: 'documents', title: '📄 Documents & Money', color: 'border-indigo-500/20 bg-indigo-500/5' },
                          ].map(cat => {
                            const items = generatedPackingList.packingList[cat.key] || [];
                            return (
                              <div key={cat.key} className={`p-5 rounded-3xl border ${cat.color}`}>
                                <h4 className="font-extrabold text-base mb-3">{cat.title}</h4>
                                <div className="space-y-2">
                                  {items.length === 0 ? (
                                    <p className="text-xs text-slate-400">No items generated for this category.</p>
                                  ) : (
                                    items.map((item, idx) => (
                                      <label key={idx} className="flex items-center gap-3 text-sm cursor-pointer select-none">
                                        <input type="checkbox" className="rounded text-teal-600 focus:ring-teal-500 h-4 w-4" />
                                        <span className="flex-1 text-slate-700 dark:text-slate-350">{item.item}</span>
                                        <span className="text-xs font-bold text-slate-450">qty: {item.qty}</span>
                                      </label>
                                    ))
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 7. TAB: AI TRIP OPTIMIZER */}
                {activeTab === 'optimize' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-black">Smart Trip Optimizer</h2>
                      <p className="text-sm text-slate-500">Provide an existing multi-city itinerary to optimize travel sequencing and lower travel expenses.</p>
                    </div>

                    {trips.length === 0 ? (
                      <div className="rounded-3xl border border-dashed p-8 text-center text-slate-500 glass-panel">
                        You need to have at least one trip planned to run the optimizer.
                      </div>
                    ) : (
                      <>
                        {!optimizedRoute && optimizeStatus !== 'loading' && (
                          <form onSubmit={handleOptimizeTrip} className="space-y-4 max-w-2xl">
                            <div>
                              <label className="text-sm font-semibold mb-1 block">Select Trip to Optimize</label>
                              <select
                                value={selectedTripId}
                                onChange={e => setSelectedTripId(e.target.value)}
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
                              >
                                <option value="">Select a trip...</option>
                                {trips.map(t => (
                                  <option key={t.id || t._id} value={t.id || t._id}>
                                    {t.name} ({t.stops?.length || 0} stops)
                                  </option>
                                ))}
                              </select>
                            </div>

                            <button 
                              type="submit" 
                              disabled={!selectedTripId}
                              className="w-full rounded-2xl bg-teal-500 py-3.5 font-bold text-white shadow-soft hover:bg-teal-600 transition disabled:opacity-50"
                            >
                              Optimize Trip Logistics
                            </button>
                          </form>
                        )}

                        {optimizeStatus === 'loading' && (
                          <div className="space-y-4">
                            <Skeleton className="h-8 w-1/3 rounded-xl" />
                            <Skeleton className="h-40 rounded-3xl mt-6" />
                          </div>
                        )}

                        {optimizeStatus === 'succeeded' && optimizedRoute && (
                          <div className="space-y-6">
                            <div className="flex justify-between items-center border-b pb-4">
                              <div>
                                <h3 className="text-xl font-bold">Optimized Sequence Results</h3>
                                <p className="text-sm text-rose-500 font-semibold">{optimizedRoute.savingsEstimation}</p>
                              </div>
                              <button 
                                onClick={() => dispatch(clearOptimization())} 
                                className="rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800"
                              >
                                Choose Another
                              </button>
                            </div>

                            {/* Optimize Sequence display */}
                            <div className="p-5 rounded-3xl border border-teal-500/20 bg-teal-500/5 dark:bg-teal-500/10">
                              <h4 className="font-bold text-sm text-teal-600 dark:text-teal-400 mb-3 flex items-center gap-1.5">
                                <FiNavigation /> Recommended City Sequence
                              </h4>
                              <div className="flex flex-wrap items-center gap-3">
                                {optimizedRoute.optimizedRoute.map((city, cIdx) => (
                                  <div key={cIdx} className="flex items-center gap-3">
                                    <div className="bg-slate-900 text-white rounded-2xl px-4 py-2.5 text-sm font-black dark:bg-slate-800">
                                      {city}
                                    </div>
                                    {cIdx < optimizedRoute.optimizedRoute.length - 1 && (
                                      <FiArrowRight className="text-slate-400 text-lg animate-pulse" />
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Improvement list */}
                            <div className="space-y-3">
                              <h4 className="font-bold text-sm uppercase text-slate-500 tracking-wider">Smart Optimization Improvements</h4>
                              <div className="grid gap-3 sm:grid-cols-2">
                                {optimizedRoute.improvements.map((imp, idx) => (
                                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800 text-xs">
                                    {imp}
                                  </div>
                                ))}
                              </div>
                            </div>

                            <p className="text-sm text-slate-500 leading-relaxed border-t pt-4">
                              <b>Detailed Transportation Advice:</b> {optimizedRoute.detailedSuggestions}
                            </p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* SAVE TRIP POPUP DIALOG */}
      {isSaveTripModalOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-[2rem] border border-white/30 bg-white/80 p-6 shadow-2xl dark:border-slate-800/80 dark:bg-slate-900/80 backdrop-blur-xl">
            <h3 className="text-2xl font-black">Save Itinerary to Trips</h3>
            <p className="text-xs text-slate-400 mt-1">This will initialize a new active trip on your dashboard, and insert the generated days as milestones.</p>

            <form onSubmit={saveItineraryAsRealTrip} className="mt-6 space-y-4">
              <div>
                <label className="text-xs font-semibold mb-1 block">Trip Name</label>
                <input
                  type="text"
                  value={saveTripForm.name}
                  onChange={e => setSaveTripForm(p => ({ ...p, name: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950/50 backdrop-blur-sm focus:border-teal-500 focus:outline-none transition-all"
                  required
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold mb-1 block">Start Date</label>
                  <input
                    type="date"
                    value={saveTripForm.startDate}
                    onChange={e => setSaveTripForm(p => ({ ...p, startDate: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950/50 backdrop-blur-sm focus:border-teal-500 focus:outline-none transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold mb-1 block">End Date</label>
                  <input
                    type="date"
                    value={saveTripForm.endDate}
                    onChange={e => setSaveTripForm(p => ({ ...p, endDate: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950/50 backdrop-blur-sm focus:border-teal-500 focus:outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end mt-6">
                <button
                  type="button"
                  onClick={() => setIsSaveTripModalOpen(false)}
                  className="rounded-xl border border-slate-200 bg-white/20 px-4 py-2 text-sm font-semibold hover:bg-white/40 dark:border-slate-700 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={applyingTrip}
                  className="rounded-xl bg-teal-500 text-white font-bold text-sm px-5 py-2 hover:bg-teal-600 disabled:opacity-50"
                >
                  {applyingTrip ? 'Saving...' : 'Confirm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
