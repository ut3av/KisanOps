import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Compass,
  Home,
  Sprout,
  Building2,
  LogIn,
  ArrowRight,
  MapPinOff,
  Satellite
} from 'lucide-react';
import { usePageTitle } from '../../hooks/usePageTitle';

export const NotFoundPage: React.FC = () => {
  usePageTitle(
    'Page Not Found (404)',
    'The requested agricultural resource could not be found.'
  );
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-surface-50 flex flex-col font-sans">
      {/* Full-page centered content */}
      <main className="flex-1 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
        <div
          className={`max-w-2xl w-full text-center space-y-8 transition-all duration-700 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          {/* Animated 404 Visual */}
          <div className="relative inline-block">
            <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-br from-agri-50 to-agri-100 border border-agri-200/60 shadow-xl flex items-center justify-center mx-auto relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-agri-200/30 to-transparent pointer-events-none" />
              <Compass
                className="w-16 h-16 sm:w-20 sm:h-20 text-agri-600"
                style={{ animation: 'spin 18s linear infinite' }}
              />
            </div>
            {/* Floating pill badge */}
            <div
              className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-agri-800 text-white text-[11px] font-bold tracking-wide shadow-lg flex items-center gap-1.5"
              style={{ animation: 'floatSlow 3s ease-in-out infinite' }}
            >
              <Satellite className="w-3.5 h-3.5 shrink-0" />
              <span>SIGNAL LOST</span>
            </div>
          </div>

          {/* Error Title */}
          <div className="space-y-3 pt-2">
            <div className="font-display text-6xl sm:text-8xl font-bold tracking-tighter text-slate-900">
              404
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
              Field Coordinates Not Found
            </h1>
            <p className="text-sm sm:text-base text-slate-500 max-w-lg mx-auto leading-relaxed">
              The route, telemetry endpoint, or resource you requested doesn't exist or has been reallocated across our regional hub network.
            </p>
          </div>

          {/* Quick Action Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl mx-auto pt-2">
            <button
              onClick={() => navigate('/')}
              className="p-5 rounded-2xl bg-white border border-slate-200 shadow-subtle hover:shadow-card hover:-translate-y-0.5 transition-all group cursor-pointer text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-agri-50 text-agri-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shrink-0">
                <Home className="w-5 h-5 shrink-0" />
              </div>
              <div className="font-display font-bold text-sm text-slate-900">Homepage</div>
              <div className="text-xs text-slate-500 mt-1">
                Explore the platform
              </div>
            </button>

            <button
              onClick={() => navigate('/farmer')}
              className="p-5 rounded-2xl bg-white border border-slate-200 shadow-subtle hover:shadow-card hover:-translate-y-0.5 transition-all group cursor-pointer text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shrink-0">
                <Sprout className="w-5 h-5 shrink-0" />
              </div>
              <div className="font-display font-bold text-sm text-slate-900">Farmer Portal</div>
              <div className="text-xs text-slate-500 mt-1">
                Rentals & AgriCredit
              </div>
            </button>

            <button
              onClick={() => navigate('/chc')}
              className="p-5 rounded-2xl bg-white border border-slate-200 shadow-subtle hover:shadow-card hover:-translate-y-0.5 transition-all group cursor-pointer text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shrink-0">
                <Building2 className="w-5 h-5 shrink-0" />
              </div>
              <div className="font-display font-bold text-sm text-slate-900">CHC Operations</div>
              <div className="text-xs text-slate-500 mt-1">
                Fleet & demand radar
              </div>
            </button>
          </div>

          {/* Login CTA */}
          <div className="pt-2">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-agri-700 hover:bg-agri-800 text-white text-sm font-bold shadow-md hover:shadow-lg transition-all"
            >
              <LogIn className="w-4 h-4 shrink-0" />
              <span>Go to Login</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NotFoundPage;
