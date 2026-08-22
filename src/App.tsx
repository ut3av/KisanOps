import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Layouts
import { FarmerLayout } from './components/layout/FarmerLayout';
import { CHCLayout } from './components/layout/CHCLayout';
import { AdminLayout } from './components/layout/AdminLayout';
import { OperatorLayout } from './components/layout/OperatorLayout';

// Landing & Multi-Page Views
import { LandingPage } from './features/landing/LandingPage';
import { ProductsPreHarvestPage } from './features/landing/pages/ProductsPreHarvestPage';
import { ProductsPostHarvestPage } from './features/landing/pages/ProductsPostHarvestPage';
import { ProductsOperationsPage } from './features/landing/pages/ProductsOperationsPage';
import { SolutionsPage } from './features/landing/pages/SolutionsPage';
import { PricingRoiPage } from './features/landing/pages/PricingRoiPage';
import { AboutPage } from './features/landing/pages/AboutPage';
import { ContactPage } from './features/landing/pages/ContactPage';

// Authentication & Roles
import { LandingRoleSelect } from './features/auth/LandingRoleSelect';
import { LoginPage } from './features/auth/LoginPage';

// Common / 404
import { NotFoundPage } from './features/common/NotFoundPage';
import { ScrollToTop } from './components/common/ScrollToTop';

// Farmer Experience
import { FarmerHome } from './features/farmer/FarmerHome';
import { FarmerMarketplace } from './features/farmer/FarmerMarketplace';
import { FarmerRentals } from './features/farmer/FarmerRentals';
import { FarmProfile } from './features/farmer/FarmProfile';
import { FarmerCredit } from './features/farmer/FarmerCredit';
import { FarmIntelligence } from './features/farmer/FarmIntelligence';

// CHC Operations
import { CHCOverview } from './features/chc/CHCOverview';
import { DemandIntelligence } from './features/chc/DemandIntelligence';
import { FleetManagement } from './features/chc/FleetManagement';
import { LiveTelematics } from './features/chc/LiveTelematics';
import { BookingsManager } from './features/chc/BookingsManager';
import { PredictiveMaintenance } from './features/chc/PredictiveMaintenance';
import { RevenueAnalytics } from './features/chc/RevenueAnalytics';
import { CHCSettings } from './features/chc/CHCSettings';

// Operator Console
import { OperatorDashboard } from './features/operator/OperatorDashboard';

// Admin Governance
import { AdminDashboard } from './features/admin/AdminDashboard';

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
        <ScrollToTop />
        <Routes>
          {/* Main Website Multi-Pages */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/products/pre-harvest" element={<ProductsPreHarvestPage />} />
          <Route path="/products/post-harvest" element={<ProductsPostHarvestPage />} />
          <Route path="/products/operations" element={<ProductsOperationsPage />} />
          <Route path="/solutions/chc" element={<SolutionsPage />} />
          <Route path="/solutions" element={<SolutionsPage />} />
          <Route path="/pricing" element={<PricingRoiPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Authentication & Role Selection */}
          <Route path="/role-select" element={<LandingRoleSelect />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Farmer Routes */}
          <Route path="/farmer" element={<FarmerLayout />}>
            <Route index element={<FarmerHome />} />
            <Route path="intelligence" element={<FarmIntelligence />} />
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

          {/* Dedicated Machine Operator Mobile Console */}
          <Route path="/operator" element={<OperatorLayout />}>
            <Route index element={<OperatorDashboard />} />
          </Route>

          {/* Platform Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
          </Route>

          {/* Custom 404 Catch-All */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
