# Graph Report - KisanOps  (2026-08-23)

## Corpus Check
- 144 files · ~372,038 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 773 nodes · 1842 edges · 49 communities (39 shown, 10 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `26d6ea9f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Navbar.tsx
- kisanOpsStore.ts
- Machine
- devDependencies
- 20260821000000_initial_schema.sql
- dependencies
- LeafletFleetMap.tsx
- compilerOptions
- compilerOptions
- useKisanOpsStore
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
- billingEngine.ts
- rules/graphify.md
- workflows/graphify.md
- quick_fix_auth.sql
- TrustMarquee.tsx
- availabilityService.ts
- telemetry-webhook/index.ts
- vercel.json
- 3. Core Functional Modules & Algorithmic Specifications
- LandingPage.tsx
- RazorpayCheckoutModal.tsx
- LazyImage.tsx
- usePageTitle.ts
- react
- 20260823000000_realtime_geospatial_availability.sql
- BookDemoModal.tsx
- public.farms
- farmIntelligenceEngine.ts
- types/index.ts
- iotIngestionEngine.ts
- dbService.ts
- LoginPage.tsx
- AdminDashboard.tsx

## God Nodes (most connected - your core abstractions)
1. `react` - 73 edges
2. `useKisanOpsStore()` - 71 edges
3. `usePageTitle()` - 55 edges
4. `Machine` - 34 edges
5. `AppState` - 23 edges
6. `Booking` - 19 edges
7. `compilerOptions` - 15 edges
8. `PredictiveMaintenanceAlert` - 14 edges
9. `compilerOptions` - 14 edges
10. `TelemetryPoint` - 13 edges

## Surprising Connections (you probably didn't know these)
- `handler()` --calls--> `createRazorpayOrderBackend()`  [EXTRACTED]
  api/create-order.ts → server/razorpayBackend.ts
- `handler()` --calls--> `verifyRazorpaySignatureBackend()`  [EXTRACTED]
  api/verify-payment.ts → server/razorpayBackend.ts
- `BookDemoModal()` --calls--> `useKisanOpsStore()`  [EXTRACTED]
  src/features/landing/components/BookDemoModal.tsx → src/store/kisanOpsStore.ts
- `BillingCalculationInput` --references--> `Booking`  [EXTRACTED]
  src/lib/billingEngine.ts → src/types/index.ts
- `BrandedReceiptModalProps` --references--> `Invoice`  [EXTRACTED]
  src/components/common/BrandedReceiptModal.tsx → src/types/index.ts

## Import Cycles
- None detected.

## Communities (49 total, 10 thin omitted)

### Community 0 - "Navbar.tsx"
Cohesion: 0.18
Nodes (9): AdminLayout(), CHCLayout(), FarmerLayout(), Navbar(), NavItem, SideNav(), SideNavProps, FloatingVoiceButton() (+1 more)

### Community 1 - "kisanOpsStore.ts"
Cohesion: 0.15
Nodes (18): SEEDED_NOTIFICATIONS, insertLiveTelemetryToDatabase(), saveBookingToDatabase(), subscribeToSupabaseRealtime(), updateBookingInDatabase(), advanceSimulationStep(), getInitialSimulationState(), RouteWaypoint (+10 more)

### Community 2 - "Machine"
Cohesion: 0.08
Nodes (31): VoiceAssistantModalProps, VoiceUiState, globalVoiceController, VoiceController, ConversationService, FarmerRequirementIntentDto, FarmerRequirementIntentSchema, TaskCategoryEnum (+23 more)

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
Cohesion: 0.10
Nodes (29): KisanOps Platform, DopplerRadarPlayer(), DopplerRadarPlayerProps, activeMachineIcon, availableMachineIcon, chcIcon, farmIcon, maintenanceIcon (+21 more)

### Community 7 - "compilerOptions"
Cohesion: 0.10
Nodes (20): DOM, src, vite/client, compilerOptions, jsx, lib, module, moduleDetection (+12 more)

### Community 8 - "compilerOptions"
Cohesion: 0.09
Nodes (21): api/**/*.ts, server/**/*.ts, vite.config.ts, compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module (+13 more)

### Community 9 - "useKisanOpsStore"
Cohesion: 0.13
Nodes (29): App(), queryClient, IntelligenceReportModal(), OperatorLayout(), LandingRoleSelect(), LoginPage(), BookingsManager(), CHCSettings() (+21 more)

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

### Community 25 - "billingEngine.ts"
Cohesion: 0.33
Nodes (7): BrandedReceiptModal(), BrandedReceiptModalProps, BillingCalculationInput, calculateFinalInvoice(), generatePdfInvoice(), Invoice, InvoiceItem

### Community 31 - "availabilityService.ts"
Cohesion: 0.09
Nodes (37): AgriCreditGauge(), AgriCreditGaugeProps, ExplanationBadge(), ExplanationBadgeProps, MachineThumbnail(), MachineThumbnailProps, VEHICLE_CONFIG, BookingModal() (+29 more)

### Community 33 - "vercel.json"
Cohesion: 0.29
Nodes (6): buildCommand, cleanUrls, headers, outputDirectory, rewrites, trailingSlash

### Community 34 - "3. Core Functional Modules & Algorithmic Specifications"
Cohesion: 0.11
Nodes (18): 1.1 Problem Statement, 1.2 Product Vision, 1. Executive Summary & Product Vision, 2. Target User Personas & Core Journeys, 3.1 Regional Predictive Demand Intelligence Engine (`demandEngine.ts`), 3.2 Inter-Hub Fleet Reallocation Optimizer (`demandEngine.ts`), 3.3 7-Factor Explainable Machinery Matching Engine (`recommendationEngine.ts`), 3.4 Dynamic Pricing Engine with Safety Bounds (`pricingEngine.ts`) (+10 more)

### Community 35 - "LandingPage.tsx"
Cohesion: 0.07
Nodes (25): MouseInteractiveGlow(), FaqItem, FAQS, FaqSection(), HERO_SLIDES, HeroSection(), HeroSectionProps, HeroSlide (+17 more)

### Community 36 - "RazorpayCheckoutModal.tsx"
Cohesion: 0.33
Nodes (8): RazorpayCheckoutModal(), RazorpayCheckoutModalProps, createRazorpayOrder(), initiateRazorpayStandardCheckout(), loadRazorpayScript(), RazorpayCheckoutOptions, RazorpayCustomerDetails, Window

### Community 38 - "usePageTitle.ts"
Cohesion: 0.43
Nodes (5): CtaBanner(), CtaBannerProps, LandingFooter(), LandingNavbar(), VERTICALS

### Community 39 - "react"
Cohesion: 0.14
Nodes (11): react, LeafletFleetMap(), ScrollToTop(), StatCard(), StatCardProps, TelematicsGaugeCluster(), CHCOverview(), CATEGORY_SHARE (+3 more)

### Community 40 - "20260823000000_realtime_geospatial_availability.sql"
Cohesion: 0.21
Nodes (10): public.bookings, public.chcs, public.machines, public.maintenance_records, public.sync_entity_location_point, public.create_verified_booking(), public.get_nearby_available_machines(), trg_sync_chc_location (+2 more)

### Community 41 - "BookDemoModal.tsx"
Cohesion: 0.40
Nodes (4): KisanLoader(), KisanLoaderProps, BookDemoModal(), BookDemoModalProps

### Community 43 - "farmIntelligenceEngine.ts"
Cohesion: 0.06
Nodes (42): assessFarmRisks(), calculateFarmProfitModel(), generateDailyFarmBrief(), generateWeeklyFarmReport(), simulateFarmScenarios(), calculateMachineProfitability(), forecastFleetDemand(), generateDailyFleetBrief() (+34 more)

### Community 44 - "types/index.ts"
Cohesion: 0.10
Nodes (26): IntelligenceReportModalProps, DailyFleetBrief, WeeklyFleetReport, AppState, AvailableMachineItem, BookingStatus, DailyFarmBrief, DemandFactorBreakdown (+18 more)

### Community 45 - "iotIngestionEngine.ts"
Cohesion: 0.17
Nodes (16): TelematicsGaugeClusterProps, fetchInitialPlatformData(), getSampleHardwareConfig(), HardwareTelemetryPayload, ingestHardwareTelemetry(), IngestionResult, ingestManualGpsLocation(), ingestOperatorGpsTelemetry() (+8 more)

### Community 46 - "dbService.ts"
Cohesion: 0.23
Nodes (15): LeafletFleetMapProps, SEEDED_AGRICREDIT_PROFILE, SEEDED_ALLOCATION_RECOMMENDATIONS, SEEDED_BOOKINGS, SEEDED_CHCS, SEEDED_DEMAND_FORECASTS, SEEDED_FARM, SEEDED_MACHINES (+7 more)

### Community 47 - "LoginPage.tsx"
Cohesion: 0.27
Nodes (7): AuthResponse, isSupabaseConfigured, signInWithEmail(), signUpWithEmail(), supabase, UserProfile, UserRole

### Community 48 - "AdminDashboard.tsx"
Cohesion: 0.29
Nodes (6): AdminDashboard(), DISTRICTS, SMAM_SUBSIDY_LEDGER, SubsidyRecord, TELEMATICS_ALERTS, TelematicsAlert

## Knowledge Gaps
- **219 isolated node(s):** `$schema`, `typescript`, `oxc`, `react/rules-of-hooks`, `warn` (+214 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `Navbar.tsx`, `kisanOpsStore.ts`, `Machine`, `LandingPage.tsx`, `RazorpayCheckoutModal.tsx`, `LazyImage.tsx`, `LeafletFleetMap.tsx`, `usePageTitle.ts`, `useKisanOpsStore`, `BookDemoModal.tsx`, `plugins`, `types/index.ts`, `LoginPage.tsx`, `AdminDashboard.tsx`, `billingEngine.ts`, `TrustMarquee.tsx`, `availabilityService.ts`?**
  _High betweenness centrality (0.120) - this node is a cross-community bridge._
- **Why does `useKisanOpsStore()` connect `useKisanOpsStore` to `Navbar.tsx`, `kisanOpsStore.ts`, `Machine`, `usePageTitle.ts`, `react`, `BookDemoModal.tsx`, `farmIntelligenceEngine.ts`, `iotIngestionEngine.ts`, `LoginPage.tsx`, `billingEngine.ts`, `availabilityService.ts`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **Why does `Machine` connect `Machine` to `kisanOpsStore.ts`, `LeafletFleetMap.tsx`, `useKisanOpsStore`, `farmIntelligenceEngine.ts`, `types/index.ts`, `iotIngestionEngine.ts`, `dbService.ts`, `availabilityService.ts`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **What connects `$schema`, `typescript`, `oxc` to the rest of the system?**
  _219 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Machine` be split into smaller, more focused modules?**
  _Cohesion score 0.07598371777476255 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.05714285714285714 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.06451612903225806 - nodes in this community are weakly interconnected._