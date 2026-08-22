import React from 'react';
import {
  X,
  Printer,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Clock,
  ShieldCheck,
  Building2,
  Calendar,
  Layers,
  IndianRupee,
  Database,
  FileText,
} from 'lucide-react';
import { WeeklyFarmReport } from '../../types';
import { WeeklyFleetReport } from '../../lib/intelligence/fleetIntelligenceEngine';

interface IntelligenceReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  farmerReport?: WeeklyFarmReport | null;
  fleetReport?: WeeklyFleetReport | null;
}

export const IntelligenceReportModal: React.FC<IntelligenceReportModalProps> = ({
  isOpen,
  onClose,
  farmerReport,
  fleetReport,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden print:max-h-none print:shadow-none print:border-none print:rounded-none">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-center justify-between border-b border-slate-800 print:bg-white print:text-slate-900 print:border-b-2 print:border-slate-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black print:bg-emerald-100">
              <FileText className="w-5 h-5 text-emerald-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800 print:text-emerald-800 print:bg-emerald-100">
                  {farmerReport ? 'Farm Decision Intelligence Report' : 'CHC Fleet Intelligence Report'}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {farmerReport ? farmerReport.weekRange : fleetReport?.weekRange}
                </span>
              </div>
              <h2 className="text-lg font-extrabold text-white print:text-slate-900 mt-0.5">
                KisanOps Strategic Operations & Risk Outlook
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 print:hidden">
            <button
              onClick={handlePrint}
              className="btn-primary text-xs py-2 px-3.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-800 text-sm print:overflow-visible">
          {/* Executive Summary */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>1. Executive Summary</span>
            </h3>
            <p className="text-slate-700 leading-relaxed font-medium">
              {farmerReport ? farmerReport.executiveSummary : fleetReport?.executiveSummary}
            </p>
          </div>

          {farmerReport && (
            <>
              {/* Economics & Profit Range */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <IndianRupee className="w-4 h-4 text-emerald-600" />
                  <span>2. Expected Economics & Profit Scenarios</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200">
                    <span className="text-xs font-bold text-amber-800 uppercase">Conservative (Pessimistic)</span>
                    <div className="text-xl font-extrabold text-amber-950 mt-1">
                      ₹{farmerReport.economicsSummary.profitRange.conservative.toLocaleString('en-IN')}
                    </div>
                    <p className="text-[11px] text-amber-700 mt-1">Assumes -15% yield loss & weather delay</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 shadow-sm">
                    <span className="text-xs font-bold text-emerald-800 uppercase">Baseline Expected</span>
                    <div className="text-2xl font-black text-emerald-950 mt-1">
                      ₹{farmerReport.economicsSummary.expectedNetProfit.toLocaleString('en-IN')}
                    </div>
                    <p className="text-[11px] text-emerald-700 mt-1">
                      ₹{farmerReport.economicsSummary.profitPerAcre.toLocaleString('en-IN')}/acre • ROI {farmerReport.economicsSummary.expectedRoiPercent}%
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-200">
                    <span className="text-xs font-bold text-sky-800 uppercase">Favorable (Optimistic)</span>
                    <div className="text-xl font-extrabold text-sky-950 mt-1">
                      ₹{farmerReport.economicsSummary.profitRange.favorable.toLocaleString('en-IN')}
                    </div>
                    <p className="text-[11px] text-sky-700 mt-1">Assumes peak luster grade premium (+6%)</p>
                  </div>
                </div>

                {/* Expense Breakdown Table */}
                <div className="border border-slate-200 rounded-2xl overflow-hidden mt-3">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-3">Cost Category</th>
                        <th className="p-3">Total Amount</th>
                        <th className="p-3">Per Acre</th>
                        <th className="p-3">% of Total Budget</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="p-3 font-medium">Certified Seeds & Inoculants</td>
                        <td className="p-3">₹{farmerReport.economicsSummary.expenses.seedsCost.toLocaleString('en-IN')}</td>
                        <td className="p-3">₹{Math.round(farmerReport.economicsSummary.expenses.seedsCost / farmerReport.economicsSummary.sizeAcres).toLocaleString('en-IN')}</td>
                        <td className="p-3 font-mono">{Math.round((farmerReport.economicsSummary.expenses.seedsCost / farmerReport.economicsSummary.expenses.totalCost) * 100)}%</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium">Fertilizers (DAP, Urea, MOP)</td>
                        <td className="p-3">₹{farmerReport.economicsSummary.expenses.fertilizersCost.toLocaleString('en-IN')}</td>
                        <td className="p-3">₹{Math.round(farmerReport.economicsSummary.expenses.fertilizersCost / farmerReport.economicsSummary.sizeAcres).toLocaleString('en-IN')}</td>
                        <td className="p-3 font-mono">{Math.round((farmerReport.economicsSummary.expenses.fertilizersCost / farmerReport.economicsSummary.expenses.totalCost) * 100)}%</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium">Machinery Rental (KisanOps Network)</td>
                        <td className="p-3 font-bold text-agri-800">₹{farmerReport.economicsSummary.expenses.machineryRentalCost.toLocaleString('en-IN')}</td>
                        <td className="p-3 font-bold text-agri-800">₹{Math.round(farmerReport.economicsSummary.expenses.machineryRentalCost / farmerReport.economicsSummary.sizeAcres).toLocaleString('en-IN')}</td>
                        <td className="p-3 font-mono font-bold text-agri-800">{Math.round((farmerReport.economicsSummary.expenses.machineryRentalCost / farmerReport.economicsSummary.expenses.totalCost) * 100)}%</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium">Labor & Field Operations</td>
                        <td className="p-3">₹{farmerReport.economicsSummary.expenses.laborCost.toLocaleString('en-IN')}</td>
                        <td className="p-3">₹{Math.round(farmerReport.economicsSummary.expenses.laborCost / farmerReport.economicsSummary.sizeAcres).toLocaleString('en-IN')}</td>
                        <td className="p-3 font-mono">{Math.round((farmerReport.economicsSummary.expenses.laborCost / farmerReport.economicsSummary.expenses.totalCost) * 100)}%</td>
                      </tr>
                      <tr className="bg-slate-50 font-extrabold text-slate-900 border-t border-slate-200">
                        <td className="p-3">Total Estimated Expenses</td>
                        <td className="p-3">₹{farmerReport.economicsSummary.expenses.totalCost.toLocaleString('en-IN')}</td>
                        <td className="p-3">₹{farmerReport.economicsSummary.expenses.costPerAcre.toLocaleString('en-IN')}</td>
                        <td className="p-3">100%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Multi-Dimensional Risk Sentinels */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span>3. Multi-Dimensional Risk Analysis</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {farmerReport.riskBreakdown.riskDrivers.map((driver, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl border bg-slate-50/70 border-slate-200 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase text-slate-900">{driver.category} RISK</span>
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded ${
                            driver.riskLevel === 'CRITICAL'
                              ? 'bg-rose-100 text-rose-800'
                              : driver.riskLevel === 'HIGH'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {driver.riskLevel} ({driver.scoreOutOf100}/100)
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-900">{driver.what}</p>
                      <p className="text-[11px] text-slate-600"><strong>Why:</strong> {driver.why}</p>
                      <p className="text-[11px] text-slate-600"><strong>Action:</strong> {driver.recommendedAction}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Strategic Action Plan */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>4. Strategic Action Plan & Expected Impact</span>
                </h3>
                <div className="space-y-2">
                  {farmerReport.actionPlan.map((item, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded mt-0.5 shrink-0 ${
                        item.priority === 'IMMEDIATE' ? 'bg-rose-500 text-white' : item.priority === 'THIS_WEEK' ? 'bg-amber-500 text-slate-950' : 'bg-slate-200 text-slate-800'
                      }`}>
                        {item.priority}
                      </span>
                      <div>
                        <p className="text-xs font-bold text-slate-900">{item.action}</p>
                        <p className="text-[11px] text-emerald-800 font-medium mt-0.5">Impact: {item.impact}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {fleetReport && (
            <>
              {/* Fleet Utilization & Projections */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span>2. Revenue Projections & Fleet Economics</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                    <span className="text-xs font-bold text-amber-800 uppercase">Conservative</span>
                    <div className="text-xl font-extrabold text-amber-950 mt-1">
                      ₹{fleetReport.revenueProjections.conservative.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300">
                    <span className="text-xs font-bold text-emerald-800 uppercase">Expected Net Contribution</span>
                    <div className="text-2xl font-black text-emerald-950 mt-1">
                      ₹{fleetReport.revenueProjections.expected.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200">
                    <span className="text-xs font-bold text-sky-800 uppercase">Optimistic (+18% Gain)</span>
                    <div className="text-xl font-extrabold text-sky-950 mt-1">
                      ₹{fleetReport.revenueProjections.optimistic.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              </div>

              {/* Machine Profitability Ranking Table */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-agri-800" />
                  <span>3. Machinery Profitability & Contribution Ranking</span>
                </h3>
                <div className="border border-slate-200 rounded-2xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-3">Rank</th>
                        <th className="p-3">Machine Asset</th>
                        <th className="p-3">Gross Revenue</th>
                        <th className="p-3">Fuel & Maint.</th>
                        <th className="p-3">Net Contribution</th>
                        <th className="p-3">Status / Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {fleetReport.machineProfitabilityRankings.slice(0, 5).map((p, idx) => (
                        <tr key={idx}>
                          <td className="p-3 font-bold text-slate-400">#{p.profitabilityRank}</td>
                          <td className="p-3">
                            <div className="font-bold text-slate-900">{p.machineModel}</div>
                            <div className="text-[10px] text-slate-500 font-mono">{p.machineIdentifier}</div>
                          </td>
                          <td className="p-3">₹{p.totalGrossRevenue.toLocaleString('en-IN')}</td>
                          <td className="p-3 text-rose-700">₹{(p.fuelExpenses + p.maintenanceExpenses).toLocaleString('en-IN')}</td>
                          <td className="p-3 font-bold text-emerald-800">₹{p.netContributionProfit.toLocaleString('en-IN')}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800">
                              {p.recommendation}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* Data Freshness & Traceability Panel */}
          <div className="border-t border-slate-200 pt-5 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-slate-400" />
              <span>Data Sources & Grounding Verification</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600">
              {(farmerReport?.dataFreshnessPanel || fleetReport?.dataFreshnessPanel || []).map((ds, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="font-medium text-slate-800">{ds.source}</span>
                  <span className="font-mono text-slate-500 text-[10px]">{ds.ageMinutes}m ago • {ds.quality}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Decision Support Disclaimer */}
          <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-[11px] text-amber-900 leading-relaxed">
            <strong>Decision Support Notice:</strong> {farmerReport?.disclaimer || 'This report is generated from statistical agronomic models, IoT telematics telemetry, and verified mandi price feeds. All financial figures represent expected estimates rather than guaranteed returns.'}
          </div>
        </div>
      </div>
    </div>
  );
};
