import React, { useState } from 'react';
import {
  Wheat,
  Layers,
  Droplets,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  Edit,
  PlusCircle,
  X,
  Sparkles,
  Save,
  Sprout,
  LocateFixed,
  Navigation,
  RotateCw,
  Tractor,
  Truck,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useKisanOpsStore } from '../../store/kisanOpsStore';
import { LeafletFleetMap } from '../../components/common/LeafletFleetMap';
import { usePageTitle } from '../../hooks/usePageTitle';
import { SEEDED_CHCS, SEEDED_MACHINES } from '../../data/seedData';

export const FarmProfile: React.FC = () => {
  usePageTitle(
    'My Farm & Plot Polygon',
    'Configure farmland acreage, crop lifecycle, soil composition, and geo-fenced boundaries.'
  );
  const { state, updateFarm, loadDemoData } = useKisanOpsStore();
  const { farm, chcs, machines } = state;

  const effectiveMachines = machines && machines.length > 0 ? machines : SEEDED_MACHINES;
  const effectiveChcs = chcs && chcs.length > 0 ? chcs : SEEDED_CHCS;

  const availableMachines = effectiveMachines.filter(m => m.status === 'AVAILABLE');
  const availableTractors = availableMachines.filter(m => m.category === 'TRACTOR');
  const availableHarvesters = availableMachines.filter(m => m.category === 'HARVESTER');
  const availableTrucks = availableMachines.filter(m => m.category === 'TRAILER' || (m.category as string) === 'TRANSPORT');
  const availableImplements = availableMachines.filter(
    m => m.category !== 'TRACTOR' && m.category !== 'HARVESTER' && m.category !== 'TRAILER' && (m.category as string) !== 'TRANSPORT'
  );

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    farmName: farm.farmName || '',
    sizeAcres: farm.sizeAcres > 0 ? farm.sizeAcres : 0,
    state: farm.state || '',
    district: farm.district || '',
    village: farm.village || '',
    latitude: farm.latitude || 0,
    longitude: farm.longitude || 0,
    cropName: farm.crop?.cropName || '',
    season: farm.crop?.season || 'Rabi',
    cropStage: farm.crop?.cropStage || 'Sowing',
    soilType: farm.soilType || '',
    irrigationType: farm.irrigationType || 'Borewell',
  });
  const [isLocatingGps, setIsLocatingGps] = useState<boolean>(false);
  const [gpsMessage, setGpsMessage] = useState<string | null>(null);

  const isConfigured = farm.sizeAcres > 0 && !!farm.district;

  const handleDetectGpsLocation = () => {
    if (!navigator.geolocation) {
      setGpsMessage('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocatingGps(true);
    setGpsMessage(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=en`);
          if (res.ok) {
            const data = await res.json();
            const addr = data.address || {};
            const detectedDistrict = addr.state_district || addr.county || addr.city || addr.district || 'Indore';
            const detectedVillage = addr.village || addr.suburb || addr.town || addr.hamlet || '';
            const detectedState = addr.state || 'Madhya Pradesh';

            setFormData(prev => ({
              ...prev,
              district: detectedDistrict,
              village: detectedVillage,
              state: detectedState,
              latitude: lat,
              longitude: lon,
            }));
            setGpsMessage(`📍 GPS Location attached: ${detectedDistrict} (${lat.toFixed(4)}, ${lon.toFixed(4)})`);
          } else {
            setFormData(prev => ({ ...prev, latitude: lat, longitude: lon }));
            setGpsMessage(`📍 GPS Coordinates attached (${lat.toFixed(4)}, ${lon.toFixed(4)})`);
          }
        } catch {
          setFormData(prev => ({ ...prev, latitude: lat, longitude: lon }));
          setGpsMessage(`📍 GPS Coordinates attached (${lat.toFixed(4)}, ${lon.toFixed(4)})`);
        }
        setIsLocatingGps(false);
      },
      (err) => {
        console.warn('GPS location error:', err);
        setGpsMessage('Could not retrieve GPS coordinates. Please allow location access or type district.');
        setIsLocatingGps(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleOpenEdit = () => {
    setFormData({
      farmName: farm.farmName || 'Kisan Agro Plot #1',
      sizeAcres: farm.sizeAcres || 5.0,
      state: farm.state || 'Madhya Pradesh',
      district: farm.district || '',
      village: farm.village || '',
      latitude: farm.latitude || 0,
      longitude: farm.longitude || 0,
      cropName: farm.crop?.cropName || 'Wheat (Sharbati)',
      season: farm.crop?.season || 'Rabi',
      cropStage: farm.crop?.cropStage || 'Vegetative',
      soilType: farm.soilType || 'Medium Black Clayey Loam',
      irrigationType: farm.irrigationType || 'Canal',
    });
    setGpsMessage(null);
    setIsEditModalOpen(true);
  };

  const handleSaveFarm = (e: React.FormEvent) => {
    e.preventDefault();
    updateFarm({
      farmName: formData.farmName,
      sizeAcres: Number(formData.sizeAcres) || 1.0,
      state: formData.state,
      district: formData.district,
      village: formData.village,
      latitude: formData.latitude || 22.7196,
      longitude: formData.longitude || 75.8577,
      soilType: formData.soilType,
      irrigationType: formData.irrigationType as any,
      crop: {
        id: farm.crop?.id || `crop-${Date.now()}`,
        cropName: formData.cropName,
        season: formData.season as any,
        cropStage: formData.cropStage as any,
      },
    });
    setIsEditModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-subtle flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {isConfigured ? farm.farmName : 'Farmland Registry & Land Records'}
            </h1>
            {isConfigured ? (
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Verified Land Record</span>
              </span>
            ) : (
              <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-md">
                Setup Pending
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {isConfigured
              ? `${farm.village ? farm.village + ', ' : ''}${farm.district}, ${farm.state} • ${farm.sizeAcres} Total Cultivated Acres`
              : 'Add your land acreage, village/district, crop stage, and soil parameters to configure instant machinery matching.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenEdit}
            className="btn-primary text-xs py-2 px-3.5 bg-agri-700 hover:bg-agri-800 text-white rounded-xl font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {isConfigured ? <Edit className="w-3.5 h-3.5 shrink-0" /> : <PlusCircle className="w-3.5 h-3.5 shrink-0" />}
            <span>{isConfigured ? 'Edit Land Details' : '+ Add Farmland & Acres'}</span>
          </button>
        </div>
      </div>

      {/* Clean Unconfigured Onboarding Banner if sizeAcres === 0 */}
      {!isConfigured && (
        <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-sky-50 border border-emerald-200/80 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold uppercase tracking-wide">
              <Sprout className="w-3.5 h-3.5 text-emerald-700" />
              <span>Step 1 of 2: Register Farmland</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Add Your Land Acreage & Location
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
              Register your land plot size (acres), location district, and current crop cycle. Yukti uses this data to recommend optimal machinery sizes, calculate dynamic hourly tariffs, and track rainfall harvest windows.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
            <button
              onClick={handleOpenEdit}
              className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 shrink-0" />
              <span>Configure Land & Acreage</span>
            </button>
            <button
              onClick={() => loadDemoData()}
              className="px-4 py-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Load 8-Acre Demo Farm</span>
            </button>
          </div>
        </div>
      )}

      {/* Grid: Farm Details & Geo-Fence Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Farm Metadata Grid */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-subtle space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Active Crop & Soil Profile
              </h3>
              {isConfigured && (
                <span className="text-xs text-slate-500 font-medium">
                  {farm.crop.season} Season
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-surface-50 p-3.5 rounded-2xl border border-slate-200/70">
                <div className="text-slate-500 text-[11px] font-medium flex items-center gap-1">
                  <Wheat className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Primary Crop</span>
                </div>
                <div className="font-bold text-slate-900 text-sm mt-1">
                  {farm.crop.cropName || 'Not Specified'}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  {farm.crop.season ? `${farm.crop.season} Season` : 'Season Pending'}
                </div>
              </div>

              <div className="bg-surface-50 p-3.5 rounded-2xl border border-slate-200/70">
                <div className="text-slate-500 text-[11px] font-medium flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                  <span>Crop Stage</span>
                </div>
                <div className="font-bold text-emerald-700 text-sm mt-1">
                  {farm.crop.cropStage || 'Pre-sowing'}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Lifecycle Phase
                </div>
              </div>

              <div className="bg-surface-50 p-3.5 rounded-2xl border border-slate-200/70">
                <div className="text-slate-500 text-[11px] font-medium flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-earth-700 shrink-0" />
                  <span>Soil Composition</span>
                </div>
                <div className="font-bold text-slate-900 text-sm mt-1 truncate">
                  {farm.soilType || 'Loamy Soil'}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Traction & Moisture</div>
              </div>

              <div className="bg-surface-50 p-3.5 rounded-2xl border border-slate-200/70">
                <div className="text-slate-500 text-[11px] font-medium flex items-center gap-1">
                  <Droplets className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Irrigation Source</span>
                </div>
                <div className="font-bold text-slate-900 text-sm mt-1">
                  {farm.irrigationType || 'Canal'}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Water Source</div>
              </div>
            </div>

            <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200/80 text-xs text-emerald-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Demand Engine & Booking Integration</span>
              </div>
              <p className="text-emerald-800 leading-relaxed text-[11px]">
                {farm.district
                  ? `Your crop parameters in ${farm.district} feed directly into the predictive scheduling matrix, allocating priority combine harvesters and securing transparent base rental tariffs.`
                  : 'Configure your district location to enable real-time machinery matchmaking and rainfall risk alerts.'}
              </p>
            </div>
          </div>
        </div>

        {/* Boundary Map & Live Machinery Inventory */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white border border-slate-200/90 rounded-3xl p-4 sm:p-5 shadow-subtle space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
              <div>
                <div className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  Geo-Fenced Farm Polygon & Available Fleet
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Live machinery, combine harvesters, and transport trucks within 25 km service geofence.
                </div>
              </div>
              <span className="text-[11px] text-emerald-700 font-mono font-bold self-start sm:self-auto bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {farm.sizeAcres > 0 ? `${farm.sizeAcres} ACRES CONFIGURED` : 'LOCATION STANDBY'}
              </span>
            </div>

            {/* Quick Fleet Availability Summary Strip */}
            <div className="bg-slate-900 text-white rounded-2xl p-3 px-4 border border-slate-800 flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span className="text-xs font-black text-white">
                  {availableMachines.length} Machinery Units Available in Service Radius
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-semibold">
                <span className="bg-slate-800 text-emerald-300 border border-slate-700 px-2 py-0.5 rounded-md">
                  🚜 {availableTractors.length} Tractors
                </span>
                <span className="bg-slate-800 text-amber-300 border border-slate-700 px-2 py-0.5 rounded-md">
                  🌾 {availableHarvesters.length} Harvesters
                </span>
                <span className="bg-slate-800 text-sky-300 border border-slate-700 px-2 py-0.5 rounded-md">
                  🚚 {availableTrucks.length} Trucks/Trailers
                </span>
                <span className="bg-slate-800 text-teal-300 border border-slate-700 px-2 py-0.5 rounded-md">
                  🛠️ {availableImplements.length} Implements
                </span>
              </div>
              <Link
                to="/farmer/marketplace"
                className="text-xs font-bold text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1 ml-auto"
              >
                <span>Book from Map</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <LeafletFleetMap
              chcs={effectiveChcs}
              farm={farm}
              machines={effectiveMachines}
              serviceRadiusKm={25}
              height="380px"
              center={[farm.latitude || 23.1872, farm.longitude || 77.1008]}
              zoom={13}
            />
          </div>
        </div>
      </div>

      {/* Edit / Configure Farmland Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs animate-in fade-in"
            onClick={() => setIsEditModalOpen(false)}
          />

          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 z-10 space-y-5 animate-in scale-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0">
                  <Sprout className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    {isConfigured ? 'Update Farmland Details' : 'Register Farmland & Acreage'}
                  </h3>
                  <p className="text-xs text-slate-500">Configure land size, district, and crop cycle</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveFarm} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Farm / Land Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kisan Green Acres Plot"
                  value={formData.farmName}
                  onChange={e => setFormData({ ...formData, farmName: e.target.value })}
                  className="w-full bg-surface-50 border border-slate-200 rounded-xl px-3 py-2.5 font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Total Land Size (Acres)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    max="500"
                    required
                    value={formData.sizeAcres}
                    onChange={e => setFormData({ ...formData, sizeAcres: Number(e.target.value) })}
                    className="w-full bg-surface-50 border border-slate-200 rounded-xl px-3 py-2.5 font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Operating State</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Madhya Pradesh, Punjab, Maharashtra"
                    value={formData.state}
                    onChange={e => setFormData({ ...formData, state: e.target.value })}
                    className="w-full bg-surface-50 border border-slate-200 rounded-xl px-3 py-2.5 font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* GPS Location Auto-Detection Action Bar */}
              <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                <div>
                  <div className="text-xs font-extrabold text-emerald-950 flex items-center gap-1.5">
                    <LocateFixed className="w-4 h-4 text-emerald-700" />
                    <span>Real-Time GPS Location</span>
                  </div>
                  <div className="text-[11px] text-emerald-800">
                    Auto-detects district, coordinates & live weather satellite feed
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleDetectGpsLocation}
                  disabled={isLocatingGps}
                  className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer disabled:opacity-50 shrink-0"
                >
                  {isLocatingGps ? (
                    <>
                      <RotateCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Locating GPS...</span>
                    </>
                  ) : (
                    <>
                      <Navigation className="w-3.5 h-3.5" />
                      <span>📍 Attach GPS Location</span>
                    </>
                  )}
                </button>
              </div>

              {gpsMessage && (
                <div className="p-2.5 bg-sky-50 border border-sky-200 text-sky-900 rounded-xl text-[11px] font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-700 shrink-0" />
                  <span>{gpsMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">District Location</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Indore, Bhopal, Ujjain, Hoshangabad"
                    value={formData.district}
                    onChange={e => setFormData({ ...formData, district: e.target.value })}
                    className="w-full bg-surface-50 border border-slate-200 rounded-xl px-3 py-2.5 font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Village / Tehsil</label>
                  <input
                    type="text"
                    placeholder="e.g. Bilkisganj, Sanwer"
                    value={formData.village}
                    onChange={e => setFormData({ ...formData, village: e.target.value })}
                    className="w-full bg-surface-50 border border-slate-200 rounded-xl px-3 py-2.5 font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Primary Crop</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Wheat (Sharbati), Soybean, Cotton, Paddy"
                    value={formData.cropName}
                    onChange={e => setFormData({ ...formData, cropName: e.target.value })}
                    className="w-full bg-surface-50 border border-slate-200 rounded-xl px-3 py-2.5 font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Crop Growth Stage</label>
                  <select
                    value={formData.cropStage}
                    onChange={e => setFormData({ ...formData, cropStage: e.target.value as any })}
                    className="w-full bg-surface-50 border border-slate-200 rounded-xl px-3 py-2.5 font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
                  >
                    <option value="Pre-sowing">Pre-sowing (Field Prep)</option>
                    <option value="Sowing">Sowing / Seed Drill</option>
                    <option value="Vegetative">Vegetative Growth</option>
                    <option value="Flowering">Flowering</option>
                    <option value="Maturity">Maturity</option>
                    <option value="Pre-harvest">Pre-harvest (2-5 days)</option>
                    <option value="Harvest-ready">Harvest-ready</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Soil Type</label>
                  <select
                    value={formData.soilType}
                    onChange={e => setFormData({ ...formData, soilType: e.target.value })}
                    className="w-full bg-surface-50 border border-slate-200 rounded-xl px-3 py-2.5 font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
                  >
                    <option value="Medium Black Clayey Loam">Medium Black Clayey Loam</option>
                    <option value="Deep Black Soil (Regur)">Deep Black Soil (Regur)</option>
                    <option value="Alluvial Loam">Alluvial Loam</option>
                    <option value="Red Sandy Loam">Red Sandy Loam</option>
                    <option value="Clayey Silt">Clayey Silt</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Irrigation Source</label>
                  <select
                    value={formData.irrigationType}
                    onChange={e => setFormData({ ...formData, irrigationType: e.target.value as any })}
                    className="w-full bg-surface-50 border border-slate-200 rounded-xl px-3 py-2.5 font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
                  >
                    <option value="Canal">Canal Irrigation</option>
                    <option value="Borewell">Tube-well / Borewell</option>
                    <option value="Drip">Micro Drip Irrigation</option>
                    <option value="Rainfed">Rainfed / Monsoon</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save & Apply Farmland</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
