# Yukti (KisanOps) — Agricultural Machinery Intelligence Platform

<div align="center">
  <img src="public/images/yukti-platform-overview.jpg" alt="Yukti Agricultural Machinery Intelligence Platform Overview" width="100%" style="border-radius: 16px; box-shadow: 0 20px 40px rgba(0,0,0,0.15);" />
  <br />
  <br />
  <p align="center">
    <strong>Predict. Allocate. Operate.</strong><br />
    <em>An end-to-end cloud operations & telematics intelligence platform for agricultural machinery, Custom Hiring Centres (CHCs), operators, and smallholder farmers.</em>
  </p>

  <p align="center">
    <a href="#-key-features"><img src="https://img.shields.io/badge/Platform-Production--Ready-1b4d3e?style=for-the-badge" alt="Production Ready" /></a>
    <a href="#-technology-stack"><img src="https://img.shields.io/badge/Stack-React%2018%20%7C%20TypeScript%20%7C%20Supabase-7aa32c?style=for-the-badge" alt="Stack" /></a>
    <a href="#-deployment-guide-vercel"><img src="https://img.shields.io/badge/Deploy-Vercel%20Edge%20Ready-000000?style=for-the-badge&logo=vercel" alt="Vercel" /></a>
    <a href="#-automated-test-suite"><img src="https://img.shields.io/badge/Tests-19%2F19%20Passing-emerald?style=for-the-badge" alt="Tests" /></a>
  </p>
</div>

---

## 🌾 The Problem & The Solution

In emerging agricultural economies like India, over **85% of smallholder farmers** lack access to high-capacity mechanization (modern harvesters, laser levelers, precision seed drills) during tight seasonal windows. At the same time, **Custom Hiring Centres (CHCs)** and equipment owners suffer from **suboptimal fleet utilization (under 32%)**, inaccurate regional demand forecasts, high idle repositioning costs, and cashflow crunches caused by informal credit.

**Yukti** (formerly KisanOps) provides a unified digital infrastructure connecting farm agricultural context, regional crop maturity timelines, IoT telematics, and fintech micro-financing to turn heavy farm equipment into a high-efficiency shared utility.

```
Farm Context & Weather Signals
            ↓
AI Demand Forecasting (+34% Regional Surge Alert)
            ↓
Deterministic Inter-Hub Fleet Rebalancing (Bhopal ➔ Sehore)
            ↓
7-Factor Explainable Machinery Matching (94% Fit Score)
            ↓
Dynamic Pricing & AgriCredit Deferred Payment (Pay Post-Harvest)
            ↓
Operator Mobile Console & Realtime CAN-Bus Telematics (J1939)
            ↓
Automated Anomaly Sentinel & Predictive Maintenance (Fuel Surge +15%)
            ↓
Instant PDF Tax Invoicing & Real Payment Settlement (Razorpay)
```

---

## ⚡ Core Platform Capabilities

### 1. 🔮 Regional Demand Intelligence Engine
- Synthesizes regional crop stage progression (Sowing ➔ Vegetative ➔ Flowering ➔ Maturity ➔ Harvest-ready), historical rental velocity, booking density, and real-time precipitation signals.
- Computes shortage indices across machinery categories (e.g. 5 harvesters required vs 3 available in the Bilkisganj wheat belt).

### 2. 🚛 Inter-Hub Fleet Reallocation Optimizer
- Solves idle capacity imbalance by evaluating surplus machinery in neighboring CHCs (e.g. Bhopal Central) and calculating relocation ROI (`+21%` utilization gain, `₹31,500` net revenue upside).

### 3. 🎯 7-Factor Explainable Smart Matching
- Computes transparent compatibility scores factoring Task Suitability (25%), Availability (20%), Travel Distance (15%), Machine Health (15%), Tariff Fit (10%), Reliability (10%), and Operator Rating (5%) with clear *"Why this match?"* explanations.

