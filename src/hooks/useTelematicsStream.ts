import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';

interface TelematicsState {
  lat: number;
  lng: number;
  speed: number;
  fuelLevel: number;
  engineTemp: number;
  engineHours: number;
}

export function useTelematicsStream(machineId: string, bookingId?: string) {
  const [isEngineOn, setIsEngineOn] = useState(false);
  const [telematics, setTelematics] = useState<TelematicsState>({
    lat: 23.2599, // Bhopal approx
    lng: 77.4126,
    speed: 0,
    fuelLevel: 85.0,
    engineTemp: 60.0,
    engineHours: 1200.5,
  });

  const timerRef = useRef<number | null>(null);

  const pushToSupabase = useCallback(async (data: TelematicsState) => {
    try {
      await supabase.from('machine_telemetry').insert({
        machine_id: machineId,
        booking_id: bookingId,
        latitude: data.lat,
        longitude: data.lng,
        speed: data.speed,
        fuel_level: data.fuelLevel,
        engine_temp: data.engineTemp,
        recorded_at: new Date().toISOString()
      });
    } catch (e) {
      console.error('Failed to push telematics', e);
    }
  }, [machineId, bookingId]);

  useEffect(() => {
    if (isEngineOn) {
      timerRef.current = window.setInterval(() => {
        setTelematics(prev => {
          const nextState = {
            lat: prev.lat + (Math.random() * 0.0001 - 0.00005),
            lng: prev.lng + (Math.random() * 0.0001 - 0.00005),
            speed: Math.max(5, Math.min(25, prev.speed + (Math.random() * 4 - 2))),
            fuelLevel: Math.max(0, prev.fuelLevel - 0.05),
            engineTemp: Math.min(110, Math.max(80, prev.engineTemp + (Math.random() * 2 - 0.5))),
            engineHours: prev.engineHours + (5 / 3600), // 5 seconds in hours
          };
          pushToSupabase(nextState);
          return nextState;
        });
      }, 5000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setTelematics(prev => ({
        ...prev,
        speed: 0,
        engineTemp: Math.max(60, prev.engineTemp - 2)
      }));
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isEngineOn, pushToSupabase]);

  return { isEngineOn, setIsEngineOn, telematics };
}
