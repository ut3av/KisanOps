import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Polygon, Circle, LayersControl } from 'react-leaflet';
import L from 'leaflet';
import { CHC, Farm, Machine, TelemetryPoint } from '../../types';
import { SEHORE_DEMO_ROUTE } from '../../lib/telematicsEngine';
import { DopplerRadarPlayer } from './DopplerRadarPlayer';
import { Layers, Map as MapIcon, Globe, Sparkles } from 'lucide-react';
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
  harvester: `
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M2 17h20"/>
      <path d="M6 17v-6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v6"/>
      <circle cx="6" cy="17" r="3"/>
      <circle cx="18" cy="17" r="3"/>
      <path d="M9 6h6"/>
      <path d="M12 3v3"/>
    </svg>
  `,
  truck: `
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/>
      <path d="M15 18H9"/>
      <path d="M19 18h2a1 1 0 0 0 1-1v-5l-3-4h-5v10h1"/>
      <circle cx="7" cy="18" r="2"/>
      <circle cx="17" cy="18" r="2"/>
    </svg>
  `,
  sprayer: `
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>
      <path d="m9 15 2 2 4-4"/>
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

const availableTractorIcon = createProfessionalIcon('linear-gradient(135deg, #10B981 0%, #059669 100%)', SVG_ICONS.tractor, 32);
const availableHarvesterIcon = createProfessionalIcon('linear-gradient(135deg, #D97706 0%, #B45309 100%)', SVG_ICONS.harvester, 34);
const availableTruckIcon = createProfessionalIcon('linear-gradient(135deg, #0284C7 0%, #0369A1 100%)', SVG_ICONS.truck, 32);
const availableImplementIcon = createProfessionalIcon('linear-gradient(135deg, #0D9488 0%, #0F766E 100%)', SVG_ICONS.sprayer, 30);
const maintenanceIcon = createProfessionalIcon('linear-gradient(135deg, #E11D48 0%, #BE123C 100%)', SVG_ICONS.alert, 34, true);

export type MapBaseLayerType =
  | 'AGRO_SATELLITE'
  | 'CARTO_VOYAGER'
  | 'OPEN_TOPO'
  | 'OSM_STANDARD'
  | 'DARK_TELEMATICS';

interface MapLayerConfig {
  name: string;
  url: string;
  attribution: string;
  maxZoom: number;
  subdomains?: string[];
}

const MAP_LAYERS: Record<MapBaseLayerType, MapLayerConfig> = {
  AGRO_SATELLITE: {
    name: 'High-Res Agricultural Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; USDA, USGS, AeroGRID',
    maxZoom: 18,
  },
  CARTO_VOYAGER: {
    name: 'Carto Clean Vector (OSM)',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>, &copy; <a href="https://openstreetmap.org">OSM</a>',
    subdomains: ['a', 'b', 'c', 'd'],
    maxZoom: 19,
  },
  OPEN_TOPO: {
    name: 'OpenTopoMap (Terrain & Contours)',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: 'Map data: &copy; <a href="https://openstreetmap.org">OSM</a>, SRTM | Map style: &copy; OpenTopoMap',
    subdomains: ['a', 'b', 'c'],
    maxZoom: 17,
  },
  OSM_STANDARD: {
    name: 'OpenStreetMap Standard',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
    subdomains: ['a', 'b', 'c'],
    maxZoom: 19,
  },
  DARK_TELEMATICS: {
    name: 'Dark Matter (Night Fleet Telematics)',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; CARTO, &copy; OSM',
    subdomains: ['a', 'b', 'c', 'd'],
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
  scrollWheelZoom?: boolean;
  serviceRadiusKm?: number;
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
  scrollWheelZoom = true,
  serviceRadiusKm,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [baseLayer, setBaseLayer] = useState<MapBaseLayerType>('AGRO_SATELLITE');
  const [radarTileUrl, setRadarTileUrl] = useState<string | null>(null);
  const [radarVisible, setRadarVisible] = useState<boolean>(false);
  const [showLayerMenu, setShowLayerMenu] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div style={{ height }} className="w-full bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 font-medium text-xs">
        Initializing Open-Source GIS Fleet Engine...
      </div>
    );
  }

  const routePositions: [number, number][] = SEHORE_DEMO_ROUTE.map(w => [w.latitude, w.longitude]);
  const activeLayerConfig = MAP_LAYERS[baseLayer];

  const availableMachines = machines.filter(m => m.status === 'AVAILABLE');
  const availableTractors = availableMachines.filter(m => m.category === 'TRACTOR');
  const availableHarvesters = availableMachines.filter(m => m.category === 'HARVESTER');
  const availableTrucks = availableMachines.filter(m => m.category === 'TRAILER' || (m.category as string) === 'TRANSPORT');
  const availableImplements = availableMachines.filter(
    m => m.category !== 'TRACTOR' && m.category !== 'HARVESTER' && m.category !== 'TRAILER' && (m.category as string) !== 'TRANSPORT'
  );

  const getLayerButtonLabel = () => {
    switch (baseLayer) {
      case 'AGRO_SATELLITE':
        return 'Agro Satellite';
      case 'CARTO_VOYAGER':
        return 'Clean Vector';
      case 'OPEN_TOPO':
        return 'Topo Terrain';
      case 'OSM_STANDARD':
        return 'OpenStreetMap';
      case 'DARK_TELEMATICS':
        return 'Night Mode';
      default:
        return 'GIS Layer';
    }
  };

  return (
    <div style={{ height }} className="w-full rounded-2xl overflow-hidden border border-slate-200 shadow-elevated relative z-0">
      {/* Real-Time Available Machinery & Trucks Inventory Floating Bar */}
      <div className="absolute top-3 left-14 z-[1000] bg-slate-950/90 backdrop-blur-md text-white rounded-2xl p-2 px-3 shadow-2xl border border-slate-700/80 flex flex-wrap items-center gap-2 max-w-[calc(100%-140px)] sm:max-w-max pointer-events-auto">
        <div className="flex items-center gap-2 pr-2 border-r border-slate-700/80">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <span className="text-xs font-black text-white whitespace-nowrap">
            {availableMachines.length} Live Fleet Available
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-300 font-semibold overflow-x-auto">
          <span className="inline-flex items-center gap-1 bg-emerald-950/80 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded-md whitespace-nowrap">
            🚜 {availableTractors.length} Tractors
          </span>
          <span className="inline-flex items-center gap-1 bg-amber-950/80 text-amber-300 border border-amber-800 px-2 py-0.5 rounded-md whitespace-nowrap">
            🌾 {availableHarvesters.length} Harvesters
          </span>
          <span className="inline-flex items-center gap-1 bg-sky-950/80 text-sky-300 border border-sky-800 px-2 py-0.5 rounded-md whitespace-nowrap">
            🚚 {availableTrucks.length} Trucks/Trailers
          </span>
          <span className="inline-flex items-center gap-1 bg-teal-950/80 text-teal-300 border border-teal-800 px-2 py-0.5 rounded-md whitespace-nowrap">
            🛠️ {availableImplements.length} Implements
          </span>
        </div>
      </div>

      {/* Top Floating Controls Bar */}
      <div className="absolute top-3 right-3 z-[1000] flex items-center gap-2 pointer-events-auto">
        {/* Layer Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowLayerMenu(!showLayerMenu)}
            className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl shadow-elevated px-3 py-2 flex items-center gap-2 text-xs font-bold text-slate-800 hover:bg-slate-50 transition-all cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-emerald-700" />
            <span>{getLayerButtonLabel()}</span>
          </button>

          {showLayerMenu && (
            <div className="absolute right-0 mt-1.5 w-64 bg-white rounded-2xl border border-slate-200 shadow-2xl p-2 z-[1010] space-y-1">
              <div className="text-[10px] font-bold uppercase text-slate-400 px-2 py-1 tracking-wider">
                Open-Source GIS Imagery
              </div>

              <button
                onClick={() => { setBaseLayer('AGRO_SATELLITE'); setShowLayerMenu(false); }}
                className={clsx(
                  'w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer',
                  baseLayer === 'AGRO_SATELLITE' ? 'bg-emerald-50 text-emerald-950 border border-emerald-200' : 'text-slate-700 hover:bg-slate-100'
                )}
              >
                <Globe className="w-3.5 h-3.5 text-emerald-600" />
                <span>Agro Satellite (Field Plots)</span>
              </button>

              <button
                onClick={() => { setBaseLayer('CARTO_VOYAGER'); setShowLayerMenu(false); }}
                className={clsx(
                  'w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer',
                  baseLayer === 'CARTO_VOYAGER' ? 'bg-emerald-50 text-emerald-950 border border-emerald-200' : 'text-slate-700 hover:bg-slate-100'
                )}
              >
                <MapIcon className="w-3.5 h-3.5 text-sky-600" />
                <span>Carto Clean Vector (Roads & SH-18)</span>
              </button>

              <button
                onClick={() => { setBaseLayer('OPEN_TOPO'); setShowLayerMenu(false); }}
                className={clsx(
                  'w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer',
                  baseLayer === 'OPEN_TOPO' ? 'bg-emerald-50 text-emerald-950 border border-emerald-200' : 'text-slate-700 hover:bg-slate-100'
                )}
              >
                <Layers className="w-3.5 h-3.5 text-amber-600" />
                <span>OpenTopoMap (Elevation Contours)</span>
              </button>

              <button
                onClick={() => { setBaseLayer('OSM_STANDARD'); setShowLayerMenu(false); }}
                className={clsx(
                  'w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer',
                  baseLayer === 'OSM_STANDARD' ? 'bg-emerald-50 text-emerald-950 border border-emerald-200' : 'text-slate-700 hover:bg-slate-100'
                )}
              >
                <MapIcon className="w-3.5 h-3.5 text-slate-600" />
                <span>OpenStreetMap Standard</span>
              </button>

              <button
                onClick={() => { setBaseLayer('DARK_TELEMATICS'); setShowLayerMenu(false); }}
                className={clsx(
                  'w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer',
                  baseLayer === 'DARK_TELEMATICS' ? 'bg-emerald-50 text-emerald-950 border border-emerald-200' : 'text-slate-700 hover:bg-slate-100'
                )}
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>Dark Matter (Night Telematics)</span>
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
        maxZoom={19}
        minZoom={6}
        scrollWheelZoom={scrollWheelZoom}
        touchZoom={true}
        doubleClickZoom={true}
        zoomSnap={0.5}
        zoomDelta={0.5}
        className="w-full h-full"
      >
        {/* Selected Base Tile Layer */}
        <TileLayer
          key={baseLayer}
          url={activeLayerConfig.url}
          attribution={activeLayerConfig.attribution}
          subdomains={activeLayerConfig.subdomains || ['a', 'b', 'c']}
          maxZoom={activeLayerConfig.maxZoom}
        />

        {/* Live RainViewer Doppler Radar Layer with smooth local upscaling */}
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

        {/* Farm Location Marker & Geofence Service Radius */}
        {farm && (
          <>
            {serviceRadiusKm && (
              <Circle
                center={[farm.latitude, farm.longitude]}
                radius={serviceRadiusKm * 1000}
                pathOptions={{
                  color: '#059669',
                  fillColor: '#10B981',
                  fillOpacity: 0.06,
                  weight: 2,
                  dashArray: '6, 6',
                }}
              />
            )}
            <Marker position={[farm.latitude, farm.longitude]} icon={farmIcon}>
              <Popup>
                <div className="text-xs p-1 max-w-[220px]">
                  <div className="font-bold text-slate-900">{farm.farmName}</div>
                  <div className="text-slate-600 font-medium mt-0.5">{farm.village}, {farm.district}</div>
                  <div className="mt-1.5 pt-1.5 border-t border-slate-200 text-[11px] text-slate-700">
                    <div><strong>Acreage:</strong> {farm.sizeAcres} Acres</div>
                    <div><strong>Crop:</strong> {farm.crop.cropName}</div>
                    <div><strong>Service Radius:</strong> {serviceRadiusKm || 25} km</div>
                  </div>
                </div>
              </Popup>
            </Marker>
          </>
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

        {/* Fleet Machinery Markers with Category Specific Professional Icons */}
        {machines.map(machine => {
          const telemetry = activeTelemetry[machine.id];
          const lat = telemetry ? telemetry.latitude : machine.latitude;
          const lng = telemetry ? telemetry.longitude : machine.longitude;

          let icon = availableTractorIcon;
          if (machine.status === 'MAINTENANCE') {
            icon = maintenanceIcon;
          } else if (machine.status === 'ACTIVE' || machine.status === 'DISPATCHED' || machine.id === selectedMachineId) {
            icon = activeMachineIcon;
          } else if (machine.category === 'HARVESTER') {
            icon = availableHarvesterIcon;
          } else if (machine.category === 'TRAILER' || (machine.category as string) === 'TRANSPORT') {
            icon = availableTruckIcon;
          } else if (machine.category !== 'TRACTOR') {
            icon = availableImplementIcon;
          }

          return (
            <Marker key={machine.id} position={[lat, lng]} icon={icon}>
              <Popup>
                <div className="text-xs p-1 max-w-[220px]">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-slate-900">{machine.brand} {machine.model}</span>
                    <span className={clsx(
                      'text-[9px] font-bold px-1.5 py-0.5 rounded',
                      machine.status === 'AVAILABLE' ? 'bg-emerald-100 text-emerald-800' : 'bg-sky-100 text-sky-800'
                    )}>
                      {machine.status}
                    </span>
                  </div>
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

      {/* Map Legend Overlay with Real-Time Inventory Counts */}
      <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-elevated border border-slate-200/90 text-xs text-slate-700 space-y-1.5 z-[1000] pointer-events-auto max-w-[270px]">
        <div className="flex items-center justify-between border-b border-slate-100 pb-1">
          <span className="font-extrabold text-slate-900 text-xs tracking-tight">
            Map Fleet Layers
          </span>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
            {availableMachines.length} Live Available
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-agri-800 shrink-0" />
          <span className="font-medium text-slate-800">Custom Hiring Centre (CHC)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
          <span className="font-medium text-slate-800">Farm Boundary ({farm?.sizeAcres || 8}-Acre {farm?.crop?.cropName || 'Wheat'})</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full border-2 border-emerald-600 border-dashed shrink-0" />
          <span className="font-medium text-slate-800">Geofence Service Radius ({serviceRadiusKm || 25} km)</span>
        </div>

        <div className="pt-1 border-t border-slate-100/80 space-y-1 text-[11px]">
          <div className="flex items-center justify-between text-slate-800">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-emerald-600 inline-block" />
              <span>Available Tractors</span>
            </span>
            <strong className="font-mono text-emerald-800">{availableTractors.length} Units</strong>
          </div>
          <div className="flex items-center justify-between text-slate-800">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-amber-600 inline-block" />
              <span>Combine Harvesters</span>
            </span>
            <strong className="font-mono text-amber-800">{availableHarvesters.length} Units</strong>
          </div>
          <div className="flex items-center justify-between text-slate-800">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-sky-600 inline-block" />
              <span>Trucks & Transport Trailers</span>
            </span>
            <strong className="font-mono text-sky-800">{availableTrucks.length} Units</strong>
          </div>
          <div className="flex items-center justify-between text-slate-800">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-teal-600 inline-block" />
              <span>Sprayers & Implements</span>
            </span>
            <strong className="font-mono text-teal-800">{availableImplements.length} Units</strong>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
          <div className="w-2.5 h-2.5 rounded-full bg-sky-500 shrink-0 animate-pulse" />
          <span className="font-medium text-slate-800 text-[11px]">Active / Dispatched GPS</span>
        </div>
      </div>
    </div>
  );
};
