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
import QuoteGenerator from './pages/ai/QuoteGenerator';
import RouteOptimizer from './pages/ai/RouteOptimizer';
import WeatherSchedule from './pages/ai/WeatherSchedule';
import EquipmentMaintenancePredict from './pages/ai/EquipmentMaintenancePredict';
import CustomerChurnPredict from './pages/ai/CustomerChurnPredict';
import JobDetail from './pages/features/JobDetail';

// // === Batch 06 Gaps & Frontend Mounts ===
import CFAgenticJobOrchestrationPage from './pages/CFAgenticJobOrchestrationPage';
import CFComputerVisionJobEstimationPage from './pages/CFComputerVisionJobEstimationPage';
import CFCrewMobileCompanionPage from './pages/CFCrewMobileCompanionPage';
import CFSeasonalDemandForecastingPage from './pages/CFSeasonalDemandForecastingPage';
import CFCustomerLifecycleOptimizationPage from './pages/CFCustomerLifecycleOptimizationPage';
import GapEquipmentWithoutEquipmentPage from './pages/GapEquipmentWithoutEquipmentPage';
import GapCrewsWithoutCrewPage from './pages/GapCrewsWithoutCrewPage';
import GapCustomersWithoutCustomerPage from './pages/GapCustomersWithoutCustomerPage';
import GapContractsWithoutContractPage from './pages/GapContractsWithoutContractPage';
import GapLimitedMobileAppForCrew1MobileReferenceNoPage from './pages/GapLimitedMobileAppForCrew1MobileReferenceNoPage';
import GapNoRealPage from './pages/GapNoRealPage';
import GapNoIntegrationWithPaymentProcessingSquareStriPage from './pages/GapNoIntegrationWithPaymentProcessingSquareStriPage';
import GapLimitedCustomerSelfPage from './pages/GapLimitedCustomerSelfPage';
import GapNoIntegrationWithAccountingQuickbooksFreshbooPage from './pages/GapNoIntegrationWithAccountingQuickbooksFreshbooPage';
import GapNoWebhooksPage from './pages/GapNoWebhooksPage';
import GapFrontendSeverelyUnderbuiltFor29Page from './pages/GapFrontendSeverelyUnderbuiltFor29Page';
import CodexCustomVizFeature from './pages/CodexCustomVizFeature';
import CodexOperationsFeature from './pages/CodexOperationsFeature';

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
        <Route path="/codex/custom-viz" element={<ProtectedRoute><CodexCustomVizFeature /></ProtectedRoute>} />
        <Route path="/codex/operations" element={<ProtectedRoute><CodexOperationsFeature /></ProtectedRoute>} />

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
          <Route path="/ai/quote-generator" element={<ProtectedRoute><AppLayout><QuoteGenerator /></AppLayout></ProtectedRoute>} />
          <Route path="/ai/route-optimizer" element={<ProtectedRoute><AppLayout><RouteOptimizer /></AppLayout></ProtectedRoute>} />
          <Route path="/ai/weather-schedule" element={<ProtectedRoute><AppLayout><WeatherSchedule /></AppLayout></ProtectedRoute>} />
          <Route path="/ai/equipment-maintenance-predict" element={<ProtectedRoute><AppLayout><EquipmentMaintenancePredict /></AppLayout></ProtectedRoute>} />
          <Route path="/ai/customer-churn-predict" element={<ProtectedRoute><AppLayout><CustomerChurnPredict /></AppLayout></ProtectedRoute>} />
          <Route path="/jobs/:id" element={<ProtectedRoute><AppLayout><JobDetail /></AppLayout></ProtectedRoute>} />
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        
          {/* // === Batch 06 Gaps & Frontend Mounts === */}
          <Route path="/cf-agentic-job-orchestration" element={<CFAgenticJobOrchestrationPage />} />
          <Route path="/cf-computer-vision-job-estimation" element={<CFComputerVisionJobEstimationPage />} />
          <Route path="/cf-crew-mobile-companion" element={<CFCrewMobileCompanionPage />} />
          <Route path="/cf-seasonal-demand-forecasting" element={<CFSeasonalDemandForecastingPage />} />
          <Route path="/cf-customer-lifecycle-optimization" element={<CFCustomerLifecycleOptimizationPage />} />
          <Route path="/gap-equipment-without-equipment" element={<GapEquipmentWithoutEquipmentPage />} />
          <Route path="/gap-crews-without-crew" element={<GapCrewsWithoutCrewPage />} />
          <Route path="/gap-customers-without-customer" element={<GapCustomersWithoutCustomerPage />} />
          <Route path="/gap-contracts-without-contract" element={<GapContractsWithoutContractPage />} />
          <Route path="/gap-limited-mobile-app-for-crew-1-mobile-reference-no-" element={<GapLimitedMobileAppForCrew1MobileReferenceNoPage />} />
          <Route path="/gap-no-real" element={<GapNoRealPage />} />
          <Route path="/gap-no-integration-with-payment-processing-square-stri" element={<GapNoIntegrationWithPaymentProcessingSquareStriPage />} />
          <Route path="/gap-limited-customer-self" element={<GapLimitedCustomerSelfPage />} />
          <Route path="/gap-no-integration-with-accounting-quickbooks-freshboo" element={<GapNoIntegrationWithAccountingQuickbooksFreshbooPage />} />
          <Route path="/gap-no-webhooks" element={<GapNoWebhooksPage />} />
          <Route path="/gap-frontend-severely-underbuilt-for-29" element={<GapFrontendSeverelyUnderbuiltFor29Page />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
