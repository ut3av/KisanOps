import React, { useState } from 'react';
import {
  Menu,
  Bell,
  User,
  ShieldCheck,
  Building2,
  ChevronDown,
  LogOut,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Trash2,
  RotateCcw,
  Database
} from 'lucide-react';
import { useKisanOpsStore } from '../../store/kisanOpsStore';
import { UserRole } from '../../types';
import { Link, useNavigate } from 'react-router-dom';
import { SideNav } from './SideNav';
import clsx from 'clsx';

export const Navbar: React.FC = () => {
  const { state, markNotificationRead, loadDemoData, clearAllData } = useKisanOpsStore();
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const [isReloading, setIsReloading] = useState(false);
  const navigate = useNavigate();

  const handleReload = () => {
    setIsReloading(true);
    loadDemoData();
    setTimeout(() => setIsReloading(false), 600);
  };

  const unreadCount = state.notifications.filter(n => !n.isRead).length;
  const isDemoActive = state.isDemoLoaded || state.machines.length > 0;

  return (
    <>
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-subtle select-none">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
          {/* Left: SideNav Menu Toggle & Brand Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Global Sidenav Trigger Button */}
            <button
              onClick={() => setIsSideNavOpen(true)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all cursor-pointer flex items-center gap-1.5 border border-slate-200/80 shadow-2xs group"
              title="Open Navigation Menu"
              aria-label="Toggle SideNav"
            >
              <Menu className="w-5 h-5 shrink-0 text-slate-700 group-hover:text-agri-800 transition-colors" />
              <span className="hidden xl:inline text-xs font-bold text-slate-700 group-hover:text-agri-800">
                Menu
              </span>
            </button>

            {/* Logo & Product Tagline */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white p-1 flex items-center justify-center border border-slate-200 shadow-xs group-hover:border-agri-600 transition-colors overflow-hidden shrink-0">
                <img
                  src="/images/yukti-logo-transparent.png"
                  alt="Yukti Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="font-display text-lg sm:text-xl font-bold tracking-tight text-agri-950">
                    Yukti
                  </span>
                  <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider px-1.5 sm:px-2 py-0.5 rounded-md bg-agri-100 text-agri-800 font-sans shrink-0">
                    PROD
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium hidden sm:block font-sans truncate">
                  Predict. Allocate. Operate.
                </p>
              </div>
            </Link>
          </div>

          {/* Right Section: Demo Controls + Location + Verified Role Badge + Notifications + User Avatar */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Demo Data Management Controls */}
            {!isDemoActive ? (
              <button
                onClick={handleReload}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-sm transition-all cursor-pointer border border-amber-600 shrink-0 animate-pulse hover:animate-none"
                title="Load full demonstration dataset (7 machines, bookings, telematics, alerts)"
              >
                <Sparkles className={clsx('w-3.5 h-3.5 shrink-0 text-amber-200', isReloading && 'animate-spin')} />
                <span className="hidden sm:inline">Load Demo Data</span>
                <span className="sm:hidden">Load Demo</span>
              </button>
            ) : (
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => clearAllData()}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 shadow-2xs transition-all cursor-pointer"
                  title="Remove all demo data, telematics feeds, prices, bookings, and reset to clean baseline"
                >
                  <Trash2 className="w-3.5 h-3.5 shrink-0 text-rose-600" />
                  <span className="hidden md:inline">Remove All Data</span>
                  <span className="md:hidden">Clear</span>
                </button>
                <button
                  onClick={handleReload}
                  className="p-1.5 rounded-xl bg-surface-100 hover:bg-surface-200 text-slate-600 border border-slate-200 transition-colors cursor-pointer"
                  title="Reload complete demo dataset"
                >
                  <RotateCcw className={clsx('w-3.5 h-3.5 shrink-0 transition-transform duration-500', isReloading && 'animate-spin text-agri-600')} />
                </button>
              </div>
            )}

            {/* Location Badge */}
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-100 border border-slate-200/80 text-xs font-medium text-slate-700 shrink-0">
              <MapPin className="w-3.5 h-3.5 text-agri-700 shrink-0" />
              <span>Sehore, Madhya Pradesh</span>
            </div>

            {/* Production Verified Role Identity Badge (No demo switcher) */}
            <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-surface-100 border border-slate-200 text-xs font-bold text-slate-800 shrink-0 select-none">
              <span className={clsx(
                'w-2 h-2 rounded-full shrink-0',
                state.selectedRole === 'ADMIN' ? 'bg-purple-500' :
                state.selectedRole === 'CHC_MANAGER' ? 'bg-sky-500' :
                state.selectedRole === 'OPERATOR' ? 'bg-amber-500' :
                'bg-emerald-500'
              )} />
              <span className="hidden md:inline">
                {state.selectedRole === 'ADMIN' ? 'Platform Administrator' :
                 state.selectedRole === 'CHC_MANAGER' ? 'CHC Hub Manager' :
                 state.selectedRole === 'OPERATOR' ? 'Machine Operator' :
                 'Farmer Portal'}
              </span>
              <span className="md:hidden">
                {state.selectedRole === 'ADMIN' ? 'Admin' :
                 state.selectedRole === 'CHC_MANAGER' ? 'CHC' :
                 state.selectedRole === 'OPERATOR' ? 'Driver' :
                 'Farmer'}
              </span>
            </div>

            {/* Notifications Dropdown */}
            <div className="relative shrink-0">
              <button
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-surface-100 relative transition-colors cursor-pointer"
                aria-label="View notifications"
              >
                <Bell className="w-5 h-5 shrink-0" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifMenu && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-elevated border border-slate-200 py-3 z-50 max-h-96 overflow-y-auto">
                  <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">In-App Notifications</span>
                    <span className="text-[10px] text-slate-500 font-medium">{state.notifications.length} alerts</span>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {state.notifications.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-400">
                        No notifications in clean production state.
                      </div>
                    ) : (
                      state.notifications.map(notif => (
                        <div
                          key={notif.id}
                          onClick={() => {
                            markNotificationRead(notif.id);
                            if (notif.linkUrl) navigate(notif.linkUrl);
                            setShowNotifMenu(false);
                          }}
                          className={clsx(
                            'p-3 hover:bg-slate-50 cursor-pointer text-xs transition-colors',
                            !notif.isRead && 'bg-emerald-50/40'
                          )}
                        >
                          <div className="font-semibold text-slate-900 flex items-center justify-between">
                            <span>{notif.title}</span>
                            {!notif.isRead && <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />}
                          </div>
                          <p className="text-slate-600 mt-1 leading-snug">{notif.message}</p>
                          <span className="text-[10px] text-slate-400 mt-1.5 block">
                            {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 shrink-0">
              <div className={clsx(
                "w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center border shadow-xs select-none uppercase shrink-0",
                state.selectedRole === 'ADMIN' ? "bg-purple-100 text-purple-900 border-purple-200" :
                state.selectedRole === 'CHC_MANAGER' ? "bg-sky-100 text-sky-900 border-sky-200" :
                "bg-emerald-100 text-emerald-900 border-emerald-200"
              )}>
                {(state.currentUser.fullName || 'U').charAt(0)}
              </div>

              <div className="hidden xl:block text-left">
                <div className="text-xs font-bold text-slate-900 leading-tight">
                  {state.currentUser.fullName || 'Yukti User'}
                </div>
                <div className="text-[10px] font-semibold text-slate-500 truncate max-w-[120px]">
                  {state.selectedRole === 'ADMIN' ? 'Platform Administrator' :
                   state.selectedRole === 'CHC_MANAGER' ? 'CHC Hub Manager' :
                   state.selectedRole === 'OPERATOR' ? 'Machine Operator' :
                   'Farmer'}
                </div>
              </div>

              {/* Log Out Button */}
              <button
                onClick={() => navigate('/login')}
                title="Sign Out"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer ml-0.5"
              >
                <LogOut className="w-4 h-4 shrink-0" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Global Slide-Over SideNav Drawer */}
      <SideNav
        isOpen={isSideNavOpen}
        onClose={() => setIsSideNavOpen(false)}
        isDrawer={true}
      />
    </>
  );
};
