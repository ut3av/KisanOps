import React from 'react';
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
  Sparkles
} from 'lucide-react';
import { DemoScenarioBar } from '../demo/DemoScenarioBar';
import { Navbar } from './Navbar';
import { YuktiAiWidget } from '../ai/YuktiAiWidget';
import { useKisanOpsStore } from '../../store/kisanOpsStore';
import clsx from 'clsx';

export const CHCLayout: React.FC = () => {
  const { state } = useKisanOpsStore();

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
      <DemoScenarioBar />
      <Navbar />

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col lg:flex-row gap-6">
        {/* Desktop Sidebar Navigation */}
        <aside className="w-full lg:w-64 shrink-0 space-y-4">
          {/* Hub Status Card */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-subtle">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Operating Hub</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
            <h3 className="text-sm font-extrabold text-slate-900">Sehore Agri Centre</h3>
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

          {/* Navigation Links */}
          <nav className="bg-white border border-slate-200/90 rounded-2xl p-2 shadow-subtle space-y-1">
            {chcNavItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all',
                    isActive
                      ? 'bg-indigo-900 text-white shadow-sm font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  )
                }
              >
                <div className="flex items-center gap-2.5">
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.pulse && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 radar-pulse" />
                  )}
                  {item.badge && (
                    <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded-md">
                      {item.badge}
                    </span>
                  )}
                  {item.count !== undefined && item.count > 0 && (
                    <span
                      className={clsx(
                        'text-[10px] font-bold px-1.5 py-0.5 rounded-full',
                        item.alert ? 'bg-rose-500 text-white animate-pulse' : 'bg-slate-100 text-slate-700'
                      )}
                    >
                      {item.count}
                    </span>
                  )}
                </div>
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* CHC Main Content Container */}
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>

      {/* Global Yukti AI Assistant */}
      <YuktiAiWidget />
    </div>
  );
};
