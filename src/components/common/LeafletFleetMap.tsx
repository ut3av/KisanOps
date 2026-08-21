import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Polygon, LayersControl } from 'react-leaflet';
import L from 'leaflet';
import { CHC, Farm, Machine, TelemetryPoint } from '../../types';
import { SEHORE_DEMO_ROUTE } from '../../lib/telematicsEngine';
import { DopplerRadarPlayer } from './DopplerRadarPlayer';
import { Layers, Map as MapIcon, Globe, Sparkles, Navigation } from 'lucide-react';
import clsx from 'clsx';

// Crisp inline SVGs for professional map rendering (No emojis)
const SVG_ICONS = {
  chc: `
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/>
      <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/>
      <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/>
      <path d="M10 6h4"/>
      <path d="M10 10h4"/>
      <path d="M10 14h4"/>
      <path d="M10 18h4"/>
    </svg>
  `,
  farm: `
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M2 22h20"/>
      <path d="M12 2v20"/>
      <path d="m4.93 10.93 4.24-4.24"/>
      <path d="m14.83 6.69 4.24 4.24"/>
      <path d="M14 18a2 2 0 0 0 2-2V9.83"/>
      <path d="M8 9.83V16a2 2 0 0 0 2 2"/>
    </svg>
  `,
  tractor: `
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <path d="m10 11 11 .9a1 1 0 0 1 .8 1.1l-.665 4.158a1 1 0 0 1-.988.842H20"/>
      <path d="M16 18h-5"/>
      <path d="M6 18a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
      <path d="M18 18a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
      <path d="M3 15h1"/>
      <path d="M6 12V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v6"/>
    </svg>
  `,
  alert: `
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
      <path d="M12 9v4"/>
      <path d="M12 17h.01"/>
    </svg>
  `,
};

const createProfessionalIcon = (bgColor: string, svgContent: string, size = 36, isPulsing = false) => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        position: relative;
        background: ${bgColor};
        width: ${size}px;
        height: ${size}px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        border: 2px solid #ffffff;
        box-shadow: 0 4px 12px rgba(0,0,0,0.25);
        transition: transform 0.2s ease;
      ">
        ${isPulsing ? `
          <div style="
            position: absolute;
            inset: -4px;
            border-radius: 16px;
            border: 2px solid ${bgColor};
            opacity: 0.75;
            animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
          "></div>
        ` : ''}
        ${svgContent}
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
};

const chcIcon = createProfessionalIcon('linear-gradient(135deg, #1B4D3E 0%, #0F291E 100%)', SVG_ICONS.chc, 36);
const farmIcon = createProfessionalIcon('linear-gradient(135deg, #059669 0%, #047857 100%)', SVG_ICONS.farm, 34);
const activeMachineIcon = createProfessionalIcon('linear-gradient(135deg, #0284C7 0%, #0369A1 100%)', SVG_ICONS.tractor, 38, true);
const availableMachineIcon = createProfessionalIcon('linear-gradient(135deg, #10B981 0%, #059669 100%)', SVG_ICONS.tractor, 32);
const maintenanceIcon = createProfessionalIcon('linear-gradient(135deg, #E11D48 0%, #BE123C 100%)', SVG_ICONS.alert, 34, true);

export type MapBaseLayerType = 'STREET' | 'SATELLITE' | 'TERRAIN';

