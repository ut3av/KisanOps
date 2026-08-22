import React, { useState, useEffect } from 'react';
import {
  Tractor,
  Play,
  Pause,
  CheckCircle2,
  Phone,
  Navigation,
  Fuel,
  Wrench,
  DollarSign,
  AlertTriangle,
  Clock,
  MapPin,
  Sparkles,
  ShieldCheck,
  Radio,
  FileCheck,
  Check,
  PlusCircle,
  Thermometer,
  Gauge
} from 'lucide-react';
import { useKisanOpsStore } from '../../store/kisanOpsStore';
import { LeafletFleetMap } from '../../components/common/LeafletFleetMap';
import { TelematicsGaugeCluster } from '../../components/common/TelematicsGauge';
import { usePageTitle } from '../../hooks/usePageTitle';
import clsx from 'clsx';

export const OperatorDashboard: React.FC = () => {
  usePageTitle(
    'Machine Operator & Driver Console',
    'Active machine mission, engine telemetry stopwatch, diesel logs, and incident reporting.'
  );
  const { state, updateBookingStatus, toggleFuelAnomaly, loadDemoData } = useKisanOpsStore();
  const { bookings, machines, currentTelemetry, farm, chcs, simulationState } = state;

  const [activeTab, setActiveTab] = useState<'MISSION' | 'DIESEL' | 'SAFETY' | 'EARNINGS'>('MISSION');
  
  // Stopwatch elapsed seconds for active job
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(6 * 3600 + 24 * 60); // 6.4 hours default
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Digital Diesel Log State
  const [litresFilled, setLitresFilled] = useState<string>('45');
  const [dieselCost, setDieselCost] = useState<string>('4050');
  const [dieselStation, setDieselStation] = useState<string>('Indian Oil Bilkisganj Outlet');
  const [dieselLogged, setDieselLogged] = useState<boolean>(false);

  // Incident & Breakdown Report State
  const [selectedFault, setSelectedFault] = useState<string>('HYDRAULIC_PRESSURE');
  const [faultNotes, setFaultNotes] = useState<string>('');
  const [faultSubmitted, setFaultSubmitted] = useState<boolean>(false);

  const activeBooking = bookings.find(
    b => b.status === 'IN_PROGRESS' || b.status === 'DISPATCHED' || b.status === 'CONFIRMED'
  ) || bookings[0];

  const assignedMachine = machines.find(m => m.id === activeBooking?.machineId) || machines[0];
  const telemetry = assignedMachine ? currentTelemetry[assignedMachine.id] : undefined;

  useEffect(() => {
    let interval: any = null;
    if (activeBooking?.status === 'IN_PROGRESS' || isTimerRunning) {
      interval = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeBooking?.status, isTimerRunning]);

  const formatStopwatch = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartWork = () => {
    if (activeBooking) {
      updateBookingStatus(activeBooking.id, 'IN_PROGRESS');
      setIsTimerRunning(true);
    }
  };

  const handlePauseWork = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const handleCompleteWork = () => {
    if (activeBooking) {
      updateBookingStatus(activeBooking.id, 'COMPLETED');
      setIsTimerRunning(false);
    }
  };

  const handleLogDiesel = (e: React.FormEvent) => {
    e.preventDefault();
    setDieselLogged(true);
    setTimeout(() => setDieselLogged(false), 3500);
  };

  const handleReportFault = (e: React.FormEvent) => {
    e.preventDefault();
    setFaultSubmitted(true);
    toggleFuelAnomaly(true);
    setTimeout(() => setFaultSubmitted(false), 4000);
  };

  if (!assignedMachine) {
    return (
      <div className="bg-[#121f15] text-white rounded-3xl p-12 text-center border border-emerald-900/60 shadow-xl space-y-4 max-w-lg mx-auto my-8">
        <div className="w-16 h-16 rounded-2xl bg-emerald-950 flex items-center justify-center mx-auto border border-emerald-800 text-emerald-400">
          <Tractor className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-white">Operator Console: Standby Mode</h3>
        <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
          Clean-slate production baseline active. There are currently no assigned machinery missions, active work orders, or telematics telemetry feeds.
        </p>
        <button
          onClick={() => loadDemoData()}
          className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-md transition-colors cursor-pointer inline-flex items-center gap-1.5"
        >
          <Sparkles className="w-4 h-4 text-amber-200" />
          <span>⚡ Load Demo Operator Mission</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Tab Navigation Pill Bar */}
      <div className="flex p-1 bg-[#152319] rounded-2xl border border-emerald-900/60 overflow-x-auto gap-1">
        <button
          type="button"
          onClick={() => setActiveTab('MISSION')}
          className={clsx(
            'flex-1 min-w-[100px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer',
            activeTab === 'MISSION'
              ? 'bg-[#7aa32c] text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          )}
        >
          <Tractor className="w-4 h-4" />
          <span>Active Mission</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('DIESEL')}
          className={clsx(
            'flex-1 min-w-[100px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer',
            activeTab === 'DIESEL'
              ? 'bg-[#7aa32c] text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          )}
        >
          <Fuel className="w-4 h-4" />
          <span>Diesel Slips</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('SAFETY')}
          className={clsx(
            'flex-1 min-w-[100px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer',
            activeTab === 'SAFETY'
              ? 'bg-[#7aa32c] text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          )}
        >
          <Wrench className="w-4 h-4" />
          <span>Safety & Faults</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('EARNINGS')}
          className={clsx(
            'flex-1 min-w-[100px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer',
            activeTab === 'EARNINGS'
              ? 'bg-[#7aa32c] text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          )}
        >
          <DollarSign className="w-4 h-4" />
          <span>My Earnings</span>
        </button>
      </div>

      {/* TAB 1: ACTIVE MISSION COCKPIT */}
      {activeTab === 'MISSION' && (
        <div className="space-y-5 animate-in fade-in duration-150">
          {/* Main Stopwatch Meter & Status */}
          <div className="bg-gradient-to-br from-[#182a1d] to-[#0f1c13] rounded-3xl p-6 border border-emerald-800/60 shadow-xl space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold bg-emerald-950 px-2.5 py-1 rounded-md border border-emerald-800/80">
                  {assignedMachine.category} • {assignedMachine.identifier}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                  {assignedMachine.brand} {assignedMachine.model}
                </h2>
              </div>

              <div className="text-right">
                <span
                  className={clsx(
                    'px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider',
                    activeBooking?.status === 'IN_PROGRESS'
                      ? 'bg-emerald-500 text-slate-950 animate-pulse'
                      : activeBooking?.status === 'DISPATCHED'
                      ? 'bg-sky-500 text-slate-950'
                      : 'bg-amber-400 text-slate-950'
                  )}
                >
                  {activeBooking?.status || 'ASSIGNED'}
                </span>
              </div>
            </div>

            {/* Large Digital Stopwatch Display */}
            <div className="p-6 rounded-2xl bg-[#080d09] border border-emerald-900/80 text-center space-y-2">
              <div className="text-[11px] uppercase tracking-widest text-emerald-400 font-bold font-mono">
                Productive Operating Runtime Meter
              </div>
              <div className="text-4xl sm:text-6xl font-black text-white font-mono tracking-tight text-emerald-400">
                {formatStopwatch(elapsedSeconds)}
              </div>
              <div className="flex items-center justify-center gap-4 text-xs font-mono text-slate-400 pt-1">
                <span>Rate: ₹{activeBooking?.hourlyRate || 980}/hr</span>
                <span>•</span>
                <span>Driver Commission: ₹150/hr</span>
                <span>•</span>
                <span className="text-emerald-400 font-bold">Earned: ₹{Math.round((elapsedSeconds / 3600) * 150)}</span>
              </div>
            </div>

            {/* Big Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {activeBooking?.status !== 'IN_PROGRESS' ? (
                <button
                  type="button"
                  onClick={handleStartWork}
                  className="sm:col-span-2 py-4 rounded-2xl bg-[#7aa32c] hover:bg-[#688c24] text-white font-black text-sm sm:text-base shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <Play className="w-5 h-5 fill-current" />
                  <span>Start Field Operation Meter</span>
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handlePauseWork}
                    className="py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Pause className="w-4 h-4" />
                    <span>{isTimerRunning ? 'Pause for Refuel/Break' : 'Resume Operating Meter'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCompleteWork}
                    className="sm:col-span-2 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Complete Job & Handover</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Farmer & Destination Information Card */}
          <div className="bg-[#152319] rounded-3xl p-6 border border-emerald-900/60 space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-900/40 pb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#7aa32c]" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-typewriter">
                  Destination & Farmer Details
                </h3>
              </div>
              <span className="text-xs text-emerald-400 font-mono font-bold">
                Khasra #142/8 • 8.0 Acres
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#0d1710] border border-emerald-900/50 space-y-1">
                <div className="text-slate-400">Farmer Name</div>
                <div className="font-bold text-white text-sm">{activeBooking?.farmerName || 'Ramesh Kumar'}</div>
                <div className="text-slate-400">{activeBooking?.farmLocation || 'Bilkisganj, Sehore (8.0 Acres Wheat)'}</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#0d1710] border border-emerald-900/50 flex items-center justify-between">
                <div>
                  <div className="text-slate-400">Direct Contact</div>
                  <div className="font-bold text-white font-mono text-sm">{activeBooking?.farmerPhone || '+91 98260 41234'}</div>
                </div>
                <a
                  href={`tel:${activeBooking?.farmerPhone || '+919826041234'}`}
                  className="px-4 py-2.5 rounded-xl bg-[#7aa32c] hover:bg-[#688c24] text-white font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Farmer</span>
                </a>
              </div>
            </div>
          </div>

          {/* Live Telematics Gauges */}
          <div className="bg-[#152319] rounded-3xl p-6 border border-emerald-900/60 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Live CAN-Bus ECU Telemetry Stream
                </h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400">2s Interval</span>
            </div>

            <TelematicsGaugeCluster
              telemetry={telemetry}
              isAnomalyActive={simulationState.isFuelAnomalyActive}
            />
          </div>
        </div>
      )}

      {/* TAB 2: DIGITAL DIESEL SLIP LOGGER */}
      {activeTab === 'DIESEL' && (
        <div className="bg-[#152319] rounded-3xl p-6 border border-emerald-900/60 space-y-5 animate-in fade-in duration-150">
          <div className="border-b border-emerald-900/40 pb-3">
            <div className="flex items-center gap-2">
              <Fuel className="w-5 h-5 text-[#7aa32c]" />
              <h3 className="text-base font-bold text-white font-typewriter">
                Digital Diesel Refill Slip Logger
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Submit fuel station purchase slips for automatic CHC hub fuel card reimbursement.
            </p>
          </div>

          {dieselLogged && (
            <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-700 text-emerald-300 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Diesel slip logged and submitted to Sehore CHC Accounts for instant reimbursement!</span>
            </div>
          )}

          <form onSubmit={handleLogDiesel} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Litres Filled (L)</label>
                <input
                  type="number"
                  step="0.5"
                  required
                  value={litresFilled}
                  onChange={(e) => setLitresFilled(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#0d1710] border border-emerald-900 rounded-xl text-white font-mono font-bold focus:outline-none focus:border-[#7aa32c]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Total Bill Amount (₹)</label>
                <input
                  type="number"
                  required
                  value={dieselCost}
                  onChange={(e) => setDieselCost(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#0d1710] border border-emerald-900 rounded-xl text-white font-mono font-bold focus:outline-none focus:border-[#7aa32c]"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Fuel Station Outlet</label>
              <input
                type="text"
                required
                value={dieselStation}
                onChange={(e) => setDieselStation(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#0d1710] border border-emerald-900 rounded-xl text-white font-bold focus:outline-none focus:border-[#7aa32c]"
              />
            </div>

            <div className="p-4 rounded-2xl bg-[#0d1710] border border-dashed border-emerald-800/80 text-center space-y-2">
              <PlusCircle className="w-8 h-8 text-[#7aa32c] mx-auto" />
              <div className="font-bold text-white">Upload Receipt Photo (Camera/Gallery)</div>
              <p className="text-[11px] text-slate-400">Captured receipt image will be verified via OCR for tax deduction.</p>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[#7aa32c] hover:bg-[#688c24] text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
            >
              Submit Diesel Refill Record
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: SAFETY & BREAKDOWN REPORTER */}
      {activeTab === 'SAFETY' && (
        <div className="bg-[#152319] rounded-3xl p-6 border border-emerald-900/60 space-y-5 animate-in fade-in duration-150">
          <div className="border-b border-emerald-900/40 pb-3">
            <div className="flex items-center gap-2">
              <Wrench className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-white font-typewriter">
                Pre-Trip Safety Checklist & Incident Reporter
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Report equipment breakdown, tire puncture, or J1939 ECU fault codes directly to CHC Maintenance.
            </p>
          </div>

          {faultSubmitted && (
            <div className="p-4 rounded-2xl bg-amber-950/80 border border-amber-600 text-amber-300 text-xs font-bold flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
              <span>Breakdown report dispatched to CHC Hub Mechanic. Mobile rescue unit notified!</span>
            </div>
          )}

          <form onSubmit={handleReportFault} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-300 mb-1.5">Select Machine Issue Category</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { id: 'HYDRAULIC_PRESSURE', label: 'Hydraulic Pressure Drop' },
                  { id: 'FUEL_ANOMALY', label: 'Fuel Filter / High Burn Rate' },
                  { id: 'OVERHEAT', label: 'Coolant High Temperature' },
                  { id: 'CUTTER_BAR', label: 'Cutter Bar / Thresher Obstruction' },
                ].map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedFault(item.id)}
                    className={clsx(
                      'p-3 rounded-xl border text-left cursor-pointer transition-all',
                      selectedFault === item.id
                        ? 'border-[#7aa32c] bg-[#1d3323] text-white font-bold shadow-sm'
                        : 'border-emerald-950 bg-[#0d1710] text-slate-400 hover:text-slate-200'
                    )}
                  >
                    {item.label}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Incident Description & Location Notes</label>
              <textarea
                rows={3}
                placeholder="Describe current symptoms (e.g. rattling sound in secondary cutter belt at low RPM)..."
                value={faultNotes}
                onChange={(e) => setFaultNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#0d1710] border border-emerald-900 rounded-xl text-white focus:outline-none focus:border-[#7aa32c]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Dispatch Emergency Maintenance Alert</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 4: MY EARNINGS & TRIP HISTORY */}
      {activeTab === 'EARNINGS' && (
        <div className="bg-[#152319] rounded-3xl p-6 border border-emerald-900/60 space-y-5 animate-in fade-in duration-150">
          <div className="border-b border-emerald-900/40 pb-3">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white font-typewriter">
                Operator Wages, Hours & Incentive Statement
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Verified productive hours tracked via telematics engine hours.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-4 rounded-2xl bg-[#0d1710] border border-emerald-900/50">
              <div className="text-[11px] text-slate-400">Total Hours Worked</div>
              <div className="text-xl font-black text-white font-mono mt-1">38.4 hrs</div>
              <div className="text-[10px] text-emerald-400 mt-0.5">This Week</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#0d1710] border border-emerald-900/50">
              <div className="text-[11px] text-slate-400">Base Shift Wage</div>
              <div className="text-xl font-black text-white font-mono mt-1">₹3,500</div>
              <div className="text-[10px] text-slate-400 mt-0.5">₹500 / Day</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#0d1710] border border-emerald-900/50">
              <div className="text-[11px] text-slate-400">Acreage Incentive</div>
              <div className="text-xl font-black text-emerald-400 font-mono mt-1">₹5,760</div>
              <div className="text-[10px] text-emerald-400 mt-0.5">₹150 / hr Productive</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#0d1710] border border-emerald-900/50">
              <div className="text-[11px] text-slate-400">Total Payout</div>
              <div className="text-xl font-black text-white font-mono mt-1">₹9,260</div>
              <div className="text-[10px] text-emerald-400 mt-0.5">Direct to Bank</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OperatorDashboard;
