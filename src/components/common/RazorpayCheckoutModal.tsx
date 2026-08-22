import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  X,
  Lock,
  ArrowRight,
  Sparkles,
  Zap,
  RotateCw,
  CreditCard,
  Building,
  Smartphone
} from 'lucide-react';
import {
  initiateRazorpayStandardCheckout,
  loadRazorpayScript,
} from '../../lib/razorpayService';

interface RazorpayCheckoutModalProps {
  amountRupees: number;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  bookingDescription: string;
  onSuccess: (paymentId: string) => void;
  onClose: () => void;
}

export const RazorpayCheckoutModal: React.FC<RazorpayCheckoutModalProps> = ({
  amountRupees,
  customerName,
  customerPhone,
  customerEmail = 'farmer@kisanops.in',
  bookingDescription,
  onSuccess,
  onClose,
}) => {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load Razorpay Standard Checkout SDK on mount and auto-launch
  useEffect(() => {
    loadRazorpayScript();
  }, []);

  const handleLaunchRazorpay = async () => {
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      await initiateRazorpayStandardCheckout({
        amountRupees,
        description: bookingDescription,
        customer: {
          name: customerName,
          email: customerEmail,
          phone: customerPhone,
        },
        onSuccess: (result) => {
          setIsProcessing(false);
          onSuccess(result.paymentId);
        },
        onFailure: (error) => {
          setIsProcessing(false);
          setErrorMessage(error.description || error.reason || 'Payment cancelled or failed on Razorpay gateway.');
        },
        onDismiss: () => {
          setIsProcessing(false);
        },
      });
    } catch (err: any) {
      setIsProcessing(false);
      setErrorMessage(err.message || 'Unable to open Razorpay. Please check your internet connection.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/75 backdrop-blur-xs overflow-y-auto font-sans">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-auto space-y-6 animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-800 text-white flex items-center justify-center font-black shadow-sm text-xl font-mono">
              ₹
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                  Razorpay Secure Gateway
                </h3>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full">
                  256-Bit SSL
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Official UPI, Google Pay, PhonePe, Cards & NetBanking
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order Summary Card */}
        <div className="bg-surface-50 border border-slate-200/90 rounded-2xl p-4 space-y-3">
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            Payment Summary
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-600">Equipment Booking:</span>
            <span className="font-bold text-slate-900 truncate max-w-[200px]">
              {bookingDescription}
            </span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-600">Farmer Name:</span>
            <span className="font-medium text-slate-800">{customerName}</span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-600">Contact Number:</span>
            <span className="font-mono text-slate-800">{customerPhone}</span>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-slate-200 text-sm font-extrabold">
            <span className="text-slate-900">Total Payable Amount:</span>
            <span className="text-xl font-black text-emerald-800 font-mono">
              ₹{amountRupees.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Supported Channels Strip */}
        <div className="grid grid-cols-3 gap-2 text-center text-[11px] text-slate-600">
          <div className="p-2.5 rounded-xl bg-surface-50 border border-slate-100 font-bold flex flex-col items-center gap-1">
            <Smartphone className="w-4 h-4 text-emerald-700" />
            <span>UPI Apps</span>
          </div>
          <div className="p-2.5 rounded-xl bg-surface-50 border border-slate-100 font-bold flex flex-col items-center gap-1">
            <CreditCard className="w-4 h-4 text-emerald-700" />
            <span>Debit / Credit</span>
          </div>
          <div className="p-2.5 rounded-xl bg-surface-50 border border-slate-100 font-bold flex flex-col items-center gap-1">
            <Building className="w-4 h-4 text-emerald-700" />
            <span>NetBanking</span>
          </div>
        </div>

        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Main Action Button */}
        <button
          onClick={handleLaunchRazorpay}
          disabled={isProcessing}
          className="w-full py-3.5 px-5 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isProcessing ? (
            <>
              <RotateCw className="w-4 h-4 animate-spin" />
              <span>Opening Razorpay Gateway...</span>
            </>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              <span>Proceed to Razorpay (₹{amountRupees.toLocaleString('en-IN')})</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <p className="text-[11px] text-center text-slate-400">
          🔒 You will be securely redirected to the official Razorpay Checkout window.
        </p>
      </div>
    </div>
  );
};
