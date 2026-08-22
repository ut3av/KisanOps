import React, { useState } from 'react';
import {
  ShieldCheck,
  Cpu,
  Database,
  Sliders,
  Activity,
  FileCheck,
  Layers,
  Zap,
  Building2,
  Users,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Download,
  Filter,
  DollarSign,
  Fuel,
  MapPin,
  RefreshCw,
  Search,
  Check,
  Scale,
  Leaf,
  Clock,
  Sparkles,
  Lock,
  ArrowUpRight,
  BarChart3
} from 'lucide-react';
import { useKisanOpsStore } from '../../store/kisanOpsStore';
import { StatCard } from '../../components/common/StatCard';
import { usePageTitle } from '../../hooks/usePageTitle';
import clsx from 'clsx';

// District Presets for MP Multi-District Governance
const DISTRICTS = [
  { id: 'ALL', name: 'State Overview (All MP)', activeHubs: 8, fleetCount: 52, gmv: '₹18.42L' },
  { id: 'SEHORE', name: 'Sehore District', activeHubs: 3, fleetCount: 18, gmv: '₹7.85L' },
  { id: 'BHOPAL', name: 'Bhopal District', activeHubs: 2, fleetCount: 14, gmv: '₹5.20L' },
  { id: 'RAISEN', name: 'Raisen District', activeHubs: 2, fleetCount: 12, gmv: '₹3.65L' },
  { id: 'HOSHANGABAD', name: 'Hoshangabad District', activeHubs: 1, fleetCount: 8, gmv: '₹1.72L' },
];

// SMAM Government Subsidy DBT Records
interface SubsidyRecord {
  id: string;
  farmerName: string;
  aadhaarHash: string;
  district: string;
  machineModel: string;
  assetSerial: string;
  totalCost: number;
  subsidyAmount: number;
  subsidyPercentage: number;
  schemeType: string;
  status: 'DISBURSED' | 'VERIFIED' | 'UNDER_AUDIT';
  timestamp: string;
}

const SMAM_SUBSIDY_LEDGER: SubsidyRecord[] = [
  {
    id: 'SMAM-2026-901',
    farmerName: 'Ramesh Kumar',
    aadhaarHash: 'XXXX-XXXX-8912',
    district: 'Sehore',
    machineModel: 'John Deere W70 Harvester',
    assetSerial: 'JD-HARV-MP-07',
    totalCost: 6380,
    subsidyAmount: 2552,
    subsidyPercentage: 40,
    schemeType: 'SMAM Smallholder Mechanization',
    status: 'DISBURSED',
    timestamp: '2026-08-21 14:30',
  },
  {
    id: 'SMAM-2026-902',
    farmerName: 'Sunita Devi',
    aadhaarHash: 'XXXX-XXXX-4421',
    district: 'Bhopal',
    machineModel: 'Mahindra 575 DI Tractor',
    assetSerial: 'MH-TRAC-MP-02',
    totalCost: 3200,
    subsidyAmount: 1600,
    subsidyPercentage: 50,
    schemeType: 'Women Farmer Mechanization Incentive',
    status: 'DISBURSED',
    timestamp: '2026-08-21 12:15',
  },
  {
    id: 'SMAM-2026-903',
    farmerName: 'Gopal Patel',
    aadhaarHash: 'XXXX-XXXX-1190',
    district: 'Raisen',
    machineModel: 'Shaktiman Rotary Tiller',
    assetSerial: 'SK-ROTA-MP-11',
    totalCost: 2800,
    subsidyAmount: 1120,
    subsidyPercentage: 40,
    schemeType: 'SMAM Smallholder Mechanization',
    status: 'VERIFIED',
    timestamp: '2026-08-21 11:00',
  },
  {
    id: 'SMAM-2026-904',
    farmerName: 'Vikram Choudhary',
    aadhaarHash: 'XXXX-XXXX-6532',
    district: 'Sehore',
    machineModel: 'Kartar 4000 Multicrop Harvester',
    assetSerial: 'KT-HARV-MP-04',
    totalCost: 8900,
    subsidyAmount: 3560,
    subsidyPercentage: 40,
    schemeType: 'Stubble Residue Management (CRM)',
    status: 'UNDER_AUDIT',
    timestamp: '2026-08-21 09:45',
  },
];

// Telematics Anomaly / Fraud Sentinel Events
interface TelematicsAlert {
  id: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  machineId: string;
  chcHub: string;
  type: string;
  description: string;
  timestamp: string;
  resolved: boolean;
}

