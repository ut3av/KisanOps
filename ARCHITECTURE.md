# KisanOps System Architecture Document

## 1. High-Level Architecture Overview

KisanOps is designed as an event-driven, modular agricultural operations intelligence layer structured around the 9-stage operational loop:

```
[ Farm Context & Crop Stage ]
             ↓
[ Predictive Demand Forecasting Engine ]
             ↓
[ Deterministic Fleet Allocation Optimizer ]
             ↓
[ 7-Factor Explainable Recommendation Engine ]
             ↓
[ Dynamic Pricing & Safety Bounds Engine ]
             ↓
[ AgriCredit Deferred-Payment Engine ]
             ↓
[ Dispatch & CAN-Bus Telematics Streaming ]
             ↓
[ Predictive Maintenance & Anomaly Detection ]
             ↓
[ Automated Invoicing & Unit Economics Engine ]
```

---

## 2. Core Subsystems

### 2.1 Demand Intelligence Subsystem (`src/lib/demandEngine.ts`)
- **Inputs**: Farm location, Acreage, Primary crop, Crop Stage, Historical Booking Velocity, Active reservations, Microclimate weather signals.
- **Explainable Weighted Model**:
  - `Harvest season window (+30)`
  - `Crop stage maturity (+25)`
  - `Historical demand curve (+20)`
  - `Active bookings load (+15)`
  - `Weather & soil moisture signal (+10)`
- **Shortage Detection**: Quantifies deficit against local CHC fleet capacity.
- **Relocation Optimizer**: Computes Haversine distance, mobilization cost, expected utilization delta (+21%), and projected revenue ROI across neighboring hubs (e.g. Bhopal ➔ Sehore).

### 2.2 Explainable Smart Match Subsystem (`src/lib/recommendationEngine.ts`)
- **Scoring Breakdown**:
  - 25% Task / Crop Suitability
  - 20% Real-time Availability
  - 15% Geographic Proximity
  - 15% Certified Machine Health Score
  - 10% Price Competitiveness
  - 10% Historical Reliability & Lifetime Rentals
  - 5% Verified Operator Rating
- **Explainability Layer**: Generates human-readable reason tags ("Suitable for 8-acre wheat", "3.2 km away", "94% prime health rating").

### 2.3 Dynamic Pricing Subsystem (`src/lib/pricingEngine.ts`)
- **Pricing Formula**:
  $$\text{Quoted Rate} = \text{Clamp}(\text{Base} + \Delta_{\text{demand}} + \Delta_{\text{shortage}} + \Delta_{\text{distance}} - \Delta_{\text{health\_discount}} + \Delta_{\text{urgency}}, \text{Base} \times 0.80, \text{Base} \times 1.30)$$
- **Safety Policy**: Enforces strict floor (0.80x) and ceiling (1.30x) multipliers to prevent surge gouging.

### 2.4 AgriCredit Engine (`src/lib/creditEngine.ts`)
- **Scoring Weights**:
  - 35% Historical Rental Payment Settlement
  - 25% CHC Network Tenure & Frequency
  - 20% Zero-Dispute Repayment Reliability
  - 10% Farm Output & Verified Acreage
  - 10% Profile Stability & Aadhaar KYC
- **Tiering**:
  - 750+ ➔ ₹10,000 Deferred Limit
  - 650–749 ➔ ₹8,000 Deferred Limit
  - 550–649 ➔ ₹3,000 Deferred Limit
  - Below 550 ➔ Upfront Digital Settlement

### 2.5 Live Telematics & Predictive Maintenance (`src/lib/telematicsEngine.ts`, `src/lib/maintenanceEngine.ts`)
- **CAN-Bus Simulation**: Emits GPS coordinates along SH-18 / Bilkisganj corridors, speed, fuel percentage, burn rate (L/h), engine temperature (°C), RPM, and engine hours every 2000ms.
- **Anomaly Detection**: Flags fuel burn rates $> \text{Baseline} \times 1.15$ (+17% anomaly) and schedules immediate 24h preventative maintenance inspections.

### 2.6 Automated Billing & Tax Invoicing (`src/lib/billingEngine.ts`)
- Reconciles booked vs actual engine operating hours.
- Itemizes rental base, transport mobilization, platform telematics fee, promotional discounts, and 5% GST.
- Generates verified, downloadable PDF tax invoices via `jsPDF`.

---

## 3. Data Flow & Security
- **Multi-Tenant Separation**: Farmers access only their private farm boundaries, bookings, and invoices. CHC Managers manage their assigned hub fleet.
- **Resilience Strategy**: Hybrid architecture that reads from/writes to Supabase PostgreSQL with seamless fallback to an in-memory/LocalStorage reactive cache during connectivity loss or offline demonstrations.
