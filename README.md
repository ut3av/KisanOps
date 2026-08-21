# KisanOps — Intelligent Operations for Modern Agriculture

> **Predict. Allocate. Operate.**  
> *The intelligence layer for agricultural machinery and Custom Hiring Centres (CHCs).*

---

## 🌾 What is KisanOps?

Agricultural machinery is an underutilized capital asset. Farmers in emerging agricultural economies face severe machinery access bottlenecks during critical sowing and harvesting windows, while Custom Hiring Centres (CHCs) struggle with unpredictable demand, suboptimal fleet positioning, and uncollected deferred receivables.

**KisanOps** is a production-grade agricultural operations platform that connects farm contexts with machinery intelligence through a closed-loop operating lifecycle:

```text
Farm Context
    ↓
Demand Prediction (+34% Harvest Surge)
    ↓
Deterministic Fleet Allocation (Bhopal ➔ Sehore)
    ↓
Smart Machine Recommendation (94% Match Fit)
    ↓
Dynamic Pricing (Transparent Quote Breakdown)
    ↓
AgriCredit Scoring (0–900 Score & Deferred Limit)
    ↓
Booking & Mobilization
    ↓
Live CAN-Bus Telematics & Tracking
    ↓
Predictive Maintenance (Fuel Anomaly Detection)
    ↓
Automated Billing & Tax Invoicing
    ↓
Fleet Utilization & Intelligence Flywheel
```

---

## ⚡ Key Features

### 1. 🔮 Predictive Machinery Demand Engine
- Synthesizes regional crop stage maturity, historical rental velocity, active booking loads, and micro-climate weather signals.
- Accurately predicts machinery shortages (e.g. 5 units required vs 3 available in Sehore wheat belt).

### 2. 🚛 Deterministic Fleet Reallocation Optimizer
- Identifies surplus capacity in neighboring hubs (e.g. Bhopal) and calculates optimal relocation ROI (+21% utilization gain, ₹31,500 net revenue gain).

### 3. 🎯 7-Factor Explainable Smart Recommendation
- Evaluates Task Suitability (25%), Availability (20%), Distance (15%), Machine Health (15%), Price (10%), Reliability (10%), and Operator Rating (5%) with transparent "Why this match?" rationale.

### 4. 📈 Transparent Dynamic Pricing
- Real-time quote engine factoring base tariffs, peak surge, shortage buffers, transport mileage, and certified health discounts with configurable safety bounds (0.80x–1.30x).

### 5. 🛡️ AgriCredit Deferred-Payment Engine
- Non-regulated 300–900 scoring engine providing pre-approved deferred rental credit (up to ₹10,000) allowing smallholders to pay post-harvest within 45 days.

### 6. 📡 Real-Time CAN-Bus Telematics & Anomaly Detection
- Streams simulated GPS coordinates, vehicle speed, fuel burn rate (L/h), engine temperature (°C), RPM, and engine hours every 2 seconds.
- Automatically triggers high-priority maintenance inspection alerts when fuel consumption deviates +17% above baseline.

### 7. 🧾 Automated Post-Rental Billing & Invoicing
- Reconciles booked vs actual telemetry operating hours, computes mobilization, platform fees, discounts, and GST, and generates downloadable PDF tax invoices.

### 8. 📊 Comprehensive CHC & Executive Analytics
- Real-time Recharts dashboards tracking Productive Machine Hours (North Star Metric), Daily/Weekly GMV, Category Revenue Share, and Asset Contribution Margins.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS |
| **Routing & State** | React Router v6, TanStack Query, Reactive Local/Supabase Store |
| **Maps & GIS** | Leaflet, React-Leaflet, OpenStreetMap |
| **Visualizations** | Recharts (Responsive Dual-Axis & Donut Charts) |
| **PDF Generation** | jsPDF (Automated Tax Invoices) |
| **Icons & UI** | Lucide React, clsx, tailwind-merge |
| **Backend & DB** | PostgreSQL, Supabase (RLS, PostGIS schemas, UUIDs) |
| **Testing** | Vitest (Automated Unit & Engine Test Suite) |

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js `v18+` (Tested on `v24.x`)
- npm `v9+`

### 1. Installation
```bash
# Clone the repository
git clone https://github.com/your-org/kisanops.git
cd kisanops

# Install dependencies
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

### 3. Run Automated Engine Tests
```bash
npx vitest run
```

---

## 🎬 5-Minute Interactive Demo Walkthrough

KisanOps includes an interactive **12-Scene Demo Controller** at the top of the screen:

| Scene | Persona | Description |
|---|---|---|
| **Scene 1** | CHC Manager | Sehore Harvester Shortage Predicted (+34%) |
| **Scene 2** | CHC Manager | Relocate Harvester from Bhopal ➔ Sehore (+21% utilization) |
| **Scene 3** | Farmer | Ramesh Kumar specifies 8-acre Wheat Harvesting requirement |
| **Scene 4** | Farmer | John Deere Harvester identified with 94% explainable fit |
| **Scene 5** | Farmer | Transparent ₹980/hr pricing breakdown & surge safety bounds |
| **Scene 6** | Farmer | AgriCredit Score 742 / ₹8,000 Deferred payment available |
| **Scene 7** | Farmer | Booking confirmed with zero upfront payment |
| **Scene 8** | CHC Manager | Operator Raju Verma assigned & dispatched |
| **Scene 9** | CHC Manager | Live CAN-Bus telematics streaming (GPS, Fuel %, RPM, Temp) |
| **Scene 10** | CHC Manager | +17% fuel anomaly triggers predictive maintenance alert |
| **Scene 11** | Farmer | Work completes (6.4h) & verified tax invoice PDF generated |
| **Scene 12** | CHC Manager | Operational revenue, machine ROI, and utilization updated |

---

## 👥 Seeded Demo Accounts

You can switch roles anytime using the top navigation switcher:

1. **Farmer Persona**: `Ramesh Kumar` (Bilkisganj, Sehore • 8.0 Acres Wheat • AgriCredit: 742)
2. **CHC Hub Manager**: `Rajesh Singh` (Sehore Agri Centre #01 • 14 Machines)
3. **Machine Operator**: `Raju Verma` (4.9★ Operator • Commercial Harvester Specialist)
4. **Platform Admin**: `System Admin` (Network Governance, Pricing Caps, and Audit Trail)

---

## 📄 License
Commercial SaaS prototype. Built with ❤️ for Indian Agriculture and Custom Hiring Centres.
