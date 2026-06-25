import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import Navbar from '@/components/Layout/Navbar';
import Footer from '@/components/Layout/Footer';
import ProtectedRoute from '@/components/ProtectedRoute';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Dashboard from '@/pages/Dashboard';
import CreateTrip from '@/pages/CreateTrip';
import MyTrips from '@/pages/MyTrips';
import ItineraryBuilder from '@/pages/ItineraryBuilder';
import ItineraryView from '@/pages/ItineraryView';
import BudgetBreakdown from '@/pages/BudgetBreakdown';
import PackingChecklistPage from '@/pages/PackingChecklistPage';
import PublicItinerary from '@/pages/PublicItinerary';
import UserProfile from '@/pages/UserProfile';
import TripNotes from '@/pages/TripNotes';
import AdminDashboard from '@/pages/AdminDashboard';
import Support from '@/pages/Support';
import AgentMarketplace from '@/pages/AgentMarketplace';
import { useState, useEffect } from 'react';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import AIHub from '@/pages/AIHub';

import AIAssistant from '@/components/AIAssistant';
import SmoothScroll from '@/components/SmoothScroll';
import { motion } from 'framer-motion';
import { FiCompass, FiCheckSquare, FiUser, FiHelpCircle, FiClock, FiLink } from 'react-icons/fi';

function VerticalTickerUp() {
  const cities = ['PARIS', 'TOKYO', 'ROME', 'BALI', 'LONDON', 'DUBAI', 'NEW YORK', 'SYDNEY', 'CAIRO', 'MUMBAI'];
  const doubleCities = [...cities, ...cities];
  return (
    <div className="flex flex-col items-center animate-marquee-vertical-up whitespace-nowrap">
      {doubleCities.map((city, idx) => (
        <div key={idx} className="py-8 font-black tracking-[0.25em] text-[9px] text-teal-500/35 dark:text-teal-400/25 uppercase [writing-mode:vertical-lr] flex items-center gap-1.5 select-none">
          <span>✈️</span>
          <span>{city}</span>
        </div>
      ))}
    </div>
  );
}

function VerticalTickerDown() {
  const cities = ['MUMBAI', 'CAIRO', 'SYDNEY', 'NEW YORK', 'DUBAI', 'LONDON', 'BALI', 'ROME', 'TOKYO', 'PARIS'];
  const doubleCities = [...cities, ...cities];
  return (
    <div className="flex flex-col items-center animate-marquee-vertical-down whitespace-nowrap">
      {doubleCities.map((city, idx) => (
        <div key={idx} className="py-8 font-black tracking-[0.25em] text-[9px] text-indigo-500/35 dark:text-indigo-400/25 uppercase [writing-mode:vertical-lr] flex items-center gap-1.5 select-none">
          <span>🌍</span>
          <span>{city}</span>
        </div>
      ))}
    </div>
  );
}

function SideTickerStrips() {
  return (
    <>
      {/* Left Margin Infinite Scrolling Ticker Strip */}
      <div className="hidden 2xl:flex fixed left-3 top-0 bottom-0 w-8 z-30 pointer-events-none flex-col justify-start bg-slate-950/5 border-l border-r border-white/[0.03] dark:border-slate-800/10 backdrop-blur-[1px] overflow-hidden">
        <VerticalTickerUp />
      </div>

      {/* Right Margin Infinite Scrolling Ticker Strip */}
      <div className="hidden 2xl:flex fixed right-3 top-0 bottom-0 w-8 z-30 pointer-events-none flex-col justify-start bg-slate-950/5 border-l border-r border-white/[0.03] dark:border-slate-800/10 backdrop-blur-[1px] overflow-hidden">
        <VerticalTickerDown />
      </div>
    </>
  );
}

function MainLayout() {
  const [scrollY, setScrollY] = useState(0);
  const [parallaxEnabled, setParallaxEnabled] = useState(false);

  useEffect(() => {
    const canUseParallax = () => (
      window.innerWidth >= 1280 &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );

    let frame = 0;
    const updateParallaxMode = () => {
      const enabled = canUseParallax();
      setParallaxEnabled(enabled);
      if (!enabled) setScrollY(0);
    };

    const handleScroll = () => {
      if (!canUseParallax()) return;
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        setScrollY(window.scrollY);
        frame = 0;
      });
    };

    updateParallaxMode();
    window.addEventListener('resize', updateParallaxMode, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', updateParallaxMode);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <SmoothScroll>
      <div className="relative min-h-screen bg-traveloop-gradient dark:bg-slate-950 overflow-x-hidden travel-pattern-bg">
        {/* Beautiful high-resolution tropical sunset background image theme overlay with GSAP-like parallax scroll scale effect */}
        <div className="absolute inset-0 -z-20 pointer-events-none overflow-hidden">
          <div 
            className="absolute inset-0 opacity-[0.48] dark:opacity-[0.58] bg-[url('/paradise_sunset.jpg')] bg-cover bg-center bg-no-repeat bg-fixed transition-transform duration-100 ease-out" 
            style={{
              transform: parallaxEnabled ? `translateY(${scrollY * 0.12}px) scale(${1 + scrollY * 0.00012})` : 'none',
              WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 30%, rgba(0,0,0,0.2) 80%, rgba(0,0,0,0) 100%)',
              maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 30%, rgba(0,0,0,0.2) 80%, rgba(0,0,0,0) 100%)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-orange-500/[0.08] via-transparent to-transparent dark:from-amber-500/[0.05] pointer-events-none" />
        </div>
        <Navbar />
        <SideTickerStrips />
        <main className="relative w-full flex-1 px-3 py-4 sm:px-5 sm:py-6 lg:px-8">
          <Outlet />
        </main>
        <AIAssistant />
        <Footer />
      </div>
    </SmoothScroll>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/ai-hub" element={<AIHub />} />
        <Route path="/create-trip" element={<CreateTrip />} />
        <Route path="/my-trips" element={<MyTrips />} />
        <Route path="/trip/:id/builder" element={<ItineraryBuilder />} />
        <Route path="/trip/:id/view" element={<ItineraryView />} />
        <Route path="/trip/:id/budget" element={<BudgetBreakdown />} />
        <Route path="/trip/:id/packing" element={<PackingChecklistPage />} />
        <Route path="/trip/:id/notes" element={<TripNotes />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/support" element={<Support />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/agents" element={<AgentMarketplace />} />
      </Route>

      <Route path="/public/:tripId" element={<PublicItinerary />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
