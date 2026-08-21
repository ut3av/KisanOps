# Graph Report - KisanOps  (2026-08-21)

## Corpus Check
- Corpus is ~35,952 words - fits in a single context window. You may not need a graph.

## Summary
- 327 nodes · 698 edges · 21 communities (18 shown, 3 thin omitted)
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
- Community 15

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
- `LeafletFleetMapProps` --references--> `CHC`  [EXTRACTED]
  src/components/common/LeafletFleetMap.tsx → src/types/index.ts
- `LeafletFleetMapProps` --references--> `Farm`  [EXTRACTED]
  src/components/common/LeafletFleetMap.tsx → src/types/index.ts
- `LeafletFleetMapProps` --references--> `Machine`  [EXTRACTED]
  src/components/common/LeafletFleetMap.tsx → src/types/index.ts

## Import Cycles
- None detected.

## Communities (21 total, 3 thin omitted)

### Community 0 - "React Components & Real Auth"
Cohesion: 0.09
Nodes (35): react, App(), queryClient, AgriCreditGauge(), AgriCreditGaugeProps, LeafletFleetMap(), StatCard(), StatCardProps (+27 more)

### Community 1 - "KisanOps Core Intelligence Architecture"
Cohesion: 0.11
Nodes (38): SEEDED_AGRICREDIT_PROFILE, SEEDED_ALLOCATION_RECOMMENDATIONS, SEEDED_BOOKINGS, SEEDED_CHCS, SEEDED_DEMAND_FORECASTS, SEEDED_FARM, SEEDED_MACHINES, SEEDED_MAINTENANCE_ALERTS (+30 more)

### Community 2 - "Seeded Agricultural Domain Data"
Cohesion: 0.06
Nodes (34): autoprefixer, oxlint, devDependencies, autoprefixer, oxlint, postcss, tailwindcss, @tailwindcss/postcss (+26 more)

### Community 3 - "Build Tooling & Dev Dependencies"
Cohesion: 0.16
Nodes (30): audit_logs, booking_events, bookings, chcs, credit_events, credit_profiles, demand_forecasts, disputes (+22 more)

### Community 4 - "Runtime Libraries & Visualization SDKs"
Cohesion: 0.07
Nodes (29): clsx, jspdf, leaflet, lucide-react, dependencies, clsx, jspdf, leaflet (+21 more)

### Community 5 - "GIS Fleet Mapping & Telematics UI"
Cohesion: 0.17
Nodes (20): ExplanationBadge(), ExplanationBadgeProps, BookingModal(), BookingModalProps, FarmerHome(), FarmerMarketplace(), MachineDetailsModal(), MachineDetailsModalProps (+12 more)

### Community 6 - "TypeScript App Compiler Config"
Cohesion: 0.10
Nodes (19): DOM, src, vite/client, compilerOptions, jsx, lib, module, moduleDetection (+11 more)

### Community 7 - "Vite & Node Configuration"
Cohesion: 0.10
Nodes (19): node, vite.config.ts, compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection (+11 more)

### Community 8 - "Linter & Code Quality Rules"
Cohesion: 0.15
Nodes (14): activeMachineIcon, availableMachineIcon, chcIcon, farmIcon, LeafletFleetMapProps, maintenanceIcon, TelematicsGaugeClusterProps, CAN-Bus Telematics Engine (+6 more)

### Community 9 - "TypeScript Workspace Config"
Cohesion: 0.23
Nodes (16): KisanOps Platform, PostgreSQL & RLS Schema, Supabase Seed Data (RFC4122 UUIDs), SEEDED_PROFILES, Modern Auth & Supabase Login, LoginPage(), Supabase Client & Auth Adapters, AuthResponse (+8 more)

### Community 10 - "PostCSS Configuration"
Cohesion: 0.33
Nodes (7): auth.users, public, public.chcs, public.farm_crops, public.farms, public.machines, public.profiles

### Community 11 - "Tailwind Theme Configuration"
Cohesion: 0.22
Nodes (8): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema, oxc, typescript, warn

### Community 12 - "Tailwind CSS Engine"
Cohesion: 0.47
Nodes (4): PredictiveMaintenance(), Predictive Maintenance Engine, calculateMachineHealth(), MaintenanceHealthBreakdown

## Knowledge Gaps
- **100 isolated node(s):** `$schema`, `typescript`, `oxc`, `react/rules-of-hooks`, `warn` (+95 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `React Components & Real Auth` to `KisanOps Core Intelligence Architecture`, `GIS Fleet Mapping & Telematics UI`, `Linter & Code Quality Rules`, `TypeScript Workspace Config`, `Tailwind Theme Configuration`, `Tailwind CSS Engine`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **Why does `useKisanOpsStore()` connect `React Components & Real Auth` to `KisanOps Core Intelligence Architecture`, `GIS Fleet Mapping & Telematics UI`, `Linter & Code Quality Rules`, `TypeScript Workspace Config`, `Tailwind CSS Engine`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Runtime Libraries & Visualization SDKs` to `Seeded Agricultural Domain Data`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **What connects `$schema`, `typescript`, `oxc` to the rest of the system?**
  _100 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `React Components & Real Auth` be split into smaller, more focused modules?**
  _Cohesion score 0.09427609427609428 - nodes in this community are weakly interconnected._
- **Should `KisanOps Core Intelligence Architecture` be split into smaller, more focused modules?**
  _Cohesion score 0.113107822410148 - nodes in this community are weakly interconnected._
- **Should `Seeded Agricultural Domain Data` be split into smaller, more focused modules?**
  _Cohesion score 0.05714285714285714 - nodes in this community are weakly interconnected._