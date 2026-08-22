import React from 'react';
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
  CheckCircle2
} from 'lucide-react';
import { useKisanOpsStore } from '../../store/kisanOpsStore';
import { StatCard } from '../../components/common/StatCard';

const AUDIT_LOGS = [
  {
    timestamp: '2026-08-21 15:42:10',
    actor: 'Rajesh Singh (CHC-MP-SEH-01)',
    action: 'DISPATCH_APPROVED',
    entity: 'JD-HARV-07 ➔ Bilkisganj Farm',
    ip: '103.24.18.92',
  },
  {
    timestamp: '2026-08-21 15:40:02',
    actor: 'Ramesh Kumar (Farmer)',
    action: 'BOOKING_CREATED_AGRICREDIT',
    entity: 'BK-2026-8891 (₹6,380 Deferred)',
    ip: '157.34.212.11',
  },
  {
    timestamp: '2026-08-21 15:38:44',
    actor: 'System Demand Engine',
    action: 'REALLOCATION_RECOMMENDED',
    entity: 'SN-HARV-12: Bhopal ➔ Sehore',
    ip: '10.0.4.12 (Internal Edge)',
  },
  {
    timestamp: '2026-08-21 15:30:19',
    actor: 'Telematics Anomaly Daemon',
    action: 'ALERT_TRIGGERED_FUEL_ANOMALY',
    entity: 'JD-HARV-07 (+17% burn rate)',
    ip: '10.0.8.99 (CAN-Bus Receiver)',
  },
];

export const AdminDashboard: React.FC = () => {
  const { state } = useKisanOpsStore();
  const { chcs, machines, bookings } = state;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-subtle flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Platform Governance & System Administration
            </h1>
            <span className="text-xs bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Root Governance
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Network pricing parameters, AgriCredit loss reserves, telematics health, and immutable audit logs.
          </p>
        </div>
      </div>

      {/* Network Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active CHC Hubs"
          value={chcs.length}
          subtitle="Sehore, Bhopal, Raisen"
          icon={Building2}
          iconBg="bg-agri-50 text-agri-800"
        />
        <StatCard
          title="Total Network Fleet"
          value={machines.length}
          subtitle="18 currently deployed"
          icon={Cpu}
          iconBg="bg-sky-50 text-sky-800"
        />
        <StatCard
          title="Total Bookings"
          value={bookings.length}
          subtitle="₹2.88L weekly GMV"
          icon={Activity}
          iconBg="bg-emerald-50 text-emerald-800"
        />
        <StatCard
          title="AgriCredit Reserve"
          value="₹5,00,000"
          subtitle="0.0% default loss rate"
          icon={ShieldCheck}
          iconBg="bg-purple-50 text-purple-800"
        />
      </div>

      {/* Governance Parameters Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dynamic Pricing Safety Policies */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-subtle space-y-4">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-agri-800" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Network Dynamic Pricing Policies
            </h3>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-surface-50 border border-slate-200/70">
              <div>
                <div className="font-bold text-slate-900">Minimum Floor Multiplier</div>
                <div className="text-[11px] text-slate-500">Limits maximum off-peak discounts</div>
              </div>
              <span className="font-mono font-bold text-slate-800">0.80x (-20%)</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-surface-50 border border-slate-200/70">
              <div>
                <div className="font-bold text-slate-900">Peak Demand Surge Cap</div>
                <div className="text-[11px] text-slate-500">Prevents emergency surge gouging</div>
              </div>
              <span className="font-mono font-bold text-slate-800">1.30x (+30%)</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-surface-50 border border-slate-200/70">
              <div>
                <div className="font-bold text-slate-900">Platform Transaction Fee</div>
                <div className="text-[11px] text-slate-500">Fixed digital CAN-Bus telemetry fee</div>
              </div>
              <span className="font-mono font-bold text-slate-800">₹100 / booking</span>
            </div>
          </div>
        </div>

        {/* AgriCredit Governance */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-subtle space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-purple-700" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              AgriCredit Risk Underwriting Limits
            </h3>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-surface-50 border border-slate-200/70">
              <div>
                <div className="font-bold text-slate-900">Tier 1 Limit (Score 750+)</div>
                <div className="text-[11px] text-slate-500">Maximum uncollateralized deferred line</div>
              </div>
              <span className="font-mono font-bold text-emerald-700">₹10,000</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-surface-50 border border-slate-200/70">
              <div>
                <div className="font-bold text-slate-900">Tier 2 Limit (Score 650–749)</div>
                <div className="text-[11px] text-slate-500">Standard verified farm profile credit</div>
              </div>
              <span className="font-mono font-bold text-emerald-700">₹8,000</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-surface-50 border border-slate-200/70">
              <div>
                <div className="font-bold text-slate-900">Repayment Grace Period</div>
                <div className="text-[11px] text-slate-500">Standard harvest settlement cycle</div>
              </div>
              <span className="font-mono font-bold text-slate-800">45 Days</span>
            </div>
          </div>
        </div>
      </div>

      {/* Immutable Audit Log Stream */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-subtle space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-slate-700" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Immutable Platform Audit Log Stream
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">Real-time cryptographic audit trail</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-surface-50 text-slate-600 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Actor / Principal</th>
                <th className="py-2.5 px-3">Event Action</th>
                <th className="py-2.5 px-3">Entity & Payload</th>
                <th className="py-2.5 px-3 text-right">Source IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {AUDIT_LOGS.map((log, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 text-slate-500">{log.timestamp}</td>
                  <td className="py-2.5 px-3 font-sans font-semibold text-slate-900">{log.actor}</td>
                  <td className="py-2.5 px-3">
                    <span className="bg-purple-50 text-purple-800 font-bold px-2 py-0.5 rounded text-[10px]">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-sans text-slate-700">{log.entity}</td>
                  <td className="py-2.5 px-3 text-right text-slate-400">{log.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
