import React, { useState } from 'react';
import {
  Tractor,
  Bell,
  User,
  ShieldCheck,
  Building2,
  ChevronDown,
  LogOut,
  MapPin,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useKisanOpsStore } from '../../store/kisanOpsStore';
import { UserRole } from '../../types';
import { Link, useNavigate } from 'react-router-dom';
import clsx from 'clsx';

export const Navbar: React.FC = () => {
  const { state, switchRole, markNotificationRead } = useKisanOpsStore();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const navigate = useNavigate();

  const unreadCount = state.notifications.filter(n => !n.isRead).length;

  const handleRoleChange = (role: UserRole) => {
    switchRole(role);
    setShowRoleMenu(false);
    if (role === 'FARMER') navigate('/farmer');
    else if (role === 'ADMIN') navigate('/admin');
    else navigate('/chc');
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo & Product Tagline */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center border border-slate-200 shadow-sm group-hover:border-agri-600 transition-colors overflow-hidden">
            <img
              src="/images/yukti-logo-transparent.png"
              alt="Yukti Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-typewriter text-xl font-bold tracking-tight text-agri-950">
                Yukti
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-agri-100 text-agri-800 font-sans">
                PROD
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block font-sans">
              Predict. Allocate. Operate.
            </p>
          </div>
        </Link>

        {/* Right Section: Location + Role Switcher + Notifications + User Avatar */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Location Badge */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-100 border border-slate-200/80 text-xs font-medium text-slate-700">
            <MapPin className="w-3.5 h-3.5 text-agri-700" />
            <span>Sehore, Madhya Pradesh</span>
          </div>

          {/* Active Role Badge (Production Identity) */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-100 border border-slate-200 text-xs font-bold text-slate-800">
            <span className={clsx(
              'w-2 h-2 rounded-full',
              state.selectedRole === 'ADMIN' ? 'bg-purple-500' :
              state.selectedRole === 'CHC_MANAGER' ? 'bg-sky-500' :
              'bg-emerald-500'
            )} />
            <span>
              {state.selectedRole === 'ADMIN' ? 'Platform Admin' :
               state.selectedRole === 'CHC_MANAGER' ? 'CHC Hub Manager' :
               'Farmer Portal'}
            </span>
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-surface-100 relative transition-colors"
              aria-label="View notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
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
                  {state.notifications.map(notif => (
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
                        {!notif.isRead && <span className="w-2 h-2 rounded-full bg-emerald-500" />}
                      </div>
                      <p className="text-slate-600 mt-1 leading-snug">{notif.message}</p>
                      <span className="text-[10px] text-slate-400 mt-1.5 block">
                        {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            {state.currentUser.avatarUrl ? (
              <img
                src={state.currentUser.avatarUrl}
                alt={state.currentUser.fullName}
                loading="lazy"
                decoding="async"
                className="w-8 h-8 rounded-full object-cover border border-slate-200"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-agri-100 text-agri-900 font-bold text-xs flex items-center justify-center">
                {state.currentUser.fullName.charAt(0)}
              </div>
            )}
            <div className="hidden lg:block text-left">
              <div className="text-xs font-bold text-slate-800 leading-tight">{state.currentUser.fullName}</div>
              <div className="text-[10px] text-slate-500">{state.currentUser.email || state.currentUser.phoneNumber}</div>
            </div>

            {/* Log Out Button */}
            <button
              onClick={() => navigate('/login')}
              title="Sign Out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer ml-1"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
