import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  TrendingUp,
  Tractor,
  Radio,
  CalendarCheck2,
  Wrench,
  BarChart3,
  Settings,
  AlertTriangle,
  Zap,
  Activity,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Navbar } from './Navbar';
import { useKisanOpsStore } from '../../store/kisanOpsStore';
import clsx from 'clsx';

export const CHCLayout: React.FC = () => {
  const { state } = useKisanOpsStore();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const activeAlertsCount = state.maintenanceAlerts.filter(a => !a.isResolved).length;
  const pendingBookingsCount = state.bookings.filter(b => b.status === 'REQUESTED' || b.status === 'CONFIRMED').length;

  const chcNavItems = [
    { to: '/chc', icon: LayoutDashboard, label: 'Overview', end: true },
    { to: '/chc/demand', icon: TrendingUp, label: 'Demand Intelligence', badge: 'Surge +34%' },
    { to: '/chc/fleet', icon: Tractor, label: 'Fleet Management' },
    { to: '/chc/telematics', icon: Radio, label: 'Live Telematics', pulse: true },
    { to: '/chc/bookings', icon: CalendarCheck2, label: 'Bookings & Dispatch', count: pendingBookingsCount },
    { to: '/chc/maintenance', icon: Wrench, label: 'Predictive Maintenance', count: activeAlertsCount, alert: activeAlertsCount > 0 },
    { to: '/chc/analytics', icon: BarChart3, label: 'Revenue & Utilization' },
    { to: '/chc/settings', icon: Settings, label: 'Hub Settings' },
  ];

  return (
    <div className="min-h-screen bg-surface-50 flex flex-col">
      <Navbar />

      {/* Mobile Horizontal Subnav Pill Bar (lg:hidden) */}
      <div className="lg:hidden bg-white border-b border-slate-200 sticky top-16 z-30 shadow-2xs select-none">
        <div className="flex items-center gap-1.5 px-3 py-2.5 overflow-x-auto no-scrollbar">
          {chcNavItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all',
                  isActive
                    ? 'bg-agri-800 text-white shadow-xs'
                    : 'text-slate-600 bg-surface-50 hover:bg-slate-100'
                )
              }
            >
              <item.icon className="w-3.5 h-3.5 shrink-0" />
              <span>{item.label}</span>
              {item.pulse && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 radar-pulse shrink-0" />
              )}
              {item.count !== undefined && item.count > 0 && (
                <span
                  className={clsx(
                    'text-[10px] font-bold px-1.5 py-0.2 rounded-full shrink-0',
                    item.alert ? 'bg-rose-500 text-white' : 'bg-slate-200 text-slate-700'
                  )}
                >
                  {item.count}
                </span>
              )}
            </NavLink>
          ))}
        </div>
      </div>

      <div className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col lg:flex-row gap-6">
        {/* Desktop Sidebar Navigation (Hidden on Mobile) */}
        <aside className={clsx(
          'hidden lg:block shrink-0 space-y-4 transition-all duration-300',
          isCollapsed ? 'w-18' : 'w-64'
        )}>
          {/* Hub Status Card */}
          {!isCollapsed ? (
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-subtle">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Operating Hub</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              </div>
              <h3 className="text-sm font-extrabold text-agri-950 truncate">Sehore Agri Centre</h3>
              <p className="text-xs text-slate-500 font-mono mt-0.5">Code: CHC-MP-SEH-01</p>

              <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                <div className="bg-surface-50 p-2 rounded-xl">
                  <div className="text-[10px] text-slate-500">Fleet Active</div>
                  <div className="font-bold text-slate-800">11 / 14</div>
                </div>
                <div className="bg-surface-50 p-2 rounded-xl">
                  <div className="text-[10px] text-slate-500">Utilization</div>
                  <div className="font-bold text-emerald-600">78.4%</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200/90 rounded-2xl p-2.5 shadow-subtle flex flex-col items-center justify-center">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" title="Hub Active: Sehore CHC" />
            </div>
          )}

          {/* Navigation Links Card */}
          <nav className="bg-white border border-slate-200/90 rounded-2xl p-2 shadow-subtle space-y-1 select-none">
            <div className="flex items-center justify-between px-2 py-1 mb-1 border-b border-slate-100">
              {!isCollapsed && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  CHC Hub Menu
                </span>
              )}
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer ml-auto"
                title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                {isCollapsed ? (
                  <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                ) : (
                  <ChevronLeft className="w-3.5 h-3.5 shrink-0" />
                )}
              </button>
            </div>

            {chcNavItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                title={isCollapsed ? item.label : undefined}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center rounded-xl text-xs font-semibold transition-all group',
                    isCollapsed
                      ? 'justify-center p-2.5 my-0.5'
                      : 'justify-between px-3.5 py-2.5',
                    isActive
                      ? 'bg-agri-800 text-white shadow-sm font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  )
                }
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <item.icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </div>

                {!isCollapsed && (
                  <div className="flex items-center gap-1.5 shrink-0 ml-1">
                    {item.pulse && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 radar-pulse shrink-0" />
                    )}
                    {item.badge && (
                      <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded-md shrink-0">
                        {item.badge}
                      </span>
                    )}
                    {item.count !== undefined && item.count > 0 && (
                      <span
                        className={clsx(
                          'text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0',
                          item.alert ? 'bg-rose-500 text-white animate-pulse' : 'bg-slate-100 text-slate-700'
                        )}
                      >
                        {item.count}
                      </span>
                    )}
                  </div>
                )}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* CHC Main Content Container */}
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
