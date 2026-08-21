import React, { useState } from 'react';
import {
  X,
  Star,
  MapPin,
  ShieldCheck,
  Zap,
  Info,
  Calendar,
  Clock,
  CheckCircle,
  HelpCircle,
  Wrench,
  Gauge
} from 'lucide-react';
import { Machine, PriceQuote, ActivityType } from '../../types';
import { BookingModal } from './BookingModal';
import { ExplanationBadge } from '../../components/common/ExplanationBadge';
import clsx from 'clsx';

interface MachineDetailsModalProps {
  machine: Machine;
  priceQuote: PriceQuote;
  matchScore?: number;
  matchReasons?: string[];
  activity?: ActivityType;
  onClose: () => void;
}

export const MachineDetailsModal: React.FC<MachineDetailsModalProps> = ({
  machine,
  priceQuote,
  matchScore = 94,
  matchReasons = [],
  activity = 'HARVESTING',
  onClose,
}) => {
  const [showBookingModal, setShowBookingModal] = useState(false);

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
        <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 my-8">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-slate-100 pb-4 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-agri-100 text-agri-900 font-bold px-2.5 py-0.5 rounded-md uppercase">
                  {machine.category}
                </span>
                <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {matchScore}% Smart Match
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 mt-1">
                {machine.brand} {machine.model}
              </h2>
              <p className="text-xs text-slate-500 font-mono">
                Identifier: {machine.identifier} • Year: {machine.yearOfManufacture}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-5 max-h-[70vh] overflow-y-auto pr-1">
            {/* Image & Quick Metrics */}
            <div className="relative h-60 rounded-2xl overflow-hidden shadow-inner bg-slate-900">
              <img
                src={machine.imageUrl}
                alt={machine.model}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 left-3 right-3 bg-black/75 backdrop-blur-md rounded-xl p-3 text-white flex justify-between items-center text-xs">
                <div>
                  <div className="font-semibold">{machine.chcName}</div>
                  <div className="text-[11px] text-slate-300 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-emerald-400" />
                    <span>{machine.distanceKm} km from your farm</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-base font-bold text-emerald-400">₹{priceQuote.quotedRatePerHour}/hr</div>
                  <div className="text-[10px] text-slate-300">Base rate: ₹{priceQuote.baseRatePerHour}/hr</div>
                </div>
              </div>
            </div>

            {/* Smart Match Explanation Badge */}
            {matchReasons.length > 0 && (
              <ExplanationBadge
                title="Smart Match Suitability Factors"
                badgeText={`${matchScore}% Match Fit`}
                badgeColor="emerald"
                reasons={matchReasons}
                defaultOpen={true}
              />
            )}

            {/* Transparent Dynamic Pricing Breakdown ("Why this price?") */}
            <div className="bg-surface-50 border border-slate-200/90 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-agri-700" />
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                    Transparent Dynamic Pricing Breakdown
                  </h4>
                </div>
                <span className="text-[11px] font-mono text-slate-500">Surge: {priceQuote.surgeMultiplier}x</span>
              </div>

              <div className="divide-y divide-slate-200/70 text-xs">
                {priceQuote.explanation.map((item, idx) => (
                  <div key={idx} className="py-2 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-slate-800">{item.title}</div>
                      <div className="text-[11px] text-slate-500">{item.description}</div>
                    </div>
                    <div
                      className={clsx(
                        'font-mono font-bold text-xs',
                        item.type === 'positive' && 'text-amber-700',
                        item.type === 'negative' && 'text-emerald-700',
                        item.type === 'neutral' && 'text-slate-800'
                      )}
                    >
                      {item.type === 'positive' ? `+₹${item.amount}` : item.type === 'negative' ? `-₹${Math.abs(item.amount)}` : `₹${item.amount}`}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-300 flex justify-between items-center text-xs font-extrabold text-slate-900">
                <span>Final Quoted Hourly Rate:</span>
                <span className="text-sm text-agri-900">₹{priceQuote.quotedRatePerHour}/hr</span>
              </div>
            </div>

            {/* Machine Specs Grid */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Technical Specifications</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-surface-50 p-2.5 rounded-xl">
                  <div className="text-[10px] text-slate-500 font-medium">Engine Output</div>
                  <div className="font-bold text-slate-800 mt-0.5">{machine.powerHp} HP • {machine.specs.engine}</div>
                </div>

                <div className="bg-surface-50 p-2.5 rounded-xl">
                  <div className="text-[10px] text-slate-500 font-medium">Health Rating</div>
                  <div className="font-bold text-emerald-600 mt-0.5">{machine.healthScore}% Certified Prime</div>
                </div>

                <div className="bg-surface-50 p-2.5 rounded-xl">
                  <div className="text-[10px] text-slate-500 font-medium">Fuel Tank</div>
                  <div className="font-bold text-slate-800 mt-0.5">{machine.specs.fuelTankLitres} Litres (Diesel)</div>
                </div>

                {machine.specs.cuttingWidthMetres && (
                  <div className="bg-surface-50 p-2.5 rounded-xl">
                    <div className="text-[10px] text-slate-500 font-medium">Cutting Width</div>
                    <div className="font-bold text-slate-800 mt-0.5">{machine.specs.cuttingWidthMetres} Metres</div>
                  </div>
                )}

                <div className="bg-surface-50 p-2.5 rounded-xl">
                  <div className="text-[10px] text-slate-500 font-medium">Assigned Operator</div>
                  <div className="font-bold text-slate-800 mt-0.5">{machine.operatorName || 'Raju Verma'} ({machine.operatorRating || 4.9}★)</div>
                </div>

                <div className="bg-surface-50 p-2.5 rounded-xl">
                  <div className="text-[10px] text-slate-500 font-medium">Last Preventative Service</div>
                  <div className="font-bold text-slate-800 mt-0.5">{machine.hoursSinceLastService}h ago (Verified)</div>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
            <button
              onClick={onClose}
              className="btn-secondary text-xs py-2.5 px-4"
            >
              Close
            </button>

            <button
              onClick={() => setShowBookingModal(true)}
              className="btn-primary text-xs py-2.5 px-6 flex-1 shadow-md"
            >
              Book Machine (₹{priceQuote.quotedRatePerHour}/hr)
            </button>
          </div>
        </div>
      </div>

      {showBookingModal && (
        <BookingModal
          machine={machine}
          priceQuote={priceQuote}
          activity={activity}
          onClose={() => {
            setShowBookingModal(false);
            onClose();
          }}
        />
      )}
    </>
  );
};
