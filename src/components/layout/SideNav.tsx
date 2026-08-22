import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  TrendingUp,
  Tractor,
  Radio,
  CalendarCheck2,
  Wrench,
  BarChart3,
  Settings,
  Home,
  Search,
  CalendarCheck,
  Wheat,
  CreditCard,
  ShieldCheck,
  Cpu,
  ChevronLeft,
  ChevronRight,
  X,
  MapPin,
  Sparkles,
  Zap,
  Activity,
  LogOut,
  HelpCircle,
  PhoneCall,
  Flame,
  AlertTriangle,
  LucideIcon,
  Trash2,
  RotateCcw
} from 'lucide-react';
import { useKisanOpsStore } from '../../store/kisanOpsStore';
import { UserRole } from '../../types';
import clsx from 'clsx';

interface SideNavProps {
  isOpen?: boolean;
  onClose?: () => void;
  isDrawer?: boolean;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

interface NavItem {
  to: string;
  icon: LucideIcon;
  label: string;
  end?: boolean;
  badge?: string;
  count?: number;
  alert?: boolean;
  pulse?: boolean;
}

export const SideNav: React.FC<SideNavProps> = ({
  isOpen = false,
  onClose,
  isDrawer = false,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const { state, switchRole, loadDemoData, clearAllData } = useKisanOpsStore();
  const navigate = useNavigate();
  const location = useLocation();

  const activeAlertsCount = state.maintenanceAlerts.filter(a => !a.isResolved).length;
  const pendingBookingsCount = state.bookings.filter(
    b => b.status === 'REQUESTED' || b.status === 'CONFIRMED'
  ).length;

  // Close drawer on route change
  useEffect(() => {
    if (isDrawer && onClose) {
      onClose();
    }
  }, [location.pathname]);

  // Handle ESC key to close drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDrawer && onClose) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDrawer, onClose]);

  const handleRoleChange = (role: UserRole) => {
    switchRole(role);
    if (onClose) onClose();
    if (role === 'FARMER') navigate('/farmer');
    else if (role === 'OPERATOR') navigate('/operator');
    else if (role === 'ADMIN') navigate('/admin');
    else navigate('/chc');
  };

  const chcNavItems: NavItem[] = [
    { to: '/chc', icon: LayoutDashboard, label: 'Overview', end: true },
    { to: '/chc/demand', icon: TrendingUp, label: 'Demand Forecast', badge: 'Surge +34%' },
    { to: '/chc/fleet', icon: Tractor, label: 'Fleet Management' },
    { to: '/chc/telematics', icon: Radio, label: 'Live Telematics', pulse: true },
    { to: '/chc/bookings', icon: CalendarCheck2, label: 'Bookings & Dispatch', count: pendingBookingsCount },
    { to: '/chc/maintenance', icon: Wrench, label: 'Maintenance Hub', count: activeAlertsCount, alert: activeAlertsCount > 0 },
    { to: '/chc/analytics', icon: BarChart3, label: 'Revenue & Yield' },
    { to: '/chc/settings', icon: Settings, label: 'Hub Settings' },
  ];

  const farmerNavItems: NavItem[] = [
    { to: '/farmer', icon: Home, label: 'Farmer Home', end: true },
    { to: '/farmer/marketplace', icon: Search, label: 'Rent Machinery' },
    { to: '/farmer/rentals', icon: CalendarCheck, label: 'My Bookings', count: pendingBookingsCount },
    { to: '/farmer/farm', icon: Wheat, label: 'My Farmland & Soil' },
    { to: '/farmer/credit', icon: CreditCard, label: 'AgriCredit Financing' },
  ];

  const adminNavItems: NavItem[] = [
    { to: '/admin', icon: ShieldCheck, label: 'Platform Command', end: true },
  ];

  const operatorNavItems: NavItem[] = [
    { to: '/operator', icon: Tractor, label: 'Operator Console', end: true },
  ];

  const currentRole = state.selectedRole;
  const currentNavItems: NavItem[] =
    currentRole === 'CHC_MANAGER' || currentRole === 'FLEET_MANAGER'
      ? chcNavItems
      : currentRole === 'FARMER'
      ? farmerNavItems
      : currentRole === 'ADMIN'
      ? adminNavItems
      : operatorNavItems;

  const roleColors: Record<UserRole, { bg: string; text: string; dot: string; label: string }> = {
    FARMER: { bg: 'bg-emerald-50 text-emerald-900 border-emerald-200', text: 'text-emerald-700', dot: 'bg-emerald-500', label: 'Farmer Portal' },
    CHC_MANAGER: { bg: 'bg-sky-50 text-sky-900 border-sky-200', text: 'text-sky-700', dot: 'bg-sky-500', label: 'CHC Hub Manager' },
    FLEET_MANAGER: { bg: 'bg-sky-50 text-sky-900 border-sky-200', text: 'text-sky-700', dot: 'bg-sky-500', label: 'Fleet Manager' },
    OPERATOR: { bg: 'bg-amber-50 text-amber-900 border-amber-200', text: 'text-amber-700', dot: 'bg-amber-500', label: 'Machine Operator' },
    ADMIN: { bg: 'bg-purple-50 text-purple-900 border-purple-200', text: 'text-purple-700', dot: 'bg-purple-500', label: 'Platform Admin' },
  };

  const navContent = (
    <div className="flex flex-col h-full overflow-y-auto custom-scrollbar select-none">
      {/* Header / Brand in SideNav */}
      <div className={clsx(
        'p-4 border-b border-slate-100 flex items-center justify-between',
        isCollapsed && !isDrawer ? 'justify-center px-2' : 'px-4'
      )}>
        {(!isCollapsed || isDrawer) ? (
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white p-1 flex items-center justify-center border border-slate-200 shadow-xs shrink-0">
              <img
                src="/images/yukti-logo-transparent.png"
                alt="Yukti"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-typewriter text-base font-bold text-slate-900 tracking-tight">
                  Yukti
                </span>
                <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-agri-100 text-agri-800">
                  {currentRole.slice(0, 3)}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium truncate">
                AI Mechanization Hub
              </p>
            </div>
          </div>
        ) : (
          <div className="w-8 h-8 rounded-xl bg-white p-1 flex items-center justify-center border border-slate-200 shadow-xs shrink-0">
            <img
              src="/images/yukti-logo-transparent.png"
              alt="Yukti"
              className="w-full h-full object-contain"
            />
          </div>
        )}

        {/* Close Button if Drawer */}
        {isDrawer && onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5 shrink-0" />
          </button>
        )}

        {/* Collapse Toggle if persistent desktop */}
        {!isDrawer && onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className={clsx(
              'p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer shrink-0',
              isCollapsed && 'mt-1'
            )}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      {/* Role Switcher Pill in Sidenav */}
      <div className={clsx('p-3', isCollapsed && !isDrawer ? 'px-2' : 'px-3')}>
        {(!isCollapsed || isDrawer) ? (
          <div className="bg-surface-50 p-2 rounded-2xl border border-slate-200/80 space-y-1.5">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
              <span>Active Workspace</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            </div>

            <div className="grid grid-cols-2 gap-1 text-[11px]">
              {(['FARMER', 'CHC_MANAGER', 'OPERATOR', 'ADMIN'] as UserRole[]).map(role => {
                const isSelected = currentRole === role;
                return (
                  <button
                    key={role}
                    onClick={() => handleRoleChange(role)}
                    className={clsx(
                      'px-2 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all text-left truncate cursor-pointer',
                      isSelected
                        ? 'bg-white shadow-xs border border-slate-200 text-slate-900'
                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'
                    )}
                  >
                    <span
                      className={clsx(
                        'w-1.5 h-1.5 rounded-full shrink-0',
                        roleColors[role].dot
                      )}
                    />
                    <span className="truncate">
                      {role === 'FARMER' ? 'Farmer' : role === 'CHC_MANAGER' ? 'CHC Hub' : role === 'OPERATOR' ? 'Operator' : 'Admin'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1 py-1">
            <span
              className={clsx(
                'w-3 h-3 rounded-full shrink-0',
                roleColors[currentRole]?.dot || 'bg-emerald-500'
              )}
              title={`Active: ${roleColors[currentRole]?.label || 'Portal'}`}
            />
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-3 py-2 space-y-1">
        {(!isCollapsed || isDrawer) && (
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1">
            Navigation Menu
          </div>
        )}

        {currentNavItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            title={isCollapsed && !isDrawer ? item.label : undefined}
            className={({ isActive }) =>
              clsx(
                'flex items-center rounded-xl text-xs font-bold transition-all group',
                isCollapsed && !isDrawer
                  ? 'justify-center p-2.5 my-1'
                  : 'justify-between px-3.5 py-2.5',
                isActive
                  ? 'bg-agri-800 text-white shadow-sm font-extrabold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              )
            }
          >
            {({ isActive }) => (
              <>
                <div className="flex items-center gap-2.5 min-w-0">
                  <item.icon
                    className={clsx(
                      'w-4 h-4 shrink-0 transition-transform group-hover:scale-110',
                      isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-800'
                    )}
                  />
                  {(!isCollapsed || isDrawer) && (
                    <span className="truncate">{item.label}</span>
                  )}
                </div>

                {(!isCollapsed || isDrawer) && (
                  <div className="flex items-center gap-1.5 shrink-0 ml-1">
                    {item.pulse && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 radar-pulse shrink-0" />
                    )}
                    {item.badge && (
                      <span className={clsx(
                        'text-[10px] font-bold px-1.5 py-0.2 rounded-md shrink-0',
                        isActive ? 'bg-agri-950/40 text-amber-200' : 'bg-amber-100 text-amber-800'
                      )}>
                        {item.badge}
                      </span>
                    )}
                    {item.count !== undefined && item.count > 0 && (
                      <span
                        className={clsx(
                          'text-[10px] font-bold px-1.5 py-0.2 rounded-full shrink-0',
                          item.alert
                            ? 'bg-rose-500 text-white animate-pulse'
                            : isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-slate-200 text-slate-700'
                        )}
                      >
                        {item.count}
                      </span>
                    )}
                  </div>
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>

      {/* Operating Context / Hub Card */}
      {(!isCollapsed || isDrawer) && (
        <div className="p-3 mt-auto space-y-2 border-t border-slate-100">
          {/* Data Management Controls Card */}
          <div className="bg-surface-50 p-2.5 rounded-2xl border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500">
              <span>Platform Dataset</span>
              <span className={clsx(
                'px-1.5 py-0.2 rounded text-[9px] font-black',
                state.machines.length > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
              )}>
                {state.machines.length > 0 ? `${state.machines.length} Assets Demo` : 'Clean Slate'}
              </span>
            </div>

            {state.machines.length === 0 ? (
              <button
                onClick={() => loadDemoData()}
                className="w-full py-1.5 px-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-200 shrink-0" />
                <span>Load Demo Dataset</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => clearAllData()}
                  className="flex-1 py-1.5 px-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-bold border border-rose-200 shadow-2xs transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3 text-rose-600 shrink-0" />
                  <span>Remove All</span>
                </button>
                <button
                  onClick={() => loadDemoData()}
                  className="p-1.5 rounded-xl bg-surface-100 hover:bg-surface-200 text-slate-700 border border-slate-200 text-xs transition-colors cursor-pointer"
                  title="Reload Demo Dataset"
                >
                  <RotateCcw className="w-3.5 h-3.5 shrink-0" />
                </button>
              </div>
            )}
          </div>

          <div className="bg-surface-100 p-3 rounded-2xl border border-slate-200/70 space-y-1 text-xs">
            <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold uppercase">
              <span>{currentRole === 'FARMER' ? 'Active Farmland' : 'Operating Hub'}</span>
              <span className="flex items-center gap-1 text-emerald-600 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                Live
              </span>
            </div>
            <div className="font-extrabold text-slate-800 truncate">
              {currentRole === 'FARMER' ? state.farm.farmName : (state.chcs[0]?.name || 'Sehore Agri Centre (CHC #01)')}
            </div>
            <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1 truncate">
              <MapPin className="w-3 h-3 text-agri-700 shrink-0" />
              <span>
                {currentRole === 'FARMER'
                  ? `${state.farm.sizeAcres} Acres • ${state.farm.crop?.cropName || 'Wheat'}`
                  : `${state.machines.length} Units • Sehore MP`}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Render as Slide-Over Drawer for Mobile / Global Trigger
  if (isDrawer) {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex">
        {/* Backdrop Overlay */}
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Drawer Panel */}
        <aside
          className="relative w-72 max-w-[85vw] bg-white h-full shadow-2xl border-r border-slate-200 z-50 flex flex-col transform transition-transform duration-300 ease-out animate-in slide-in-from-left"
          role="dialog"
          aria-modal="true"
          aria-label="Sidebar Navigation"
        >
          {navContent}
        </aside>
      </div>
    );
  }

  // Render as Persistent Desktop Sidenav
  return (
    <aside
      className={clsx(
        'hidden lg:flex flex-col bg-white border-r border-slate-200/90 shadow-subtle shrink-0 transition-all duration-300 sticky top-16 h-[calc(100vh-4rem)] z-20',
        isCollapsed ? 'w-18' : 'w-64'
      )}
    >
      {navContent}
    </aside>
  );
};
