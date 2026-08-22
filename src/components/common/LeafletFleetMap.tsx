import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Polygon } from 'react-leaflet';
import L from 'leaflet';
import { CHC, Farm, Machine, TelemetryPoint } from '../../types';
import { SEHORE_DEMO_ROUTE } from '../../lib/telematicsEngine';

// Custom icons using HTML strings for crisp SVG rendering in Leaflet
const createCustomIcon = (color: string, iconSymbol: string, size = 32) => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        background-color: ${color};
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 14px;
        border: 2px solid white;
        box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3);
      ">
        ${iconSymbol}
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
};

const chcIcon = createCustomIcon('#1B4D3E', '🏢', 34); // Forest Green CHC Hub
const farmIcon = createCustomIcon('#10B981', '🌾', 32); // Farm Emerald
const activeMachineIcon = createCustomIcon('#0284C7', '🚜', 36); // Dispatched / Active Blue
const availableMachineIcon = createCustomIcon('#059669', '🚜', 30); // Available Green
const maintenanceIcon = createCustomIcon('#E11D48', '⚠️', 32); // Maintenance Red

interface LeafletFleetMapProps {
  chcs?: CHC[];
  farm?: Farm;
  machines?: Machine[];
  activeTelemetry?: Record<string, TelemetryPoint>;
  selectedMachineId?: string;
  height?: string;
  showRoute?: boolean;
  center?: [number, number];
  zoom?: number;
}

export const LeafletFleetMap: React.FC<LeafletFleetMapProps> = ({
  chcs = [],
  farm,
  machines = [],
  activeTelemetry = {},
  selectedMachineId,
  height = '460px',
  showRoute = true,
  center = [23.185, 77.105], // Sehore region midpoint
  zoom = 12,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div style={{ height }} className="w-full bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
        Loading GIS Map Engine...
      </div>
    );
  }

  const routePositions: [number, number][] = SEHORE_DEMO_ROUTE.map(w => [w.latitude, w.longitude]);

  return (
    <div style={{ height }} className="w-full rounded-2xl overflow-hidden border border-slate-200 shadow-subtle relative z-0">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Dispatch Route Polyline */}
        {showRoute && (
          <Polyline
            positions={routePositions}
            pathOptions={{
              color: '#0284C7',
              weight: 4,
              dashArray: '8, 8',
              opacity: 0.8,
            }}
          />
        )}

        {/* Farm Boundary Polygon */}
        {farm && farm.boundaryPolygon && (
          <Polygon
            positions={farm.boundaryPolygon}
            pathOptions={{
              color: '#10B981',
              fillColor: '#10B981',
              fillOpacity: 0.2,
              weight: 2,
            }}
          />
        )}

        {/* Farmer's Location */}
        {farm && (
          <Marker position={[farm.latitude, farm.longitude]} icon={farmIcon}>
            <Popup>
              <div className="text-xs p-1">
                <div className="font-bold text-slate-900">{farm.farmName}</div>
                <div className="text-slate-600">{farm.sizeAcres} Acres • {farm.crop.cropName}</div>
                <div className="text-slate-500">{farm.village}, {farm.district}</div>
                <div className="mt-1 font-semibold text-emerald-700">Harvesting Activity Required</div>
              </div>
            </Popup>
          </Marker>
        )}

        {/* CHC Hubs */}
        {chcs.map(chc => (
          <Marker key={chc.id} position={[chc.latitude, chc.longitude]} icon={chcIcon}>
            <Popup>
              <div className="text-xs p-1">
                <div className="font-bold text-agri-900">{chc.name}</div>
                <div className="text-slate-600">Hub Code: {chc.code}</div>
                <div className="text-slate-500">Fleet: {chc.activeMachines}/{chc.totalMachines} Active</div>
                <div className="text-slate-500">Contact: {chc.contactPhone}</div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Machinery Markers */}
        {machines.map(machine => {
          // Check if dynamic telemetry is streaming for this machine
          const telemetry = activeTelemetry[machine.id];
          const lat = telemetry ? telemetry.latitude : machine.latitude;
          const lng = telemetry ? telemetry.longitude : machine.longitude;

          let icon = availableMachineIcon;
          if (machine.status === 'MAINTENANCE') icon = maintenanceIcon;
          else if (machine.status === 'ACTIVE' || machine.status === 'DISPATCHED' || machine.id === selectedMachineId) {
            icon = activeMachineIcon;
          }

          return (
            <Marker key={machine.id} position={[lat, lng]} icon={icon}>
              <Popup>
                <div className="text-xs p-1 max-w-[200px]">
                  <div className="font-bold text-slate-900">{machine.brand} {machine.model}</div>
                  <div className="text-slate-500 font-mono">{machine.identifier} ({machine.category})</div>
                  <div className="mt-1 flex items-center justify-between text-slate-700">
                    <span>Rate:</span>
                    <span className="font-bold text-agri-800">₹{machine.baseRatePerHour}/hr</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-700">
                    <span>Health Score:</span>
                    <span className="font-semibold text-emerald-600">{machine.healthScore}%</span>
                  </div>
                  {telemetry && (
                    <div className="mt-1.5 pt-1.5 border-t border-slate-200 text-[10px] text-slate-600 space-y-0.5">
                      <div className="font-bold text-sky-700">Live CAN-Bus:</div>
                      <div>Speed: {telemetry.speedKmh} km/h • Fuel: {telemetry.fuelLevelPercent}%</div>
                      <div>Burn Rate: {telemetry.fuelConsumptionRateLph} L/h • {telemetry.engineTemperatureC}°C</div>
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Map Legend Overlay */}
      <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md rounded-xl p-2.5 shadow-card border border-slate-200/80 text-[11px] text-slate-700 space-y-1 z-[1000] pointer-events-auto">
        <div className="font-bold text-slate-800 text-xs mb-1">Map Legend</div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-agri-800 inline-block"></span>
          <span>CHC Hub</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
          <span>Farmer Field</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-sky-600 inline-block"></span>
          <span>Live Moving Machinery</span>
        </div>
      </div>
    </div>
  );
};
