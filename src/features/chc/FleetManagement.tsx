import React, { useState } from 'react';
import {
  Tractor,
  Filter,
  Search,
  SlidersHorizontal,
  Activity,
  Fuel,
  Clock,
  Wrench,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  ChevronRight,
  X
} from 'lucide-react';
import { useKisanOpsStore } from '../../store/kisanOpsStore';
import { Machine, MachineStatus, MachineCategory } from '../../types';
import { MachineThumbnail } from '../../components/common/MachineThumbnail';
import { usePageTitle } from '../../hooks/usePageTitle';
import clsx from 'clsx';

export const FleetManagement: React.FC = () => {
  usePageTitle(
    'Fleet Registry & Machinery Status',
    'Track machinery availability, health scores, and technical specifications.'
  );
  const { state } = useKisanOpsStore();
  const { machines, currentTelemetry } = state;

  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);

  const filteredMachines = machines.filter(m => {
    if (statusFilter !== 'ALL' && m.status !== statusFilter) return false;
    if (categoryFilter !== 'ALL' && m.category !== categoryFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match = `${m.brand} ${m.model} ${m.identifier} ${m.category} ${m.chcName}`.toLowerCase();
      if (!match.includes(q)) return false;
    }
    return true;
  });

  const getStatusBadgeClass = (status: MachineStatus) => {
    switch (status) {
      case 'AVAILABLE': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'ACTIVE': return 'bg-sky-100 text-sky-800 border-sky-200';
      case 'DISPATCHED': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'RESERVED': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'MAINTENANCE': return 'bg-rose-100 text-rose-800 border-rose-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-subtle flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Fleet Asset Management
            </h1>
            <span className="text-xs bg-agri-100 text-agri-800 font-bold px-2 py-0.5 rounded-md shrink-0">
              {machines.length} Total Registered Assets
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time status, health indicators, engine hours, and preventative service cycles.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-subtle flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 transform -translate-y-1/2 shrink-0" />
          <input
            type="text"
            placeholder="Search by ID, model, brand or CHC hub..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-surface-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-agri-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-surface-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-agri-500 cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="AVAILABLE">Available</option>
            <option value="ACTIVE">Active in Field</option>
            <option value="DISPATCHED">Dispatched</option>
            <option value="RESERVED">Reserved</option>
            <option value="MAINTENANCE">Maintenance</option>
          </select>

          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="bg-surface-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-agri-500 cursor-pointer"
          >
            <option value="ALL">All Categories</option>
            <option value="HARVESTER">Harvesters</option>
            <option value="TRACTOR">Tractors</option>
            <option value="ROTAVATOR">Rotavators</option>
            <option value="SEEDER">Seeders</option>
            <option value="SPRAYER">Sprayers</option>
          </select>
        </div>
      </div>

      {/* Fleet Table */}
      <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-subtle">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-surface-50 text-slate-600 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200 select-none">
              <tr>
                <th className="py-3.5 px-4 min-w-[240px]">Identifier / Asset</th>
                <th className="py-3.5 px-4 min-w-[150px]">Operating Hub</th>
                <th className="py-3.5 px-4 text-center min-w-[110px]">Status</th>
                <th className="py-3.5 px-4 text-center min-w-[100px]">Health Score</th>
                <th className="py-3.5 px-4 text-center min-w-[100px]">Engine Hours</th>
                <th className="py-3.5 px-4 text-center min-w-[120px]">Next Service</th>
                <th className="py-3.5 px-4 text-right min-w-[100px]">Tariff (₹/hr)</th>
                <th className="py-3.5 px-4 text-center min-w-[90px]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMachines.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Tractor className="w-8 h-8 text-slate-300 shrink-0" />
                      <span className="font-semibold text-xs text-slate-600">No machinery assets found</span>
                      <span className="text-[11px] text-slate-400">Try adjusting your search query or status filter.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredMachines.map(machine => {
                  const telemetry = currentTelemetry[machine.id];
                  const hoursToService = Math.round(machine.serviceIntervalHours - machine.hoursSinceLastService);

                  return (
                    <tr key={machine.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <MachineThumbnail
                            src={machine.imageUrl}
                            alt={machine.model}
                            category={machine.category}
                            size="md"
                          />
                          <div className="min-w-0">
                            <div className="font-extrabold text-slate-900 truncate">
                              {machine.brand} {machine.model}
                            </div>
                            <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1.5 mt-0.5">
                              <span className="font-semibold text-slate-700">{machine.identifier}</span>
                              <span>•</span>
                              <span>{machine.powerHp} HP</span>
                              <span className="text-[9px] bg-slate-100 px-1.5 py-0.2 rounded text-slate-600 uppercase font-bold">
                                {machine.category}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800">{machine.chcName}</div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-agri-700 shrink-0" />
                          <span>Sehore Hub Area</span>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span className={clsx('badge-status border text-[10px] inline-block font-bold', getStatusBadgeClass(machine.status))}>
                          {machine.status}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <div className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 font-mono">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{machine.healthScore}%</span>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-center font-mono font-bold text-slate-800">
                        {telemetry ? telemetry.engineHours : machine.totalEngineHours} hrs
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span
                          className={clsx(
                            'font-mono font-semibold text-xs',
                            hoursToService <= 30 ? 'text-rose-600 font-bold' : 'text-slate-600'
                          )}
                        >
                          {hoursToService} hrs remaining
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right font-bold text-slate-900 font-mono">
                        ₹{machine.baseRatePerHour}/hr
                      </td>

                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => setSelectedMachine(machine)}
                          className="btn-secondary text-[11px] py-1 px-2.5 cursor-pointer"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Machine Inspector Drawer / Modal */}
      {selectedMachine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 my-8 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs bg-agri-100 text-agri-800 font-bold px-2 py-0.5 rounded-md uppercase">
                  {selectedMachine.category}
                </span>
                <h3 className="text-lg font-extrabold text-slate-900 mt-1">
                  {selectedMachine.brand} {selectedMachine.model} ({selectedMachine.identifier})
                </h3>
              </div>
              <button
                onClick={() => setSelectedMachine(null)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5 shrink-0" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="h-48 rounded-2xl overflow-hidden">
                <MachineThumbnail
                  src={selectedMachine.imageUrl}
                  alt={selectedMachine.model}
                  category={selectedMachine.category}
                  size="full"
                  containerClassName="h-48 rounded-2xl"
                  showCategoryBadge={true}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-surface-50 p-2.5 rounded-xl border border-slate-200/70">
                  <div className="text-[10px] text-slate-500">Power Rating</div>
                  <div className="font-bold text-slate-800 mt-0.5">{selectedMachine.powerHp} HP Engine</div>
                </div>
                <div className="bg-surface-50 p-2.5 rounded-xl border border-slate-200/70">
                  <div className="text-[10px] text-slate-500">Health Certification</div>
                  <div className="font-bold text-emerald-600 mt-0.5">{selectedMachine.healthScore}% Certified</div>
                </div>
                <div className="bg-surface-50 p-2.5 rounded-xl border border-slate-200/70">
                  <div className="text-[10px] text-slate-500">Total Lifetime Rentals</div>
                  <div className="font-bold text-slate-800 mt-0.5">{selectedMachine.totalRentals} Completed</div>
                </div>
                <div className="bg-surface-50 p-2.5 rounded-xl border border-slate-200/70">
                  <div className="text-[10px] text-slate-500">Assigned Operator</div>
                  <div className="font-bold text-slate-800 mt-0.5">{selectedMachine.operatorName || 'Raju Verma'}</div>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 text-right">
              <button
                onClick={() => setSelectedMachine(null)}
                className="btn-secondary text-xs py-2 px-4 cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
