# Product Requirements Document (PRD)
## Project: Yukti (KisanOps) - Agricultural Machinery Intelligence & Operations Platform

**Document Version:** 2.4.0  
**Author:** Product & Architecture Team  
**Target Deployment:** Vercel Edge + Supabase Cloud  
**Status:** Approved & Production-Ready  
**Classification:** Proprietary / Indian Agricultural Mechanization OS  

---

## 1. Executive Summary & Product Vision

### 1.1 Problem Statement
In India and emerging agrarian economies, over **85% of smallholder farmers** (< 2 hectares) cannot afford capital investment in high-efficiency farm machinery (e.g., combine harvesters, laser land levelers, pneumatic precision planters). During short 10–14 day seasonal crop windows (e.g., Rabi wheat harvest or Kharif paddy sowing), equipment shortages lead to significant crop spoilage, stubble burning penalties, and yield losses.

Concurrently, **Custom Hiring Centres (CHCs)** and equipment aggregators suffer from:
1. **Depressed Fleet Utilization (< 32%)**: Machines sit idle in one district while neighboring districts experience severe shortages.
2. **Asymmetric Information & Speculative Pricing**: Lack of dynamic pricing transparency leads to price gouging during peak harvest.
3. **Severe Liquidity Bottlenecks**: Smallholders operate on crop-cycle cash flows and cannot pay upfront digital rentals.
4. **Lack of Field Telematics & Breakdowns**: High operational costs driven by undetected mechanical anomalies, excessive fuel burn, and manual machine tracking.

### 1.2 Product Vision
**Yukti (KisanOps)** is an end-to-end Agricultural Machinery Intelligence & Operations Platform that transforms agricultural equipment from an under-utilized, fragmented asset into an explainable, on-demand, cloud-coordinated shared utility.

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           YUKTI OPERATIONAL FLYWHEEL                            │
│                                                                                 │
│  [Agro-Weather & Soil Signals] ──► [Predictive Regional Demand Engine]          │
│                                              │                                  │
│                                              ▼                                  │
│  [Explainable 7-Factor Matching] ◄── [Deterministic Inter-Hub Fleet Rebalancing]│
│               │                                                                 │
│               ▼                                                                 │
│  [Dynamic Safe-Bound Pricing] ──► [AgriCredit Post-Harvest Deferred Pay]        │
│                                              │                                  │
│                                              ▼                                  │
│  [Automated Invoicing & GST] ◄── [J1939 CAN-Bus Telematics & Anomaly Sentinel]  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Target User Personas & Core Journeys

| Persona | Role in Platform | Primary Goals | Key Pain Points |
|---|---|---|---|
| **Ramesh Kumar**<br />*Smallholder Farmer* | `/farmer` | • Discover & book certified machinery on demand<br />• Pay post-harvest with zero upfront cash<br />• Track live machine dispatch to farm boundary | • Unreliable local agents<br />• Surge pricing during harvest<br />• Lack of cash liquidity before harvest sale |
| **Rajesh Singh**<br />*CHC Hub Manager* | `/chc` | • Forecast 7-day machinery demand by crop stage<br />• Rebalance fleet across neighboring hubs for high ROI<br />• Monitor live CAN-Bus telemetry & predictive maintenance | • Low fleet utilization<br />• High mobilization transit costs<br />• Unexpected machine breakdowns in peak season |
| **Raju Verma**<br />*Field Machine Operator* | `/operator` | • 1-Tap stopwatch work meter for engine runtime<br />• Turn-by-turn GPS navigation to farmer polygons<br />• Digital diesel log with slip capture & breakdown reporting | • Manual paper logs<br />• Disputed work hours with farmers<br />• Delayed diesel expense reimbursement |
| **State Agri Director**<br />*Platform Governance / Admin* | `/admin` | • Multi-district oversight (Sehore, Bhopal, Raisen)<br />• Enforce anti-gouging dynamic pricing safety bounds<br />• Manage SMAM government subsidy Direct Benefit Transfer (DBT) | • Lack of statewide visibility<br />• Subsidy fraud & phantom assets<br />• Regional machinery inequality |

---

## 3. Core Functional Modules & Algorithmic Specifications

### 3.1 Regional Predictive Demand Intelligence Engine (`demandEngine.ts`)
Synthesizes regional crop stage maturity timelines, historical booking velocity, active reservations, and micro-climate weather signals to forecast 7-day machinery demand index ($D_I \in [0, 100]$):

