import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { viteRazorpayPlugin } from './server/viteRazorpayPlugin.ts';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  // Populate process.env with loaded env vars for server middleware
  process.env.RAZORPAY_KEY_ID = env.RAZORPAY_KEY_ID || env.VITE_RAZORPAY_KEY_ID;
  process.env.RAZORPAY_KEY_SECRET = env.RAZORPAY_KEY_SECRET;
  process.env.VITE_RAZORPAY_KEY_ID = env.VITE_RAZORPAY_KEY_ID || env.RAZORPAY_KEY_ID;

  return {
    plugins: [react(), viteRazorpayPlugin()],
    // Ensure SPA fallback works for all routes during dev
    appType: 'spa',
  };
});
