# Graph Report - KisanOps  (2026-08-21)

## Corpus Check
- Corpus is ~35,924 words - fits in a single context window. You may not need a graph.

## Summary
- 326 nodes · 697 edges · 20 communities (17 shown, 3 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 1,200 input · 800 output

## Community Hubs (Navigation)
- React Components & Real Auth
- KisanOps Core Intelligence Architecture
- Seeded Agricultural Domain Data
- Build Tooling & Dev Dependencies
- Runtime Libraries & Visualization SDKs
- GIS Fleet Mapping & Telematics UI
- TypeScript App Compiler Config
- Vite & Node Configuration
- Linter & Code Quality Rules
- TypeScript Workspace Config
- PostCSS Configuration
- Tailwind Theme Configuration
- Tailwind CSS Engine
- Vite Bundler Configuration
- Community 14

## God Nodes (most connected - your core abstractions)
1. `useKisanOpsStore()` - 44 edges
2. `react` - 32 edges
3. `Modern Auth & Supabase Login` - 17 edges
4. `Machine` - 16 edges
5. `AppState` - 15 edges
6. `compilerOptions` - 15 edges
7. `Supabase Client & Auth Adapters` - 14 edges
8. `compilerOptions` - 14 edges
9. `machines` - 13 edges
10. `Predictive Demand Engine` - 12 edges

## Surprising Connections (you probably didn't know these)
- `KisanOps Platform` --secures_with--> `Modern Auth & Supabase Login`  [EXTRACTED]
  README.md → src/features/auth/LoginPage.tsx
- `Supabase Client & Auth Adapters` --connects_to--> `PostgreSQL & RLS Schema`  [EXTRACTED]
  src/lib/supabaseClient.ts → supabase/schema.sql
- `TelematicsGaugeClusterProps` --references--> `TelemetryPoint`  [EXTRACTED]
  src/components/common/TelematicsGauge.tsx → src/types/index.ts
- `LeafletFleetMapProps` --references--> `Machine`  [EXTRACTED]
  src/components/common/LeafletFleetMap.tsx → src/types/index.ts
- `LoginPage()` --calls--> `useKisanOpsStore()`  [EXTRACTED]
  src/features/auth/LoginPage.tsx → src/store/kisanOpsStore.ts

## Import Cycles
- None detected.

## Communities (20 total, 3 thin omitted)

### Community 0 - "React Components & Real Auth"
Cohesion: 0.10
Nodes (30): react, App(), queryClient, AgriCreditGauge(), AgriCreditGaugeProps, StatCard(), StatCardProps, DEMO_SCENES (+22 more)

### Community 1 - "KisanOps Core Intelligence Architecture"
Cohesion: 0.11
Nodes (40): LeafletFleetMapProps, SEEDED_AGRICREDIT_PROFILE, SEEDED_ALLOCATION_RECOMMENDATIONS, SEEDED_BOOKINGS, SEEDED_CHCS, SEEDED_DEMAND_FORECASTS, SEEDED_FARM, SEEDED_MACHINES (+32 more)

### Community 2 - "Seeded Agricultural Domain Data"
Cohesion: 0.12
Nodes (28): ExplanationBadge(), ExplanationBadgeProps, BookingModal(), BookingModalProps, FarmerHome(), FarmerMarketplace(), MachineDetailsModal(), MachineDetailsModalProps (+20 more)

### Community 3 - "Build Tooling & Dev Dependencies"
Cohesion: 0.06
Nodes (34): autoprefixer, oxlint, devDependencies, autoprefixer, oxlint, postcss, tailwindcss, @tailwindcss/postcss (+26 more)

### Community 4 - "Runtime Libraries & Visualization SDKs"
Cohesion: 0.16
Nodes (30): audit_logs, booking_events, bookings, chcs, credit_events, credit_profiles, demand_forecasts, disputes (+22 more)

### Community 5 - "GIS Fleet Mapping & Telematics UI"
Cohesion: 0.07
Nodes (29): clsx, jspdf, leaflet, lucide-react, dependencies, clsx, jspdf, leaflet (+21 more)

### Community 6 - "TypeScript App Compiler Config"
Cohesion: 0.10
Nodes (19): DOM, src, vite/client, compilerOptions, jsx, lib, module, moduleDetection (+11 more)

### Community 7 - "Vite & Node Configuration"
Cohesion: 0.10
Nodes (19): node, vite.config.ts, compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection (+11 more)

### Community 8 - "Linter & Code Quality Rules"
Cohesion: 0.16
Nodes (13): activeMachineIcon, availableMachineIcon, chcIcon, farmIcon, LeafletFleetMap(), maintenanceIcon, TelematicsGaugeCluster(), TelematicsGaugeClusterProps (+5 more)

### Community 9 - "TypeScript Workspace Config"
Cohesion: 0.26
Nodes (15): KisanOps Platform, PostgreSQL & RLS Schema, SEEDED_PROFILES, Modern Auth & Supabase Login, LoginPage(), Supabase Client & Auth Adapters, AuthResponse, isSupabaseConfigured (+7 more)

### Community 10 - "PostCSS Configuration"
Cohesion: 0.33
Nodes (7): auth.users, public, public.chcs, public.farm_crops, public.farms, public.machines, public.profiles

### Community 11 - "Tailwind Theme Configuration"
Cohesion: 0.22
Nodes (8): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema, oxc, typescript, warn

## Knowledge Gaps
- **100 isolated node(s):** `$schema`, `typescript`, `oxc`, `react/rules-of-hooks`, `warn` (+95 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `React Components & Real Auth` to `KisanOps Core Intelligence Architecture`, `Seeded Agricultural Domain Data`, `Linter & Code Quality Rules`, `TypeScript Workspace Config`, `Tailwind Theme Configuration`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **Why does `useKisanOpsStore()` connect `React Components & Real Auth` to `Linter & Code Quality Rules`, `TypeScript Workspace Config`, `Seeded Agricultural Domain Data`, `KisanOps Core Intelligence Architecture`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **Why does `dependencies` connect `GIS Fleet Mapping & Telematics UI` to `Build Tooling & Dev Dependencies`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **What connects `$schema`, `typescript`, `oxc` to the rest of the system?**
  _100 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `React Components & Real Auth` be split into smaller, more focused modules?**
  _Cohesion score 0.10372340425531915 - nodes in this community are weakly interconnected._
- **Should `KisanOps Core Intelligence Architecture` be split into smaller, more focused modules?**
  _Cohesion score 0.10505050505050505 - nodes in this community are weakly interconnected._
- **Should `Seeded Agricultural Domain Data` be split into smaller, more focused modules?**
  _Cohesion score 0.12380952380952381 - nodes in this community are weakly interconnected._