import React, { createContext, useState, useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Services from './pages/features/Services';
import Customers from './pages/features/Customers';
import Properties from './pages/features/Properties';
import Quotes from './pages/features/Quotes';
import Jobs from './pages/features/Jobs';
import Crews from './pages/features/Crews';
import Equipment from './pages/features/Equipment';
import Chemicals from './pages/features/Chemicals';
import Photos from './pages/features/Photos';
import ServicePlans from './pages/features/ServicePlans';
import Invoices from './pages/features/Invoices';
import Contracts from './pages/features/Contracts';
import Fleet from './pages/features/Fleet';
import Maintenance from './pages/features/Maintenance';
import Safety from './pages/features/Safety';
import Insurance from './pages/features/Insurance';
import Environmental from './pages/features/Environmental';
import Training from './pages/features/Training';
import Referrals from './pages/features/Referrals';
import Bookings from './pages/features/Bookings';
import Reviews from './pages/features/Reviews';
import Marketing from './pages/features/Marketing';
import Locations from './pages/features/Locations';
import RouteSheets from './pages/features/RouteSheets';
import TimeTracking from './pages/features/TimeTracking';
import Reports from './pages/features/Reports';
import QuoteEstimator from './pages/ai/QuoteEstimator';
import ChemicalAdvisor from './pages/ai/ChemicalAdvisor';
import WeatherScheduler from './pages/ai/WeatherScheduler';
import MarketingGenerator from './pages/ai/MarketingGenerator';
import UpsellAdvisor from './pages/ai/UpsellAdvisor';

// Auth Context
export const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  const login = (userData, tokenStr) => {
    setUser(userData);
    setToken(tokenStr);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', tokenStr);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="app-header">
      <Link to="/dashboard" className="logo-section">
        <span className="logo-icon">🔵</span>
        <div>
          <div className="logo-text">AI Pressure Washing</div>
          <div className="logo-subtitle">Exterior Cleaning Management</div>
        </div>
      </Link>
      <div className="header-right">
        <span className="user-info">{user?.name || user?.email}</span>
        <button className="btn-logout" onClick={handleLogout}>Logout</button>
      </div>
    </header>
  );
}

function AppLayout({ children }) {
  return (
    <>
      <Header />
      <main className="main-content">
        {children}
      </main>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<ProtectedRoute><AppLayout><Dashboard /></AppLayout></ProtectedRoute>} />
          {/* Feature routes */}
          <Route path="/services" element={<ProtectedRoute><AppLayout><Services /></AppLayout></ProtectedRoute>} />
          <Route path="/customers" element={<ProtectedRoute><AppLayout><Customers /></AppLayout></ProtectedRoute>} />
          <Route path="/properties" element={<ProtectedRoute><AppLayout><Properties /></AppLayout></ProtectedRoute>} />
          <Route path="/quotes" element={<ProtectedRoute><AppLayout><Quotes /></AppLayout></ProtectedRoute>} />
          <Route path="/jobs" element={<ProtectedRoute><AppLayout><Jobs /></AppLayout></ProtectedRoute>} />
          <Route path="/crews" element={<ProtectedRoute><AppLayout><Crews /></AppLayout></ProtectedRoute>} />
          <Route path="/equipment" element={<ProtectedRoute><AppLayout><Equipment /></AppLayout></ProtectedRoute>} />
          <Route path="/chemicals" element={<ProtectedRoute><AppLayout><Chemicals /></AppLayout></ProtectedRoute>} />
          <Route path="/photos" element={<ProtectedRoute><AppLayout><Photos /></AppLayout></ProtectedRoute>} />
          <Route path="/service-plans" element={<ProtectedRoute><AppLayout><ServicePlans /></AppLayout></ProtectedRoute>} />
          <Route path="/invoices" element={<ProtectedRoute><AppLayout><Invoices /></AppLayout></ProtectedRoute>} />
          <Route path="/contracts" element={<ProtectedRoute><AppLayout><Contracts /></AppLayout></ProtectedRoute>} />
          <Route path="/fleet" element={<ProtectedRoute><AppLayout><Fleet /></AppLayout></ProtectedRoute>} />
          <Route path="/maintenance" element={<ProtectedRoute><AppLayout><Maintenance /></AppLayout></ProtectedRoute>} />
          <Route path="/safety" element={<ProtectedRoute><AppLayout><Safety /></AppLayout></ProtectedRoute>} />
          <Route path="/insurance" element={<ProtectedRoute><AppLayout><Insurance /></AppLayout></ProtectedRoute>} />
          <Route path="/environmental" element={<ProtectedRoute><AppLayout><Environmental /></AppLayout></ProtectedRoute>} />
          <Route path="/training" element={<ProtectedRoute><AppLayout><Training /></AppLayout></ProtectedRoute>} />
          <Route path="/referrals" element={<ProtectedRoute><AppLayout><Referrals /></AppLayout></ProtectedRoute>} />
          <Route path="/bookings" element={<ProtectedRoute><AppLayout><Bookings /></AppLayout></ProtectedRoute>} />
          <Route path="/reviews" element={<ProtectedRoute><AppLayout><Reviews /></AppLayout></ProtectedRoute>} />
          <Route path="/marketing" element={<ProtectedRoute><AppLayout><Marketing /></AppLayout></ProtectedRoute>} />
          <Route path="/locations" element={<ProtectedRoute><AppLayout><Locations /></AppLayout></ProtectedRoute>} />
          <Route path="/route-sheets" element={<ProtectedRoute><AppLayout><RouteSheets /></AppLayout></ProtectedRoute>} />
          <Route path="/time-tracking" element={<ProtectedRoute><AppLayout><TimeTracking /></AppLayout></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><AppLayout><Reports /></AppLayout></ProtectedRoute>} />
          {/* AI routes */}
          <Route path="/ai/quote-estimator" element={<ProtectedRoute><AppLayout><QuoteEstimator /></AppLayout></ProtectedRoute>} />
          <Route path="/ai/chemical-advisor" element={<ProtectedRoute><AppLayout><ChemicalAdvisor /></AppLayout></ProtectedRoute>} />
          <Route path="/ai/weather-scheduler" element={<ProtectedRoute><AppLayout><WeatherScheduler /></AppLayout></ProtectedRoute>} />
          <Route path="/ai/marketing-generator" element={<ProtectedRoute><AppLayout><MarketingGenerator /></AppLayout></ProtectedRoute>} />
          <Route path="/ai/upsell-advisor" element={<ProtectedRoute><AppLayout><UpsellAdvisor /></AppLayout></ProtectedRoute>} />
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