$$D_I = w_{\text{harvest}} \cdot S_{\text{harvest}} + w_{\text{stage}} \cdot S_{\text{stage}} + w_{\text{hist}} \cdot S_{\text{hist}} + w_{\text{book}} \cdot S_{\text{book}} + w_{\text{weather}} \cdot S_{\text{weather}}$$

- **Weights**:
  - $w_{\text{harvest}} = 0.30$ (Harvest window proximity)
  - $w_{\text{stage}} = 0.25$ (Crop phenological stage)
  - $w_{\text{hist}} = 0.20$ (Historical rental velocity)
  - $w_{\text{book}} = 0.15$ (Active reservation density)
  - $w_{\text{weather}} = 0.10$ (Precipitation & soil moisture signals)

### 3.2 Inter-Hub Fleet Reallocation Optimizer (`demandEngine.ts`)
Evaluates machine surplus across source hubs ($H_s$) and deficit in target hubs ($H_t$) to generate actionable reallocation recommendations:
- **Haversine Distance & Transit Cost**:
  $$\text{Transit Cost} = d(H_s, H_t) \times \text{RebateRatePerKm}$$
- **Projected Revenue Uplift & Net ROI**:
  $$\text{Net Revenue} = (\text{ShortageUnits} \times \text{ExpectedOperatingHours} \times \text{AvgHourlyTariff}) - \text{Transit Cost}$$
  $$\text{ROI} = \frac{\text{Net Revenue}}{\text{Transit Cost}}$$

### 3.3 7-Factor Explainable Machinery Matching Engine (`recommendationEngine.ts`)
Generates transparent match scores ($M_S \in [0, 100]$) with natural-language reason tags:

$$M_S = 0.25 S_{\text{task}} + 0.20 S_{\text{avail}} + 0.15 S_{\text{dist}} + 0.15 S_{\text{health}} + 0.10 S_{\text{price}} + 0.10 S_{\text{rel}} + 0.05 S_{\text{operator}}$$

- **Explainability Output**:
  - "Optimally matched for 8-acre Wheat harvesting"
  - "Proximity: 3.2 km from farm boundary"
  - "Certified Health Rating: 94% prime efficiency"
  - "Operator Rating: 4.9★ with 120+ verified farm missions"

### 3.4 Dynamic Pricing Engine with Safety Bounds (`pricingEngine.ts`)
Adjusts real-time rental rates based on local demand elasticity, machine distance, and certified machine health while enforcing strict regulatory guardrails:

$$\text{Raw Rate} = \text{BaseRate} + \Delta_{\text{demand}} + \Delta_{\text{shortage}} + \Delta_{\text{distance}} - \Delta_{\text{health\_discount}} + \Delta_{\text{urgency}}$$
$$\text{Quoted Rate} = \text{Clamp}(\text{Raw Rate}, \text{BaseRate} \times 0.80, \text{BaseRate} \times 1.30)$$

- **Safety Policy**: Enforces a strict floor ($0.80\times$) and ceiling ($1.30\times$) to prevent predatory pricing during emergency pre-rain harvest surges.

### 3.5 AgriCredit Deferred-Payment Micro-Financing Engine (`creditEngine.ts`)
Proprietary credit rating algorithm ($C_S \in [300, 900]$) evaluating non-traditional agricultural data:
- **Scoring Model**:
  - 35% Historical Rental Payment Settlement
  - 25% CHC Network Tenure & Frequency
  - 20% Zero-Dispute Repayment Reliability
  - 10% Farm Output & Verified Acreage
  - 10% Profile Stability & Aadhaar KYC
- **Tiered Credit Limits**:
  - Score $\ge 750$: Tier 1 — ₹10,000 Deferred Limit (45 days post-harvest repayment)
  - Score $650 - 749$: Tier 2 — ₹8,000 Deferred Limit
  - Score $550 - 649$: Tier 3 — ₹3,000 Deferred Limit
  - Score $< 550$: Tier 4 — Upfront Digital Settlement (UPI / Cards)

### 3.6 Real-Time CAN-Bus J1939 Telematics & Anomaly Sentinel (`telematicsEngine.ts`, `maintenanceEngine.ts`)
- **Telemetry Stream**: Emits GPS coordinates, speed (km/h), fuel level (%), fuel burn rate (L/h), engine temperature (°C), RPM, battery voltage (V), and engine hours on a 2000ms loop.
- **Anomaly Detection Sentinels**:
  - **Fuel Burn Surge**: Flags alert when $\text{FuelRate} > \text{Baseline} \times 1.15$ (+15% surge).
  - **Coolant Overheating**: Flags critical alert when $\text{Temp} > 105^\circ\text{C}$.
  - **Hydraulic Safety**: Flags alert when $\text{Pressure} > 200\text{ Bar}$.

