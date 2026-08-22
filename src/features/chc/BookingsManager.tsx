import React from 'react';
import {
  CalendarCheck,
  MapPin,
  Phone,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  FileText,
  User,
  ShieldCheck,
  ArrowRight,
  Tractor
} from 'lucide-react';
import { useKisanOpsStore } from '../../store/kisanOpsStore';
import { Booking, BookingStatus } from '../../types';
import { usePageTitle } from '../../hooks/usePageTitle';
import clsx from 'clsx';

export const BookingsManager: React.FC = () => {
  usePageTitle(
    'Bookings & Dispatch Operations',
    'Manage agricultural machinery rental reservations, assignments, and dispatch statuses.'
  );
  const { state, updateBookingStatus, loadDemoData } = useKisanOpsStore();
  const { bookings } = state;

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
                  <div className="font-bold text-slate-900 mt-0.5">{booking.activity} ({booking.bookedHours} hrs)</div>
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
                      onClick={() => updateBookingStatus(booking.id, 'COMPLETED', 6.4)}
                      className="btn-primary text-xs py-2 px-4 bg-emerald-700 hover:bg-emerald-800 flex items-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>Complete Work (6.4 Actual Hrs) & Issue Invoice</span>
                    </button>
                  )}

                  {booking.status === 'COMPLETED' && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                      <FileText className="w-3.5 h-3.5 shrink-0" />
                      <span>Tax Invoice Generated & Billed</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
