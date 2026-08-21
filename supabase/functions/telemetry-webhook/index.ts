// ============================================================================
// KISANOPS / YUKTI - HARDWARE TELEMETRY INGESTION EDGE FUNCTION (Deno/Supabase)
// Deploy with: supabase functions deploy telemetry-webhook --no-verify-jwt
// ============================================================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // 1. Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    const payload = await req.json();

    const {
      machineId,
      latitude,
      longitude,
      speedKmh = 0,
      fuelLevelPercent,
      fuelBurnRateLph = 7.2,
      engineHours = 0,
      engineTemperatureC = 85,
      rpm = 1900,
      batteryVoltage = 13.6,
      status = 'ACTIVE',
    } = payload;

    if (!machineId || latitude === undefined || longitude === undefined) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing machineId, latitude, or longitude' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const timestamp = new Date().toISOString();

    // 2. Insert telemetry point into machine_telemetry table
    const { error: insertError } = await supabase.from('machine_telemetry').insert({
      machine_id: machineId,
      timestamp,
      latitude,
      longitude,
      speed_kmh: speedKmh,
      fuel_level_percent: fuelLevelPercent,
      fuel_consumption_rate_lph: fuelBurnRateLph,
      engine_hours: engineHours,
      engine_temperature_c: engineTemperatureC,
      rpm,
      battery_voltage: batteryVoltage,
      status,
    });

    if (insertError) {
      throw insertError;
    }

    // 3. Evaluate High-Priority Predictive Maintenance Anomaly
    const anomalyAlerts = [];
    const baselineFuelRate = 7.2;
    const fuelDeltaPercent = Math.round(((fuelBurnRateLph - baselineFuelRate) / baselineFuelRate) * 100);

    if (fuelDeltaPercent >= 15) {
      const { data: insertedAlert } = await supabase.from('maintenance_predictions').insert({
        machine_id: machineId,
        alert_type: 'FUEL_ANOMALY',
        severity: fuelDeltaPercent >= 25 ? 'CRITICAL' : 'HIGH',
        description: `CAN-Bus sensor detected fuel burn rate at ${fuelBurnRateLph} L/h (+${fuelDeltaPercent}% above ${baselineFuelRate} L/h baseline).`,
        recommended_action: 'Inspect fuel injection pressure nozzle and air particulate filter within 24 hours.',
        fuel_anomaly_delta_percent: fuelDeltaPercent,
        urgency_hours: 24,
        is_resolved: false,
        created_at: timestamp,
      }).select();

      if (insertedAlert) anomalyAlerts.push(insertedAlert);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Telemetry point ingested successfully',
        timestamp,
        anomalyCount: anomalyAlerts.length,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err.message || 'Server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
