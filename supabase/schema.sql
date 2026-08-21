-- ============================================================================
-- KISANOPS - COMPLETE PRODUCTION POSTGRESQL & SUPABASE SCHEMA
-- Execute this entire script in your Supabase SQL Editor:
-- https://app.supabase.com/project/_/sql
-- ============================================================================

-- 1. Enable Required PostgreSQL Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Create Enums
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('FARMER', 'OPERATOR', 'CHC_MANAGER', 'FLEET_MANAGER', 'ADMIN');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE machine_status AS ENUM ('AVAILABLE', 'RESERVED', 'DISPATCHED', 'ACTIVE', 'RETURNING', 'MAINTENANCE', 'OFFLINE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE booking_status AS ENUM ('REQUESTED', 'CONFIRMED', 'DISPATCHED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'DISPUTED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('INITIATED', 'PENDING', 'AUTHORIZED', 'CAPTURED', 'FAILED', 'REFUNDED', 'PARTIALLY_REFUNDED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_method AS ENUM ('UPI', 'CARD', 'NET_BANKING', 'AGRICREDIT_DEFERRED', 'CASH');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE activity_type AS ENUM ('SOIL_PREPARATION', 'SOWING', 'CULTIVATION', 'SPRAYING', 'IRRIGATION', 'HARVESTING', 'THRESHING', 'TRANSPORT');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE machine_category AS ENUM ('TRACTOR', 'HARVESTER', 'ROTAVATOR', 'SEEDER', 'SPRAYER', 'THRESHER', 'TRAILER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. Profiles Table (Linked to Supabase Auth Users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone_number TEXT,
    email TEXT,
    role user_role NOT NULL DEFAULT 'FARMER',
    avatar_url TEXT,
    district TEXT DEFAULT 'Sehore',
    village TEXT DEFAULT 'Bilkisganj',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Custom Hiring Centres (CHCs) Table
CREATE TABLE IF NOT EXISTS public.chcs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    manager_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    village TEXT NOT NULL,
    district TEXT NOT NULL,
    state TEXT NOT NULL DEFAULT 'Madhya Pradesh',
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    contact_phone TEXT NOT NULL,
    contact_email TEXT,
    operating_radius_km DOUBLE PRECISION DEFAULT 35.0,
    total_machines INT DEFAULT 14,
    active_machines INT DEFAULT 11,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Farms & Crop Profiles
CREATE TABLE IF NOT EXISTS public.farms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farmer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    farm_name TEXT NOT NULL,
    village TEXT NOT NULL,
    district TEXT NOT NULL,
    state TEXT NOT NULL DEFAULT 'Madhya Pradesh',
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    size_acres DOUBLE PRECISION NOT NULL,
    irrigation_type TEXT NOT NULL DEFAULT 'Canal',
    soil_type TEXT DEFAULT 'Deep Black Soil (Vertisol)',
    boundary_polygon JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.farm_crops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farm_id UUID NOT NULL REFERENCES public.farms(id) ON DELETE CASCADE,
    crop_name TEXT NOT NULL,
    season TEXT NOT NULL DEFAULT 'Rabi',
    crop_stage TEXT NOT NULL DEFAULT 'Pre-harvest',
    sowing_date DATE,
    expected_harvest_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Machinery Fleet Registry
CREATE TABLE IF NOT EXISTS public.machines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chc_id UUID NOT NULL REFERENCES public.chcs(id) ON DELETE CASCADE,
    identifier TEXT NOT NULL UNIQUE,
    category machine_category NOT NULL,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    year_of_manufacture INT NOT NULL DEFAULT 2023,
    power_hp INT NOT NULL,
    fuel_type TEXT DEFAULT 'DIESEL',
    status machine_status NOT NULL DEFAULT 'AVAILABLE',
    base_rate_per_hour NUMERIC(10, 2) NOT NULL,
    base_rate_per_acre NUMERIC(10, 2),
    health_score INT NOT NULL DEFAULT 94 CHECK (health_score BETWEEN 0 AND 100),
    total_engine_hours NUMERIC(10, 2) NOT NULL DEFAULT 0.0,
    service_interval_hours NUMERIC(10, 2) NOT NULL DEFAULT 250.0,
    hours_since_last_service NUMERIC(10, 2) NOT NULL DEFAULT 0.0,
    image_url TEXT,
    rating NUMERIC(3, 2) DEFAULT 4.8,
    total_rentals INT DEFAULT 0,
    supported_activities TEXT[] DEFAULT ARRAY['HARVESTING', 'THRESHING'],
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    operator_name TEXT,
    operator_rating NUMERIC(3, 2) DEFAULT 4.9,
    specs JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Real-Time CAN-Bus Telemetry Table (Time-Series Optimized)
CREATE TABLE IF NOT EXISTS public.machine_telemetry (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    machine_id UUID NOT NULL REFERENCES public.machines(id) ON DELETE CASCADE,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    speed_kmh DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    fuel_level_percent DOUBLE PRECISION NOT NULL,
    fuel_consumption_rate_lph DOUBLE PRECISION NOT NULL DEFAULT 7.2,
    engine_hours DOUBLE PRECISION NOT NULL,
    engine_temperature_c DOUBLE PRECISION NOT NULL,
    rpm INT NOT NULL DEFAULT 1900,
    battery_voltage DOUBLE PRECISION NOT NULL DEFAULT 13.4,
    status machine_status NOT NULL DEFAULT 'ACTIVE'
);

CREATE INDEX IF NOT EXISTS idx_telemetry_machine_time ON public.machine_telemetry(machine_id, timestamp DESC);

-- 8. Predictive Maintenance & Anomaly Predictions
CREATE TABLE IF NOT EXISTS public.maintenance_predictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    machine_id UUID NOT NULL REFERENCES public.machines(id) ON DELETE CASCADE,
    alert_type TEXT NOT NULL, -- FUEL_ANOMALY, SERVICE_OVERDUE, TEMP_SURGE
    severity TEXT NOT NULL DEFAULT 'HIGH', -- LOW, MEDIUM, HIGH, CRITICAL
    description TEXT NOT NULL,
    recommended_action TEXT NOT NULL,
    fuel_anomaly_delta_percent INT DEFAULT 0,
    urgency_hours INT NOT NULL DEFAULT 24,
    is_resolved BOOLEAN DEFAULT FALSE,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. AgriCredit Profiles & Limits
CREATE TABLE IF NOT EXISTS public.credit_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farmer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
    credit_score INT NOT NULL DEFAULT 742 CHECK (credit_score BETWEEN 300 AND 900),
    rating_category TEXT NOT NULL DEFAULT 'Good',
    credit_limit NUMERIC(10, 2) NOT NULL DEFAULT 8000.00,
    utilized_credit NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    available_credit NUMERIC(10, 2) GENERATED ALWAYS AS (credit_limit - utilized_credit) STORED,
    payment_history_score INT DEFAULT 96,
    rental_history_score INT DEFAULT 92,
    repayment_reliability_score INT DEFAULT 94,
    farm_activity_score INT DEFAULT 88,
    profile_stability_score INT DEFAULT 90,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Bookings & Lifecycle Records
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_number TEXT NOT NULL UNIQUE,
    farmer_id UUID NOT NULL REFERENCES public.profiles(id),
    chc_id UUID NOT NULL REFERENCES public.chcs(id),
    machine_id UUID NOT NULL REFERENCES public.machines(id),
    farm_id UUID NOT NULL REFERENCES public.farms(id),
    activity activity_type NOT NULL DEFAULT 'HARVESTING',
    status booking_status NOT NULL DEFAULT 'REQUESTED',
    booking_mode TEXT DEFAULT 'HOURLY',
    booked_hours NUMERIC(6, 2) NOT NULL DEFAULT 6.0,
    actual_hours NUMERIC(6, 2),
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    actual_start_time TIMESTAMPTZ,
    actual_end_time TIMESTAMPTZ,
    hourly_rate NUMERIC(10, 2) NOT NULL,
    estimated_total NUMERIC(10, 2) NOT NULL,
    actual_total NUMERIC(10, 2),
    payment_method payment_method NOT NULL DEFAULT 'AGRICREDIT_DEFERRED',
    payment_status payment_status NOT NULL DEFAULT 'AUTHORIZED',
    operator_name TEXT DEFAULT 'Raju Verma',
    operator_phone TEXT DEFAULT '+91 97550 12399',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Automated Tax Invoices
CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number TEXT NOT NULL UNIQUE,
    booking_id UUID NOT NULL REFERENCES public.bookings(id) UNIQUE,
    farmer_id UUID NOT NULL REFERENCES public.profiles(id),
    chc_id UUID NOT NULL REFERENCES public.chcs(id),
    machine_id UUID NOT NULL REFERENCES public.machines(id),
    booked_hours NUMERIC(6, 2) NOT NULL,
    actual_hours NUMERIC(6, 2) NOT NULL,
    base_rate_per_hour NUMERIC(10, 2) NOT NULL,
    base_rental_amount NUMERIC(10, 2) NOT NULL,
    transport_charge NUMERIC(10, 2) NOT NULL DEFAULT 300.0,
    fuel_surcharge NUMERIC(10, 2) NOT NULL DEFAULT 240.0,
    platform_fee NUMERIC(10, 2) NOT NULL DEFAULT 100.0,
    discount_amount NUMERIC(10, 2) NOT NULL DEFAULT 100.0,
    tax_gst_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.0,
    final_total_amount NUMERIC(10, 2) NOT NULL,
    payment_method payment_method NOT NULL DEFAULT 'AGRICREDIT_DEFERRED',
    payment_status payment_status NOT NULL DEFAULT 'CAPTURED',
    pdf_url TEXT,
    issued_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Demand Forecasts & Inter-Hub Allocations
CREATE TABLE IF NOT EXISTS public.demand_forecasts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    district TEXT NOT NULL,
    crop_name TEXT NOT NULL,
    crop_stage TEXT NOT NULL,
    machine_category machine_category NOT NULL,
    forecast_date DATE NOT NULL DEFAULT CURRENT_DATE,
    demand_level TEXT NOT NULL DEFAULT 'VERY_HIGH',
    demand_index INT NOT NULL CHECK (demand_index BETWEEN 0 AND 100),
    expected_demand_units INT NOT NULL,
    available_units INT NOT NULL,
    shortage_units INT NOT NULL,
    confidence_score NUMERIC(3, 2) NOT NULL DEFAULT 0.95,
    factors JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.machine_allocations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_chc_id UUID NOT NULL REFERENCES public.chcs(id),
    target_chc_id UUID NOT NULL REFERENCES public.chcs(id),
    machine_id UUID NOT NULL REFERENCES public.machines(id),
    distance_km DOUBLE PRECISION NOT NULL,
    relocation_cost NUMERIC(10, 2) NOT NULL,
    expected_utilization_gain_percent INT NOT NULL DEFAULT 21,
    estimated_revenue_gain NUMERIC(10, 2) NOT NULL DEFAULT 31500.0,
    status TEXT NOT NULL DEFAULT 'RECOMMENDED',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Audit Logs
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES public.profiles(id),
    actor_name TEXT NOT NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    payload JSONB,
    ip_address TEXT DEFAULT '127.0.0.1',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. Automatic Supabase Auth User ➔ Profile Creation Trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
    assigned_role user_role := 'FARMER';
    derived_phone text;
BEGIN
    -- Safe role resolution without enum casting exceptions
    IF new.raw_user_meta_data->>'role' IN ('FARMER', 'OPERATOR', 'CHC_MANAGER', 'FLEET_MANAGER', 'ADMIN') THEN
        assigned_role := (new.raw_user_meta_data->>'role')::user_role;
    END IF;

    -- Safe phone resolution avoiding null/empty collisions
    derived_phone := COALESCE(
        NULLIF(new.phone, ''),
        NULLIF(new.raw_user_meta_data->>'phone_number', ''),
        '+91' || floor(random() * 8999999999 + 1000000000)::text
    );

    INSERT INTO public.profiles (
        id,
        auth_user_id,
        full_name,
        phone_number,
        email,
        role
    )
    VALUES (
        gen_random_uuid(),
        new.id,
        COALESCE(NULLIF(new.raw_user_meta_data->>'full_name', ''), split_part(new.email, '@', 1), 'Yukti User'),
        derived_phone,
        new.email,
        assigned_role
    )
    ON CONFLICT (auth_user_id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        email = COALESCE(EXCLUDED.email, public.profiles.email),
        updated_at = NOW();

    RETURN new;
EXCEPTION
    WHEN OTHERS THEN
        -- Prevents 500 "Database error saving new user" if an edge constraint triggers
        RAISE WARNING 'handle_new_user encountered non-fatal error: %', SQLERRM;
        RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 15. Enable Row Level Security (RLS) & Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.machines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chcs ENABLE ROW LEVEL SECURITY;

-- Public Read Policies (Allow browsing machinery & CHCs)
CREATE POLICY "Allow public read access to machines" ON public.machines FOR SELECT USING (true);
CREATE POLICY "Allow public read access to CHCs" ON public.chcs FOR SELECT USING (true);
CREATE POLICY "Allow public read access to forecasts" ON public.demand_forecasts FOR SELECT USING (true);

-- User Isolation Policies
CREATE POLICY "Users view own profile" ON public.profiles FOR SELECT USING (auth.uid() = auth_user_id OR auth.uid() IS NULL);
CREATE POLICY "Farmers view own farms" ON public.farms FOR SELECT USING (auth.uid() = farmer_id OR auth.uid() IS NULL);
CREATE POLICY "Farmers view own bookings" ON public.bookings FOR SELECT USING (auth.uid() = farmer_id OR auth.uid() IS NULL);
CREATE POLICY "Farmers view own credit" ON public.credit_profiles FOR SELECT USING (auth.uid() = farmer_id OR auth.uid() IS NULL);
CREATE POLICY "Farmers view own invoices" ON public.invoices FOR SELECT USING (auth.uid() = farmer_id OR auth.uid() IS NULL);