### 4. 💳 AgriCredit Deferred-Payment Micro-Financing
- Proprietary 300–900 scoring algorithm assessing landholding size, crop variety, historical repayment reliability, and farm productivity.
- Grants smallholders pre-approved deferred rental limits (up to `₹10,000`) to pay post-harvest within 45 days, eliminating liquidity bottlenecks.

### 5. 📡 Real-Time CAN-Bus J1939 Telematics & Anomaly Sentinels
- Connects OBD-II / Teltonika hardware GPS trackers or streams simulated 2000ms electronic control unit (ECU) data including RPM, speed, engine temperature (°C), fuel consumption rate (L/h), and battery voltage.
- Automatically flags high-priority maintenance alerts when fuel burn rate spikes `+15%` above baseline or coolant temperature exceeds `105°C`.

### 6. 🚜 Dedicated Driver / Operator Mobile Console (`/operator`)
- Mobile-first driver interface featuring a 1-tap productive runtime meter (Start / Pause / Complete), turn-by-turn navigation to farm boundary polygons, digital diesel slip logger with reimbursement tracking, and J1939 fault reporter.

### 7. 💳 Razorpay Online Payment Gateway Integration
- Embedded Razorpay Standard Checkout SDK supporting instant UPI QR code scanning, Google Pay / PhonePe deep links, RuPay / Visa cards, and NetBanking alongside deferred AgriCredit.

### 8. 🧾 Automated GST Billing & Post-Rental Invoicing
- Dynamically reconciles booked vs actual telemetry engine hours, computes transport charges, fuel surcharges, platform fees, and 5% GST, automatically outputting downloadable PDF tax invoices via `jsPDF`.

---

## 👥 4 Role-Based Dedicated Portals

| Role | Route | Key Modules & Capabilities |
|---|---|---|
| 🌾 **Farmer Portal** | `/farmer` | • Smart Machinery Marketplace<br />• 1-Click Booking Modal<br />• Farm & Crop Polygon Profiles<br />• AgriCredit Limit & Repayment History<br />• Active Rental Live GPS Tracking |
| 🏢 **CHC Hub Manager** | `/chc` | • 7-Day Regional Demand Forecasting<br />• Fleet Health & Hour Meter Registry<br />• Live Telematics CAN-Bus Stream<br />• Predictive Maintenance & Anomaly Resolution<br />• Booking Dispatch Manager & GST Revenue Analytics |
| 🚜 **Machine Operator** | `/operator` | • Active Mission Cockpit with 1-Tap Stopwatch Meter<br />• Direct Farmer Phone Dialer & Navigation<br />• Digital Diesel Refill Logger<br />• Pre-Trip Safety & Breakdown Reporter<br />• Operator Wages & Acreage Incentive Tracker |
| 🛡️ **Platform Governance** | `/admin` | • Multi-Hub Regional Overview<br />• Dynamic Pricing Safety Rules & Cap Bounds (0.80x–1.30x)<br />• Cross-District Fleet Allocation Approvals<br />• SOC2 / ISO 27001 Security Audit Log |

---

## 🛠️ Technology Stack

```text
┌────────────────────────────────────────────────────────┐
│                   CLIENT APPLICATION                   │
│   React 18  •  TypeScript  •  Vite  •  Tailwind CSS    │
│   React Router v6  •  TanStack React Query  •  Recharts│
│   Leaflet GIS Maps  •  jsPDF  •  Lucide Icons          │
└──────────────────────────┬─────────────────────────────┘
                           │ REST / Realtime / Webhooks
┌──────────────────────────▼─────────────────────────────┐
│                    SUPABASE CLOUD                      │
│   PostgreSQL 15 (UUIDs, RLS, PostGIS, JSONB)           │
│   Supabase Auth (OTP / Password / Profiles)            │
│   Supabase Realtime (PostgreSQL Changes WebSocket)     │
│   Supabase Edge Functions (Deno Telemetry Webhook)     │
└──────────────────────────┬─────────────────────────────┘
                           │
┌──────────────────────────▼─────────────────────────────┐
│                PAYMENTS & HARDWARE IOT                 │
│   Razorpay Checkout Gateway (UPI, QR, Cards)           │
│   OBD-II / Teltonika J1939 CAN-Bus GPS Trackers        │
└────────────────────────────────────────────────────────┘
```

