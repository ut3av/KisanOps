# Graph Report - KisanOps  (2026-08-22)

## Corpus Check
- 128 files · ~346,419 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 655 nodes · 1475 edges · 38 communities (29 shown, 9 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e955e972`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Navbar.tsx
- kisanOpsStore.ts
- voice.ts
- devDependencies
- 20260821000000_initial_schema.sql
- dependencies
- LeafletFleetMap.tsx
- compilerOptions
- compilerOptions
- react
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
- FarmerRentals.tsx
- rules/graphify.md
- workflows/graphify.md
- quick_fix_auth.sql
- TrustMarquee.tsx
- types/index.ts
- telemetry-webhook/index.ts
- vercel.json
- 3. Core Functional Modules & Algorithmic Specifications
- HeroSection.tsx
- RazorpayCheckoutModal.tsx
- LazyImage.tsx

## God Nodes (most connected - your core abstractions)
1. `react` - 71 edges
2. `useKisanOpsStore()` - 61 edges
3. `usePageTitle()` - 53 edges
4. `Machine` - 27 edges
5. `AppState` - 15 edges
6. `Booking` - 15 edges
7. `compilerOptions` - 15 edges
8. `compilerOptions` - 14 edges
9. `machines` - 13 edges
10. `🎬 Step-by-Step 12-Scene Script` - 13 edges

## Surprising Connections (you probably didn't know these)
- `handler()` --calls--> `createRazorpayOrderBackend()`  [EXTRACTED]
  api/create-order.ts → server/razorpayBackend.ts
- `handler()` --calls--> `verifyRazorpaySignatureBackend()`  [EXTRACTED]
  api/verify-payment.ts → server/razorpayBackend.ts
- `BrandedReceiptModalProps` --references--> `Invoice`  [EXTRACTED]
  src/components/common/BrandedReceiptModal.tsx → src/types/index.ts
- `BookDemoModal()` --calls--> `useKisanOpsStore()`  [EXTRACTED]
  src/features/landing/components/BookDemoModal.tsx → src/store/kisanOpsStore.ts
- `BillingCalculationInput` --references--> `Booking`  [EXTRACTED]
  src/lib/billingEngine.ts → src/types/index.ts

## Import Cycles
- None detected.

## Communities (38 total, 9 thin omitted)

### Community 0 - "Navbar.tsx"
Cohesion: 0.13
Nodes (13): KisanLoader(), KisanLoaderProps, AdminLayout(), CHCLayout(), Navbar(), NavItem, SideNav(), SideNavProps (+5 more)

### Community 1 - "kisanOpsStore.ts"
Cohesion: 0.08
Nodes (52): LeafletFleetMapProps, TelematicsGaugeClusterProps, SEEDED_AGRICREDIT_PROFILE, SEEDED_ALLOCATION_RECOMMENDATIONS, SEEDED_BOOKINGS, SEEDED_CHCS, SEEDED_DEMAND_FORECASTS, SEEDED_FARM (+44 more)

### Community 2 - "voice.ts"
Cohesion: 0.07
Nodes (29): VoiceAssistantModalProps, VoiceUiState, globalVoiceController, VoiceController, ConversationService, FarmerRequirementIntentDto, FarmerRequirementIntentSchema, TaskCategoryEnum (+21 more)

### Community 3 - "devDependencies"
Cohesion: 0.06
Nodes (34): autoprefixer, oxlint, devDependencies, autoprefixer, oxlint, postcss, tailwindcss, @tailwindcss/postcss (+26 more)

### Community 4 - "20260821000000_initial_schema.sql"
Cohesion: 0.16
Nodes (30): audit_logs, booking_events, bookings, chcs, credit_events, credit_profiles, demand_forecasts, disputes (+22 more)

### Community 5 - "dependencies"
Cohesion: 0.06
Nodes (31): clsx, jspdf, leaflet, lucide-react, dependencies, clsx, jspdf, leaflet (+23 more)

### Community 6 - "LeafletFleetMap.tsx"
Cohesion: 0.09
Nodes (30): KisanOps Platform, DopplerRadarPlayer(), DopplerRadarPlayerProps, activeMachineIcon, availableMachineIcon, chcIcon, farmIcon, maintenanceIcon (+22 more)

### Community 7 - "compilerOptions"
Cohesion: 0.10
Nodes (20): DOM, src, vite/client, compilerOptions, jsx, lib, module, moduleDetection (+12 more)

### Community 8 - "compilerOptions"
Cohesion: 0.09
Nodes (21): api/**/*.ts, server/**/*.ts, vite.config.ts, compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module (+13 more)

### Community 9 - "react"
Cohesion: 0.06
Nodes (69): react, App(), queryClient, InteractiveCursor(), LeafletFleetMap(), MinimalCursor(), MouseInteractiveGlow(), ScrollToTop() (+61 more)

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

### Community 25 - "FarmerRentals.tsx"
Cohesion: 0.29
Nodes (8): BrandedReceiptModal(), BrandedReceiptModalProps, FarmerRentals(), BillingCalculationInput, calculateFinalInvoice(), generatePdfInvoice(), BookingStatus, InvoiceItem

### Community 31 - "types/index.ts"
Cohesion: 0.09
Nodes (37): AgriCreditGauge(), AgriCreditGaugeProps, ExplanationBadge(), ExplanationBadgeProps, MachineThumbnail(), MachineThumbnailProps, VEHICLE_CONFIG, BookingModal() (+29 more)

### Community 33 - "vercel.json"
Cohesion: 0.29
Nodes (6): buildCommand, cleanUrls, headers, outputDirectory, rewrites, trailingSlash

### Community 34 - "3. Core Functional Modules & Algorithmic Specifications"
Cohesion: 0.11
Nodes (18): 1.1 Problem Statement, 1.2 Product Vision, 1. Executive Summary & Product Vision, 2. Target User Personas & Core Journeys, 3.1 Regional Predictive Demand Intelligence Engine (`demandEngine.ts`), 3.2 Inter-Hub Fleet Reallocation Optimizer (`demandEngine.ts`), 3.3 7-Factor Explainable Machinery Matching Engine (`recommendationEngine.ts`), 3.4 Dynamic Pricing Engine with Safety Bounds (`pricingEngine.ts`) (+10 more)

### Community 35 - "HeroSection.tsx"
Cohesion: 0.40
Nodes (4): HERO_SLIDES, HeroSection(), HeroSectionProps, HeroSlide

### Community 36 - "RazorpayCheckoutModal.tsx"
Cohesion: 0.33
Nodes (8): RazorpayCheckoutModal(), RazorpayCheckoutModalProps, createRazorpayOrder(), initiateRazorpayStandardCheckout(), loadRazorpayScript(), RazorpayCheckoutOptions, RazorpayCustomerDetails, Window

## Knowledge Gaps
- **210 isolated node(s):** `$schema`, `typescript`, `oxc`, `react/rules-of-hooks`, `warn` (+205 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `Navbar.tsx`, `kisanOpsStore.ts`, `voice.ts`, `HeroSection.tsx`, `RazorpayCheckoutModal.tsx`, `LazyImage.tsx`, `LeafletFleetMap.tsx`, `plugins`, `FarmerRentals.tsx`, `TrustMarquee.tsx`, `types/index.ts`?**
  _High betweenness centrality (0.125) - this node is a cross-community bridge._
- **Why does `useKisanOpsStore()` connect `react` to `Navbar.tsx`, `kisanOpsStore.ts`, `voice.ts`, `FarmerRentals.tsx`, `types/index.ts`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **Why does `Machine` connect `types/index.ts` to `kisanOpsStore.ts`, `voice.ts`, `LeafletFleetMap.tsx`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **What connects `$schema`, `typescript`, `oxc` to the rest of the system?**
  _210 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Navbar.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12857142857142856 - nodes in this community are weakly interconnected._
- **Should `kisanOpsStore.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08038075092543628 - nodes in this community are weakly interconnected._
- **Should `voice.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0742447516641065 - nodes in this community are weakly interconnected._