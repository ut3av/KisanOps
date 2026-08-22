-- ============================================================================
-- KISANOPS - PRODUCTION GEOSPATIAL POSTGIS AVAILABILITY & REALTIME ENGINE
-- Migration: 20260823000000_realtime_geospatial_availability.sql
-- ============================================================================

-- 1. Enable PostGIS Extension
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;

-- 2. Add Location Source and Status Enums if not existing
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'location_source_type') THEN
        CREATE TYPE location_source_type AS ENUM ('gps_tracker', 'operator_app', 'chc_manual', 'last_known', 'map_pin', 'admin_verified');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'location_freshness_status') THEN
        CREATE TYPE location_freshness_status AS ENUM ('LIVE', 'RECENT', 'STALE');
    END IF;
END $$;

-- 3. Extend Machines Table with Geospatial Geography Columns
ALTER TABLE public.machines 
ADD COLUMN IF NOT EXISTS location geography(Point, 4326),
ADD COLUMN IF NOT EXISTS location_source location_source_type DEFAULT 'last_known',
ADD COLUMN IF NOT EXISTS location_accuracy DOUBLE PRECISION DEFAULT 5.0,
ADD COLUMN IF NOT EXISTS location_updated_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS current_latitude DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS current_longitude DOUBLE PRECISION;

-- 4. Extend Farms Table with Geospatial Geography Columns
ALTER TABLE public.farms
ADD COLUMN IF NOT EXISTS location geography(Point, 4326),
ADD COLUMN IF NOT EXISTS location_source location_source_type DEFAULT 'map_pin',
ADD COLUMN IF NOT EXISTS location_accuracy DOUBLE PRECISION DEFAULT 10.0,
ADD COLUMN IF NOT EXISTS location_updated_at TIMESTAMPTZ DEFAULT NOW();

-- 5. Extend CHCs Table with Geospatial Geography Columns
ALTER TABLE public.chcs
ADD COLUMN IF NOT EXISTS location geography(Point, 4326),
ADD COLUMN IF NOT EXISTS location_updated_at TIMESTAMPTZ DEFAULT NOW();

-- 6. Trigger to automatically sync geography(Point, 4326) from latitude/longitude
CREATE OR REPLACE FUNCTION public.sync_entity_location_point()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.latitude IS NOT NULL AND NEW.longitude IS NOT NULL THEN
        NEW.location := ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326)::geography;
        NEW.location_updated_at := NOW();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply Triggers
DROP TRIGGER IF EXISTS trg_sync_machine_location ON public.machines;
CREATE TRIGGER trg_sync_machine_location
BEFORE INSERT OR UPDATE OF latitude, longitude ON public.machines
FOR EACH ROW EXECUTE FUNCTION public.sync_entity_location_point();

DROP TRIGGER IF EXISTS trg_sync_farm_location ON public.farms;
CREATE TRIGGER trg_sync_farm_location
BEFORE INSERT OR UPDATE OF latitude, longitude ON public.farms
FOR EACH ROW EXECUTE FUNCTION public.sync_entity_location_point();

DROP TRIGGER IF EXISTS trg_sync_chc_location ON public.chcs;
CREATE TRIGGER trg_sync_chc_location
BEFORE INSERT OR UPDATE OF latitude, longitude ON public.chcs
FOR EACH ROW EXECUTE FUNCTION public.sync_entity_location_point();

-- 7. High-Performance GIST Spatial Indexes
CREATE INDEX IF NOT EXISTS idx_machines_location_gist ON public.machines USING GIST (location);
CREATE INDEX IF NOT EXISTS idx_farms_location_gist ON public.farms USING GIST (location);
CREATE INDEX IF NOT EXISTS idx_chcs_location_gist ON public.chcs USING GIST (location);

-- Additional indexes for fast availability filtering
CREATE INDEX IF NOT EXISTS idx_machines_status_category ON public.machines(status, category);
CREATE INDEX IF NOT EXISTS idx_bookings_machine_window ON public.bookings(machine_id, status, start_time, end_time);
CREATE INDEX IF NOT EXISTS idx_maintenance_machine_window ON public.maintenance_records(machine_id, status, scheduled_start, scheduled_end);

