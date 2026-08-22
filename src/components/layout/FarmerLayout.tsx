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
  Tractor
} from 'lucide-react';
import { DemoScenarioBar } from '../demo/DemoScenarioBar';
import { Navbar } from './Navbar';
import clsx from 'clsx';

export const FarmerLayout: React.FC = () => {
  const navItems = [
    { to: '/farmer', icon: Home, label: 'Home', end: true },
    { to: '/farmer/marketplace', icon: Search, label: 'Find Equipment' },
    { to: '/farmer/rentals', icon: CalendarCheck, label: 'My Rentals' },
    { to: '/farmer/farm', icon: Wheat, label: 'My Farm' },
    { to: '/farmer/credit', icon: CreditCard, label: 'AgriCredit' },
    { to: '/operator', icon: Tractor, label: 'Operator App' },
  ];

  return (
    <div className="min-h-screen bg-surface-50 flex flex-col">
      <DemoScenarioBar />
      <Navbar />

      {/* Farmer Desktop Header Nav */}
      <div className="bg-white border-b border-slate-200 hidden md:block">
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
                      ? 'bg-agri-800 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  )
                }
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Farm ID: BIL-SEH-08 • 8.0 Acres Wheat</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8">
        <Outlet />
      </main>

      {/* Mobile-First Bottom Navigation Bar */}
      <nav aria-label="Mobile Navigation" className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 z-50 px-2 py-2 shadow-elevated overflow-x-auto">
        <div className="flex gap-2 min-w-max mx-auto px-2">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                clsx(
                  'flex flex-col items-center justify-center py-1.5 px-3 rounded-xl text-[10px] font-semibold transition-all min-w-[72px]',
                  isActive
                    ? 'text-agri-800 bg-agri-50'
                    : 'text-slate-500 hover:text-slate-800'
                )
              }
            >
              <item.icon className="w-5 h-5 mb-0.5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};
