import React, { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Info
} from 'lucide-react';
import { Machine, PriceQuote, ActivityType, PaymentMethod } from '../../types';
import { useKisanOpsStore } from '../../store/kisanOpsStore';
import { useNavigate } from 'react-router-dom';
import { RazorpayCheckoutModal } from '../../components/common/RazorpayCheckoutModal';
import clsx from 'clsx';

interface BookingModalProps {
  machine: Machine;
  priceQuote: PriceQuote;
  activity?: ActivityType;
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  machine,
  priceQuote,
  activity = 'HARVESTING',
  onClose,
}) => {
  const { state, createBooking } = useKisanOpsStore();
  const navigate = useNavigate();

  const [bookedHours, setBookedHours] = useState<number>(6.0);
  const [startDate, setStartDate] = useState<string>('2026-08-22');
  const [startTime, setStartTime] = useState<string>('08:00');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('AGRICREDIT_DEFERRED');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showRazorpayModal, setShowRazorpayModal] = useState<boolean>(false);

  const { farm, agriCredit } = state;

  // Calculation lines
  const hourlyRate = priceQuote.quotedRatePerHour;
  const rentalAmount = Math.round(bookedHours * hourlyRate);
  const transportCharge = 300;
  const platformFee = 100;
  const promoDiscount = 100;
  const subtotal = rentalAmount + transportCharge + platformFee - promoDiscount;
  const gstAmount = Math.round(subtotal * 0.05);
  const estimatedTotal = subtotal + gstAmount;

  const isAgriCreditEligible = agriCredit.availableCredit >= estimatedTotal;

  const executeFinalBooking = (paymentStatus: 'AUTHORIZED' | 'CAPTURED' = 'AUTHORIZED') => {
    setIsSubmitting(true);

    const startDateTime = `${startDate}T${startTime}:00.000Z`;
    const endHour = (parseInt(startTime.split(':')[0], 10) + bookedHours) % 24;
    const endDateTime = `${startDate}T${endHour.toString().padStart(2, '0')}:00:00.000Z`;

    setTimeout(() => {
      createBooking({
        farmerId: state.currentUser.id,
        farmerName: state.currentUser.fullName,
        farmerPhone: state.currentUser.phoneNumber,
        chcId: machine.chcId,
        chcName: machine.chcName,
        machineId: machine.id,
        machineIdentifier: machine.identifier,
        machineModel: `${machine.brand} ${machine.model}`,
        machineCategory: machine.category,
        farmId: farm.id,
        farmName: farm.farmName,
        farmLocation: `${farm.village}, ${farm.district} (${farm.sizeAcres} Acres)`,
        activity,
        status: 'CONFIRMED',
        bookingMode: 'HOURLY',
        bookedHours,
        startTime: startDateTime,
        endTime: endDateTime,
        hourlyRate,
        estimatedTotal,
        paymentMethod,
        paymentStatus,
        operatorName: machine.operatorName || 'Assigned CHC Operator',
        operatorPhone: machine.operatorPhone || state.currentUser.phoneNumber || 'N/A',
      });

      setIsSubmitting(false);
      setShowRazorpayModal(false);
      onClose();
      navigate('/farmer/rentals');
    }, 600);
  };

  const handleConfirmBooking = () => {
    if (paymentMethod === 'UPI' || paymentMethod === 'CARD') {
      setShowRazorpayModal(true);
    } else {
      executeFinalBooking('AUTHORIZED');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-5 sm:p-6 shadow-2xl border border-slate-100 my-auto max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-agri-100 text-agri-900 font-bold px-2 py-0.5 rounded-md uppercase">
                {machine.category}
              </span>
              <h3 className="text-lg font-extrabold text-slate-900">
                Book {machine.brand} {machine.model}
              </h3>
            </div>
            <p className="text-xs text-slate-500 font-mono mt-0.5">{machine.identifier} • {machine.chcName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          {/* Farm Destination */}
          <div className="bg-surface-50 p-3.5 rounded-2xl border border-slate-200/80 flex items-center gap-3">
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="text-xs">
              <div className="font-bold text-slate-800">Destination: {farm.farmName}</div>
              <div className="text-slate-600">{farm.village}, {farm.district} • {farm.sizeAcres} Acres ({farm.crop.cropName})</div>
            </div>
          </div>

          {/* Duration & Scheduling */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Operating Hours</label>
              <select
                value={bookedHours}
                onChange={e => setBookedHours(parseFloat(e.target.value))}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-agri-500 focus:outline-none"
              >
                <option value={4}>4 Hours (Half Day)</option>
                <option value={6}>6 Hours (Standard Harvest)</option>
                <option value={8}>8 Hours (Full Day)</option>
                <option value={12}>12 Hours (Intensive Shift)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Date</label>
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-agri-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Start Time</label>
              <select
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-agri-500 focus:outline-none"
              >
                <option value="06:00">06:00 AM (Early Dawn)</option>
                <option value="08:00">08:00 AM (Morning Shift)</option>
                <option value="12:00">12:00 PM (Noon Shift)</option>
                <option value="15:00">03:00 PM (Afternoon)</option>
              </select>
            </div>
          </div>

          {/* Payment Selection */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>Select Payment Method</span>
              <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> AgriCredit Verified
              </span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Option 1: AgriCredit Deferred */}
              <button
                type="button"
                onClick={() => setPaymentMethod('AGRICREDIT_DEFERRED')}
                className={clsx(
                  'text-left p-3 rounded-2xl border transition-all flex flex-col justify-between',
                  paymentMethod === 'AGRICREDIT_DEFERRED'
                    ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/30'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                )}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-extrabold text-xs text-agri-950 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      AgriCredit Deferred
                    </span>
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">
                      Zero Upfront
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600">Pay within 45 days post harvest.</p>
                </div>
                <div className="mt-2 text-[10px] font-semibold text-emerald-800">
                  Available: ₹{agriCredit.availableCredit.toLocaleString('en-IN')}
                </div>
              </button>

              {/* Option 2: Pay Online */}
              <button
                type="button"
                onClick={() => setPaymentMethod('UPI')}
                className={clsx(
                  'text-left p-3 rounded-2xl border transition-all flex flex-col justify-between',
                  paymentMethod === 'UPI'
                    ? 'border-agri-500 bg-agri-50/50 ring-2 ring-agri-500/30'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                )}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-extrabold text-xs text-slate-900 flex items-center gap-1">
                      <CreditCard className="w-3.5 h-3.5 text-slate-600" />
                      Pay Online (UPI / Cards)
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600">Instant digital settlement via Razorpay.</p>
                </div>
                <div className="mt-2 text-[10px] text-slate-500">Google Pay, PhonePe, Cards</div>
              </button>
            </div>
          </div>

          {/* Pricing Calculation Summary */}
          <div className="bg-surface-100 rounded-2xl p-4 space-y-2 border border-slate-200/80 text-xs">
            <div className="font-bold text-slate-800 mb-1 flex items-center justify-between">
              <span>Transparent Price Summary</span>
              <span className="text-[11px] text-slate-500">Rate: ₹{hourlyRate}/hr</span>
            </div>

            <div className="flex justify-between text-slate-600">
              <span>Machinery Rental ({bookedHours} hrs × ₹{hourlyRate})</span>
              <span className="font-semibold text-slate-800">₹{rentalAmount}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Mobilization & Transport</span>
              <span className="font-semibold text-slate-800">₹{transportCharge}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Platform & Machine Tracking Fee</span>
              <span className="font-semibold text-slate-800">₹{platformFee}</span>
            </div>
            <div className="flex justify-between text-emerald-700 font-medium">
              <span>AgriCredit Loyalty Promotion</span>
              <span>-₹{promoDiscount}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>GST (5%)</span>
              <span className="font-semibold text-slate-800">₹{gstAmount}</span>
            </div>

            <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm font-extrabold text-slate-900">
              <span>Total Quotation</span>
              <span className="text-base text-agri-900">₹{estimatedTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary text-xs py-2.5 px-4"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleConfirmBooking}
            disabled={isSubmitting || (paymentMethod === 'AGRICREDIT_DEFERRED' && !isAgriCreditEligible)}
            className="btn-primary text-xs py-2.5 px-6 flex-1 shadow-md"
          >
            {isSubmitting ? 'Confirming with CHC Hub...' : `Confirm Booking (₹${estimatedTotal.toLocaleString('en-IN')})`}
          </button>
        </div>
      </div>

      {showRazorpayModal && (
        <RazorpayCheckoutModal
          amountRupees={estimatedTotal}
          customerName={state.currentUser.fullName}
          customerPhone={state.currentUser.phoneNumber}
          customerEmail={state.currentUser.email}
          bookingDescription={`${machine.brand} ${machine.model} (${bookedHours} Hours Rental)`}
          onSuccess={(paymentId) => {
            executeFinalBooking('CAPTURED');
          }}
          onClose={() => setShowRazorpayModal(false)}
        />
      )}
    </div>
  );
};
