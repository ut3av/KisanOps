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
  ChevronRight,
  X,
  PlusCircle,
  Sparkles,
  Save,
} from 'lucide-react';
import { useKisanOpsStore } from '../../store/kisanOpsStore';
import { Machine, MachineStatus, MachineCategory } from '../../types';
import { MachineThumbnail } from '../../components/common/MachineThumbnail';
import { getLocationFreshness } from '../../lib/availabilityService';
import { usePageTitle } from '../../hooks/usePageTitle';
import clsx from 'clsx';

export const FleetManagement: React.FC = () => {
  usePageTitle(
    'Fleet Registry & Machinery Status',
    'Track machinery availability, health scores, and technical specifications.'
  );
  const { state, addMachine, updateMachineStatus, loadDemoData } = useKisanOpsStore();
  const { machines, currentTelemetry, chcs } = state;

  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state for adding new machinery
  const [formData, setFormData] = useState({
    brand: 'Mahindra',
    model: '575 DI',
    category: 'TRACTOR' as MachineCategory,
    identifier: 'MP-09-AB-1234',
    powerHp: 50,
    baseRatePerHour: 850,
    baseRatePerAcre: 650,
    yearOfManufacture: 2024,
    healthScore: 98,
    operatorName: 'Assigned Driver',
    operatorPhone: '+91 98261 00000',
    chcName: chcs[0]?.name || 'Central Hub',
    telemetryMode: 'HARDWARE_IOT' as 'HARDWARE_IOT' | 'OPERATOR_GPS' | 'MANUAL',
    latitude: 23.2030,
    longitude: 77.0844,
    serviceIntervalHours: 250,
  });

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

  const handleOpenAddModal = () => {
    setFormData({
      brand: 'Mahindra',
      model: '575 DI',
      category: 'TRACTOR',
      identifier: `AGRI-${Math.floor(1000 + Math.random() * 9000)}`,
      powerHp: 50,
      baseRatePerHour: 850,
      baseRatePerAcre: 650,
      yearOfManufacture: 2024,
      healthScore: 98,
      operatorName: 'Assigned Operator',
      operatorPhone: '+91 98261 00000',
      chcName: chcs[0]?.name || 'Central Hub',
      telemetryMode: 'HARDWARE_IOT',
      latitude: chcs[0]?.latitude || 23.2030,
      longitude: chcs[0]?.longitude || 77.0844,
      serviceIntervalHours: 250,
    });
    setIsAddModalOpen(true);
  };

  const handleSaveMachine = (e: React.FormEvent) => {
    e.preventDefault();
    addMachine({
      brand: formData.brand,
      model: formData.model,
      category: formData.category,
      identifier: formData.identifier,
      powerHp: Number(formData.powerHp) || 50,
      baseRatePerHour: Number(formData.baseRatePerHour) || 800,
      baseRatePerAcre: Number(formData.baseRatePerAcre) || 600,
      yearOfManufacture: Number(formData.yearOfManufacture) || 2024,
      healthScore: Number(formData.healthScore) || 95,
      operatorName: formData.operatorName,
      operatorPhone: formData.operatorPhone,
      chcName: formData.chcName,
      status: 'AVAILABLE',
      latitude: Number(formData.latitude) || 23.2030,
      longitude: Number(formData.longitude) || 77.0844,
      telemetryMode: formData.telemetryMode,
      serviceIntervalHours: Number(formData.serviceIntervalHours) || 250,
      hoursSinceLastService: 0,
      totalEngineHours: 0,
    });
    setIsAddModalOpen(false);
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

        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenAddModal}
            className="btn-primary text-xs py-2 px-3.5 bg-agri-700 hover:bg-agri-800 text-white rounded-xl font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 shrink-0" />
            <span>+ Add Machinery Asset</span>
          </button>
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
            <option value="THRESHER">Threshers</option>
          </select>
        </div>
      </div>

      {/* Fleet Table */}
      <div className="bg-white border border-slate-200/90 rounded-3xl shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-surface-50 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Equipment / Model</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Telemetry Mode & GPS</th>
                <th className="py-3 px-4">Hourly Tariff</th>
                <th className="py-3 px-4">Health Index</th>
                <th className="py-3 px-4">Engine Hours</th>
                <th className="py-3 px-4">Operating Hub</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredMachines.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 px-4 text-center">
                    <div className="max-w-sm mx-auto space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-surface-100 text-slate-400 flex items-center justify-center mx-auto">
                        <Tractor className="w-6 h-6" />
                      </div>
                      <div className="font-extrabold text-slate-800 text-sm">
                        No registered fleet assets found
                      </div>
                      <p className="text-xs text-slate-500">
                        Add your first tractor, harvester, or implement to start dispatching and tracking live CAN-Bus telemetry.
                      </p>
                      <div className="flex items-center justify-center gap-2 pt-2">
                        <button
                          onClick={handleOpenAddModal}
                          className="btn-primary text-xs py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                          <span>+ Add First Machine</span>
                        </button>
                        <button
                          onClick={() => loadDemoData()}
                          className="btn-secondary text-xs py-2 px-3.5 inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                          <span>Load 7 Demo Assets</span>
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredMachines.map(machine => {
                  const telemetry = currentTelemetry[machine.id];
                  const freshness = getLocationFreshness(
                    machine.locationUpdatedAt || telemetry?.timestamp,
                    machine.locationSource
                  );

                  return (
                    <tr
                      key={machine.id}
                      onClick={() => setSelectedMachine(machine)}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <MachineThumbnail
                            src={machine.imageUrl}
                            alt={machine.model}
                            category={machine.category}
                            size="md"
                            containerClassName="rounded-xl shadow-xs shrink-0"
                          />
                          <div>
                            <div className="font-extrabold text-slate-900 group-hover:text-agri-800 transition-colors">
                              {machine.brand} {machine.model}
                            </div>
                            <div className="text-[11px] text-slate-500 font-mono">
                              {machine.identifier} • {machine.powerHp} HP
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-bold text-slate-700">
                        {machine.category}
                      </td>

                      <td className="py-3 px-4">
                        <span className={clsx('px-2.5 py-1 rounded-full text-[11px] font-bold border', getStatusBadgeClass(machine.status))}>
                          {machine.status}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="space-y-0.5">
                          <span className={clsx(
                            'text-[10px] font-extrabold px-2 py-0.5 rounded-md inline-block uppercase',
                            machine.telemetryMode === 'MANUAL'
                              ? 'bg-blue-100 text-blue-800'
                              : machine.telemetryMode === 'OPERATOR_GPS'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-purple-100 text-purple-800'
                          )}>
                            {machine.telemetryMode === 'MANUAL' ? 'Mode 1: Manual' : machine.telemetryMode === 'OPERATOR_GPS' ? 'Mode 2: Mobile GPS' : 'Mode 3: IoT Tracker'}
                          </span>
                          <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                            <span className={clsx(
                              'w-1.5 h-1.5 rounded-full',
                              freshness.status === 'LIVE' ? 'bg-emerald-500 animate-pulse' : freshness.status === 'RECENT' ? 'bg-amber-500' : 'bg-slate-400'
                            )} />
                            <span>{freshness.text}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        ₹{machine.baseRatePerHour}/hr
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-12 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                            <div
                              className={clsx(
                                'h-full rounded-full',
                                machine.healthScore >= 90 ? 'bg-emerald-500' : machine.healthScore >= 75 ? 'bg-amber-500' : 'bg-rose-500'
                              )}
                              style={{ width: `${machine.healthScore}%` }}
                            />
                          </div>
                          <span className="font-bold font-mono text-slate-700">{machine.healthScore}%</span>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono text-slate-700">
                        {telemetry ? `${telemetry.engineHours} hrs` : `${machine.totalEngineHours} hrs`}
                      </td>

                      <td className="py-3 px-4 text-slate-600 truncate max-w-[140px]">
                        {machine.chcName}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedMachine(machine);
                          }}
                          className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
                        >
                          <ChevronRight className="w-4 h-4" />
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

      {/* Add New Machinery Asset Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs animate-in fade-in"
            onClick={() => setIsAddModalOpen(false)}
          />

          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 z-10 space-y-5 animate-in scale-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-agri-100 text-agri-800 flex items-center justify-center font-bold shrink-0">
                  <Tractor className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Register New Machinery Asset
                  </h3>
                  <p className="text-xs text-slate-500">Add tractor, harvester, or implement to fleet</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveMachine} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Machine Category</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full bg-surface-50 border border-slate-200 rounded-xl px-3 py-2.5 font-bold text-slate-800 focus:ring-2 focus:ring-agri-500 focus:outline-none cursor-pointer"
                  >
                    <option value="TRACTOR">Tractor</option>
                    <option value="HARVESTER">Combine Harvester</option>
                    <option value="ROTAVATOR">Rotavator</option>
                    <option value="SEEDER">Seeder / Seed Drill</option>
                    <option value="SPRAYER">Boom Sprayer</option>
                    <option value="THRESHER">Thresher</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Registration Plate / ID</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MP-09-AB-1234"
                    value={formData.identifier}
                    onChange={e => setFormData({ ...formData, identifier: e.target.value })}
                    className="w-full bg-surface-50 border border-slate-200 rounded-xl px-3 py-2.5 font-mono font-bold text-slate-900 focus:ring-2 focus:ring-agri-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Manufacturer / Brand</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mahindra, John Deere, Sonalika, New Holland"
                    value={formData.brand}
                    onChange={e => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full bg-surface-50 border border-slate-200 rounded-xl px-3 py-2.5 font-medium text-slate-900 focus:ring-2 focus:ring-agri-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Model Name / Number</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 575 DI, 5310, Tiger 55"
                    value={formData.model}
                    onChange={e => setFormData({ ...formData, model: e.target.value })}
                    className="w-full bg-surface-50 border border-slate-200 rounded-xl px-3 py-2.5 font-medium text-slate-900 focus:ring-2 focus:ring-agri-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Power (HP)</label>
                  <input
                    type="number"
                    min="15"
                    max="200"
                    required
                    value={formData.powerHp}
                    onChange={e => setFormData({ ...formData, powerHp: Number(e.target.value) })}
                    className="w-full bg-surface-50 border border-slate-200 rounded-xl px-3 py-2.5 font-mono text-slate-900 focus:ring-2 focus:ring-agri-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Rate (₹/hr)</label>
                  <input
                    type="number"
                    min="100"
                    max="10000"
                    step="50"
                    required
                    value={formData.baseRatePerHour}
                    onChange={e => setFormData({ ...formData, baseRatePerHour: Number(e.target.value) })}
                    className="w-full bg-surface-50 border border-slate-200 rounded-xl px-3 py-2.5 font-mono font-bold text-slate-900 focus:ring-2 focus:ring-agri-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Year</label>
                  <input
                    type="number"
                    min="2015"
                    max="2026"
                    required
                    value={formData.yearOfManufacture}
                    onChange={e => setFormData({ ...formData, yearOfManufacture: Number(e.target.value) })}
                    className="w-full bg-surface-50 border border-slate-200 rounded-xl px-3 py-2.5 font-mono text-slate-900 focus:ring-2 focus:ring-agri-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Assigned Driver Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Raju Verma"
                    value={formData.operatorName}
                    onChange={e => setFormData({ ...formData, operatorName: e.target.value })}
                    className="w-full bg-surface-50 border border-slate-200 rounded-xl px-3 py-2.5 font-medium text-slate-900 focus:ring-2 focus:ring-agri-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Driver Phone</label>
                  <input
                    type="text"
                    placeholder="+91 98261 00000"
                    value={formData.operatorPhone}
                    onChange={e => setFormData({ ...formData, operatorPhone: e.target.value })}
                    className="w-full bg-surface-50 border border-slate-200 rounded-xl px-3 py-2.5 font-mono text-slate-900 focus:ring-2 focus:ring-agri-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Telemetry Tracking Architecture Mode</label>
                <select
                  value={formData.telemetryMode}
                  onChange={e => setFormData({ ...formData, telemetryMode: e.target.value as any })}
                  className="w-full bg-surface-50 border border-slate-200 rounded-xl px-3 py-2.5 font-bold text-slate-800 focus:ring-2 focus:ring-agri-500 focus:outline-none cursor-pointer"
                >
                  <option value="HARDWARE_IOT">Mode 3: Hardware IoT / CAN-Bus GPS Tracker</option>
                  <option value="OPERATOR_GPS">Mode 2: Driver Mobile App GPS Stream</option>
                  <option value="MANUAL">Mode 1: Manual CHC Location Setting</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Initial Latitude (°N)</label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    value={formData.latitude}
                    onChange={e => setFormData({ ...formData, latitude: Number(e.target.value) })}
                    className="w-full bg-surface-50 border border-slate-200 rounded-xl px-3 py-2.5 font-mono text-slate-900 focus:ring-2 focus:ring-agri-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Initial Longitude (°E)</label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    value={formData.longitude}
                    onChange={e => setFormData({ ...formData, longitude: Number(e.target.value) })}
                    className="w-full bg-surface-50 border border-slate-200 rounded-xl px-3 py-2.5 font-mono text-slate-900 focus:ring-2 focus:ring-agri-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Hub / Branch Location</label>
                <input
                  type="text"
                  placeholder="e.g. Indore Hub #01, Bhopal Depot"
                  value={formData.chcName}
                  onChange={e => setFormData({ ...formData, chcName: e.target.value })}
                  className="w-full bg-surface-50 border border-slate-200 rounded-xl px-3 py-2.5 font-medium text-slate-900 focus:ring-2 focus:ring-agri-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-agri-700 hover:bg-agri-800 text-white font-extrabold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Register Machine Asset</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Machine Details Inspector Modal */}
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

              {/* Live Status and Location Freshness Inspector */}
              {(() => {
                const freshness = getLocationFreshness(
                  selectedMachine.locationUpdatedAt,
                  selectedMachine.locationSource
                );

                return (
                  <div className="space-y-2.5 pt-1">
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-700">
                          Operational Status:
                        </span>
                        <select
                          value={selectedMachine.status}
                          onChange={e => {
                            const newStatus = e.target.value as MachineStatus;
                            updateMachineStatus(selectedMachine.id, newStatus);
                            setSelectedMachine({
                              ...selectedMachine,
                              status: newStatus,
                            });
                          }}
                          className="bg-white border border-slate-300 rounded-xl px-2.5 py-1 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                        >
                          <option value="AVAILABLE">AVAILABLE (PostGIS Ready)</option>
                          <option value="ACTIVE">ACTIVE (In Field)</option>
                          <option value="DISPATCHED">DISPATCHED (In Transit)</option>
                          <option value="RESERVED">RESERVED (Booked)</option>
                          <option value="MAINTENANCE">MAINTENANCE (Offline)</option>
                        </select>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1 border-t border-slate-200/80">
                        <span>Telemetry GPS Anchor:</span>
                        <span className="font-mono font-bold text-slate-800">
                          {selectedMachine.latitude ? selectedMachine.latitude.toFixed(4) : '23.2030'}° N,{' '}
                          {selectedMachine.longitude ? selectedMachine.longitude.toFixed(4) : '77.0844'}° E
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-600">
                        <span>Location Freshness:</span>
                        <span
                          className={clsx(
                            'font-bold px-2 py-0.5 rounded-full flex items-center gap-1',
                            freshness.status === 'LIVE'
                              ? 'bg-emerald-100 text-emerald-800'
                              : freshness.status === 'RECENT'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-200 text-slate-700'
                          )}
                        >
                          <span
                            className={clsx(
                              'w-1.5 h-1.5 rounded-full',
                              freshness.status === 'LIVE'
                                ? 'bg-emerald-600 animate-pulse'
                                : freshness.status === 'RECENT'
                                ? 'bg-amber-600'
                                : 'bg-slate-400'
                            )}
                          />
                          {freshness.text} ({selectedMachine.locationSource || 'last_known'})
                        </span>
                      </div>
                    </div>

                    {/* Service Interval & Engine Hours Gauge */}
                    <div className="bg-surface-50 p-3 rounded-2xl border border-slate-200 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-slate-700">Maintenance Service Interval:</span>
                        <span className="font-mono font-bold text-slate-800">
                          {selectedMachine.hoursSinceLastService || 140} / {selectedMachine.serviceIntervalHours || 250} hrs
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div
                          className={clsx(
                            'h-full rounded-full',
                            (selectedMachine.hoursSinceLastService || 140) >= (selectedMachine.serviceIntervalHours || 250)
                              ? 'bg-rose-600'
                              : (selectedMachine.hoursSinceLastService || 140) >= (selectedMachine.serviceIntervalHours || 250) * 0.8
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          )}
                          style={{
                            width: `${Math.min(100, Math.round(((selectedMachine.hoursSinceLastService || 140) / (selectedMachine.serviceIntervalHours || 250)) * 100))}%`,
                          }}
                        />
                      </div>
                      <div className="text-[10px] text-slate-500 flex items-center justify-between">
                        <span>Last Serviced at: 120 hrs</span>
                        <span className="font-bold">Next Service in {Math.max(0, (selectedMachine.serviceIntervalHours || 250) - (selectedMachine.hoursSinceLastService || 140))} hrs</span>
                      </div>
                    </div>
                  </div>
                );
              })()}

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

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <a
                href="/chc/telematics"
                className="btn-primary text-xs py-2 px-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold inline-flex items-center gap-1.5 shadow-sm"
              >
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                <span>Open Live Telematics</span>
              </a>
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
