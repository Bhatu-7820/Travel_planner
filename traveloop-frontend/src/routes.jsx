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
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';

import AIAssistant from '@/components/AIAssistant';

function MainLayout() {
  return (
    <div className="min-h-screen bg-traveloop-gradient dark:bg-slate-950">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      <AIAssistant />
      <Footer />
    </div>
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
