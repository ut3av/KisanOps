/**
 * Razorpay Standard Web Checkout Client Service
 * 
 * Orchestrates:
 * 1. Backend Order Creation (POST /api/create-order)
 * 2. Razorpay Standard Modal UI Trigger
 * 3. Backend HMAC-SHA256 Signature Verification (POST /api/verify-payment)
 */

declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface RazorpayCustomerDetails {
  name: string;
  email?: string;
  phone: string;
}

export interface RazorpayCheckoutOptions {
  amountRupees: number;
  description: string;
  customer: RazorpayCustomerDetails;
  receipt?: string;
  notes?: Record<string, string>;
  onSuccess: (paymentResult: {
    paymentId: string;
    orderId: string;
    signature: string;
  }) => void;
  onFailure?: (error: { code?: string; description?: string; source?: string; step?: string; reason?: string }) => void;
  onDismiss?: () => void;
}

/**
 * Ensures Razorpay Checkout script is loaded on the page.
 */
export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      return resolve(false);
    }
    if (window.Razorpay) {
      return resolve(true);
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.error('Failed to load Razorpay Checkout SDK');
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

/**
 * STEP 1: Calls Backend to create a verified Razorpay order.
 */
export async function createRazorpayOrder(
  amountRupees: number,
  receipt?: string,
  notes?: Record<string, string>
): Promise<{ order_id: string; amount: number; currency: string }> {
  const amountPaise = Math.round(amountRupees * 100);

  const response = await fetch('/api/create-order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: amountPaise,
      currency: 'INR',
      receipt,
      notes,
    }),
  });

  const data = await response.json();

  if (!response.ok || !data.success || !data.order_id) {
    throw new Error(data.error || 'Failed to create Razorpay order from backend.');
  }

  return {
    order_id: data.order_id,
    amount: data.amount,
    currency: data.currency,
  };
}

/**
 * STEP 3: Calls Backend to verify HMAC-SHA256 signature.
 */
export async function verifyRazorpayPayment(payload: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}): Promise<{ success: boolean; message?: string; error?: string }> {
  const response = await fetch('/api/verify-payment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Payment signature verification failed.');
  }

  return data;
}

/**
 * STEP 2: Main Entrypoint for Standard Web Checkout Modal
 */
export async function initiateRazorpayStandardCheckout(options: RazorpayCheckoutOptions): Promise<void> {
  const isScriptLoaded = await loadRazorpayScript();
  if (!isScriptLoaded || !window.Razorpay) {
    throw new Error('Razorpay SDK could not be loaded. Please check your internet connection.');
  }

  const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_TSik59VgeaYiNc';

  // 1. Create order on backend
  const order = await createRazorpayOrder(options.amountRupees, options.receipt, options.notes);

  // 2. Open standard checkout modal
  const rzpOptions: any = {
    key: razorpayKeyId,
    amount: order.amount,
    currency: order.currency,
    name: 'Yukti (KisanOps)',
    description: options.description,
    image: '/images/yukti-logo-transparent.png',
    order_id: order.order_id,
    prefill: {
      name: options.customer.name,
      email: options.customer.email || 'farmer@kisanops.in',
      contact: options.customer.phone,
    },
    notes: options.notes || {
      platform: 'Yukti KisanOps',
    },
    theme: {
      color: '#1B4D3E', // Forest Green Agri Theme
    },
    modal: {
      ondismiss: () => {
        if (options.onDismiss) {
          options.onDismiss();
        }
      },
    },
    handler: async (response: {
      razorpay_payment_id: string;
      razorpay_order_id: string;
      razorpay_signature: string;
    }) => {
      try {
        // 3. Verify signature on backend
        await verifyRazorpayPayment({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        });

        options.onSuccess({
          paymentId: response.razorpay_payment_id,
          orderId: response.razorpay_order_id,
          signature: response.razorpay_signature,
        });
      } catch (err: any) {
        if (options.onFailure) {
          options.onFailure({
            description: err.message || 'Signature verification failed on backend.',
          });
        }
      }
    },
  };

  const rzp = new window.Razorpay(rzpOptions);

  rzp.on('payment.failed', (response: any) => {
    console.error('Razorpay Payment Failed:', response.error);
    if (options.onFailure) {
      options.onFailure(response.error);
    }
  });

  rzp.open();
}
