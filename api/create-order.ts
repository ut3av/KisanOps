import { createRazorpayOrderBackend } from '../server/razorpayBackend.ts';

/**
 * Serverless / Edge / Node handler for POST /api/create-order
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
    const { amount, currency, receipt, notes } = body;

    // Validation: amount >= 100 paise
    if (amount === undefined || amount === null || typeof amount !== 'number' || amount < 100) {
      return res.status(400).json({
        success: false,
        error: 'Invalid amount: minimum order amount must be at least 100 paise (₹1.00).',
      });
    }

    const result = await createRazorpayOrderBackend({
      amount,
      currency,
      receipt,
      notes,
    });

    if (!result.success) {
      const statusCode = result.error?.includes('Authentication') ? 401 : 500;
      return res.status(statusCode).json(result);
    }

    return res.status(200).json(result);
  } catch (err: any) {
    console.error('Error in /api/create-order handler:', err);
    return res.status(500).json({
      success: false,
      error: err?.message || 'Internal Server Error while creating Razorpay order',
    });
  }
}
