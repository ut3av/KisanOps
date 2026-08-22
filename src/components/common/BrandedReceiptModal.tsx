import React from 'react';
import {
  X,
  Download,
  Printer,
  CheckCircle2,
  ShieldCheck,
  Building2,
  User,
  Calendar,
  Clock,
  Tractor,
  QrCode,
  FileText,
  CreditCard
} from 'lucide-react';
import { Invoice } from '../../types';
import { generatePdfInvoice } from '../../lib/billingEngine';

interface BrandedReceiptModalProps {
  invoice: Invoice;
  onClose: () => void;
}

export const BrandedReceiptModal: React.FC<BrandedReceiptModalProps> = ({
  invoice,
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    generatePdfInvoice(invoice);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-auto max-h-[95vh] overflow-y-auto animate-in fade-in zoom-in-95 space-y-6">
        {/* Receipt Top Actions */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs bg-emerald-100 text-emerald-800 font-extrabold px-3 py-1 rounded-full flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Official Tax Receipt & Invoice</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPdf}
              className="btn-primary text-xs py-2 px-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer font-bold"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={handlePrint}
              className="btn-secondary text-xs py-2 px-3 rounded-xl flex items-center gap-1.5 cursor-pointer font-bold"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Branded Receipt Paper */}
        <div className="bg-surface-50 border border-slate-200/90 rounded-2xl p-6 space-y-6 text-slate-900 font-sans shadow-subtle">
          {/* Header Brand Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white p-1.5 border border-slate-200 shadow-xs flex items-center justify-center">
                <img
                  src="/images/yukti-logo-transparent.png"
                  alt="Yukti Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="font-display text-xl font-extrabold tracking-tight text-agri-950">
                  Yukti
                </div>
                <div className="text-[11px] text-slate-500 font-medium">
                  Agricultural Machinery & CHC Network
                </div>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <div className="font-mono font-bold text-sm text-agri-800">
                {invoice.invoiceNumber}
              </div>
              <div className="text-[11px] text-slate-500">
                Issued: {new Date(invoice.issuedAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Farmer & CHC Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Billed To (Farmer)
              </div>
              <div className="font-extrabold text-slate-900 text-sm">{invoice.farmerName}</div>
              <div className="text-slate-600 font-mono">Phone: {invoice.farmerPhone}</div>
              <div className="text-slate-500 font-mono">Booking Ref: {invoice.bookingNumber}</div>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Custom Hiring Centre (CHC Provider)
              </div>
              <div className="font-extrabold text-slate-900 text-sm">{invoice.chcName}</div>
              <div className="text-slate-600">Equipment: {invoice.machineName}</div>
              <div className="text-slate-500 font-mono">Asset ID: {invoice.machineIdentifier}</div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-surface-100 text-slate-600 font-bold border-b border-slate-200">
                  <th className="py-2.5 px-3">Item Description</th>
                  <th className="py-2.5 px-3 text-center">Hours / Qty</th>
                  <th className="py-2.5 px-3 text-right">Rate</th>
                  <th className="py-2.5 px-3 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {invoice.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-2.5 px-3 text-slate-800">{item.description}</td>
                    <td className="py-2.5 px-3 text-center font-mono text-slate-600">{item.quantity}</td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-600">₹{Math.abs(item.unitPrice)}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                      {item.totalPrice < 0 ? `-₹${Math.abs(item.totalPrice)}` : `₹${item.totalPrice}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pricing Summary Breakdown */}
          <div className="space-y-1.5 text-xs text-right max-w-xs ml-auto pt-2">
            <div className="flex justify-between text-slate-600">
              <span>Base Rental Subtotal:</span>
              <span className="font-mono font-bold">₹{invoice.baseRentalAmount}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Mobilization & Logistics:</span>
              <span className="font-mono font-bold">₹{invoice.transportCharge}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Platform & Fuel Variance:</span>
              <span className="font-mono font-bold">₹{invoice.fuelSurcharge + invoice.platformFee}</span>
            </div>
            {invoice.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>Seasonal Promotional Discount:</span>
                <span className="font-mono">-₹{invoice.discountAmount}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>GST (5% Agricultural Implementation):</span>
              <span className="font-mono font-bold">₹{invoice.taxGstAmount}</span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-slate-900 border-t border-slate-300 pt-2">
              <span>Final Paid Amount:</span>
              <span className="font-mono text-emerald-700">₹{invoice.finalTotalAmount}</span>
            </div>
          </div>

          {/* Payment Verification Banner */}
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
              <div>
                <div className="font-extrabold">
                  Payment Method: {invoice.paymentMethod.replace('_', ' ')}
                </div>
                <div className="text-[11px] text-emerald-800">
                  Status: {invoice.paymentStatus} • Verified via Razorpay Gateway & Machine Sensors
                </div>
              </div>
            </div>
            <div className="text-right text-[10px] font-mono font-bold text-emerald-800 hidden sm:block">
              YUKTI-SECURE-PAY-VERIFIED
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
