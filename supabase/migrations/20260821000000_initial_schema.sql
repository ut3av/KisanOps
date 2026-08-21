-- ============================================================================
-- KISANOPS - PRODUCTION POSTGRESQL & SUPABASE MIGRATION SCHEMA
-- ============================================================================

-- Enable UUID & PostGIS extension where available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enum Types
CREATE TYPE user_role AS ENUM ('FARMER', 'OPERATOR', 'CHC_MANAGER', 'FLEET_MANAGER', 'ADMIN');
CREATE TYPE machine_status AS ENUM ('AVAILABLE', 'RESERVED', 'DISPATCHED', 'ACTIVE', 'RETURNING', 'MAINTENANCE', 'OFFLINE');
CREATE TYPE booking_status AS ENUM ('REQUESTED', 'CONFIRMED', 'DISPATCHED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'DISPUTED');
CREATE TYPE payment_status AS ENUM ('INITIATED', 'PENDING', 'AUTHORIZED', 'CAPTURED', 'FAILED', 'REFUNDED', 'PARTIALLY_REFUNDED');
CREATE TYPE payment_method AS ENUM ('UPI', 'CARD', 'NET_BANKING', 'AGRICREDIT_DEFERRED', 'CASH');
CREATE TYPE activity_type AS ENUM ('SOIL_PREPARATION', 'SOWING', 'CULTIVATION', 'SPRAYING', 'IRRIGATION', 'HARVESTING', 'THRESHING', 'TRANSPORT');
CREATE TYPE machine_category AS ENUM ('TRACTOR', 'HARVESTER', 'ROTAVATOR', 'SEEDER', 'SPRAYER', 'THRESHER', 'TRAILER');

-- 1. Users & Profiles
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID UNIQUE,
    full_name TEXT NOT NULL,
    phone_number TEXT NOT NULL UNIQUE,
    email TEXT,
    role user_role NOT NULL DEFAULT 'FARMER',
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Custom Hiring Centres (CHCs)
CREATE TABLE IF NOT EXISTS chcs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    manager_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    village TEXT NOT NULL,
    district TEXT NOT NULL,
    state TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    contact_phone TEXT NOT NULL,
    contact_email TEXT,
    operating_radius_km DOUBLE PRECISION DEFAULT 35.0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Farms & Crops
CREATE TABLE IF NOT EXISTS farms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farmer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    farm_name TEXT NOT NULL,
    village TEXT NOT NULL,
    district TEXT NOT NULL,
    state TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    size_acres DOUBLE PRECISION NOT NULL,
    irrigation_type TEXT NOT NULL, -- Drip, Canal, Borewell, Rainfed
    soil_type TEXT,
    boundary_polygon JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS farm_crops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    crop_name TEXT NOT NULL, -- Wheat, Paddy, Soybean, Cotton, Maize, etc.
    season TEXT NOT NULL, -- Kharif, Rabi, Zaid
    sowing_date DATE,
    expected_harvest_date DATE,
    crop_stage TEXT NOT NULL, -- Pre-sowing, Sowing, Vegetative, Flowering, Maturity, Pre-harvest, Harvest-ready
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS farm_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    activity activity_type NOT NULL,
    status TEXT DEFAULT 'PENDING',
    target_start_date DATE NOT NULL,
    target_end_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Machinery & Fleet
CREATE TABLE IF NOT EXISTS machines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chc_id UUID NOT NULL REFERENCES chcs(id) ON DELETE CASCADE,
    identifier TEXT NOT NULL UNIQUE, -- e.g. MH-575-01, JD-HARV-07
    category machine_category NOT NULL,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    year_of_manufacture INT NOT NULL,
    power_hp INT NOT NULL,
    fuel_type TEXT DEFAULT 'DIESEL',
    status machine_status NOT NULL DEFAULT 'AVAILABLE',
    base_rate_per_hour NUMERIC(10, 2) NOT NULL,
    base_rate_per_acre NUMERIC(10, 2),
    health_score INT NOT NULL DEFAULT 95 CHECK (health_score BETWEEN 0 AND 100),
    total_engine_hours NUMERIC(10, 2) NOT NULL DEFAULT 0.0,
    service_interval_hours NUMERIC(10, 2) NOT NULL DEFAULT 250.0,
    hours_since_last_service NUMERIC(10, 2) NOT NULL DEFAULT 0.0,
    image_url TEXT,
    rating NUMERIC(3, 2) DEFAULT 4.8,
    total_rentals INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS machine_operators (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    chc_id UUID NOT NULL REFERENCES chcs(id) ON DELETE CASCADE,
    license_number TEXT NOT NULL,
    experience_years INT DEFAULT 5,
    rating NUMERIC(3, 2) DEFAULT 4.9,
    status TEXT DEFAULT 'AVAILABLE',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS machine_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    machine_id UUID NOT NULL REFERENCES machines(id) ON DELETE CASCADE,
    document_type TEXT NOT NULL, -- RC, Insurance, Fitness, Pollution, Warranty
    document_url TEXT NOT NULL,
    expiry_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Telematics & Live Stream
CREATE TABLE IF NOT EXISTS machine_locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    machine_id UUID NOT NULL REFERENCES machines(id) ON DELETE CASCADE,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    heading DOUBLE PRECISION DEFAULT 0.0,
    speed_kmh DOUBLE PRECISION DEFAULT 0.0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS machine_telemetry (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    machine_id UUID NOT NULL REFERENCES machines(id) ON DELETE CASCADE,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    speed_kmh DOUBLE PRECISION NOT NULL,
    fuel_level_percent DOUBLE PRECISION NOT NULL,
    fuel_consumption_rate_lph DOUBLE PRECISION NOT NULL,
    engine_hours DOUBLE PRECISION NOT NULL,
    engine_temperature_c DOUBLE PRECISION NOT NULL,
    rpm INT NOT NULL,
    battery_voltage DOUBLE PRECISION NOT NULL,
    status machine_status NOT NULL
);

CREATE INDEX idx_machine_telemetry_machine_time ON machine_telemetry(machine_id, timestamp DESC);

-- 6. Machine Health & Predictive Maintenance
CREATE TABLE IF NOT EXISTS machine_health (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    machine_id UUID NOT NULL REFERENCES machines(id) ON DELETE CASCADE UNIQUE,
    overall_health_score INT NOT NULL CHECK (overall_health_score BETWEEN 0 AND 100),
    engine_health INT NOT NULL CHECK (engine_health BETWEEN 0 AND 100),
    hydraulics_health INT NOT NULL CHECK (hydraulics_health BETWEEN 0 AND 100),
    fuel_system_health INT NOT NULL CHECK (fuel_system_health BETWEEN 0 AND 100),
    transmission_health INT NOT NULL CHECK (transmission_health BETWEEN 0 AND 100),
    last_evaluated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS maintenance_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    machine_id UUID NOT NULL REFERENCES machines(id) ON DELETE CASCADE,
    maintenance_type TEXT NOT NULL, -- Routine, Preventive, Corrective, Emergency
    description TEXT NOT NULL,
    cost NUMERIC(10, 2) NOT NULL,
    performed_by TEXT NOT NULL,
    engine_hours_at_service NUMERIC(10, 2) NOT NULL,
    completed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS maintenance_predictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    machine_id UUID NOT NULL REFERENCES machines(id) ON DELETE CASCADE,
    alert_type TEXT NOT NULL, -- FUEL_ANOMALY, SERVICE_OVERDUE, TEMP_SURGE, VIBRATION_SPIKE
    severity TEXT NOT NULL, -- LOW, MEDIUM, HIGH, CRITICAL
    description TEXT NOT NULL,
    recommended_action TEXT NOT NULL,
    urgency_hours INT NOT NULL DEFAULT 48,
    is_resolved BOOLEAN DEFAULT FALSE,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Pricing Rules & Quotes
CREATE TABLE IF NOT EXISTS pricing_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chc_id UUID REFERENCES chcs(id) ON DELETE CASCADE,
    category machine_category NOT NULL,
    base_rate NUMERIC(10, 2) NOT NULL,
    min_surge_multiplier NUMERIC(4, 2) NOT NULL DEFAULT 0.80,
    max_surge_multiplier NUMERIC(4, 2) NOT NULL DEFAULT 1.30,
    demand_surge_weight NUMERIC(4, 2) DEFAULT 0.15,
    distance_cost_per_km NUMERIC(10, 2) DEFAULT 15.0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS price_quotes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farmer_id UUID NOT NULL REFERENCES profiles(id),
    machine_id UUID NOT NULL REFERENCES machines(id),
    farm_id UUID NOT NULL REFERENCES farms(id),
    base_price NUMERIC(10, 2) NOT NULL,
    demand_adjustment NUMERIC(10, 2) NOT NULL DEFAULT 0.0,
    supply_adjustment NUMERIC(10, 2) NOT NULL DEFAULT 0.0,
    distance_adjustment NUMERIC(10, 2) NOT NULL DEFAULT 0.0,
    health_discount NUMERIC(10, 2) NOT NULL DEFAULT 0.0,
    urgency_adjustment NUMERIC(10, 2) NOT NULL DEFAULT 0.0,
    quoted_rate_per_hour NUMERIC(10, 2) NOT NULL,
    pricing_explanation JSONB NOT NULL,
    valid_until TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. AgriCredit System
CREATE TABLE IF NOT EXISTS credit_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farmer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
    credit_score INT NOT NULL DEFAULT 740 CHECK (credit_score BETWEEN 300 AND 900),
    rating_category TEXT NOT NULL DEFAULT 'Excellent', -- Excellent, Good, Fair, Poor
    credit_limit NUMERIC(10, 2) NOT NULL DEFAULT 8000.00,
    utilized_credit NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    available_credit NUMERIC(10, 2) GENERATED ALWAYS AS (credit_limit - utilized_credit) STORED,
    payment_history_score INT DEFAULT 95,
    rental_history_score INT DEFAULT 90,
    repayment_reliability_score INT DEFAULT 92,
    farm_activity_score INT DEFAULT 88,
    profile_stability_score INT DEFAULT 90,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS credit_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    credit_profile_id UUID NOT NULL REFERENCES credit_profiles(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL, -- REPAYMENT_ON_TIME, OVERDUE, LIMIT_ADJUSTMENT, RENTAL_DEFERRED
    amount NUMERIC(10, 2) NOT NULL,
    balance_after NUMERIC(10, 2) NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Bookings & Lifecycle Events
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_number TEXT NOT NULL UNIQUE,
    farmer_id UUID NOT NULL REFERENCES profiles(id),
    chc_id UUID NOT NULL REFERENCES chcs(id),
    machine_id UUID NOT NULL REFERENCES machines(id),
    farm_id UUID NOT NULL REFERENCES farms(id),
    operator_id UUID REFERENCES machine_operators(id),
    activity activity_type NOT NULL,
    status booking_status NOT NULL DEFAULT 'REQUESTED',
    booking_mode TEXT DEFAULT 'HOURLY', -- HOURLY, ACREAGE
    booked_hours NUMERIC(6, 2) NOT NULL DEFAULT 6.0,
    booked_acres NUMERIC(6, 2),
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    actual_start_time TIMESTAMPTZ,
    actual_end_time TIMESTAMPTZ,
    actual_hours NUMERIC(6, 2),
    hourly_rate NUMERIC(10, 2) NOT NULL,
    estimated_total NUMERIC(10, 2) NOT NULL,
    actual_total NUMERIC(10, 2),
    payment_method payment_method NOT NULL DEFAULT 'UPI',
    payment_status payment_status NOT NULL DEFAULT 'INITIATED',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS booking_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    status_from booking_status,
    status_to booking_status NOT NULL,
    notes TEXT,
    event_time TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Payments & Billing
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES bookings(id),
    payment_reference TEXT NOT NULL UNIQUE,
    provider TEXT NOT NULL DEFAULT 'RAZORPAY', -- RAZORPAY, CASHFREE, AGRICREDIT
    amount NUMERIC(10, 2) NOT NULL,
    currency TEXT DEFAULT 'INR',
    method payment_method NOT NULL,
    status payment_status NOT NULL DEFAULT 'PENDING',
    webhook_payload JSONB,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payment_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_id UUID NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number TEXT NOT NULL UNIQUE,
    booking_id UUID NOT NULL REFERENCES bookings(id) UNIQUE,
    farmer_id UUID NOT NULL REFERENCES profiles(id),
    chc_id UUID NOT NULL REFERENCES chcs(id),
    machine_id UUID NOT NULL REFERENCES machines(id),
    booked_hours NUMERIC(6, 2) NOT NULL,
    actual_hours NUMERIC(6, 2) NOT NULL,
    base_rate_per_hour NUMERIC(10, 2) NOT NULL,
    base_rental_amount NUMERIC(10, 2) NOT NULL,
    transport_charge NUMERIC(10, 2) NOT NULL DEFAULT 0.0,
    fuel_surcharge NUMERIC(10, 2) NOT NULL DEFAULT 0.0,
    platform_fee NUMERIC(10, 2) NOT NULL DEFAULT 100.0,
    discount_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.0,
    tax_gst_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.0,
    final_total_amount NUMERIC(10, 2) NOT NULL,
    payment_status payment_status NOT NULL DEFAULT 'CAPTURED',
    pdf_url TEXT,
    issued_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS invoice_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    quantity NUMERIC(10, 2) NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL,
    total_price NUMERIC(10, 2) NOT NULL
);

CREATE TABLE IF NOT EXISTS refunds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_id UUID NOT NULL REFERENCES payments(id),
    invoice_id UUID REFERENCES invoices(id),
    amount NUMERIC(10, 2) NOT NULL,
    reason TEXT NOT NULL,
    status TEXT DEFAULT 'PROCESSED',
    processed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Demand Forecasts & Fleet Allocations
CREATE TABLE IF NOT EXISTS demand_forecasts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    district TEXT NOT NULL,
    crop_name TEXT NOT NULL,
    crop_stage TEXT NOT NULL,
    machine_category machine_category NOT NULL,
    forecast_date DATE NOT NULL,
    demand_level TEXT NOT NULL, -- LOW, MEDIUM, HIGH, VERY_HIGH
    demand_index INT NOT NULL CHECK (demand_index BETWEEN 0 AND 100),
    expected_demand_units INT NOT NULL,
    available_units INT NOT NULL,
    shortage_units INT NOT NULL,
    confidence_score NUMERIC(3, 2) NOT NULL DEFAULT 0.92,
    factors JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS machine_allocations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_chc_id UUID NOT NULL REFERENCES chcs(id),
    target_chc_id UUID NOT NULL REFERENCES chcs(id),
    machine_id UUID NOT NULL REFERENCES machines(id),
    distance_km DOUBLE PRECISION NOT NULL,
    relocation_cost NUMERIC(10, 2) NOT NULL,
    expected_utilization_gain_percent INT NOT NULL,
    estimated_revenue_gain NUMERIC(10, 2) NOT NULL,
    status TEXT DEFAULT 'RECOMMENDED', -- RECOMMENDED, APPROVED, IN_TRANSIT, COMPLETED
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Feedback, Notifications & Audit Logs
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_id UUID NOT NULL REFERENCES profiles(id),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL, -- BOOKING, DISPATCH, TELEMATICS, MAINTENANCE, INVOICE, DEMAND
    link_url TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES bookings(id) UNIQUE,
    farmer_id UUID NOT NULL REFERENCES profiles(id),
    machine_id UUID NOT NULL REFERENCES machines(id),
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS disputes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES bookings(id),
    raised_by UUID NOT NULL REFERENCES profiles(id),
    issue_type TEXT NOT NULL, -- MACHINE_BREAKDOWN, BILLING_MISMATCH, DELAY, QUALITY
    description TEXT NOT NULL,
    status TEXT DEFAULT 'OPEN', -- OPEN, IN_REVIEW, RESOLVED, CLOSED
    resolution TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES profiles(id),
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    payload JSONB,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE farms ENABLE ROW LEVEL SECURITY;
ALTER TABLE farm_crops ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Sample Policies
CREATE POLICY "Farmers read their own profile" ON profiles FOR SELECT USING (auth.uid() = auth_user_id);
CREATE POLICY "Farmers manage own farms" ON farms FOR ALL USING (auth.uid() = farmer_id);
CREATE POLICY "Farmers read own bookings" ON bookings FOR SELECT USING (auth.uid() = farmer_id);
CREATE POLICY "Farmers read own credit" ON credit_profiles FOR SELECT USING (auth.uid() = farmer_id);
CREATE POLICY "Farmers read own invoices" ON invoices FOR SELECT USING (auth.uid() = farmer_id);
