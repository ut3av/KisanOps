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
    <header className="bg-white border-b border-slate-200 sticky top-[41px] z-40 shadow-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo & Product Tagline */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-agri-800 flex items-center justify-center text-white shadow-sm group-hover:bg-agri-900 transition-colors">
            <Tractor className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight text-agri-950">KisanOps</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-agri-100 text-agri-800">
                PROD
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
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

          {/* Role Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-100 hover:bg-surface-200 border border-slate-200 text-xs font-semibold text-slate-800 transition-colors"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Role: {state.selectedRole.replace('_', ' ')}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-elevated border border-slate-200 py-2 z-50">
                <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Switch Active Persona
                </div>

                <button
                  onClick={() => handleRoleChange('FARMER')}
                  className={clsx(
                    'w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-slate-50',
                    state.selectedRole === 'FARMER' ? 'text-agri-800 font-bold bg-agri-50/60' : 'text-slate-700'
                  )}
                >
                  <User className="w-4 h-4 text-emerald-600" />
                  <div>
                    <div className="font-semibold">Farmer View</div>
                    <div className="text-[10px] text-slate-500">Ramesh Kumar (8 Acres)</div>
                  </div>
                </button>

                <button
                  onClick={() => handleRoleChange('CHC_MANAGER')}
                  className={clsx(
                    'w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-slate-50',
                    state.selectedRole === 'CHC_MANAGER' ? 'text-agri-800 font-bold bg-agri-50/60' : 'text-slate-700'
                  )}
                >
                  <Building2 className="w-4 h-4 text-sky-600" />
                  <div>
                    <div className="font-semibold">CHC Manager</div>
                    <div className="text-[10px] text-slate-500">Sehore Agri Centre</div>
                  </div>
                </button>

                <button
                  onClick={() => handleRoleChange('OPERATOR')}
                  className={clsx(
                    'w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-slate-50',
                    state.selectedRole === 'OPERATOR' ? 'text-agri-800 font-bold bg-agri-50/60' : 'text-slate-700'
                  )}
                >
                  <Tractor className="w-4 h-4 text-amber-600" />
                  <div>
                    <div className="font-semibold">Machine Operator</div>
                    <div className="text-[10px] text-slate-500">Raju Verma (4.9★)</div>
                  </div>
                </button>

                <button
                  onClick={() => handleRoleChange('ADMIN')}
                  className={clsx(
                    'w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-slate-50',
                    state.selectedRole === 'ADMIN' ? 'text-agri-800 font-bold bg-agri-50/60' : 'text-slate-700'
                  )}
                >
                  <ShieldCheck className="w-4 h-4 text-purple-600" />
                  <div>
                    <div className="font-semibold">Platform Admin</div>
                    <div className="text-[10px] text-slate-500">System Governance</div>
                  </div>
                </button>
              </div>
            )}
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
                className="w-8 h-8 rounded-full object-cover border border-slate-200"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-agri-100 text-agri-900 font-bold text-xs flex items-center justify-center">
                {state.currentUser.fullName.charAt(0)}
              </div>
            )}
            <div className="hidden lg:block text-left">
              <div className="text-xs font-bold text-slate-800 leading-tight">{state.currentUser.fullName}</div>
              <div className="text-[10px] text-slate-500">{state.currentUser.phoneNumber}</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