---

## 🌐 Deployment Guide: Vercel

> **Is Vercel fine for Yukti?**  
> **Yes, Vercel is the optimal deployment platform.** Because Yukti is built on Vite + React SPA architecture with Supabase as the serverless backend, deploying to Vercel provides sub-second global Edge CDN delivery, automatic HTTPS, continuous deployment from GitHub, and instant preview branches.

### 1-Click / CLI Deployment to Vercel

#### Option A: Deploy via Vercel CLI
```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy project
vercel
```

#### Option B: Deploy via Vercel Web Dashboard
1. Push your repository to GitHub: `git push origin main`.
2. Open the [Vercel Dashboard](https://vercel.com/new) and click **Add New Project**.
3. Import your GitHub repository (`KisanOps`).
4. Set the Framework Preset to **Vite**.
5. Build & Output settings (configured automatically via `vercel.json`):
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
6. Add Environment Variables (see below) and click **Deploy**.

### Environment Variables Configuration

In your Vercel Project Settings ➔ **Environment Variables**, add:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key-here

# Razorpay Payment Gateway (Optional / Sandbox Supported)
VITE_RAZORPAY_KEY_ID=rzp_test_yourKeyHere
```

*Note: If environment variables are not supplied, the platform will automatically run in local interactive mode with 100% feature coverage.*

---

## ⚡ Local Development Setup

### Prerequisites
- Node.js `v18+` or `v20+`
- npm `v9+`

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-org/KisanOps.git
cd KisanOps
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Run Production Build & Validation
```bash
# Verify TypeScript & Vite bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 🧪 Automated Test Suite

Yukti includes comprehensive unit tests verifying all core computation engines, dynamic pricing, weather signals, IoT ingestion validators, and database fallbacks:

```bash
# Run Vitest test runner
npx vitest run
```

```text
 ✓ src/lib/__tests__/weatherEngine.test.ts (4 tests)
 ✓ src/lib/__tests__/engines.test.ts (10 tests)
 ✓ src/lib/__tests__/iotAndDb.test.ts (5 tests)

 Test Files  3 passed (3)
      Tests  19 passed (19)
```

---

## 🗄️ Database & Edge Functions (Supabase)

### 1. Execute SQL Schema
In your Supabase project dashboard, open the **SQL Editor** and execute the entire content of [`supabase/schema.sql`](file:///c:/Users/vastu/OneDrive/Desktop/Projects/KisanOps/supabase/schema.sql).

### 2. Deploy IoT Telemetry Edge Function
```bash
supabase functions deploy telemetry-webhook --no-verify-jwt
```

### 3. Send Test Hardware Telemetry Payload
```bash
curl -X POST "https://your-project.supabase.co/functions/v1/telemetry-webhook" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{
    "machineId": "mach-jd-harv-07",
    "latitude": 23.1872,
    "longitude": 77.1008,
    "speedKmh": 4.8,
    "fuelLevelPercent": 78.5,
    "fuelConsumptionRateLph": 8.4,
    "engineHours": 342.8,
    "engineTemperatureC": 88,
    "rpm": 1950,
    "batteryVoltage": 13.8,
    "status": "ACTIVE"
  }'
```

---

## 📄 License & Compliance

- **Security & Compliance**: Built for SOC2 Type II, ISO 27001, and AES-256 encrypted telematics streams.
- **License**: MIT License. Developed for Indian Custom Hiring Centres and Agri-Mechanization Hubs.
