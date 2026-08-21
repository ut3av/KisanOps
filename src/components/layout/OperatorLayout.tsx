import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  Tractor,
  Radio,
  Fuel,
  Wrench,
  DollarSign,
  User,
  LogOut,
  MapPin,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { useKisanOpsStore } from '../../store/kisanOpsStore';
import clsx from 'clsx';

export const OperatorLayout: React.FC = () => {
  const { state, switchRole } = useKisanOpsStore();
  const navigate = useNavigate();

  const activeBooking = state.bookings.find(
    b => b.status === 'DISPATCHED' || b.status === 'IN_PROGRESS' || b.status === 'CONFIRMED'
  );

  return (
    <div className="min-h-screen bg-[#0d140e] text-slate-100 flex flex-col font-sans selection:bg-[#7aa32c]/30">
      {/* Top Mobile-First Operator Header */}
      <header className="bg-[#142217] border-b border-emerald-950/80 sticky top-0 z-40 px-4 py-3 shadow-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-900/60 p-1 flex items-center justify-center border border-emerald-700/60">
              <Tractor className="w-5 h-5 text-[#9dc84d]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-typewriter text-lg font-black text-white tracking-tight">
                  Yukti Driver
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-emerald-900/80 text-emerald-300 border border-emerald-700/60">
                  OPERATOR
                </span>
              </div>
              <p className="text-[11px] text-emerald-400/80 font-mono">
                {state.currentUser.fullName || 'Raju Verma'} • 4.9★ Harvester Specialist
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live GPS Beacon Pill */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/90 border border-emerald-800/80 text-[11px] font-bold text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>CAN-Bus Connected</span>
            </div>

            {/* Role Switch / Exit */}
            <button
              onClick={() => {
                switchRole('FARMER');
                navigate('/farmer');
              }}
              title="Switch Workspace"
              className="p-2 rounded-xl bg-emerald-950 border border-emerald-850 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 pb-24">
        <Outlet />
      </main>
    </div>
  );
};
