import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  TrendingUp,
  IndianRupee,
  Activity,
  Tractor,
  Calendar,
  Layers,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import { useKisanOpsStore } from '../../store/kisanOpsStore';
import { StatCard } from '../../components/common/StatCard';
import { usePageTitle } from '../../hooks/usePageTitle';

const REVENUE_DATA = [
  { day: 'Mon', revenue: 28400, utilization: 68 },
  { day: 'Tue', revenue: 34200, utilization: 72 },
  { day: 'Wed', revenue: 31000, utilization: 70 },
  { day: 'Thu', revenue: 39500, utilization: 75 },
  { day: 'Fri', revenue: 42800, utilization: 78 },
  { day: 'Sat (Surge)', revenue: 54000, utilization: 88 },
  { day: 'Sun (Surge)', revenue: 58500, utilization: 92 },
];

const CATEGORY_SHARE = [
  { name: 'Combine Harvesters', value: 48, color: '#1B4D3E' },
  { name: 'Heavy Tractors', value: 28, color: '#10B981' },
  { name: 'Rotavators & Tillers', value: 12, color: '#0284C7' },
  { name: 'Multi-Crop Seeders', value: 8, color: '#F59E0B' },
  { name: 'Boom Sprayers', value: 4, color: '#8B5CF6' },
];

const PROFITABILITY_DATA = [
  {
    model: 'John Deere Harvester (JD-HARV-07)',
    grossRevenue: 98400,
    fuelCost: 18200,
    operatorCost: 12000,
    maintenanceCost: 4500,
    netContribution: 63700,
    marginPercent: 64.7,
  },
  {
    model: 'Sonalika Tiger Harvester (SN-HARV-12)',
    grossRevenue: 84000,
    fuelCost: 16500,
    operatorCost: 11000,
    maintenanceCost: 3200,
    netContribution: 53300,
    marginPercent: 63.4,
  },
  {
    model: 'Mahindra 575 DI (MH-575-01)',
    grossRevenue: 52000,
    fuelCost: 8900,
    operatorCost: 8000,
    maintenanceCost: 2800,
    netContribution: 32300,
    marginPercent: 62.1,
  },
  {
    model: 'Swaraj 744 FE (SW-744-02)',
    grossRevenue: 48500,
    fuelCost: 8600,
    operatorCost: 7500,
    maintenanceCost: 3100,
    netContribution: 29300,
    marginPercent: 60.4,
  },
];

export const RevenueAnalytics: React.FC = () => {
  usePageTitle(
    'CHC Revenue & Fleet Utilization Analytics',
    'Unit economics, gross GMV, and machine contribution margins.'
  );
  const [timeRange, setTimeRange] = useState<'7D' | '30D' | '90D'>('7D');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-subtle flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              CHC Revenue & Fleet Utilization Analytics
            </h1>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md">
              Gross GMV: ₹2,88,400 (This Week)
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Unit economics, machine contribution margins, and telemetry-verified productive operating hours.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-surface-100 p-1.5 rounded-2xl border border-slate-200">
          {(['7D', '30D', '90D'] as const).map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                timeRange === range
                  ? 'bg-white text-agri-950 shadow-subtle'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Top 4 Business Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Productive Machine Hours"
          value="412.5 hrs"
          subtitle="North Star Metric"
          change="+18.4%"
          icon={Activity}
          iconBg="bg-agri-50 text-agri-800"
        />
        <StatCard
          title="Average Fleet Utilization"
          value="78.4%"
          subtitle="Peak harvest surge"
          change="+14.2%"
          icon={TrendingUp}
          iconBg="bg-emerald-50 text-emerald-800"
        />
        <StatCard
          title="Average Order Value"
          value="₹6,380"
          subtitle="6.2 hrs avg duration"
          change="+8.5%"
          icon={IndianRupee}
          iconBg="bg-sky-50 text-sky-800"
        />
        <StatCard
          title="AgriCredit Deferred Rate"
          value="42%"
          subtitle="Zero default rate (100% on time)"
          change="0% loss"
          icon={ShieldCheck}
          iconBg="bg-purple-50 text-purple-800"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Daily Revenue & Utilization Dual Chart */}
        <div className="lg:col-span-8 bg-white border border-slate-200/90 rounded-3xl p-6 shadow-subtle space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Daily Gross Revenue vs Fleet Utilization
              </h3>
              <p className="text-xs text-slate-500">Correlation between surge demand matching and daily revenue capture.</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-agri-800 inline-block" />
                <span className="text-slate-600 font-medium">Gross Revenue (₹)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                <span className="text-slate-600 font-medium">Utilization (%)</span>
              </div>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={REVENUE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#64748B' }} unit="%" />
                <Tooltip
                  formatter={(value: any, name: any) => [
                    name === 'revenue' ? `₹${Number(value).toLocaleString('en-IN')}` : `${value}%`,
                    name === 'revenue' ? 'Revenue' : 'Utilization'
                  ]}
                  contentStyle={{ borderRadius: '12px', fontSize: '12px', border: '1px solid #E2E8F0' }}
                />
                <Bar yAxisId="left" dataKey="revenue" fill="#1B4D3E" radius={[6, 6, 0, 0]} />
                <Line yAxisId="right" type="monotone" dataKey="utilization" stroke="#10B981" strokeWidth={3} dot={{ r: 4 }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Share by Equipment Category */}
        <div className="lg:col-span-4 bg-white border border-slate-200/90 rounded-3xl p-6 shadow-subtle space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Revenue by Machine Category
            </h3>
            <p className="text-xs text-slate-500">Combine harvesters drive 48% of total revenue during wheat harvest.</p>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={CATEGORY_SHARE}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {CATEGORY_SHARE.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => [`${value}% Share`, 'Share']} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 text-xs">
            {CATEGORY_SHARE.map(item => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-700 font-medium">{item.name}</span>
                </div>
                <span className="font-bold text-slate-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Machine Profitability & Unit Economics Table */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-subtle space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
          Asset-Level Profitability & Unit Economics
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-surface-50 text-slate-600 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Machine Model</th>
                <th className="py-3 px-4 text-right">Gross Revenue</th>
                <th className="py-3 px-4 text-right">Fuel Cost</th>
                <th className="py-3 px-4 text-right">Operator Cost</th>
                <th className="py-3 px-4 text-right">Maintenance Cost</th>
                <th className="py-3 px-4 text-right">Net Contribution</th>
                <th className="py-3 px-4 text-center">Net Margin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {PROFITABILITY_DATA.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-sans font-extrabold text-slate-900">{row.model}</td>
                  <td className="py-3 px-4 text-right font-bold text-slate-900">₹{row.grossRevenue.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-4 text-right text-rose-700">-₹{row.fuelCost.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-4 text-right text-slate-700">-₹{row.operatorCost.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-4 text-right text-slate-700">-₹{row.maintenanceCost.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-4 text-right font-bold text-emerald-800">₹{row.netContribution.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-md border border-emerald-200 text-xs">
                      {row.marginPercent}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
