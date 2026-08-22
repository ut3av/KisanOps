import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  Home,
  Search,
  CalendarCheck,
  Wheat,
  CreditCard,
  User,
  ShieldCheck,
  Sparkles,
  Brain,
} from 'lucide-react';
import { Navbar } from './Navbar';
import { useKisanOpsStore } from '../../store/kisanOpsStore';
import { FloatingVoiceButton } from '../voice/FloatingVoiceButton';
import clsx from 'clsx';

export const FarmerLayout: React.FC = () => {
  const { state } = useKisanOpsStore();
  const { farm } = state;

  const navItems = [
    { to: '/farmer', icon: Home, label: 'Home', end: true },
    { to: '/farmer/intelligence', icon: Brain, label: 'Farm Intelligence' },
    { to: '/farmer/marketplace', icon: Search, label: 'Find Equipment' },
    { to: '/farmer/rentals', icon: CalendarCheck, label: 'My Rentals' },
    { to: '/farmer/farm', icon: Wheat, label: 'My Farm' },
    { to: '/farmer/credit', icon: CreditCard, label: 'AgriCredit' },
  ];

  return (
    <div className="min-h-screen bg-surface-50 flex flex-col">
      <Navbar />

      {/* Farmer Desktop Header Nav */}
      <div className="bg-white border-b border-slate-200 hidden md:block select-none shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <nav className="flex space-x-1 py-2">
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  clsx(
                    'px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-2 transition-all',
                    isActive
                      ? 'bg-agri-800 text-white shadow-sm font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  )
                }
              >
                <item.icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <span className="truncate max-w-sm">{farm.farmName} • {farm.sizeAcres} Acres ({farm.crop?.cropName || 'Wheat'})</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8">
        <Outlet />
      </main>

      {/* Floating Multilingual Voice AI Assistant Button */}
      <FloatingVoiceButton />

      {/* Mobile-First Bottom Navigation Bar */}
      <nav aria-label="Mobile Navigation" className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 z-30 px-2 py-2 shadow-elevated select-none">
        <div className="grid grid-cols-5 gap-1 max-w-md mx-auto">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                clsx(
                  'flex flex-col items-center justify-center py-1.5 rounded-xl text-[10px] font-semibold transition-all',
                  isActive
                    ? 'text-agri-800 bg-agri-50 font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                )
              }
            >
              <item.icon className="w-5 h-5 mb-0.5 shrink-0" />
              <span className="truncate">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};
