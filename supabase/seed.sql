-- ============================================================================
-- KISANOPS - COMPLETE INITIAL SEED DATA
-- Execute in Supabase SQL Editor after running schema.sql
-- ============================================================================

-- 1. Seed Profiles
INSERT INTO public.profiles (id, full_name, phone_number, email, role, district, village, avatar_url)
VALUES 
('11111111-1111-1111-1111-111111111111', 'Ramesh Kumar', '+91 98260 41234', 'ramesh.kumar@kisanops.in', 'FARMER', 'Sehore', 'Bilkisganj', 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&q=80&w=200'),
('22222222-2222-2222-2222-222222222222', 'Rajesh Singh', '+91 98930 77122', 'rajesh.singh@kisanops.in', 'CHC_MANAGER', 'Sehore', 'Sehore City', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'),
('33333333-3333-3333-3333-333333333333', 'Raju Verma', '+91 97550 12399', 'raju.verma@kisanops.in', 'OPERATOR', 'Sehore', 'Bilkisganj', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200'),
('44444444-4444-4444-4444-444444444444', 'Vikram Patel', '+91 94250 88311', 'admin@kisanops.in', 'ADMIN', 'Bhopal', 'Arera Colony', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200')
ON CONFLICT (id) DO NOTHING;

-- 2. Seed Custom Hiring Centres (CHCs)
INSERT INTO public.chcs (id, name, code, manager_id, village, district, state, latitude, longitude, contact_phone, contact_email, total_machines, active_machines)
VALUES 
('c1111111-1111-1111-1111-111111111111', 'Sehore Agri Centre #01', 'CHC-MP-SEH-01', '22222222-2222-2222-2222-222222222222', 'Bilkisganj Road', 'Sehore', 'Madhya Pradesh', 23.2032, 77.0844, '+91 98930 77122', 'sehore01@kisanops.in', 14, 11),
('c2222222-2222-2222-2222-222222222222', 'GreenFields CHC Hub', 'CHC-MP-BHP-03', '44444444-4444-4444-4444-444444444444', 'Phanda Kalan', 'Bhopal', 'Madhya Pradesh', 23.2394, 77.2655, '+91 98260 55144', 'greenfields.bhopal@kisanops.in', 22, 14),
('c3333333-3333-3333-3333-333333333333', 'Kisan Seva Kendra Raisen', 'CHC-MP-RSN-02', NULL, 'Salamadpur', 'Raisen', 'Madhya Pradesh', 23.3315, 77.7812, '+91 94250 11988', 'raisen02@kisanops.in', 10, 7)
ON CONFLICT (id) DO NOTHING;

-- 3. Seed Farm for Ramesh Kumar
INSERT INTO public.farms (id, farmer_id, farm_name, village, district, state, latitude, longitude, size_acres, irrigation_type, soil_type)
VALUES 
('f1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Ramesh Kumar Wheat Farm (Khasra 142/2)', 'Bilkisganj', 'Sehore', 'Madhya Pradesh', 23.1845, 77.0982, 8.0, 'Tube well + Canal', 'Deep Black Vertisol')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.farm_crops (id, farm_id, crop_name, season, crop_stage, expected_harvest_date)
VALUES 
('fc111111-1111-1111-1111-111111111111', 'f1111111-1111-1111-1111-111111111111', 'Wheat (Sharbati Gold)', 'Rabi', 'Pre-harvest', CURRENT_DATE + INTERVAL '10 days')
ON CONFLICT (id) DO NOTHING;

-- 4. Seed Machinery Fleet
INSERT INTO public.machines (id, chc_id, identifier, category, brand, model, power_hp, status, base_rate_per_hour, health_score, total_engine_hours, latitude, longitude, operator_name, operator_rating, rating, total_rentals)
VALUES 
('m1111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', 'JD-HARV-07', 'HARVESTER', 'John Deere', 'W70 Combine Harvester with Straw Walker', 100, 'AVAILABLE', 980.00, 94, 1243.8, 23.1950, 77.0910, 'Raju Verma', 4.9, 4.9, 142),
('m2222222-2222-2222-2222-222222222222', 'c1111111-1111-1111-1111-111111111111', 'MH-575-01', 'TRACTOR', 'Mahindra', '575 DI Sarpanch Plus 4WD', 47, 'AVAILABLE', 450.00, 91, 2180.5, 23.2045, 77.0850, 'Suresh Meena', 4.7, 4.8, 280),
('m3333333-3333-3333-3333-333333333333', 'c1111111-1111-1111-1111-111111111111', 'SW-744-02', 'TRACTOR', 'Swaraj', '744 FE Multi-Speed PTO', 48, 'AVAILABLE', 460.00, 88, 1890.0, 23.2010, 77.0810, 'Mukesh Lodhi', 4.8, 4.7, 195),
('m4444444-4444-4444-4444-444444444444', 'c2222222-2222-2222-2222-222222222222', 'SN-HARV-12', 'HARVESTER', 'Sonalika', 'Tiger Combine Harvester 4x4', 110, 'AVAILABLE', 950.00, 96, 610.2, 23.2410, 77.2680, 'Anil Malviya', 4.9, 4.9, 78)
ON CONFLICT (id) DO NOTHING;

-- 5. Seed AgriCredit Profile
INSERT INTO public.credit_profiles (id, farmer_id, credit_score, rating_category, credit_limit, utilized_credit, payment_history_score, rental_history_score, repayment_reliability_score)
VALUES 
('cp111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 742, 'Good', 8000.00, 0.00, 96, 92, 94)
ON CONFLICT (farmer_id) DO NOTHING;

-- 6. Seed Demand Forecasts
INSERT INTO public.demand_forecasts (district, crop_name, crop_stage, machine_category, demand_level, demand_index, expected_demand_units, available_units, shortage_units, confidence_score, factors)
VALUES 
('Sehore', 'Wheat', 'Pre-harvest', 'HARVESTER', 'VERY_HIGH', 88, 5, 3, 2, 0.96, '{"crop_stage": "+25 (Maturity window in 4 days)", "historical_trend": "+20 (Historical harvest peak)", "current_reservations": "+15 (3 pre-bookings)", "weather": "+10 (Dry window for next 6 days)"}'::jsonb),
('Bhopal', 'Wheat', 'Mid-Growth', 'HARVESTER', 'LOW', 42, 2, 6, 0, 0.92, '{"crop_stage": "+10 (Early crop development)", "historical_trend": "+15 (Moderate)", "current_reservations": "+5 (Low demand)"}'::jsonb);
