import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Layouts
import { FarmerLayout } from './components/layout/FarmerLayout';
import { CHCLayout } from './components/layout/CHCLayout';
import { AdminLayout } from './components/layout/AdminLayout';

// Landing & Roles
import { LandingRoleSelect } from './features/auth/LandingRoleSelect';
import { LoginPage } from './features/auth/LoginPage';

// Farmer Experience
import { FarmerHome } from './features/farmer/FarmerHome';
import { FarmerMarketplace } from './features/farmer/FarmerMarketplace';
import { FarmerRentals } from './features/farmer/FarmerRentals';
import { FarmProfile } from './features/farmer/FarmProfile';
import { FarmerCredit } from './features/farmer/FarmerCredit';

// CHC Operations
import { CHCOverview } from './features/chc/CHCOverview';
import { DemandIntelligence } from './features/chc/DemandIntelligence';
import { FleetManagement } from './features/chc/FleetManagement';
import { LiveTelematics } from './features/chc/LiveTelematics';
import { BookingsManager } from './features/chc/BookingsManager';
import { PredictiveMaintenance } from './features/chc/PredictiveMaintenance';
import { RevenueAnalytics } from './features/chc/RevenueAnalytics';
import { CHCSettings } from './features/chc/CHCSettings';

// Admin Governance
import { AdminDashboard } from './features/admin/AdminDashboard';

// Operator Mobile App
import { OperatorDashboard } from './components/operator/OperatorDashboard';
import { ActiveJobExecution } from './components/operator/ActiveJobExecution';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
    },
  },
});

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Landing & Authentication */}
          <Route path="/" element={<LandingRoleSelect />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Farmer Routes */}
          <Route path="/farmer" element={<FarmerLayout />}>
            <Route index element={<FarmerHome />} />
            <Route path="marketplace" element={<FarmerMarketplace />} />
            <Route path="rentals" element={<FarmerRentals />} />
            <Route path="farm" element={<FarmProfile />} />
            <Route path="credit" element={<FarmerCredit />} />
          </Route>

          {/* CHC Operations Hub Routes */}
          <Route path="/chc" element={<CHCLayout />}>
            <Route index element={<CHCOverview />} />
            <Route path="demand" element={<DemandIntelligence />} />
            <Route path="fleet" element={<FleetManagement />} />
            <Route path="telematics" element={<LiveTelematics />} />
            <Route path="bookings" element={<BookingsManager />} />
            <Route path="maintenance" element={<PredictiveMaintenance />} />
            <Route path="analytics" element={<RevenueAnalytics />} />
            <Route path="settings" element={<CHCSettings />} />
          </Route>

          {/* Platform Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
          </Route>

          {/* Dedicated Machinery Operator Routes */}
          <Route path="/operator">
            <Route index element={<OperatorDashboard />} />
            <Route path="job/:bookingId" element={<ActiveJobExecution />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
