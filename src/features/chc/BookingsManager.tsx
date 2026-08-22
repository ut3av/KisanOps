import React, { useState } from 'react';
import {
  CalendarCheck,
  Clock,
  CheckCircle2,
  Truck,
  FileText,
  User,
  ShieldCheck,
  Tractor,
  X,
  Zap,
} from 'lucide-react';
import { useKisanOpsStore } from '../../store/kisanOpsStore';
import { Booking } from '../../types';
import { usePageTitle } from '../../hooks/usePageTitle';
import clsx from 'clsx';

export const BookingsManager: React.FC = () => {
  usePageTitle(
    'Bookings & Dispatch Operations',
    'Manage agricultural machinery rental reservations, assignments, and dispatch statuses.'
  );
  const { state, updateBookingStatus, loadDemoData } = useKisanOpsStore();
  const { bookings } = state;

  const [completingBooking, setCompletingBooking] = useState<Booking | null>(null);
  const [actualHoursInput, setActualHoursInput] = useState<string>('6.0');

  const handleOpenCompleteModal = (booking: Booking) => {
    setCompletingBooking(booking);
    setActualHoursInput(String(booking.actualHours ?? booking.bookedHours ?? 6.0));
  };

  const handleConfirmCompletion = () => {
    if (!completingBooking) return;
    const hours = Math.max(0.5, Number(actualHoursInput) || completingBooking.bookedHours || 6.0);
    updateBookingStatus(completingBooking.id, 'COMPLETED', hours);
    setCompletingBooking(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-subtle flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Bookings & Dispatch Management
            </h1>
            <span className="text-xs bg-agri-100 text-agri-800 font-bold px-2 py-0.5 rounded-md">
              {bookings.length} Total Bookings
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage incoming farmer reservations, operator mobilization, live work progress, and automatic completion.
          </p>
        </div>
      </div>

      {/* Bookings List */}
      {bookings.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/90 shadow-subtle space-y-4 max-w-lg mx-auto my-6">
          <div className="w-14 h-14 rounded-2xl bg-surface-100 flex items-center justify-center mx-auto text-slate-400">
            <CalendarCheck className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No Rental Bookings Received</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            There are currently no active, dispatched, or pending farmer bookings. You can load the demonstration dataset to test the full lifecycle dispatch.
          </p>
          <button
            onClick={() => loadDemoData()}
            className="btn-primary text-xs py-2.5 px-5 bg-amber-500 hover:bg-amber-600 text-white inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <span>⚡ Load Demo Bookings</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map(booking => {
            return (
              <div
                key={booking.id}
                className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-subtle space-y-4 hover:shadow-card transition-all"
              >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-agri-100 text-agri-900 flex items-center justify-center font-bold shrink-0">
                    <Tractor className="w-6 h-6 text-agri-900 shrink-0" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-500">{booking.bookingNumber}</span>
                      <span
                        className={clsx(
                          'text-xs font-extrabold px-2.5 py-0.5 rounded-full uppercase',
                          booking.status === 'COMPLETED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : booking.status === 'IN_PROGRESS'
                            ? 'bg-sky-100 text-sky-800 animate-pulse'
                            : 'bg-amber-100 text-amber-800'
                        )}
                      >
                        {booking.status}
                      </span>
                    </div>
                    <h3 className="text-base font-extrabold text-slate-900 mt-0.5">{booking.machineModel}</h3>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-lg font-black text-agri-950">₹{booking.estimatedTotal.toLocaleString('en-IN')}</div>
                  <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 justify-end">
                    <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                    <span>{booking.paymentMethod.replace('_', ' ')}</span>
                  </div>
                </div>
              </div>

              {/* Farmer and Field Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-surface-50 p-3 rounded-xl border border-slate-200/70">
                  <div className="text-slate-500 text-[10px] font-medium">Farmer Information</div>
                  <div className="font-bold text-slate-900 mt-0.5">{booking.farmerName}</div>
                  <div className="text-slate-500 font-mono">{booking.farmerPhone}</div>
                </div>

                <div className="bg-surface-50 p-3 rounded-xl border border-slate-200/70">
                  <div className="text-slate-500 text-[10px] font-medium">Destination & Farm</div>
                  <div className="font-bold text-slate-900 mt-0.5">{booking.farmName}</div>
                  <div className="text-slate-500">{booking.farmLocation}</div>
                </div>

                <div className="bg-surface-50 p-3 rounded-xl border border-slate-200/70">
                  <div className="text-slate-500 text-[10px] font-medium">Schedule & Duration</div>
                  <div className="font-bold text-slate-900 mt-0.5">
                    {booking.activity} ({booking.actualHours ? `${booking.actualHours} actual hrs` : `${booking.bookedHours} booked hrs`})
                  </div>
                  <div className="text-slate-500">Rate: ₹{booking.hourlyRate}/hr</div>
                </div>
              </div>

              {/* Operator Dispatch Controls */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-slate-500 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                  <span>Operator: <strong>{booking.operatorName}</strong> ({booking.operatorPhone})</span>
                </div>

                <div className="flex items-center gap-2">
                  {booking.status === 'CONFIRMED' && (
                    <button
                      onClick={() => updateBookingStatus(booking.id, 'DISPATCHED')}
                      className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Truck className="w-3.5 h-3.5 shrink-0" />
                      <span>Dispatch Operator & Machine</span>
                    </button>
                  )}

                  {booking.status === 'DISPATCHED' && (
                    <button
                      onClick={() => updateBookingStatus(booking.id, 'IN_PROGRESS')}
                      className="btn-primary text-xs py-2 px-4 bg-sky-700 hover:bg-sky-800 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Clock className="w-3.5 h-3.5 shrink-0" />
                      <span>Mark Work Started In Field</span>
                    </button>
                  )}

                  {booking.status === 'IN_PROGRESS' && (
                    <button
                      onClick={() => handleOpenCompleteModal(booking)}
                      className="btn-primary text-xs py-2 px-4 bg-emerald-700 hover:bg-emerald-800 flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>Complete Work & Issue Invoice</span>
                    </button>
                  )}

                  {booking.status === 'COMPLETED' && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                      <FileText className="w-3.5 h-3.5 shrink-0" />
                      <span>Tax Invoice Generated & Billed ({booking.actualHours || booking.bookedHours} hrs)</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
            );
          })}
        </div>
      )}

      {/* Completion & Verified Engine Hours Modal */}
      {completingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-5 animate-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Complete Rental & Generate Invoice
                </h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  {completingBooking.bookingNumber} • {completingBooking.farmerName}
                </p>
              </div>
              <button
                onClick={() => setCompletingBooking(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-surface-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-1.5">
                <div className="flex justify-between text-slate-600">
                  <span>Machinery Asset:</span>
                  <span className="font-bold text-slate-800">{completingBooking.machineModel}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Hourly Tariff:</span>
                  <span className="font-bold text-slate-800">₹{completingBooking.hourlyRate}/hr</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Booked Duration:</span>
                  <span className="font-bold text-slate-800">{completingBooking.bookedHours} Hours</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">
                  Actual Telematics Engine Runtime Hours *
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.1"
                    min="0.5"
                    max="48"
                    value={actualHoursInput}
                    onChange={e => setActualHoursInput(e.target.value)}
                    className="w-full bg-surface-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-bold font-mono text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                  <span className="text-xs font-bold text-slate-500 shrink-0">Hours</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Verified from machine CAN-Bus engine hours sensor. Invoicing will reconcile based on this number.
                </p>
              </div>

              <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-3.5 space-y-1">
                <div className="text-[11px] font-bold text-emerald-800 flex items-center justify-between">
                  <span>Estimated Total to Bill:</span>
                  <span className="text-sm font-black text-emerald-950">
                    ₹{(
                      Math.round(
                        (Number(actualHoursInput) || completingBooking.bookedHours) * completingBooking.hourlyRate + 300 + 100 - 100
                      ) * 1.05
                    ).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </span>
                </div>
                <p className="text-[10px] text-emerald-700">Includes base runtime, mobilization, tracking fee & 5% GST.</p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setCompletingBooking(null)}
                className="btn-secondary text-xs py-2 px-4 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmCompletion}
                className="btn-primary text-xs py-2 px-5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold flex items-center gap-1.5 shadow-md cursor-pointer rounded-xl"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Confirm & Issue Invoice</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
