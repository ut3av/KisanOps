import type { Plugin, ViteDevServer } from 'vite';
import type { IncomingMessage, ServerResponse } from 'http';
import { createRazorpayOrderBackend, verifyRazorpaySignatureBackend } from './razorpayBackend.ts';

/**
 * Helper to parse JSON body from incoming HTTP request.
 */
function parseRequestBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      if (!body) {
        return resolve({});
      }
      try {
        const json = JSON.parse(body);
        resolve(json);
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', (err) => reject(err));
  });
}

/**
 * Helper to send JSON response.
 */
function sendJsonResponse(res: ServerResponse, statusCode: number, data: any) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}

/**
 * Vite Plugin for local Razorpay API endpoints:
 * - POST /api/create-order
 * - POST /api/verify-payment
 */
export function viteRazorpayPlugin(): Plugin {
  return {
    name: 'vite-razorpay-api-plugin',
    configureServer(server: ViteDevServer) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split('?')[0];

        // Endpoint: POST /api/create-order
        if (url === '/api/create-order' && req.method === 'POST') {
          try {
            const body = await parseRequestBody(req);
            const { amount, currency, receipt, notes } = body;

            // Validate amount >= 100 paise
            if (amount === undefined || amount === null || typeof amount !== 'number' || amount < 100) {
              return sendJsonResponse(res, 400, {
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
              return sendJsonResponse(res, statusCode, result);
            }

            return sendJsonResponse(res, 200, result);
          } catch (err: any) {
            console.error('[Vite Razorpay API] Error in /api/create-order:', err);
            return sendJsonResponse(res, 500, {
              success: false,
              error: err?.message || 'Internal Server Error while creating order',
            });
          }
        }

        // Endpoint: POST /api/verify-payment
        if (url === '/api/verify-payment' && req.method === 'POST') {
          try {
            const body = await parseRequestBody(req);
            const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

            // Validate missing fields
            if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
              return sendJsonResponse(res, 400, {
                success: false,
                error: 'Missing required verification fields: razorpay_order_id, razorpay_payment_id, and razorpay_signature are required.',
              });
            }

            const result = verifyRazorpaySignatureBackend({
              razorpay_order_id,
              razorpay_payment_id,
              razorpay_signature,
            });

            if (!result.success) {
              const statusCode = result.error?.includes('Authentication') ? 401 : 400;
              return sendJsonResponse(res, statusCode, result);
            }

            return sendJsonResponse(res, 200, result);
          } catch (err: any) {
            console.error('[Vite Razorpay API] Error in /api/verify-payment:', err);
            return sendJsonResponse(res, 500, {
              success: false,
              error: err?.message || 'Internal Server Error while verifying signature',
            });
          }
        }

        next();
      });
    },
  };
}

export default viteRazorpayPlugin;
