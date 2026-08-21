-- ============================================================================
-- KISANOPS / YUKTI - CLEAN ALL DEMO DATA FROM SUPABASE
-- Run this script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/vrmycvndfylrzuuxjrat/sql/new
-- This will wipe all dummy/demo bookings, invoices, telematics, and seeded accounts
-- while keeping your database schema, enums, triggers, and RLS policies 100% intact.
-- ============================================================================

BEGIN;

-- 1. Disable Foreign Key Triggers temporarily for fast clean truncate
SET session_replication_role = 'replica';

-- 2. Truncate all transactional & evaluation data tables
TRUNCATE TABLE public.invoices CASCADE;
TRUNCATE TABLE public.credit_profiles CASCADE;
TRUNCATE TABLE public.bookings CASCADE;
TRUNCATE TABLE public.demand_forecasts CASCADE;
TRUNCATE TABLE public.machine_allocations CASCADE;
TRUNCATE TABLE public.audit_logs CASCADE;
TRUNCATE TABLE public.farms CASCADE;

-- 3. Delete demo machinery records (Keep your schema ready for real machinery)
TRUNCATE TABLE public.machines CASCADE;

-- 4. Delete demo CHC Hub records
TRUNCATE TABLE public.chcs CASCADE;

-- 5. Delete demo profiles (profiles not connected to active real auth users, or delete all demo profiles)
DELETE FROM public.profiles 
WHERE email IN (
    'ramesh.farmer@kisanops.in',
    'rajesh.chc@kisanops.in',
    'amit.admin@mp.gov.in',
    'demo@kisanops.in'
)
OR full_name IN ('Ramesh Kumar', 'Rajesh Singh', 'Dr. Amit Sharma');

-- 6. Restore Foreign Key Trigger rules
SET session_replication_role = 'origin';

-- 7. Add an immutable clean-slate audit entry
INSERT INTO public.audit_logs (
    id,
    actor_name,
    action,
    entity_type,
    payload,
    ip_address,
    created_at
) VALUES (
    gen_random_uuid(),
    'Platform Administrator',
    'PLATFORM_RESET_CLEAN_PRODUCTION',
    'SYSTEM',
    '{"message": "All demo data truncated. Platform reset to clean production state."}'::jsonb,
    '127.0.0.1',
    NOW()
);

COMMIT;

-- Verification Check (Should return 0 rows for demo data)
SELECT 'bookings' as table_name, count(*) FROM public.bookings
UNION ALL
SELECT 'invoices', count(*) FROM public.invoices
UNION ALL
SELECT 'credit_profiles', count(*) FROM public.credit_profiles
UNION ALL
SELECT 'profiles', count(*) FROM public.profiles;
