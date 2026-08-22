import { verifyRazorpaySignatureBackend } from '../server/razorpayBackend.ts';

/**
 * Serverless / Edge / Node handler for POST /api/verify-payment
 */
export default async function handler(req: any, res: any) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed. Use POST.' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    // Validation: Missing fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: razorpay_order_id, razorpay_payment_id, and razorpay_signature are required.',
      });
    }

    const result = verifyRazorpaySignatureBackend({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    if (!result.success) {
      const statusCode = result.error?.includes('Authentication') ? 401 : 400;
      return res.status(statusCode).json(result);
    }

    return res.status(200).json(result);
  } catch (err: any) {
    console.error('Error in /api/verify-payment handler:', err);
    return res.status(500).json({
      success: false,
      error: err?.message || 'Internal Server Error while verifying signature',
    });
  }
}