const MAP_LAYERS: Record<MapBaseLayerType, { name: string; url: string; attribution: string; maxZoom: number }> = {
  STREET: {
    name: 'Carto Voyager (Clean Vector)',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>, &copy; OSM',
    maxZoom: 19,
  },
  SATELLITE: {
    name: 'Esri World Imagery (High-Res Agro Satellite)',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS',
    maxZoom: 18,
  },
  TERRAIN: {
    name: 'OpenStreetMap Standard',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 19,
  },
};

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
  height = '480px',
  showRoute = true,
  center = [23.185, 77.105], // Sehore region midpoint
  zoom = 12,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [baseLayer, setBaseLayer] = useState<MapBaseLayerType>('STREET');
  const [radarTileUrl, setRadarTileUrl] = useState<string | null>(null);
  const [radarVisible, setRadarVisible] = useState<boolean>(false);
  const [showLayerMenu, setShowLayerMenu] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div style={{ height }} className="w-full bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 font-medium text-xs">
        Initializing High-Resolution GIS Map Engine...
      </div>
    );
  }

  const routePositions: [number, number][] = SEHORE_DEMO_ROUTE.map(w => [w.latitude, w.longitude]);
  const activeLayerConfig = MAP_LAYERS[baseLayer];

  return (
    <div style={{ height }} className="w-full rounded-2xl overflow-hidden border border-slate-200 shadow-elevated relative z-0">
      {/* Top Floating Controls Bar */}
      <div className="absolute top-3 right-3 z-[1000] flex items-center gap-2 pointer-events-auto">
        {/* Layer Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowLayerMenu(!showLayerMenu)}
            className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl shadow-elevated px-3 py-2 flex items-center gap-2 text-xs font-bold text-slate-800 hover:bg-slate-50 transition-all"
          >
            <Layers className="w-3.5 h-3.5 text-agri-800" />
            <span>{baseLayer === 'SATELLITE' ? 'Satellite View' : baseLayer === 'STREET' ? 'Clean Vector' : 'OSM Map'}</span>
          </button>

          {showLayerMenu && (
            <div className="absolute right-0 mt-1.5 w-52 bg-white rounded-2xl border border-slate-200 shadow-2xl p-1.5 z-[1010] space-y-1">
              <button
                onClick={() => { setBaseLayer('STREET'); setShowLayerMenu(false); }}
                className={clsx(
                  'w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all',
                  baseLayer === 'STREET' ? 'bg-agri-50 text-agri-950' : 'text-slate-600 hover:bg-slate-100'
                )}
              >
                <MapIcon className="w-3.5 h-3.5 text-agri-700" />
                <span>Clean Vector Map</span>
              </button>

              <button
                onClick={() => { setBaseLayer('SATELLITE'); setShowLayerMenu(false); }}
                className={clsx(
                  'w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all',
                  baseLayer === 'SATELLITE' ? 'bg-agri-50 text-agri-950' : 'text-slate-600 hover:bg-slate-100'
                )}
              >
                <Globe className="w-3.5 h-3.5 text-sky-600" />
                <span>Agro Satellite Imagery</span>
              </button>

              <button
                onClick={() => { setBaseLayer('TERRAIN'); setShowLayerMenu(false); }}
                className={clsx(
                  'w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all',
                  baseLayer === 'TERRAIN' ? 'bg-agri-50 text-agri-950' : 'text-slate-600 hover:bg-slate-100'
                )}
              >
                <Layers className="w-3.5 h-3.5 text-emerald-600" />
                <span>OpenStreetMap Standard</span>
              </button>
            </div>
          )}
        </div>

        {/* Doppler Radar Timeline Player */}
        <DopplerRadarPlayer
          radarVisible={radarVisible}
          onToggleRadar={setRadarVisible}
          onFrameChange={setRadarTileUrl}
        />
      </div>

      <MapContainer
        center={center}
        zoom={zoom}
        maxZoom={18}
        minZoom={6}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        {/* Selected Base Tile Layer */}
        <TileLayer
          key={baseLayer}
          url={activeLayerConfig.url}
          attribution={activeLayerConfig.attribution}
          maxZoom={activeLayerConfig.maxZoom}
        />

        {/* Live RainViewer Doppler Radar Layer with smooth local upscaling (Native Zoom 6 prevents RainViewer server error tiles) */}
        {radarTileUrl && (
          <TileLayer
            key={radarTileUrl}
            url={radarTileUrl}
            opacity={0.65}
            zIndex={400}
            minNativeZoom={1}
            maxNativeZoom={6}
            maxZoom={18}
          />
        )}

        {/* Dispatch Route Polyline along SH-18 */}
        {showRoute && (
          <Polyline
            positions={routePositions}
            pathOptions={{
              color: '#0284c7',
              weight: 4,
              opacity: 0.85,
              dashArray: '8, 8',
            }}
          />
        )}

        {/* Farmer Land Parcel Polygon */}
        {farm && farm.boundaryPolygon && farm.boundaryPolygon.length > 0 && (
          <Polygon
            positions={farm.boundaryPolygon}
            pathOptions={{
              color: '#10b981',
              fillColor: '#10b981',
              fillOpacity: 0.25,
              weight: 2.5,
            }}
          >
            <Popup>
              <div className="text-xs p-1 max-w-[200px]">
                <div className="font-bold text-slate-900">{farm.farmName}</div>
                <div className="text-slate-500">{farm.sizeAcres} Acres • {farm.crop.cropName}</div>
                <div className="text-[10px] text-emerald-700 font-semibold mt-1">Stage: {farm.crop.cropStage}</div>
              </div>
            </Popup>
          </Polygon>
        )}

        {/* Farm Location Marker */}
        {farm && (
          <Marker position={[farm.latitude, farm.longitude]} icon={farmIcon}>
            <Popup>
              <div className="text-xs p-1 max-w-[220px]">
                <div className="font-bold text-slate-900">{farm.farmName}</div>
                <div className="text-slate-600 font-medium mt-0.5">{farm.village}, {farm.district}</div>
                <div className="mt-1.5 pt-1.5 border-t border-slate-200 text-[11px] text-slate-700">
                  <div><strong>Acreage:</strong> {farm.sizeAcres} Acres</div>
                  <div><strong>Crop:</strong> {farm.crop.cropName}</div>
                  <div><strong>Irrigation:</strong> {farm.irrigationType}</div>
                </div>
              </div>
            </Popup>
          </Marker>
        )}

        {/* CHC Hub Markers */}
        {chcs.map(chc => (
          <Marker key={chc.id} position={[chc.latitude, chc.longitude]} icon={chcIcon}>
            <Popup>
              <div className="text-xs p-1 max-w-[220px]">
                <div className="font-bold text-agri-950 text-sm">{chc.name}</div>
                <div className="text-slate-500 font-mono text-[10px]">{chc.code}</div>
                <div className="mt-1.5 pt-1.5 border-t border-slate-200 text-slate-700 space-y-0.5">
                  <div><strong>Location:</strong> {chc.village}, {chc.district}</div>
                  <div><strong>Fleet:</strong> {chc.activeMachines} / {chc.totalMachines} Machines Active</div>
                  <div><strong>Phone:</strong> {chc.contactPhone}</div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Fleet Machinery Markers */}
        {machines.map(machine => {
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
                <div className="text-xs p-1 max-w-[220px]">
                  <div className="font-bold text-slate-900">{machine.brand} {machine.model}</div>
                  <div className="text-slate-500 font-mono text-[10px]">{machine.identifier} ({machine.category})</div>
                  <div className="mt-1 flex items-center justify-between text-slate-700">
                    <span>Hourly Rate:</span>
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

      {/* Map Legend Overlay with Clean SVGs */}
      <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-elevated border border-slate-200/90 text-xs text-slate-700 space-y-1.5 z-[1000] pointer-events-auto">
        <div className="font-extrabold text-slate-900 text-xs tracking-tight border-b border-slate-100 pb-1">
          Map Fleet Layers
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-agri-800 shrink-0" />
          <span className="font-medium text-slate-800">Custom Hiring Centre (CHC)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
          <span className="font-medium text-slate-800">Farm Boundary (8-Acre Wheat)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-sky-500 shrink-0 animate-pulse" />
          <span className="font-medium text-slate-800">Active / Dispatched Telematics</span>
        </div>
      </div>
    </div>
  );
};