-- 8. PostGIS RPC: Real-Time Nearby Available Machines Search
-- Calculates exact geofenced distance, evaluates operational state, active booking conflicts, and maintenance windows.
CREATE OR REPLACE FUNCTION public.get_nearby_available_machines(
    p_farmer_lat DOUBLE PRECISION,
    p_farmer_lon DOUBLE PRECISION,
    p_radius_km DOUBLE PRECISION DEFAULT 25.0,
    p_start_time TIMESTAMPTZ DEFAULT NULL,
    p_end_time TIMESTAMPTZ DEFAULT NULL,
    p_category TEXT DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    chc_id UUID,
    chc_name TEXT,
    identifier TEXT,
    category machine_category,
    brand TEXT,
    model TEXT,
    year_of_manufacture INT,
    power_hp INT,
    fuel_type TEXT,
    status machine_status,
    base_rate_per_hour NUMERIC(10, 2),
    base_rate_per_acre NUMERIC(10, 2),
    health_score INT,
    rating NUMERIC(3, 2),
    total_rentals INT,
    image_url TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    distance_km DOUBLE PRECISION,
    location_source location_source_type,
    location_updated_at TIMESTAMPTZ,
    location_freshness TEXT,
    is_bookable BOOLEAN,
    unavailability_reason TEXT
) AS $$
DECLARE
    v_farmer_geom geography;
    v_radius_meters DOUBLE PRECISION;
    v_start TIMESTAMPTZ;
    v_end TIMESTAMPTZ;
BEGIN
    v_farmer_geom := ST_SetSRID(ST_MakePoint(p_farmer_lon, p_farmer_lat), 4326)::geography;
    v_radius_meters := p_radius_km * 1000.0;
    v_start := COALESCE(p_start_time, NOW());
    v_end := COALESCE(p_end_time, v_start + INTERVAL '6 hours');

    RETURN QUERY
    WITH candidate_machines AS (
        SELECT 
            m.id,
            m.chc_id,
            c.name AS chc_name,
            m.identifier,
            m.category,
            m.brand,
            m.model,
            m.year_of_manufacture,
            m.power_hp,
            m.fuel_type,
            m.status,
            m.base_rate_per_hour,
            m.base_rate_per_acre,
            m.health_score,
            m.rating,
            m.total_rentals,
            m.image_url,
            COALESCE(m.current_latitude, m.latitude, c.latitude) AS latitude,
            COALESCE(m.current_longitude, m.longitude, c.longitude) AS longitude,
            (ST_Distance(
                COALESCE(m.location, c.location, ST_SetSRID(ST_MakePoint(c.longitude, c.latitude), 4326)::geography),
                v_farmer_geom
            ) / 1000.0) AS distance_km,
            COALESCE(m.location_source, 'last_known'::location_source_type) AS location_source,
            COALESCE(m.location_updated_at, m.updated_at) AS location_updated_at
        FROM public.machines m
        JOIN public.chcs c ON m.chc_id = c.id
        WHERE m.is_active = TRUE
          AND (p_category IS NULL OR p_category = 'ALL' OR m.category::TEXT = p_category)
          AND ST_DWithin(
              COALESCE(m.location, c.location, ST_SetSRID(ST_MakePoint(c.longitude, c.latitude), 4326)::geography),
              v_farmer_geom,
              v_radius_meters
          )
    )
    SELECT 
        cm.id,
        cm.chc_id,
        cm.chc_name,
        cm.identifier,
        cm.category,
        cm.brand,
        cm.model,
        cm.year_of_manufacture,
        cm.power_hp,
        cm.fuel_type,
        cm.status,
        cm.base_rate_per_hour,
        cm.base_rate_per_acre,
        cm.health_score,
        cm.rating,
        cm.total_rentals,
        cm.image_url,
        cm.latitude,
        cm.longitude,
        ROUND(cm.distance_km::NUMERIC, 2)::DOUBLE PRECISION AS distance_km,
        cm.location_source,
        cm.location_updated_at,
        CASE 
            WHEN cm.location_updated_at >= NOW() - INTERVAL '5 minutes' THEN 'LIVE'
            WHEN cm.location_updated_at >= NOW() - INTERVAL '30 minutes' THEN 'RECENT'
            ELSE 'STALE'
        END AS location_freshness,
        (
            cm.status = 'AVAILABLE'
            AND NOT EXISTS (
                SELECT 1 FROM public.bookings b
                WHERE b.machine_id = cm.id
                  AND b.status IN ('CONFIRMED', 'DISPATCHED', 'IN_PROGRESS')
                  AND (
                      (b.start_time <= v_end AND b.end_time >= v_start)
                      OR (b.actual_start_time IS NOT NULL AND b.actual_end_time IS NULL)
                  )
            )
            AND NOT EXISTS (
                SELECT 1 FROM public.maintenance_records mr
                WHERE mr.machine_id = cm.id
                  AND mr.status = 'IN_PROGRESS'
            )
        ) AS is_bookable,
        CASE
            WHEN cm.status != 'AVAILABLE' THEN 'Machine status is ' || cm.status::TEXT
            WHEN EXISTS (
                SELECT 1 FROM public.bookings b
                WHERE b.machine_id = cm.id
                  AND b.status IN ('CONFIRMED', 'DISPATCHED', 'IN_PROGRESS')
                  AND (
                      (b.start_time <= v_end AND b.end_time >= v_start)
                      OR (b.actual_start_time IS NOT NULL AND b.actual_end_time IS NULL)
                  )
            ) THEN 'Already booked for the requested time window'
            WHEN EXISTS (
                SELECT 1 FROM public.maintenance_records mr
                WHERE mr.machine_id = cm.id
                  AND mr.status = 'IN_PROGRESS'
            ) THEN 'Under scheduled maintenance'
            ELSE NULL
        END AS unavailability_reason
    FROM candidate_machines cm
    ORDER BY is_bookable DESC, distance_km ASC;
