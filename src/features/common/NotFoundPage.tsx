import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Compass,
  ArrowLeft,
  Home,
  Sprout,
  Building2,
  LogIn,
  ShieldCheck,
  Search
} from 'lucide-react';
import { LandingNavbar } from '../landing/components/LandingNavbar';
import { LandingFooter } from '../landing/components/LandingFooter';
import { usePageTitle } from '../../hooks/usePageTitle';

export const NotFoundPage: React.FC = () => {
  usePageTitle(
    'Page Not Found (404)',
    'The requested agricultural resource could not be found.'
  );
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F5FAED] text-[#1c1d1f] flex flex-col font-sans selection:bg-[#7aa32c]/20 selection:text-[#2e4013]">
      <LandingNavbar />

      <main className="flex-1 flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl w-full text-center space-y-8">
          {/* Animated 404 Visual */}
          <div className="relative inline-block">
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-white border-2 border-[#7aa32c]/30 shadow-2xl flex items-center justify-center mx-auto relative overflow-hidden">
              <div className="absolute inset-0 bg-radial from-[#9dc84d]/20 to-transparent blur-xl pointer-events-none" />
              <Compass className="w-16 h-16 sm:w-20 sm:h-20 text-[#7aa32c] animate-spin" style={{ animationDuration: '18s' }} />
            </div>
            {/* Pill Tag */}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#1b4d3e] text-white text-xs font-bold font-typewriter shadow-md">
              GPS SATELLITE SIGNAL LOST
            </div>
          </div>

          <div className="space-y-3">
            <div className="font-typewriter text-5xl sm:text-7xl font-bold tracking-tight text-[#1c1d1f]">
              404
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Field Coordinates Not Found
            </h1>
            <p className="text-sm sm:text-base text-stone-600 max-w-lg mx-auto leading-relaxed">
              The agricultural plot, telematics gateway, or URL route you requested does not exist or has been reallocated across our regional hub network.
            </p>
          </div>

          {/* Quick Action Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto pt-4 text-left">
            <button
              onClick={() => navigate('/')}
              className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm hover:border-[#7aa32c] hover:shadow-md transition-all group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-[#F5FAED] text-[#7aa32c] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Home className="w-5 h-5" />
              </div>
              <div className="font-bold text-sm text-stone-900">Yukti Homepage</div>
              <div className="text-xs text-stone-500 mt-1">
                Explore platform & modular products
              </div>
            </button>

            <button
              onClick={() => navigate('/farmer')}
              className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm hover:border-emerald-500 hover:shadow-md transition-all group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Sprout className="w-5 h-5" />
              </div>
              <div className="font-bold text-sm text-stone-900">Farmer Experience</div>
              <div className="text-xs text-stone-500 mt-1">
                Equipment rentals & AgriCredit
              </div>
            </button>

            <button
              onClick={() => navigate('/chc')}
              className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm hover:border-agri-600 hover:shadow-md transition-all group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-800 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="font-bold text-sm text-stone-900">CHC Operations</div>
              <div className="text-xs text-stone-500 mt-1">
                Demand intelligence & fleet radar
              </div>
            </button>
          </div>

          <div className="pt-4">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1b4d3e] text-white text-xs sm:text-sm font-bold shadow-md hover:bg-[#153e32] transition-colors"
            >
              <LogIn className="w-4 h-4" />
              <span>Go to Authentication Login</span>
            </Link>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
};

export default NotFoundPage;
