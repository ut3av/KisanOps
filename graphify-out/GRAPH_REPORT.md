# Graph Report - KisanOps  (2026-08-21)

## Corpus Check
- Corpus is ~39,446 words - fits in a single context window. You may not need a graph.

## Summary
- 347 nodes · 744 edges · 20 communities (17 shown, 3 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 1,200 input · 800 output

## Community Hubs (Navigation)
- React Components & Live Weather UI
- KisanOps Core Intelligence Architecture
- Seeded Agricultural Domain Data
- Build Tooling & Dev Dependencies
- Runtime Libraries & Visualization SDKs
- GIS Fleet Mapping & Doppler Radar
- TypeScript App Compiler Config
- Vite & Node Configuration
- Linter & Code Quality Rules
- Community 9
- Community 10
- Community 11
- Community 12
- Community 13
- Community 14

## God Nodes (most connected - your core abstractions)
1. `useKisanOpsStore()` - 44 edges
2. `react` - 34 edges
3. `Weather Intelligence & Risk Radar` - 19 edges
4. `Machine` - 16 edges
5. `AppState` - 15 edges
6. `compilerOptions` - 15 edges
7. `compilerOptions` - 14 edges
8. `Predictive Demand Engine` - 13 edges
9. `machines` - 13 edges
10. `Explainable Recommendation Engine` - 12 edges

## Surprising Connections (you probably didn't know these)
- `KisanOps Platform` --integrates--> `Weather Intelligence & Risk Radar`  [EXTRACTED]
  README.md → src/lib/weatherEngine.ts
- `LeafletFleetMapProps` --references--> `Machine`  [EXTRACTED]
  src/components/common/LeafletFleetMap.tsx → src/types/index.ts
- `TelematicsGaugeClusterProps` --references--> `TelemetryPoint`  [EXTRACTED]
  src/components/common/TelematicsGauge.tsx → src/types/index.ts
- `LoginPage()` --calls--> `useKisanOpsStore()`  [EXTRACTED]
  src/features/auth/LoginPage.tsx → src/store/kisanOpsStore.ts
- `BookingModal()` --calls--> `useKisanOpsStore()`  [EXTRACTED]
  src/features/farmer/BookingModal.tsx → src/store/kisanOpsStore.ts

## Import Cycles
- None detected.

## Communities (20 total, 3 thin omitted)

### Community 0 - "React Components & Live Weather UI"
Cohesion: 0.09
Nodes (36): react, App(), queryClient, AgriCreditGauge(), AgriCreditGaugeProps, LeafletFleetMap(), StatCard(), StatCardProps (+28 more)

### Community 1 - "KisanOps Core Intelligence Architecture"
Cohesion: 0.08
Nodes (45): activeMachineIcon, availableMachineIcon, chcIcon, farmIcon, LeafletFleetMapProps, maintenanceIcon, TelematicsGaugeClusterProps, SEEDED_AGRICREDIT_PROFILE (+37 more)

### Community 2 - "Seeded Agricultural Domain Data"
Cohesion: 0.13
Nodes (30): ExplanationBadge(), ExplanationBadgeProps, BookingModal(), BookingModalProps, FarmerHome(), FarmerMarketplace(), MachineDetailsModal(), MachineDetailsModalProps (+22 more)

### Community 3 - "Build Tooling & Dev Dependencies"
Cohesion: 0.06
Nodes (34): autoprefixer, oxlint, devDependencies, autoprefixer, oxlint, postcss, tailwindcss, @tailwindcss/postcss (+26 more)

### Community 4 - "Runtime Libraries & Visualization SDKs"
Cohesion: 0.16
Nodes (30): audit_logs, booking_events, bookings, chcs, credit_events, credit_profiles, demand_forecasts, disputes (+22 more)

### Community 5 - "GIS Fleet Mapping & Doppler Radar"
Cohesion: 0.07
Nodes (29): clsx, jspdf, leaflet, lucide-react, dependencies, clsx, jspdf, leaflet (+21 more)

### Community 6 - "TypeScript App Compiler Config"
Cohesion: 0.16
Nodes (22): KisanOps Platform, Doppler Radar Map Player, DopplerRadarPlayer(), DopplerRadarPlayerProps, Weather Radar & Harvest Window Barometer, WeatherRadarCard(), WeatherRadarCardProps, Weather Intelligence & Risk Radar (+14 more)

### Community 7 - "Vite & Node Configuration"
Cohesion: 0.10
Nodes (19): DOM, src, vite/client, compilerOptions, jsx, lib, module, moduleDetection (+11 more)

### Community 8 - "Linter & Code Quality Rules"
Cohesion: 0.10
Nodes (19): node, vite.config.ts, compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection (+11 more)

### Community 9 - "Community 9"
Cohesion: 0.32
Nodes (11): SEEDED_PROFILES, LoginPage(), AuthResponse, isSupabaseConfigured, sendPhoneOtp(), signInWithEmail(), signUpWithEmail(), supabase (+3 more)

### Community 10 - "Community 10"
Cohesion: 0.33
Nodes (7): auth.users, public, public.chcs, public.farm_crops, public.farms, public.machines, public.profiles

### Community 11 - "Community 11"
Cohesion: 0.22
Nodes (8): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema, oxc, typescript, warn

## Knowledge Gaps
- **105 isolated node(s):** `$schema`, `typescript`, `oxc`, `react/rules-of-hooks`, `warn` (+100 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `React Components & Live Weather UI` to `KisanOps Core Intelligence Architecture`, `Seeded Agricultural Domain Data`, `TypeScript App Compiler Config`, `Community 9`, `Community 11`?**
  _High betweenness centrality (0.074) - this node is a cross-community bridge._
- **Why does `Weather Intelligence & Risk Radar` connect `TypeScript App Compiler Config` to `Seeded Agricultural Domain Data`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **Why does `useKisanOpsStore()` connect `React Components & Live Weather UI` to `Community 9`, `Seeded Agricultural Domain Data`, `KisanOps Core Intelligence Architecture`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **What connects `$schema`, `typescript`, `oxc` to the rest of the system?**
  _105 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `React Components & Live Weather UI` be split into smaller, more focused modules?**
  _Cohesion score 0.09117475160724722 - nodes in this community are weakly interconnected._
- **Should `KisanOps Core Intelligence Architecture` be split into smaller, more focused modules?**
  _Cohesion score 0.07918552036199095 - nodes in this community are weakly interconnected._
- **Should `Seeded Agricultural Domain Data` be split into smaller, more focused modules?**
  _Cohesion score 0.12762762762762764 - nodes in this community are weakly interconnected._