### 3.7 Agro-Meteorological Radar & Soil Traction Intelligence (`weatherEngine.ts`)
- Integrates Open-Meteo High-Resolution Agro Forecast API (100% free, zero API key) and RainViewer Doppler Radar Tile API.
- Computes real-time Soil Tractive Condition:
  - $< 40\%$ Soil Moisture: **OPTIMAL_TRACTION** (Heavy harvesters permitted)
  - $40\% - 70\%$ Soil Moisture: **MODERATE_SLIPPAGE** (Tractors & light rotavators only)
  - $> 70\%$ Soil Moisture: **IMPASSABLE_SINKAGE** (Operations suspended to avoid equipment bogging)

### 3.8 Automated Post-Rental Billing & GST Invoicing (`billingEngine.ts`)
- Automatically reconciles booked vs actual telemetry engine hours.
- Itemizes base hourly tariff, transport mobilization, platform telematics fee, fuel variance, promotional discounts, and 5% GST.
- Generates downloadable, tamper-evident PDF tax invoices using `jsPDF`.

---

## 4. Technical Architecture & Tech Stack

```text
┌───────────────────────────────────────────────────────────────────────────────────┐
│                                CLIENT TIER (SPA)                                  │
│   React 18  •  TypeScript  •  Vite  •  Tailwind CSS  •  Lucide Icons  •  Recharts │
│   Leaflet GIS Maps  •  TanStack Query  •  jsPDF Invoicing  •  Razorpay SDK        │
└────────────────────────────────────────┬──────────────────────────────────────────┘
                                         │ HTTPS / WSS / REST
┌────────────────────────────────────────▼──────────────────────────────────────────┐
│                             BACKEND TIER (SUPABASE)                               │
│   PostgreSQL 15 (UUIDs, JSONB, Spatial Queries, Audit Trails)                     │
│   Row Level Security (RLS) Multi-Tenant Data Isolation                            │
│   Supabase Realtime (PostgreSQL Changes CDC WebSockets)                           │
│   Supabase Edge Functions (Deno Telemetry Ingestion Webhooks)                     │
└────────────────────────────────────────┬──────────────────────────────────────────┘
                                         │
┌────────────────────────────────────────▼──────────────────────────────────────────┐
│                         EXTERNAL INTEGRATION ECOSYSTEM                            │
│   Open-Meteo Agro Weather API  •  RainViewer Doppler Radar API                    │
│   Razorpay Payment Gateway (UPI, QR, Cards, NetBanking)                           │
│   Hardware J1939 CAN-Bus GPS Trackers (OBD-II / Teltonika FMB640)                 │
└───────────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Non-Functional Requirements (NFRs)

1. **Performance & Latency**:
   - Time-to-First-Byte (TTFB) < 200ms on Vercel Global Edge Network.
   - Dynamic Recommendation Match scoring compute time < 15ms in-browser / < 50ms on API.
   - Telematics ingestion throughput > 1,000 events/sec via Deno Edge Functions.
2. **Security & Data Privacy**:
   - Strict Row Level Security (RLS) on all database tables.
   - Farmer personal identifying information (PII) and Aadhaar numbers SHA-256 hashed.
   - Audit trail logging on all pricing adjustments, dispatches, and credit approvals.
3. **Resilience & Offline Capability**:
   - Hybrid sync strategy: Supabase Cloud PostgreSQL with automated local fallback in offline agricultural areas.
4. **Localization & Accessibility**:
   - Fully responsive for low-cost Android mobile devices used by field operators and farmers.
   - High-contrast visual cards with color-blind safe telemetry indicators.

---

## 6. Success Metrics & Key Performance Indicators (KPIs)

- **CHC Fleet Utilization**: Increase from baseline <32% to >68% during peak crop harvest.
- **Farmer Mechanization Access Time**: Reduce booking-to-arrival lead time from 72 hours to under 4 hours.
- **AgriCredit Repayment Rate**: Maintain >98.2% on-time post-harvest deferred settlement.
- **Machine Health & Downtime**: Reduce field breakdowns by 40% via automated J1939 telematics anomaly alerts.
- **Farmer Cost Savings**: 18–25% reduction in rental expenditure through transparent dynamic pricing and elimination of middleman brokerage.
