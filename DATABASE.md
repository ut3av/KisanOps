# KisanOps Database Specification & Data Dictionary

## 1. Schema Overview

The database is built for PostgreSQL 14+ and Supabase, utilizing UUID primary keys, timestamp audit columns, foreign key constraints, and Row Level Security (RLS) policies.

---

## 2. Table Catalog

| Table | Description | Primary Key | Key Foreign Keys |
|---|---|---|---|
| `profiles` | User identity & role metadata | `id (UUID)` | `auth_user_id` |
| `chcs` | Custom Hiring Centre hubs | `id (UUID)` | `manager_id -> profiles(id)` |
| `farms` | Farm boundaries & geographic coordinates | `id (UUID)` | `farmer_id -> profiles(id)` |
| `farm_crops` | Crop cycles, seasons, and crop stages | `id (UUID)` | `farm_id -> farms(id)` |
| `machines` | Fleet registry, HP, health scores, tariffs | `id (UUID)` | `chc_id -> chcs(id)` |
| `machine_telemetry` | Time-series CAN-Bus sensor logs | `id (UUID)` | `machine_id -> machines(id)` |
| `maintenance_predictions`| Predictive fuel & service anomaly alerts | `id (UUID)` | `machine_id -> machines(id)` |
| `demand_forecasts` | 7-day regional machinery demand index | `id (UUID)` | N/A |
| `machine_allocations` | Inter-hub reallocation optimization records | `id (UUID)` | `source_chc_id`, `target_chc_id`, `machine_id` |
| `credit_profiles` | AgriCredit 0–900 scores & deferred limits | `id (UUID)` | `farmer_id -> profiles(id)` |
| `bookings` | Rental reservations & lifecycle states | `id (UUID)` | `farmer_id`, `chc_id`, `machine_id`, `farm_id` |
| `invoices` | Automated tax invoices & payment status | `id (UUID)` | `booking_id -> bookings(id)` |
| `audit_logs` | Immutable audit trail for all transactions | `id (UUID)` | `actor_id -> profiles(id)` |

---

## 3. Row Level Security (RLS) Policies

1. **Farmer Data Isolation**:
   - `SELECT` and `UPDATE` on `farms`, `farm_crops`, `bookings`, `invoices`, and `credit_profiles` restricted to `auth.uid() = farmer_id`.
2. **CHC Hub Manager Access**:
   - Authorized CHC managers can read and update machines, allocations, bookings, and telematics belonging to their assigned `chc_id`.
3. **Platform Administrator**:
   - Root read/write access across all network hubs and audit tables.

---

## 4. Migration Files

The initial PostgreSQL schema migration is available at:
`supabase/migrations/20260821000000_initial_schema.sql`