END;
$$ LANGUAGE plpgsql STABLE;

-- 9. Atomic Booking & Reservation RPC (Race-condition protection)
CREATE OR REPLACE FUNCTION public.create_verified_booking(
    p_farmer_id UUID,
    p_farm_id UUID,
    p_machine_id UUID,
    p_activity activity_type,
    p_start_time TIMESTAMPTZ,
    p_end_time TIMESTAMPTZ,
    p_booked_hours NUMERIC(10, 2),
    p_estimated_total NUMERIC(10, 2),
    p_payment_method payment_method,
    p_payment_status payment_status DEFAULT 'PENDING'
)
RETURNS JSONB AS $$
DECLARE
    v_machine RECORD;
    v_conflict_count INT;
    v_booking_id UUID;
BEGIN
    -- 1. Lock the machine row for update to prevent concurrent double-bookings
    SELECT * INTO v_machine 
    FROM public.machines 
    WHERE id = p_machine_id AND is_active = TRUE 
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object(
            'success', FALSE,
            'error_code', 'MACHINE_NOT_FOUND',
            'message', 'Machine not found or is currently inactive.'
        );
    END IF;

    IF v_machine.status != 'AVAILABLE' THEN
        RETURN jsonb_build_object(
            'success', FALSE,
            'error_code', 'MACHINE_UNAVAILABLE',
            'message', 'Machine is not available (Current status: ' || v_machine.status::TEXT || ').'
        );
    END IF;

    -- 2. Check for overlapping bookings
    SELECT COUNT(*) INTO v_conflict_count
    FROM public.bookings
    WHERE machine_id = p_machine_id
      AND status IN ('CONFIRMED', 'DISPATCHED', 'IN_PROGRESS')
      AND (start_time < p_end_time AND end_time > p_start_time);

    IF v_conflict_count > 0 THEN
        RETURN jsonb_build_object(
            'success', FALSE,
            'error_code', 'BOOKING_CONFLICT',
            'message', 'यह मशीन अभी किसी अन्य किसान द्वारा बुक कर ली गई है।'
        );
    END IF;

    -- 3. Create the booking atomically
    INSERT INTO public.bookings (
        farmer_id,
        farm_id,
        machine_id,
        activity,
        status,
        start_time,
        end_time,
        booked_hours,
        estimated_total,
        payment_method,
        payment_status
    ) VALUES (
        p_farmer_id,
        p_farm_id,
        p_machine_id,
        p_activity,
        'CONFIRMED',
        p_start_time,
        p_end_time,
        p_booked_hours,
        p_estimated_total,
        p_payment_method,
        p_payment_status
    ) RETURNING id INTO v_booking_id;

    RETURN jsonb_build_object(
        'success', TRUE,
        'booking_id', v_booking_id,
        'message', 'Booking successfully verified and created.'
    );
END;
$$ LANGUAGE plpgsql;
