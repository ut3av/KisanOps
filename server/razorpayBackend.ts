import crypto from 'crypto';
import Razorpay from 'razorpay';

export interface CreateOrderParams {
  amount: number; // in paise (e.g. 50000 paise = ₹500)
  currency?: string;
  receipt?: string;
  notes?: Record<string, string>;
}

export interface CreateOrderResponse {
  success: boolean;
  order_id: string;
  amount: number;
  currency: string;
  receipt?: string;
  error?: string;
}

export interface VerifyPaymentParams {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  message?: string;
  error?: string;
  payment_id?: string;
  order_id?: string;
}

/**
 * Resolves Razorpay credentials from environment variables.
 */
export function getRazorpayCredentials(): { keyId: string; keySecret: string } {
  const keyId = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID || '';
  const keySecret = process.env.RAZORPAY_KEY_SECRET || '';
  return { keyId, keySecret };
}

/**
 * Initializes a Razorpay SDK instance.
 */
export function getRazorpayInstance(): Razorpay {
  const { keyId, keySecret } = getRazorpayCredentials();
  if (!keyId || !keySecret) {
    throw new Error('Razorpay credentials missing: RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET not set.');
  }
  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
}

/**
 * STEP 1: Backend - Create Order
 * - Validates amount >= 100 paise
 * - Calls Razorpay API: POST https://api.razorpay.com/v1/orders
 * - Returns { order_id, amount, currency }
 */
export async function createRazorpayOrderBackend(params: CreateOrderParams): Promise<CreateOrderResponse> {
  const { amount, currency = 'INR', receipt, notes } = params;

  // Validation: Minimum 100 paise (₹1.00)
  if (!amount || typeof amount !== 'number' || amount < 100) {
    const errorMsg = 'Invalid amount: minimum order amount must be at least 100 paise (₹1.00).';
    return {
      success: false,
      order_id: '',
      amount: 0,
      currency,
      error: errorMsg,
    };
  }

  const { keyId, keySecret } = getRazorpayCredentials();
  if (!keyId || !keySecret) {
    return {
      success: false,
      order_id: '',
      amount,
      currency,
      error: 'Authentication failed: Razorpay API credentials not configured on backend.',
    };
  }

  try {
    const razorpay = getRazorpayInstance();
    const orderOptions = {
      amount: Math.round(amount),
      currency: currency.toUpperCase(),
      receipt: receipt || `rcpt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      notes: notes || {},
    };

    const order = await razorpay.orders.create(orderOptions);

    return {
      success: true,
      order_id: order.id,
      amount: Number(order.amount),
      currency: order.currency,
      receipt: (order as any).receipt,
    };
  } catch (err: any) {
    console.error('Razorpay Order Creation Failed:', err);
    return {
      success: false,
      order_id: '',
      amount,
      currency,
      error: err?.error?.description || err?.message || 'Failed to create order on Razorpay gateway.',
    };
  }
}

/**
 * STEP 3: Backend - Verify Signature
 * - Algorithm: HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)
 * - Compares generated signature with razorpay_signature
 * - Returns success only if signatures match
 */
export function verifyRazorpaySignatureBackend(params: VerifyPaymentParams): VerifyPaymentResponse {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = params;

  // Validation: Check for required fields
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return {
      success: false,
      error: 'Missing required fields: razorpay_order_id, razorpay_payment_id, and razorpay_signature are required.',
    };
  }

  const { keySecret } = getRazorpayCredentials();
  if (!keySecret) {
    return {
      success: false,
      error: 'Authentication failure: RAZORPAY_KEY_SECRET is not configured on server.',
    };
  }

  try {
    const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(payload)
      .digest('hex');

    const isMatch = crypto.timingSafeEqual(
      Buffer.from(generatedSignature, 'utf8'),
      Buffer.from(razorpay_signature, 'utf8')
    );

    if (isMatch) {
      return {
        success: true,
        message: 'Payment signature verified successfully.',
        payment_id: razorpay_payment_id,
        order_id: razorpay_order_id,
      };
    } else {
      return {
        success: false,
        error: 'Payment verification failed: signature mismatch.',
      };
    }
  } catch (err: any) {
    // If buffer length differs timingSafeEqual throws, which indicates mismatch
    return {
      success: false,
      error: 'Payment verification failed: signature mismatch or malformed signature.',
    };
  }
}
