import React, { useState } from 'react';
import {
  CalendarCheck,
  MapPin,
  Phone,
  Clock,
  Download,
  CheckCircle2,
  Radio,
  FileText,
  ShieldCheck,
  Tractor,
  AlertTriangle,
  Play,
  ArrowRight
} from 'lucide-react';
import { useKisanOpsStore } from '../../store/kisanOpsStore';
import { LeafletFleetMap } from '../../components/common/LeafletFleetMap';
import { TelematicsGaugeCluster } from '../../components/common/TelematicsGauge';
import { generatePdfInvoice } from '../../lib/billingEngine';
import { BookingStatus } from '../../types';
import clsx from 'clsx';

export const FarmerRentals: React.FC = () => {
  const { state, updateBookingStatus } = useKisanOpsStore();
  const { bookings, farm, machines, chcs, currentTelemetry, invoices, simulationState } = state;

  const [selectedBookingId, setSelectedBookingId] = useState<string>(bookings[0]?.id || '');

  const activeBooking = bookings.find(b => b.id === selectedBookingId) || bookings[0];
  const bookingInvoice = invoices.find(inv => inv.bookingId === activeBooking?.id);

  const steps: { status: BookingStatus; label: string; desc: string }[] = [
    { status: 'CONFIRMED', label: 'Confirmed', desc: 'Equipment reserved at CHC Hub' },
    { status: 'DISPATCHED', label: 'Dispatched', desc: 'In transit to Bilkisganj' },
    { status: 'IN_PROGRESS', label: 'In Operation', desc: 'Working in 8-acre field' },
    { status: 'COMPLETED', label: 'Completed', desc: 'Work done & invoice issued' },
  ];

  const getStepIndex = (status: BookingStatus) => {
    switch (status) {
      case 'REQUESTED': return 0;
      case 'CONFIRMED': return 0;
      case 'DISPATCHED': return 1;
      case 'IN_PROGRESS': return 2;
      case 'COMPLETED': return 3;
      default: return 0;
    }
  };

  const currentStepIndex = activeBooking ? getStepIndex(activeBooking.status) : 0;
  const isOperatingOrDispatched = activeBooking?.status === 'DISPATCHED' || activeBooking?.status === 'IN_PROGRESS';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-subtle flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            My Machinery Rentals & Live Tracking
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Monitor real-time equipment dispatch, field telematics, and automated tax invoices.
          </p>
        </div>

        {bookings.length > 1 && (
          <select
            value={selectedBookingId}
            onChange={e => setSelectedBookingId(e.target.value)}
            className="bg-surface-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800"
          >
            {bookings.map(b => (
              <option key={b.id} value={b.id}>
                {b.bookingNumber} - {b.machineModel} ({b.status})
              </option>
            ))}
          </select>
        )}
      </div>

      {activeBooking ? (
        <div className="space-y-6">
          {/* Active Rental Hero Status Card */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-subtle space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-agri-100 text-agri-900 flex items-center justify-center font-bold text-xl">
                  🚜
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-500">{activeBooking.bookingNumber}</span>
                    <span
                      className={clsx(
                        'text-xs font-extrabold px-2.5 py-0.5 rounded-full uppercase',
                        activeBooking.status === 'COMPLETED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : activeBooking.status === 'IN_PROGRESS'
                          ? 'bg-sky-100 text-sky-800 animate-pulse'
                          : 'bg-amber-100 text-amber-800'
                      )}
                    >
                      {activeBooking.status}
                    </span>
                  </div>
                  <h2 className="text-lg font-extrabold text-slate-900 mt-0.5">{activeBooking.machineModel}</h2>
                </div>
              </div>

              {/* Operator info & Quick contact */}
              <div className="flex items-center gap-3 bg-surface-50 p-3 rounded-2xl border border-slate-200/80">
                <div className="w-9 h-9 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-xs">
                  {activeBooking.operatorName?.charAt(0) || 'R'}
                </div>
                <div className="text-xs">
                  <div className="font-bold text-slate-900">{activeBooking.operatorName} (Operator)</div>
                  <div className="text-slate-500 font-mono">{activeBooking.operatorPhone}</div>
                </div>
                <a
                  href={`tel:${activeBooking.operatorPhone}`}
                  className="p-2 rounded-xl bg-agri-800 text-white hover:bg-agri-900 transition-colors shadow-sm ml-2"
                  title="Call Operator"
                >
                  <Phone className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Step Progression Bar */}
            <div className="py-2">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {steps.map((step, idx) => {
                  const isDone = idx < currentStepIndex || activeBooking.status === 'COMPLETED';
                  const isCurrent = idx === currentStepIndex && activeBooking.status !== 'COMPLETED';

                  return (
                    <div key={step.status} className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <div
                          className={clsx(
                            'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all',
                            isDone
                              ? 'bg-emerald-600 text-white shadow-sm'
                              : isCurrent
                              ? 'bg-agri-800 text-white ring-4 ring-agri-100'
                              : 'bg-slate-100 text-slate-400'
                          )}
                        >
                          {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                        </div>
                        <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={clsx(
                              'h-full transition-all duration-500',
                              isDone ? 'bg-emerald-500 w-full' : isCurrent ? 'bg-agri-800 w-1/2' : 'w-0'
                            )}
                          />
                        </div>
                      </div>
                      <div className="font-bold text-xs text-slate-800">{step.label}</div>
                      <div className="text-[11px] text-slate-500">{step.desc}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Interactive Simulation / Status Advance Bar for Demo Flow */}
            <div className="bg-surface-50 p-4 rounded-2xl border border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-slate-600 flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
                <span>
                  Telemetry Link: <strong>Active (2s streaming interval)</strong>
                </span>
              </div>

              <div className="flex items-center gap-2">
                {activeBooking.status === 'CONFIRMED' && (
                  <button
                    onClick={() => updateBookingStatus(activeBooking.id, 'DISPATCHED')}
                    className="btn-primary text-xs py-1.5 px-3"
                  >
                    Simulate: Dispatch Machine
                  </button>
                )}

                {activeBooking.status === 'DISPATCHED' && (
                  <button
                    onClick={() => updateBookingStatus(activeBooking.id, 'IN_PROGRESS')}
                    className="btn-primary text-xs py-1.5 px-3"
                  >
                    Simulate: Start In-Field Work
                  </button>
                )}

                {activeBooking.status === 'IN_PROGRESS' && (
                  <button
                    onClick={() => updateBookingStatus(activeBooking.id, 'COMPLETED', 6.4)}
                    className="btn-primary text-xs py-1.5 px-3 bg-emerald-700 hover:bg-emerald-800"
                  >
                    Simulate: Complete Rental (6.4h)
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Telematics Cluster & Interactive Route Map */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-12 space-y-4">
              <TelematicsGaugeCluster
                telemetry={currentTelemetry[activeBooking.machineId]}
                isAnomalyActive={simulationState.isFuelAnomalyActive}
              />

              <div className="bg-white border border-slate-200/90 rounded-3xl p-4 shadow-subtle">
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Live GPS Telematics Route Tracker
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">
                    Sehore Agri Centre ➔ Bilkisganj Farm
                  </span>
                </div>
                <LeafletFleetMap
                  chcs={chcs}
                  farm={farm}
                  machines={machines}
                  activeTelemetry={currentTelemetry}
                  selectedMachineId={activeBooking.machineId}
                  height="400px"
                />
              </div>
            </div>
          </div>

          {/* Automated Tax Invoice Section (Visible when completed or ready) */}
          {bookingInvoice && (
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-subtle space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-200">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-slate-900">
                        Automated Tax Invoice #{bookingInvoice.invoiceNumber}
                      </h3>
                      <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                        {bookingInvoice.paymentStatus}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Calculated from CAN-Bus operating actuals ({bookingInvoice.actualHours} actual hrs @ ₹{bookingInvoice.baseRatePerHour}/hr).
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => generatePdfInvoice(bookingInvoice)}
                  className="btn-primary text-xs py-2 px-4 shadow-sm flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Invoice PDF</span>
                </button>
              </div>

              {/* Invoice Itemized Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-surface-50 text-slate-600 font-bold uppercase tracking-wider text-[10px] border-y border-slate-200/80">
                    <tr>
                      <th className="py-2.5 px-3">Description</th>
                      <th className="py-2.5 px-3 text-center">Qty / Hours</th>
                      <th className="py-2.5 px-3 text-right">Unit Rate</th>
                      <th className="py-2.5 px-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {bookingInvoice.items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-medium text-slate-800">{item.description}</td>
                        <td className="py-2.5 px-3 text-center font-mono">{item.quantity}</td>
                        <td className="py-2.5 px-3 text-right font-mono">₹{Math.abs(item.unitPrice)}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-slate-900 font-mono">
                          {item.totalPrice < 0 ? `-₹${Math.abs(item.totalPrice)}` : `₹${item.totalPrice}`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t border-slate-200">
                      <td colSpan={3} className="py-2 px-3 text-right font-bold text-slate-600">GST (5%):</td>
                      <td className="py-2 px-3 text-right font-bold text-slate-900 font-mono">₹{bookingInvoice.taxGstAmount}</td>
                    </tr>
                    <tr className="border-t border-slate-200 bg-surface-50">
                      <td colSpan={3} className="py-3 px-3 text-right font-extrabold text-slate-900 text-sm">
                        Final Total Amount:
                      </td>
                      <td className="py-3 px-3 text-right font-black text-agri-950 text-base font-mono">
                        ₹{bookingInvoice.finalTotalAmount.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-subtle space-y-3">
          <Tractor className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No Rentals Scheduled</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Book machinery in the marketplace to see live telemetry, operator tracking, and invoices here.
          </p>
        </div>
      )}
    </div>
  );
};
