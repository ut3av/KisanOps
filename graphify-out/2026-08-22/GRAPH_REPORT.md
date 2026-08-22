# Graph Report - KisanOps  (2026-08-22)

## Corpus Check
- 109 files · ~331,932 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 571 nodes · 1221 edges · 38 communities (29 shown, 9 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `805ac129`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- AdminDashboard.tsx
- kisanOpsStore.ts
- LazyImage.tsx
- devDependencies
- 20260821000000_initial_schema.sql
- dependencies
- weatherEngine.ts
- compilerOptions
- compilerOptions
- App.tsx
- schema.sql
- plugins
- tsconfig.json
- AgriCredit Engine
- Dynamic Pricing Engine
- razorpayBackend.ts
- 🎬 Step-by-Step 12-Scene Script
- KisanOps API Specification
- 2. Core Subsystems
- KisanOps Database Specification & Data Dictionary
- KisanOps Deployment Guide
- BookDemoModal.tsx
- rules/graphify.md
- workflows/graphify.md
- quick_fix_auth.sql
- TrustMarquee.tsx
- FarmerHome.tsx
- telemetry-webhook/index.ts
- vercel.json
- 3. Core Functional Modules & Algorithmic Specifications
- LeafletFleetMap.tsx
- RazorpayCheckoutModal.tsx
- HeroSection.tsx

## God Nodes (most connected - your core abstractions)
1. `react` - 64 edges
2. `useKisanOpsStore()` - 57 edges
3. `usePageTitle()` - 53 edges
4. `Machine` - 17 edges
5. `AppState` - 15 edges
6. `compilerOptions` - 15 edges
7. `compilerOptions` - 14 edges
8. `machines` - 13 edges
9. `🎬 Step-by-Step 12-Scene Script` - 13 edges
10. `TelemetryPoint` - 12 edges

## Surprising Connections (you probably didn't know these)
- `handler()` --calls--> `createRazorpayOrderBackend()`  [EXTRACTED]
  api/create-order.ts → server/razorpayBackend.ts
- `handler()` --calls--> `verifyRazorpaySignatureBackend()`  [EXTRACTED]
  api/verify-payment.ts → server/razorpayBackend.ts
- `TelematicsGaugeClusterProps` --references--> `TelemetryPoint`  [EXTRACTED]
  src/components/common/TelematicsGauge.tsx → src/types/index.ts
- `BookDemoModal()` --calls--> `useKisanOpsStore()`  [EXTRACTED]
  src/features/landing/components/BookDemoModal.tsx → src/store/kisanOpsStore.ts
- `LoginPage()` --calls--> `usePageTitle()`  [EXTRACTED]
  src/features/auth/LoginPage.tsx → src/hooks/usePageTitle.ts

## Import Cycles
- None detected.

## Communities (38 total, 9 thin omitted)

### Community 0 - "AdminDashboard.tsx"
Cohesion: 0.18
Nodes (10): StatCard(), StatCardProps, DISTRICTS, SMAM_SUBSIDY_LEDGER, SubsidyRecord, TELEMATICS_ALERTS, TelematicsAlert, CATEGORY_SHARE (+2 more)

### Community 1 - "kisanOpsStore.ts"
Cohesion: 0.07
Nodes (65): LeafletFleetMapProps, SEEDED_AGRICREDIT_PROFILE, SEEDED_ALLOCATION_RECOMMENDATIONS, SEEDED_BOOKINGS, SEEDED_CHCS, SEEDED_DEMAND_FORECASTS, SEEDED_FARM, SEEDED_MACHINES (+57 more)

### Community 3 - "devDependencies"
Cohesion: 0.06
Nodes (34): autoprefixer, oxlint, devDependencies, autoprefixer, oxlint, postcss, tailwindcss, @tailwindcss/postcss (+26 more)

### Community 4 - "20260821000000_initial_schema.sql"
Cohesion: 0.16
Nodes (30): audit_logs, booking_events, bookings, chcs, credit_events, credit_profiles, demand_forecasts, disputes (+22 more)

### Community 5 - "dependencies"
Cohesion: 0.06
Nodes (31): clsx, jspdf, leaflet, lucide-react, dependencies, clsx, jspdf, leaflet (+23 more)

### Community 6 - "weatherEngine.ts"
Cohesion: 0.16
Nodes (19): KisanOps Platform, DopplerRadarPlayer(), DopplerRadarPlayerProps, WeatherRadarCard(), WeatherRadarCardProps, CachedForecast, computeHarvestRiskAssessment(), fetchAgroWeatherForecast() (+11 more)

### Community 7 - "compilerOptions"
Cohesion: 0.10
Nodes (20): DOM, src, vite/client, compilerOptions, jsx, lib, module, moduleDetection (+12 more)

### Community 8 - "compilerOptions"
Cohesion: 0.09
Nodes (21): api/**/*.ts, server/**/*.ts, vite.config.ts, compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module (+13 more)

### Community 9 - "App.tsx"
Cohesion: 0.07
Nodes (60): react, App(), queryClient, InteractiveCursor(), ScrollToTop(), AdminLayout(), CHCLayout(), FarmerLayout() (+52 more)

### Community 10 - "schema.sql"
Cohesion: 0.43
Nodes (5): public.chcs, public.farm_crops, public.farms, public.profiles, auth.users

### Community 11 - "plugins"
Cohesion: 0.22
Nodes (8): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema, oxc, typescript, warn

### Community 19 - "razorpayBackend.ts"
Cohesion: 0.18
Nodes (11): handler(), handler(), CreateOrderParams, CreateOrderResponse, createRazorpayOrderBackend(), getRazorpayCredentials(), getRazorpayInstance(), VerifyPaymentParams (+3 more)

### Community 20 - "🎬 Step-by-Step 12-Scene Script"
Cohesion: 0.12
Nodes (15): KisanOps 5-Minute Deterministic Demo Script, 🧭 Pre-Flight Setup, Scene 10: Predictive Fuel Anomaly Detection, Scene 11: Automated Billing & PDF Invoice, Scene 12: Business Impact & Revenue Analytics, Scene 1: Demand Intelligence Shortage Detection, Scene 2: Deterministic Fleet Allocation, Scene 3: Farmer Activity Requirement (+7 more)

### Community 21 - "KisanOps API Specification"
Cohesion: 0.13
Nodes (14): 1. Machinery & Recommendations, 2. Dynamic Pricing, 3. AgriCredit System, 4. Bookings & Lifecycle, 5. Telematics Stream & Anomaly Webhook, 6. Invoices & Settlement, `GET /api/v1/invoices/:booking_id`, `GET /api/v1/machines` (+6 more)

### Community 22 - "2. Core Subsystems"
Cohesion: 0.18
Nodes (10): 1. High-Level Architecture Overview, 2.1 Demand Intelligence Subsystem (`src/lib/demandEngine.ts`), 2.2 Explainable Smart Match Subsystem (`src/lib/recommendationEngine.ts`), 2.3 Dynamic Pricing Subsystem (`src/lib/pricingEngine.ts`), 2.4 AgriCredit Engine (`src/lib/creditEngine.ts`), 2.5 Live Telematics & Predictive Maintenance (`src/lib/telematicsEngine.ts`, `src/lib/maintenanceEngine.ts`), 2.6 Automated Billing & Tax Invoicing (`src/lib/billingEngine.ts`), 2. Core Subsystems (+2 more)

### Community 23 - "KisanOps Database Specification & Data Dictionary"
Cohesion: 0.33
Nodes (5): 1. Schema Overview, 2. Table Catalog, 3. Row Level Security (RLS) Policies, 4. Migration Files, KisanOps Database Specification & Data Dictionary

### Community 24 - "KisanOps Deployment Guide"
Cohesion: 0.33
Nodes (5): 1. Environment Variables, 2. Frontend Deployment (Vercel), 3. Database Deployment (Supabase), 4. Production Health Check, KisanOps Deployment Guide

### Community 25 - "BookDemoModal.tsx"
Cohesion: 0.40
Nodes (4): KisanLoader(), KisanLoaderProps, BookDemoModal(), BookDemoModalProps

### Community 31 - "FarmerHome.tsx"
Cohesion: 0.15
Nodes (18): AgriCreditGauge(), AgriCreditGaugeProps, ExplanationBadge(), ExplanationBadgeProps, BookingModal(), BookingModalProps, FarmerHome(), FarmerMarketplace() (+10 more)

### Community 33 - "vercel.json"
Cohesion: 0.29
Nodes (6): buildCommand, cleanUrls, framework, headers, outputDirectory, rewrites

### Community 34 - "3. Core Functional Modules & Algorithmic Specifications"
Cohesion: 0.11
Nodes (18): 1.1 Problem Statement, 1.2 Product Vision, 1. Executive Summary & Product Vision, 2. Target User Personas & Core Journeys, 3.1 Regional Predictive Demand Intelligence Engine (`demandEngine.ts`), 3.2 Inter-Hub Fleet Reallocation Optimizer (`demandEngine.ts`), 3.3 7-Factor Explainable Machinery Matching Engine (`recommendationEngine.ts`), 3.4 Dynamic Pricing Engine with Safety Bounds (`pricingEngine.ts`) (+10 more)

### Community 35 - "LeafletFleetMap.tsx"
Cohesion: 0.12
Nodes (18): activeMachineIcon, availableMachineIcon, chcIcon, farmIcon, LeafletFleetMap(), maintenanceIcon, MAP_LAYERS, MapBaseLayerType (+10 more)

### Community 36 - "RazorpayCheckoutModal.tsx"
Cohesion: 0.27
Nodes (10): RazorpayCheckoutModal(), RazorpayCheckoutModalProps, Window, createRazorpayOrder(), initiateRazorpayStandardCheckout(), loadRazorpayScript(), RazorpayCheckoutOptions, RazorpayCustomerDetails (+2 more)

### Community 37 - "HeroSection.tsx"
Cohesion: 0.40
Nodes (4): HERO_SLIDES, HeroSection(), HeroSectionProps, HeroSlide

## Knowledge Gaps
- **204 isolated node(s):** `$schema`, `typescript`, `oxc`, `react/rules-of-hooks`, `warn` (+199 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `App.tsx` to `AdminDashboard.tsx`, `kisanOpsStore.ts`, `LazyImage.tsx`, `LeafletFleetMap.tsx`, `RazorpayCheckoutModal.tsx`, `HeroSection.tsx`, `weatherEngine.ts`, `plugins`, `BookDemoModal.tsx`, `TrustMarquee.tsx`, `FarmerHome.tsx`?**
  _High betweenness centrality (0.116) - this node is a cross-community bridge._
- **Why does `useKisanOpsStore()` connect `App.tsx` to `AdminDashboard.tsx`, `kisanOpsStore.ts`, `LeafletFleetMap.tsx`, `BookDemoModal.tsx`, `FarmerHome.tsx`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **Why does `plugins` connect `plugins` to `App.tsx`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **What connects `$schema`, `typescript`, `oxc` to the rest of the system?**
  _204 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `kisanOpsStore.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06855995410212277 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.05714285714285714 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.06451612903225806 - nodes in this community are weakly interconnected._