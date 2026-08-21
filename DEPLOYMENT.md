# KisanOps Deployment Guide

This guide covers deployment procedures for Vercel, Netlify, and Supabase.

---

## 1. Environment Variables

Create a `.env` file in the project root:

```bash
# Frontend Supabase Integration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Backend Secret (For Edge Functions / Services)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Map Provider (Optional custom tiles)
VITE_MAP_TILES_URL=https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png

# Payment Gateway (Razorpay / Cashfree)
VITE_RAZORPAY_KEY_ID=rzp_test_placeholder
RAZORPAY_KEY_SECRET=secret_placeholder
```

---

## 2. Frontend Deployment (Vercel)

1. Push your repository to GitHub.
2. Log into **Vercel** and select **Add New Project**.
3. Import the `kisanops` repository.
4. Set the Framework Preset to **Vite**.
5. Set Build Command: `npm run build`
6. Set Output Directory: `dist`
7. Add Environment Variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).
8. Deploy!

---

## 3. Database Deployment (Supabase)

1. Create a new project on [Supabase.com](https://supabase.com).
2. Navigate to **SQL Editor**.
3. Copy the contents of `supabase/migrations/20260821000000_initial_schema.sql` and run the script.
4. Enable Realtime on the `machine_telemetry`, `bookings`, and `maintenance_predictions` tables under **Database > Replication**.

---

## 4. Production Health Check

Run the automated verification suite before promotion:
```bash
npm run build
npx vitest run
```
