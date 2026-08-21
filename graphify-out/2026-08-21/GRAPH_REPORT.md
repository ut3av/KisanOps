# Graph Report - KisanOps  (2026-08-21)

## Corpus Check
- 90 files · ~286,314 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 478 nodes · 972 edges · 28 communities (23 shown, 5 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `46902ade`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- App.tsx
- kisanOpsStore.ts
- FarmerMarketplace.tsx
- devDependencies
- 20260821000000_initial_schema.sql
- dependencies
- LeafletFleetMap.tsx
- compilerOptions
- compilerOptions
- LandingPage.tsx
- schema.sql
- plugins
- tsconfig.json
- AgriCredit Engine
- Dynamic Pricing Engine
- 🎬 Step-by-Step 12-Scene Script
- KisanOps API Specification
- 2. Core Subsystems
- KisanOps Database Specification & Data Dictionary
- KisanOps Deployment Guide
- BookDemoModal.tsx
- rules/graphify.md
- workflows/graphify.md

## God Nodes (most connected - your core abstractions)
1. `react` - 59 edges
2. `useKisanOpsStore()` - 50 edges
3. `Machine` - 16 edges
4. `AppState` - 15 edges
5. `compilerOptions` - 15 edges
6. `compilerOptions` - 14 edges
7. `machines` - 13 edges
8. `🎬 Step-by-Step 12-Scene Script` - 13 edges
9. `profiles` - 12 edges
10. `LandingNavbar()` - 11 edges

## Surprising Connections (you probably didn't know these)
- `TelematicsGaugeClusterProps` --references--> `TelemetryPoint`  [EXTRACTED]
  src/components/common/TelematicsGauge.tsx → src/types/index.ts
- `BookDemoModal()` --calls--> `useKisanOpsStore()`  [EXTRACTED]
  src/features/landing/components/BookDemoModal.tsx → src/store/kisanOpsStore.ts
- `LeafletFleetMapProps` --references--> `Machine`  [EXTRACTED]
  src/components/common/LeafletFleetMap.tsx → src/types/index.ts
- `DemoScenarioBar()` --calls--> `useKisanOpsStore()`  [EXTRACTED]
  src/components/demo/DemoScenarioBar.tsx → src/store/kisanOpsStore.ts
- `LoginPage()` --calls--> `useKisanOpsStore()`  [EXTRACTED]
  src/features/auth/LoginPage.tsx → src/store/kisanOpsStore.ts

## Import Cycles
- None detected.

## Communities (28 total, 5 thin omitted)

### Community 0 - "App.tsx"
Cohesion: 0.08
Nodes (39): react, App(), queryClient, AgriCreditGauge(), AgriCreditGaugeProps, InteractiveCursor(), LeafletFleetMap(), StatCard() (+31 more)

### Community 1 - "kisanOpsStore.ts"
Cohesion: 0.09
Nodes (47): LeafletFleetMapProps, SEEDED_AGRICREDIT_PROFILE, SEEDED_ALLOCATION_RECOMMENDATIONS, SEEDED_BOOKINGS, SEEDED_CHCS, SEEDED_DEMAND_FORECASTS, SEEDED_FARM, SEEDED_MACHINES (+39 more)

### Community 2 - "FarmerMarketplace.tsx"
Cohesion: 0.12
Nodes (26): ExplanationBadge(), ExplanationBadgeProps, BookingModal(), BookingModalProps, FarmerHome(), FarmerMarketplace(), MachineDetailsModal(), MachineDetailsModalProps (+18 more)

### Community 3 - "devDependencies"
Cohesion: 0.06
Nodes (34): autoprefixer, oxlint, devDependencies, autoprefixer, oxlint, postcss, tailwindcss, @tailwindcss/postcss (+26 more)

### Community 4 - "20260821000000_initial_schema.sql"
Cohesion: 0.16
Nodes (30): audit_logs, booking_events, bookings, chcs, credit_events, credit_profiles, demand_forecasts, disputes (+22 more)

### Community 5 - "dependencies"
Cohesion: 0.07
Nodes (29): clsx, jspdf, leaflet, lucide-react, dependencies, clsx, jspdf, leaflet (+21 more)

### Community 6 - "LeafletFleetMap.tsx"
Cohesion: 0.08
Nodes (30): KisanOps Platform, DopplerRadarPlayer(), DopplerRadarPlayerProps, activeMachineIcon, availableMachineIcon, chcIcon, farmIcon, maintenanceIcon (+22 more)

### Community 7 - "compilerOptions"
Cohesion: 0.10
Nodes (19): DOM, src, vite/client, compilerOptions, jsx, lib, module, moduleDetection (+11 more)

### Community 8 - "compilerOptions"
Cohesion: 0.10
Nodes (19): node, vite.config.ts, compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection (+11 more)

### Community 9 - "LandingPage.tsx"
Cohesion: 0.07
Nodes (36): NotFoundPage(), CtaBanner(), CtaBannerProps, FaqItem, FAQS, FaqSection(), HERO_SLIDES, HeroSection() (+28 more)

### Community 10 - "schema.sql"
Cohesion: 0.33
Nodes (7): auth.users, public, public.chcs, public.farm_crops, public.farms, public.machines, public.profiles

### Community 11 - "plugins"
Cohesion: 0.22
Nodes (8): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema, oxc, typescript, warn

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

## Knowledge Gaps
- **165 isolated node(s):** `$schema`, `typescript`, `oxc`, `react/rules-of-hooks`, `warn` (+160 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `App.tsx` to `kisanOpsStore.ts`, `FarmerMarketplace.tsx`, `LeafletFleetMap.tsx`, `LandingPage.tsx`, `plugins`, `BookDemoModal.tsx`?**
  _High betweenness centrality (0.124) - this node is a cross-community bridge._
- **Why does `useKisanOpsStore()` connect `App.tsx` to `kisanOpsStore.ts`, `FarmerMarketplace.tsx`, `LeafletFleetMap.tsx`, `LandingPage.tsx`, `BookDemoModal.tsx`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **Why does `plugins` connect `plugins` to `App.tsx`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **What connects `$schema`, `typescript`, `oxc` to the rest of the system?**
  _165 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `App.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07526881720430108 - nodes in this community are weakly interconnected._
- **Should `kisanOpsStore.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08897243107769423 - nodes in this community are weakly interconnected._
- **Should `FarmerMarketplace.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12380952380952381 - nodes in this community are weakly interconnected._