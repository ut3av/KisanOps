import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  ArrowRight,
  Phone,
  TrendingUp,
  CreditCard,
  Wrench
} from 'lucide-react';
import { YuktiActionCardData } from '../../services/yuktiAiService';
import { useKisanOpsStore } from '../../store/kisanOpsStore';

interface YuktiActionCardProps {
  card: YuktiActionCardData;
  onActionTriggered?: (actionName: string) => void;
}

export const YuktiActionCard: React.FC<YuktiActionCardProps> = ({ card, onActionTriggered }) => {
  const { createBooking, approveAllocation, resolveAlert, state } = useKisanOpsStore();
  const navigate = useNavigate();
  const [isExecuted, setIsExecuted] = useState(false);
  const [executionMessage, setExecutionMessage] = useState<string | null>(null);

  // 1. BOOK MACHINE CARD
  if (card.type === 'BOOK_MACHINE') {
    const { machine, activity, acres, estimatedHours, estimatedTotal, priceQuote } = card.payload;

    const handleConfirmBooking = () => {
      const startTime = new Date(Date.now() + 86400000).toISOString();
      const endTime = new Date(Date.now() + 86400000 + estimatedHours * 3600000).toISOString();

      const newBooking = createBooking({
        farmerId: state.currentUser.id,
        farmerName: state.currentUser.fullName,
        farmerPhone: state.currentUser.phoneNumber,
        chcId: machine.chcId,
        chcName: machine.chcName,
        machineId: machine.id,
        machineIdentifier: machine.identifier,
        machineModel: `${machine.brand} ${machine.model}`,
        machineCategory: machine.category,
        farmId: state.farm.id,
        farmName: state.farm.farmName,
        farmLocation: `${state.farm.village}, ${state.farm.district} (${acres} Acres)`,
        activity,
        status: 'CONFIRMED',
        bookingMode: 'HOURLY',
        bookedHours: estimatedHours,
        startTime,
        endTime,
        hourlyRate: machine.baseRatePerHour,
        estimatedTotal,
        paymentMethod: 'AGRICREDIT_DEFERRED',
        paymentStatus: 'AUTHORIZED',
        operatorName: machine.operatorName || 'Raju Verma',
        operatorPhone: '+91 97550 12399',
      });

      setIsExecuted(true);
      setExecutionMessage(`Booking Created: ${newBooking.bookingNumber}! Machine reserved.`);
      if (onActionTriggered) onActionTriggered('Booking Confirmed');
    };

    return (
      <div className="mt-3 bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl p-3.5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
              🚜
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                {card.title}
              </h4>
              <p className="text-[10px] text-slate-500">{card.subtitle}</p>
            </div>
          </div>
          {card.badge && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
              {card.badge}
            </span>
          )}
        </div>

        {/* Pricing & Time details */}
        <div className="bg-surface-50 dark:bg-slate-800/70 rounded-xl p-2.5 grid grid-cols-3 gap-1.5 text-center text-xs">
          <div>
            <span className="text-[9px] text-slate-400 block uppercase">Farm Size</span>
            <span className="font-extrabold text-slate-800 dark:text-slate-200">{acres} Acres</span>
          </div>
          <div>
            <span className="text-[9px] text-slate-400 block uppercase">Est. Time</span>
            <span className="font-extrabold text-slate-800 dark:text-slate-200">{estimatedHours} Hrs</span>
          </div>
          <div>
            <span className="text-[9px] text-slate-400 block uppercase">Est. Total</span>
            <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
              ₹{estimatedTotal.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Action Button */}
        {isExecuted ? (
          <div className="bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 rounded-xl p-2 flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-200 font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{executionMessage}</span>
          </div>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleConfirmBooking}
              className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-colors active:scale-95"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Confirm 1-Click Booking</span>
            </button>
            <button
              onClick={() => navigate('/farmer/marketplace')}
              className="py-2 px-3 rounded-xl bg-surface-100 hover:bg-surface-200 text-slate-700 font-bold text-xs transition-colors"
            >
              Details
            </button>
          </div>
        )}
      </div>
    );
  }

  // 2. DEMAND REALLOCATION CARD
  if (card.type === 'DEMAND_REALLOCATION') {
    const { allocation, forecast, sourceHub, targetHub } = card.payload;

    const handleApproveReallocation = () => {
      if (allocation) {
        approveAllocation(allocation.id);
      }
      setIsExecuted(true);
      setExecutionMessage('Reallocation Approved: 2 Harvesters Dispatched to Sehore!');
      if (onActionTriggered) onActionTriggered('Reallocation Approved');
    };

    return (
      <div className="mt-3 bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800/60 rounded-2xl p-3.5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-sm">
              📊
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                {card.title}
              </h4>
              <p className="text-[10px] text-slate-500">{card.subtitle}</p>
            </div>
          </div>
          {card.badge && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
              {card.badge}
            </span>
          )}
        </div>

        <div className="bg-amber-50/60 dark:bg-amber-950/30 rounded-xl p-2.5 flex items-center justify-between text-xs">
          <div>
            <span className="text-[9px] text-slate-500 block uppercase">From Source</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{sourceHub}</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <div className="text-right">
            <span className="text-[9px] text-slate-500 block uppercase">To Target</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{targetHub}</span>
          </div>
        </div>

        {isExecuted ? (
          <div className="bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 rounded-xl p-2 flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-200 font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{executionMessage}</span>
          </div>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleApproveReallocation}
              className="flex-1 py-2 px-3 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-colors active:scale-95"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Approve Fleet Transfer</span>
            </button>
            <button
              onClick={() => navigate('/chc/demand')}
              className="py-2 px-3 rounded-xl bg-surface-100 hover:bg-surface-200 text-slate-700 font-bold text-xs transition-colors"
            >
              Matrix
            </button>
          </div>
        )}
      </div>
    );
  }

  // 3. MAINTENANCE TRIAGE CARD
  if (card.type === 'MAINTENANCE_TRIAGE') {
    const { alert, machine } = card.payload;

    const handleResolve = () => {
      if (alert) {
        resolveAlert(alert.id);
      }
      setIsExecuted(true);
      setExecutionMessage('Maintenance Alert Resolved & Service Scheduled!');
      if (onActionTriggered) onActionTriggered('Alert Resolved');
    };

    return (
      <div className="mt-3 bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-800/60 rounded-2xl p-3.5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center font-bold text-sm">
              ⚠️
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                {card.title}
              </h4>
              <p className="text-[10px] text-slate-500">{card.subtitle}</p>
            </div>
          </div>
          {card.badge && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300">
              {card.badge}
            </span>
          )}
        </div>

        <div className="text-[11px] text-slate-600 dark:text-slate-300 bg-rose-50/50 dark:bg-rose-950/20 p-2.5 rounded-xl border border-rose-100 dark:border-rose-900/40">
          <strong>Recommended Action:</strong> {alert?.recommendedAction || 'Inspect fuel injection nozzle and air filter.'}
        </div>

        {isExecuted ? (
          <div className="bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 rounded-xl p-2 flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-200 font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{executionMessage}</span>
          </div>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleResolve}
              className="flex-1 py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-colors active:scale-95"
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Dispatch Mechanic & Resolve</span>
            </button>
            <button
              onClick={() => navigate('/chc/maintenance')}
              className="py-2 px-3 rounded-xl bg-surface-100 hover:bg-surface-200 text-slate-700 font-bold text-xs transition-colors"
            >
              View Sensor
            </button>
          </div>
        )}
      </div>
    );
  }

  // 4. AGRICREDIT CARD
  if (card.type === 'AGRICREDIT_BOOSTER') {
    const { score, available } = card.payload;
    return (
      <div className="mt-3 bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800/60 rounded-2xl p-3.5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold text-sm">
              💳
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                {card.title}
              </h4>
              <p className="text-[10px] text-slate-500">{card.subtitle}</p>
            </div>
          </div>
          {card.badge && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
              {card.badge}
            </span>
          )}
        </div>

        <button
          onClick={() => navigate('/farmer/credit')}
          className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-colors"
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Open AgriCredit Portal & Repayment Index</span>
        </button>
      </div>
    );
  }

  // 5. LIVE TRACKING CARD
  if (card.type === 'TRACK_JOB') {
    const { machine, booking, telemetry } = card.payload;
    return (
      <div className="mt-3 bg-white dark:bg-slate-900 border border-sky-200 dark:border-sky-800/60 rounded-2xl p-3.5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-sm">
              📍
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                {card.title}
              </h4>
              <p className="text-[10px] text-slate-500">{card.subtitle}</p>
            </div>
          </div>
          {card.badge && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-300">
              {card.badge}
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => alert('Calling Operator Raju Verma (+91 97550 12399)...')}
            className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-colors"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call Driver (Raju)</span>
          </button>
          <button
            onClick={() => navigate('/operator')}
            className="py-2 px-3 rounded-xl bg-surface-100 hover:bg-surface-200 text-slate-700 font-bold text-xs transition-colors"
          >
            Telemetry
          </button>
        </div>
      </div>
    );
  }

  return null;
};
