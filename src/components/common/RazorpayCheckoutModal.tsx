import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  CreditCard,
  QrCode,
  Smartphone,
  Building,
  CheckCircle2,
  AlertCircle,
  X,
  Lock,
  ArrowRight,
  Sparkles,
  Zap,
  RotateCw
} from 'lucide-react';
import clsx from 'clsx';

declare global {
  interface Window {
    Razorpay: any;
  }
}

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
  customerEmail = 'ramesh.farmer@kisanops.in',
  bookingDescription,
  onSuccess,
  onClose,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'UPI_QR' | 'UPI_INTENT' | 'CARD' | 'NET_BANKING'>('UPI_QR');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [upiId, setUpiId] = useState<string>('ramesh@okaxis');
  const [cardNumber, setCardNumber] = useState<string>('4532 •••• •••• 8812');
  const [expiry, setExpiry] = useState<string>('09/28');
  const [cvv, setCvv] = useState<string>('742');

  const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;

  // Load Razorpay Standard Checkout script if live key is available
  useEffect(() => {
    if (razorpayKey && !window.Razorpay) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, [razorpayKey]);

  const handleLaunchLiveRazorpay = () => {
    if (razorpayKey && window.Razorpay) {
      const options = {
        key: razorpayKey,
        amount: amountRupees * 100, // in paise
        currency: 'INR',
        name: 'Yukti (KisanOps)',
        description: bookingDescription,
        image: '/images/yukti-logo-transparent.png',
        handler: (response: any) => {
          onSuccess(response.razorpay_payment_id || `pay_${Date.now()}`);
        },
        prefill: {
          name: customerName,
          email: customerEmail,
          contact: customerPhone,
        },
        theme: {
          color: '#1B4D3E',
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } else {
      // Execute built-in interactive simulator
      handleSimulatePayment();
    }
  };

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const generatedPayId = `pay_rzp_${Date.now().toString(36).toUpperCase()}`;
      onSuccess(generatedPayId);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto font-sans">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 my-8 space-y-5 animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-stone-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1b4d3e] text-white flex items-center justify-center font-black shadow-sm">
              ₹
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-stone-900 font-typewriter">
                  Razorpay Secure Gateway
                </h3>
                <span className="text-[10px] bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-700" />
                  256-Bit SSL
                </span>
              </div>
              <p className="text-xs text-stone-500 font-medium">
                Merchant: Yukti AgTech Operations • Order Total: <strong className="text-stone-900">₹{amountRupees.toLocaleString('en-IN')}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-600 rounded-full hover:bg-stone-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Payment Methods Selection */}
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setSelectedMethod('UPI_QR')}
            className={clsx(
              'p-2.5 rounded-2xl border text-center transition-all cursor-pointer',
              selectedMethod === 'UPI_QR'
                ? 'border-[#7aa32c] bg-[#F5FAED] shadow-sm font-bold text-stone-900'
                : 'border-stone-200 text-stone-600 hover:bg-stone-50'
            )}
          >
            <QrCode className="w-5 h-5 text-[#7aa32c] mx-auto mb-1" />
            <div className="text-xs">UPI QR Code</div>
          </button>

          <button
            type="button"
            onClick={() => setSelectedMethod('UPI_INTENT')}
            className={clsx(
              'p-2.5 rounded-2xl border text-center transition-all cursor-pointer',
              selectedMethod === 'UPI_INTENT'
                ? 'border-[#7aa32c] bg-[#F5FAED] shadow-sm font-bold text-stone-900'
                : 'border-stone-200 text-stone-600 hover:bg-stone-50'
            )}
          >
            <Smartphone className="w-5 h-5 text-[#7aa32c] mx-auto mb-1" />
            <div className="text-xs">UPI Apps</div>
          </button>

          <button
            type="button"
            onClick={() => setSelectedMethod('CARD')}
            className={clsx(
              'p-2.5 rounded-2xl border text-center transition-all cursor-pointer',
              selectedMethod === 'CARD'
                ? 'border-[#7aa32c] bg-[#F5FAED] shadow-sm font-bold text-stone-900'
                : 'border-stone-200 text-stone-600 hover:bg-stone-50'
            )}
          >
            <CreditCard className="w-5 h-5 text-[#7aa32c] mx-auto mb-1" />
            <div className="text-xs">Card / RuPay</div>
          </button>
        </div>

        {/* Active Payment Method Container */}
        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-4">
          {selectedMethod === 'UPI_QR' && (
            <div className="text-center space-y-3">
              <div className="w-40 h-40 bg-white p-3 rounded-2xl mx-auto border border-stone-200 shadow-sm flex flex-col items-center justify-center relative">
                {/* Visual SVG QR Code Mock */}
                <div className="w-full h-full bg-stone-900 rounded-lg p-2 flex items-center justify-center">
                  <QrCode className="w-28 h-28 text-white" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-8 h-8 rounded-full bg-white p-1 shadow-md border border-stone-200">
                    <img src="/images/yukti-logo-transparent.png" alt="Yukti" className="w-full h-full object-contain" />
                  </div>
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-stone-800">
                  Scan QR with any UPI App (Google Pay / PhonePe / Paytm / BHIM)
                </p>
                <p className="text-[11px] text-stone-500 font-mono mt-0.5">
                  Amount: ₹{amountRupees.toLocaleString('en-IN')} • Ref: BK-{Date.now().toString().slice(-4)}
                </p>
              </div>
            </div>
          )}

          {selectedMethod === 'UPI_INTENT' && (
            <div className="space-y-3">
              <label className="block text-xs font-bold text-stone-700">Enter Virtual Payment Address (VPA / UPI ID)</label>
              <div className="relative">
                <Smartphone className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="e.g. yourname@oksbi"
                  className="w-full pl-9 pr-3 py-2.5 bg-white border border-stone-200 rounded-xl text-xs font-bold text-stone-900 focus:outline-none focus:border-[#7aa32c]"
                />
              </div>
              <div className="flex gap-2">
                {['@okaxis', '@okhdfcbank', '@paytm', '@ybl'].map((handle) => (
                  <button
                    key={handle}
                    type="button"
                    onClick={() => setUpiId(upiId.split('@')[0] + handle)}
                    className="text-[10px] font-bold px-2 py-1 bg-white border border-stone-200 rounded-lg text-stone-600 hover:text-stone-900"
                  >
                    {handle}
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedMethod === 'CARD' && (
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Card Number</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl font-mono text-stone-900 focus:outline-none focus:border-[#7aa32c]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Expiry Date</label>
                  <input
                    type="text"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl font-mono text-stone-900 focus:outline-none focus:border-[#7aa32c]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">CVV / CVC</label>
                  <input
                    type="password"
                    maxLength={4}
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl font-mono text-stone-900 focus:outline-none focus:border-[#7aa32c]"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="space-y-2 pt-1">
          <button
            type="button"
            disabled={isProcessing}
            onClick={handleLaunchLiveRazorpay}
            className="w-full py-3.5 rounded-xl bg-[#1b4d3e] hover:bg-[#153e32] text-white font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <RotateCw className="w-4 h-4 animate-spin text-[#9dc84d]" />
                <span>Verifying UPI / Bank Authorization...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 text-[#9dc84d]" />
                <span>Pay ₹{amountRupees.toLocaleString('en-IN')} Securely</span>
                <ArrowRight className="w-4 h-4 text-[#9dc84d]" />
              </>
            )}
          </button>

          <p className="text-[11px] text-center text-stone-500 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Instant tax invoice PDF generated upon payment capture.</span>
          </p>
        </div>
      </div>
    </div>
  );
};