const TELEMATICS_ALERTS: TelematicsAlert[] = [
  {
    id: 'ALT-104',
    severity: 'WARNING',
    machineId: 'JD-HARV-MP-07',
    chcHub: 'Sehore CHC Hub #01',
    type: 'Fuel Burn Rate Anomaly',
    description: 'CAN-Bus detected 7.8 L/h fuel burn (+17% above 6.5 L/h baseline). Clean air filter required.',
    timestamp: '15 mins ago',
    resolved: false,
  },
  {
    id: 'ALT-103',
    severity: 'INFO',
    machineId: 'MH-TRAC-MP-02',
    chcHub: 'GreenFields Bhopal CHC',
    type: 'Geofence Exit',
    description: 'Approved inter-hub route transit towards Bilkisganj cluster.',
    timestamp: '42 mins ago',
    resolved: true,
  },
  {
    id: 'ALT-102',
    severity: 'CRITICAL',
    machineId: 'SN-HARV-MP-12',
    chcHub: 'Raisen Agri Hub',
    type: 'Hydraulic Pressure Threshold',
    description: 'Sensor reading 210 Bar during heavy wheat threshing. Exceeds 200 Bar safety threshold.',
    timestamp: '2 hours ago',
    resolved: false,
  },
];

export const AdminDashboard: React.FC = () => {
  usePageTitle(
    'Statewide Governance & Subsidies Hub',
    'Statewide agricultural mechanization oversight, SMAM scheme subsidies, and price protection policies.'
  );
  const { state } = useKisanOpsStore();
  const { chcs, machines, bookings } = state;

  const [selectedDistrict, setSelectedDistrict] = useState<string>('ALL');
  const [auditSearch, setAuditSearch] = useState<string>('');
  const [selectedAuditCategory, setSelectedAuditCategory] = useState<string>('ALL');
  
  // Interactive Governance Policies State
  const [minFloorMultiplier, setMinFloorMultiplier] = useState<number>(0.80);
  const [peakSurgeCap, setPeakSurgeCap] = useState<number>(1.30);
  const [interHubRebateKm, setInterHubRebateKm] = useState<number>(18);
  const [agriCreditLossReserve, setAgriCreditLossReserve] = useState<number>(500000);
  const [policySaved, setPolicySaved] = useState<boolean>(false);
  const [rebalanceAuthorized, setRebalanceAuthorized] = useState<boolean>(false);

  const handleSavePolicies = (e: React.FormEvent) => {
    e.preventDefault();
    setPolicySaved(true);
    setTimeout(() => setPolicySaved(false), 3000);
  };

  const handleAuthorizeRebalance = () => {
    setRebalanceAuthorized(true);
    setTimeout(() => setRebalanceAuthorized(false), 4000);
  };

  // Comprehensive Audit Trail
  const AUDIT_LOGS = [
    {
      id: 'AUD-8894',
      timestamp: '2026-08-21 15:42:10',
      actor: 'Rajesh Singh (CHC Manager)',
      action: 'DISPATCH_APPROVED',
      category: 'DISPATCH',
      entity: 'JD-HARV-07 -> Bilkisganj Farm',
      ip: '103.24.18.92',
      status: 'VERIFIED',
    },
    {
      id: 'AUD-8893',
      timestamp: '2026-08-21 15:40:02',
      actor: 'Ramesh Kumar (Farmer)',
      action: 'BOOKING_CREATED_AGRICREDIT',
      category: 'AGRICREDIT',
      entity: 'BK-2026-8891 (₹6,380 Deferred @ 0% upfront)',
      ip: '157.34.212.11',
      status: 'VERIFIED',
    },
    {
      id: 'AUD-8892',
      timestamp: '2026-08-21 15:38:44',
      actor: 'System AI Allocation Engine',
      action: 'REALLOCATION_RECOMMENDED',
      category: 'REALLOCATION',
      entity: 'SN-HARV-12: Bhopal -> Sehore (+24% Gain)',
      ip: '10.0.4.12 (Internal Edge)',
      status: 'PENDING_AUTH',
    },
    {
      id: 'AUD-8891',
      timestamp: '2026-08-21 15:30:19',
      actor: 'CAN-Bus Telematics Sentinel',
      action: 'ALERT_FUEL_ANOMALY',
      category: 'TELEMATICS',
      entity: 'JD-HARV-07 (+17% burn rate over baseline)',
      ip: '10.0.8.99 (Receiver)',
      status: 'LOGGED',
    },
    {
      id: 'AUD-8890',
      timestamp: '2026-08-21 14:15:00',
      actor: 'Dr. Amit Sharma (Platform Admin)',
      action: 'PRICING_CAP_ADJUSTED',
      category: 'PRICING',
      entity: 'Surge Cap bounded to 1.30x Max (Anti-Gouging)',
      ip: '14.139.240.18',
      status: 'IMMUTABLE',
    },
  ];

  const filteredLogs = AUDIT_LOGS.filter((log) => {
    const matchesSearch =
      log.actor.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.action.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.entity.toLowerCase().includes(auditSearch.toLowerCase());
    const matchesCat =
      selectedAuditCategory === 'ALL' || log.category === selectedAuditCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header with District Selector & Live Sync */}
      <div className="bg-white border border-stone-200/90 rounded-3xl p-6 shadow-sm flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight font-typewriter">
              State Agricultural Command & Platform Governance
            </h1>
            <span className="text-xs bg-purple-100 text-purple-900 font-bold px-3 py-1 rounded-full flex items-center gap-1.5 border border-purple-200">
              <ShieldCheck className="w-4 h-4 text-purple-700" />
              State Administrator Tier
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Real-time SMAM subsidy auditing, dynamic anti-gouging pricing bounds, AgriCredit loss reserves, and state-wide telematics dispatch.
          </p>
        </div>

        {/* District Filter Selector */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full sm:w-auto pl-9 pr-8 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-bold text-stone-800 focus:outline-none focus:border-[#7aa32c] cursor-pointer"
            >
              {DISTRICTS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
            title="Refresh Real-Time Feeds"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Top-Level Macro Command Metrics (6 Strategic Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Statewide Fleet GMV"
          value="₹18.42 Lakh"
          subtitle="+14.2% MoM Expansion"
          icon={TrendingUp}
          iconBg="bg-emerald-50 text-emerald-800"
        />
        <StatCard
          title="Active Telematics Fleet"
          value="48 / 52 Units"
          subtitle="92.3% active uptime"
          icon={Cpu}
          iconBg="bg-sky-50 text-sky-800"
        />
        <StatCard
          title="SMAM Subsidy Disbursed"
          value="₹42.85 Lakh"
          subtitle="Direct Benefit Transfer (DBT)"
          icon={FileCheck}
          iconBg="bg-[#F5FAED] text-[#2e4013]"
        />
        <StatCard
          title="AgriCredit Reserve"
          value="₹5,00,000"
          subtitle="0.0% default loss rate"
          icon={ShieldCheck}
          iconBg="bg-purple-50 text-purple-800"
        />
        <StatCard
          title="Mechanized Acreage"
          value="3,840 Acres"
          subtitle="Wheat, Paddy & Soy"
          icon={Scale}
          iconBg="bg-amber-50 text-amber-800"
        />
        <StatCard
          title="Carbon Abatement"
          value="48.6 T CO₂e"
          subtitle="-18.2% diesel burn saved"
          icon={Leaf}
          iconBg="bg-teal-50 text-teal-800"
        />
      </div>

      {/* 3. Cross-District Rebalancing & Fleet Allocation Matrix */}
      <div className="bg-white border border-stone-200/90 rounded-3xl p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#7aa32c]" />
              <h2 className="text-base sm:text-lg font-bold text-stone-900 font-typewriter">
                Cross-District Machinery Allocation & Rebalancing Hub
              </h2>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Live AI algorithm identifying inter-hub machine deficits and predicting crop lodging risk prior to rainfall.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-bold">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              Sehore Deficit: -4 Combine Harvesters
            </span>
          </div>
        </div>

        {/* Rebalancing Strategy Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center p-5 rounded-2xl bg-gradient-to-r from-[#F5FAED] via-stone-50 to-emerald-50/50 border border-[#7aa32c]/30">
          <div className="lg:col-span-8 space-y-2">
            <div className="text-xs font-bold text-[#2e4013] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#7aa32c]" />
              <span>Recommended Machine Relocation Action</span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-stone-900">
              Shift 3 John Deere Combine Harvesters: Bhopal Hub ➔ Sehore Agri Centre
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Open-Meteo Doppler forecast indicates rainstorm incoming in Sehore in 18 hours. Shifting 3 idle harvesters from Bhopal will generate{' '}
              <strong className="text-emerald-800 font-semibold">₹54,000 in saved crop yield</strong> and increase fleet utilization from 68% to 92%.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono pt-1 text-stone-700">
              <span>Transit Distance: <strong>38 km (NH-46)</strong></span>
              <span>•</span>
              <span>Rebate Subsidy: <strong>₹684 (@ ₹18/km)</strong></span>
              <span>•</span>
              <span>Est. Transit Time: <strong>55 mins</strong></span>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col items-end justify-center">
            {rebalanceAuthorized ? (
              <div className="w-full p-3 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold text-center flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Inter-Hub Relocation Authorized!</span>
              </div>
            ) : (
              <button
                onClick={handleAuthorizeRebalance}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#1b4d3e] hover:bg-[#153e32] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
              >
                <Zap className="w-4 h-4 text-[#9dc84d]" />
                <span>Authorize Relocation & Subsidy</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 4. Two-Column Matrix: Governance Policies & Telematics Sentinel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Network Dynamic Pricing Policy Sliders (6 Cols) */}
        <div className="lg:col-span-6 bg-white border border-stone-200/90 rounded-3xl p-6 shadow-sm space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-[#7aa32c]" />
                <h3 className="text-sm sm:text-base font-bold text-stone-900 font-typewriter">
                  Network Anti-Gouging & Pricing Policies
                </h3>
              </div>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 font-mono">
                REGULATORY CONTROLS
              </span>
            </div>

            <form onSubmit={handleSavePolicies} className="mt-4 space-y-4">
              {/* Slider 1: Floor Multiplier */}
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-stone-900">Minimum Floor Multiplier</span>
                    <p className="text-[11px] text-stone-500">Limits maximum off-peak discount to protect CHC operators</p>
                  </div>
                  <span className="font-mono font-extrabold text-[#2e4013] text-sm bg-white px-2.5 py-1 rounded-lg border border-stone-200">
                    {minFloorMultiplier.toFixed(2)}x ({(minFloorMultiplier * 100 - 100).toFixed(0)}%)
                  </span>
                </div>
                <input
                  type="range"
                  min="0.70"
                  max="0.90"
                  step="0.05"
                  value={minFloorMultiplier}
                  onChange={(e) => setMinFloorMultiplier(parseFloat(e.target.value))}
                  className="w-full accent-[#7aa32c] cursor-pointer"
                />
              </div>

              {/* Slider 2: Surge Cap */}
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-stone-900">Rain Risk Surge Cap</span>
                    <p className="text-[11px] text-stone-500">Bans algorithmic price gouging during emergency harvest windows</p>
                  </div>
                  <span className="font-mono font-extrabold text-amber-900 text-sm bg-white px-2.5 py-1 rounded-lg border border-stone-200">
                    {peakSurgeCap.toFixed(2)}x (+{(peakSurgeCap * 100 - 100).toFixed(0)}% Max)
                  </span>
                </div>
                <input
                  type="range"
                  min="1.15"
                  max="1.40"
                  step="0.05"
                  value={peakSurgeCap}
                  onChange={(e) => setPeakSurgeCap(parseFloat(e.target.value))}
                  className="w-full accent-amber-600 cursor-pointer"
                />
              </div>

              {/* Slider 3: Inter-Hub Transit Rebate */}
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-stone-900">Inter-Hub Transit Subsidy</span>
                    <p className="text-[11px] text-stone-500">Government rebate paid to operators per km of machine relocation</p>
                  </div>
                  <span className="font-mono font-extrabold text-emerald-900 text-sm bg-white px-2.5 py-1 rounded-lg border border-stone-200">
                    ₹{interHubRebateKm} / km
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="25"
                  step="1"
                  value={interHubRebateKm}
                  onChange={(e) => setInterHubRebateKm(parseInt(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <div className="text-[11px] text-stone-500">
                  {policySaved ? (
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      Policy parameters updated and logged to audit trail.
                    </span>
                  ) : (
                    <span>Last audited: Today, 15:40 IST</span>
                  )}
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#1b4d3e] hover:bg-[#153e32] text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
                >
                  Save Policy Bounds
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Statewide Telematics Anomaly Sentinel (6 Cols) */}
        <div className="lg:col-span-6 bg-white border border-stone-200/90 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-sky-700" />
              <h3 className="text-sm sm:text-base font-bold text-stone-900 font-typewriter">
                CAN-Bus J1939 Telematics & Anomaly Sentinel
              </h3>
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-50 text-sky-800 text-[10px] font-bold font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-ping" />
              LIVE TELEMETRY
            </span>
          </div>

          <div className="space-y-3">
            {TELEMATICS_ALERTS.map((alert) => (
              <div
                key={alert.id}
                className={clsx(
                  'p-3.5 rounded-2xl border transition-all flex items-start justify-between gap-3 text-xs',
                  alert.severity === 'CRITICAL'
                    ? 'bg-rose-50/70 border-rose-200 text-rose-950'
                    : alert.severity === 'WARNING'
                    ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                    : 'bg-stone-50 border-stone-200 text-stone-900'
                )}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold">{alert.machineId}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-white border border-stone-200 font-semibold text-stone-600">
                      {alert.chcHub}
                    </span>
                    <span className="text-[10px] text-stone-400 font-mono">{alert.timestamp}</span>
                  </div>
                  <div className="font-bold text-xs">{alert.type}</div>
                  <p className="text-[11px] text-stone-600 leading-snug">{alert.description}</p>
                </div>

                <div>
                  {alert.resolved ? (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      Resolved
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md border border-rose-300 animate-pulse">
                      Investigate
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-surface-50 border border-stone-200/70 flex items-center justify-between text-xs text-stone-600">
            <span>Overall Telematics Ping Health</span>
            <span className="font-mono font-bold text-emerald-700">99.82% Packet Integrity (No Drops)</span>
          </div>
        </div>
      </div>

      {/* 5. SMAM Government Subsidy DBT Disbursement Ledger */}
      <div className="bg-white border border-stone-200/90 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-[#7aa32c]" />
              <h3 className="text-base font-bold text-stone-900 font-typewriter">
                SMAM Scheme Direct Benefit Transfer (DBT) Verification Ledger
              </h3>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Automated 40%–50% subsidy validation backed by CAN-Bus runtime hours and verified Aadhaar telemetry.
            </p>
          </div>

          <button
            onClick={() => alert('Exporting signed PDF audit report for State Mechanization Directorate...')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export DBT Audit Report</span>
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50/70 text-stone-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">DBT ID & Farmer</th>
                <th className="py-3 px-4">District</th>
                <th className="py-3 px-4">Machine & Serial</th>
                <th className="py-3 px-4">Scheme Category</th>
                <th className="py-3 px-4">Total Fee</th>
                <th className="py-3 px-4">Govt Subsidy (DBT)</th>
                <th className="py-3 px-4">Audit Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-800">
              {SMAM_SUBSIDY_LEDGER.map((sub) => (
                <tr key={sub.id} className="hover:bg-stone-50/50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-stone-900">{sub.farmerName}</div>
                    <div className="text-[10px] text-stone-400 font-mono">{sub.id} • {sub.aadhaarHash}</div>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-stone-700">
                    {sub.district}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold">{sub.machineModel}</div>
                    <div className="text-[10px] font-mono text-stone-400">{sub.assetSerial}</div>
                  </td>
                  <td className="py-3.5 px-4 text-stone-600">
                    {sub.schemeType}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-stone-900">
                    ₹{sub.totalCost.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-[#2e4013]">
                    ₹{sub.subsidyAmount.toLocaleString()} ({sub.subsidyPercentage}%)
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={clsx(
                        'px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider',
                        sub.status === 'DISBURSED'
                          ? 'bg-emerald-100 text-emerald-900'
                          : sub.status === 'VERIFIED'
                          ? 'bg-sky-100 text-sky-900'
                          : 'bg-amber-100 text-amber-900'
                      )}
                    >
                      {sub.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. Immutable Governance Audit Trail */}
      <div className="bg-white border border-stone-200/90 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-purple-700" />
            <h3 className="text-base font-bold text-stone-900 font-typewriter">
              Platform Security & Immutable Governance Audit Trail
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search audit trail..."
                value={auditSearch}
                onChange={(e) => setAuditSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 focus:outline-none focus:border-[#7aa32c]"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedAuditCategory}
              onChange={(e) => setSelectedAuditCategory(e.target.value)}
              className="py-1.5 px-3 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold text-stone-700 focus:outline-none focus:border-[#7aa32c]"
            >
              <option value="ALL">All Categories</option>
              <option value="DISPATCH">Dispatches</option>
              <option value="AGRICREDIT">AgriCredit</option>
              <option value="REALLOCATION">Reallocation</option>
              <option value="TELEMATICS">Telematics</option>
              <option value="PRICING">Pricing</option>
            </select>
          </div>
        </div>

        {/* Audit Log Rows */}
        <div className="space-y-2 text-xs">
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              className="p-3 rounded-xl bg-stone-50/70 border border-stone-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-stone-100/60 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-purple-600" />
                <div>
                  <div className="font-bold text-stone-900">{log.action}</div>
                  <div className="text-[11px] text-stone-600">{log.entity}</div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-stone-500 text-[11px] font-mono">
                <span>{log.actor}</span>
                <span>•</span>
                <span>{log.timestamp}</span>
                <span>•</span>
                <span className="bg-white px-2 py-0.5 rounded border border-stone-200 font-bold text-stone-700">
                  {log.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
