import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Wheat,
  Tractor,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Calendar,
  MapPin,
  CheckCircle2,
  Sprout,
  Droplets,
  Pickaxe,
  Truck,
  Star,
  PlusCircle,
  X,
  Save,
  Zap,
  User,
  LocateFixed,
  Navigation,
  RotateCw
} from 'lucide-react';
import { useKisanOpsStore } from '../../store/kisanOpsStore';
import { ActivityType, Machine, AvailabilitySnapshot } from '../../types';
import { AgriCreditGauge } from '../../components/common/AgriCreditGauge';
import { WeatherRadarCard } from '../../components/common/WeatherRadarCard';
import { scoreMachineForFarmer } from '../../lib/recommendationEngine';
import { calculateDynamicPrice } from '../../lib/pricingEngine';
import { getNearbyMachineAvailability } from '../../lib/availabilityService';
import { usePageTitle } from '../../hooks/usePageTitle';
import { SEEDED_PROFILES } from '../../data/seedData';
import { MachineThumbnail } from '../../components/common/MachineThumbnail';
import { MachineDetailsModal } from './MachineDetailsModal';
import clsx from 'clsx';

export const FarmerHome: React.FC = () => {
  usePageTitle(
    'Farmer Home & Farm Hub',
    'AI equipment matching, agro-weather risk radar, and deferred AgriCredit.'
  );
  const { state, updateFarm, loadDemoData } = useKisanOpsStore();
  const navigate = useNavigate();

  const { farm, machines, bookings, agriCredit, currentUser } = state;
  const isDemo = SEEDED_PROFILES.some(p => p.id === currentUser.id);
  const userBookings = isDemo ? bookings : bookings.filter(b => b.farmerId === currentUser.id);
  const activeBooking = userBookings.find(b => b.status !== 'COMPLETED' && b.status !== 'CANCELLED');

  const [isFarmModalOpen, setIsFarmModalOpen] = useState(false);
  const [selectedMachineForModal, setSelectedMachineForModal] = useState<Machine | null>(null);

  // Real-time Geospatial Availability State
  const [selectedRadiusKm, setSelectedRadiusKm] = useState<number>(25);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('ALL');
  const [availabilitySnapshot, setAvailabilitySnapshot] = useState<AvailabilitySnapshot | null>(null);

  useEffect(() => {
    let isCancelled = false;
    const fetchAvailability = async () => {
      const snap = await getNearbyMachineAvailability(
        {
          latitude: farm.latitude || 23.1642,
          longitude: farm.longitude || 77.1215,
          radiusKm: selectedRadiusKm,
          machineCategory: selectedCategoryFilter as any,
        },
        {
          machines: state.machines,
          chcs: state.chcs,
          bookings: state.bookings,
          maintenanceAlerts: state.maintenanceAlerts,
        }
      );
      if (!isCancelled) {
        setAvailabilitySnapshot(snap);
      }
    };
    fetchAvailability();
    return () => {
      isCancelled = true;
    };
  }, [farm.latitude, farm.longitude, selectedRadiusKm, selectedCategoryFilter, state.machines, state.bookings, state.maintenanceAlerts, state.chcs]);

  // Form state for configuring farm
  const [formData, setFormData] = useState({
    farmName: farm.farmName || (currentUser.fullName ? `${currentUser.fullName}'s Farm` : ''),
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

  const isFarmConfigured = farm.sizeAcres > 0 && !!farm.district;

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

  const handleOpenFarmModal = () => {
    setFormData({
      farmName: farm.farmName || `${currentUser.fullName}'s Farm`,
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
    setIsFarmModalOpen(true);
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
    setIsFarmModalOpen(false);
  };

  const activities: Array<{
    type: ActivityType;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    desc: string;
    highlighted?: boolean;
  }> = [
    {
      type: 'HARVESTING',
      label: 'Harvest Crop',
      icon: Wheat,
      desc: 'Combine Harvesters & Threshers',
      highlighted: isFarmConfigured && (farm.crop?.cropStage === 'Pre-harvest' || farm.crop?.cropStage === 'Harvest-ready'),
    },
    {
      type: 'SOIL_PREPARATION',
      label: 'Prepare Soil',
      icon: Tractor,
      desc: 'Heavy Tractors & Rotavators',
    },
    {
      type: 'SOWING',
      label: 'Sow Seeds',
      icon: Sprout,
      desc: 'Zero-Till & Multi-Crop Drills',
    },
    {
      type: 'SPRAYING',
      label: 'Spray Crop',
      icon: Droplets,
      desc: 'Boom & HTP Tractor Sprayers',
    },
    {
      type: 'CULTIVATION',
      label: 'Cultivate Land',
      icon: Pickaxe,
      desc: 'Tine Cultivators & Ploughs',
    },
    {
      type: 'TRANSPORT',
      label: 'Haul & Transport',
      icon: Truck,
      desc: 'Tipping Trailers & Trolleys',
    },
  ];

  // Find top recommended machine for current farm activity
  const recommendedMachines = machines.map(machine => {
    const scoreResult = scoreMachineForFarmer(machine, {
      farm,
      activity: 'HARVESTING',
    });
    const priceQuote = calculateDynamicPrice(machine, {
      demandIndex: 94,
      shortageUnits: 2,
      distanceKm: machine.distanceKm || 3.2,
    });
    return {
      machine,
      score: scoreResult.matchScore,
      reasons: scoreResult.reasons,
      priceQuote,
    };
  }).sort((a, b) => b.score - a.score);

  const topMatch = recommendedMachines[0];

  return (
    <div className="space-y-6">
      {/* Welcome & Farm Context Banner */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-subtle flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-emerald-100 border-2 border-emerald-200 text-emerald-800 flex items-center justify-center font-extrabold shadow-sm shrink-0">
            <User className="w-7 h-7 text-emerald-700" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Namaste, {state.currentUser.fullName}
              </h1>
              {isFarmConfigured ? (
                <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-md border border-emerald-200">
                  Verified Farmer
                </span>
              ) : (
                <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-md">
                  Land Registration Pending
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-600 flex items-center gap-1.5 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-agri-700 shrink-0" />
              <span>
                {isFarmConfigured
                  ? `${farm.farmName} • ${farm.village ? farm.village + ', ' : ''}${farm.district} (${farm.sizeAcres} Acres)`
                  : 'No Farmland Configured • Tap to Set Up Land & Acres'}
              </span>
            </p>
          </div>
        </div>

        {/* Current Crop Stage Pill / Setup Button */}
        {isFarmConfigured && farm.crop?.cropName ? (
          <div className="bg-amber-50/80 border border-amber-200/90 rounded-2xl p-3 px-4 flex items-center gap-3 w-full md:w-auto">
            <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800 shrink-0">
              <Wheat className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">
                {farm.crop.cropName} • {farm.crop.cropStage}
              </div>
              <div className="text-xs text-amber-900 font-medium flex items-center gap-2">
                <span>{farm.crop.season} Season</span>
                <button
                  onClick={handleOpenFarmModal}
                  className="text-[11px] text-emerald-700 underline font-bold hover:text-emerald-900 cursor-pointer"
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={handleOpenFarmModal}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-2xl py-3 px-4 flex items-center gap-2 shadow-sm transition-all cursor-pointer w-full md:w-auto justify-center"
          >
            <PlusCircle className="w-4 h-4 shrink-0" />
            <span>+ Add Farmland & Acres</span>
          </button>
        )}
      </div>

      {/* Clean Unconfigured Onboarding Hero Banner */}
      {!isFarmConfigured && (
        <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-sky-50 border border-emerald-200/80 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 animate-in fade-in">
          <div className="space-y-2 text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold uppercase tracking-wide">
              <Sprout className="w-3.5 h-3.5 text-emerald-700" />
              <span>Step 1: Set Up Farmland Profile</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Enter your cultivated land area & location
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
              Add your land acreage, district, and crop variety to unlock verified Custom Hiring Centre (CHC) machinery, real-time hourly pricing, agro-weather risk forecasts, and deferred AgriCredit.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
            <button
              onClick={handleOpenFarmModal}
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

      {/* Live Agro-Weather Risk Radar & Harvest Window Countdown */}
      {isFarmConfigured ? (
        <WeatherRadarCard
          district={farm.district}
          latitude={farm.latitude}
          longitude={farm.longitude}
          onEmergencyPreBook={() => navigate('/farmer/marketplace?activity=HARVESTING&priority=weather')}
        />
      ) : (
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center shrink-0 border border-sky-200">
              <MapPin className="w-6 h-6 text-sky-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Weather Risk Radar & Harvest Window
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Configure your farmland district above to activate live Open-Meteo satellite precipitation and harvest tractability monitoring.
              </p>
            </div>
          </div>
          <button
            onClick={handleOpenFarmModal}
            className="btn-secondary text-xs py-2 px-3.5 flex items-center gap-1.5 shadow-sm cursor-pointer shrink-0"
          >
            <span>Set Location District</span>
          </button>
        </div>
      )}

      {/* Hero CTA: What do you need to do? */}
      <div className="bg-gradient-to-br from-agri-900 to-agri-950 text-white rounded-3xl p-6 sm:p-8 shadow-elevated relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full mb-3">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>AI Activity Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            What do you need to do on your farm?
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-1.5 leading-relaxed">
            Select your agricultural requirement. Yukti predicts demand, matches ideal horsepower, and guarantees fair transparent pricing with deferred AgriCredit.
          </p>
        </div>

        {/* Activity Buttons Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 relative z-10">
          {activities.map(act => {
            const IconComponent = act.icon;
            return (
              <button
                key={act.type}
                onClick={() => {
                  if (!isFarmConfigured) {
                    handleOpenFarmModal();
                  } else {
                    navigate(`/farmer/marketplace?activity=${act.type}`);
                  }
                }}
                className={`text-left p-3.5 rounded-2xl border transition-all flex flex-col justify-between group cursor-pointer ${
                  act.highlighted
                    ? 'bg-emerald-500/20 border-emerald-400/60 shadow-sm ring-2 ring-emerald-400/40 hover:bg-emerald-500/30'
                    : 'bg-white/10 border-white/10 hover:bg-white/15 hover:border-white/20'
                }`}
              >
                <div>
                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center mb-2.5 text-white group-hover:scale-110 transition-transform">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div className="font-bold text-xs sm:text-sm text-white">{act.label}</div>
                </div>

                <div className="mt-3 flex items-center justify-between text-[10px] text-slate-300">
                  <span className="truncate">{act.desc}</span>
                  <ArrowRight className="w-3 h-3 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid: AgriCredit & Current Active Booking */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: AgriCredit Score & Settlement Status */}
        <div className="lg:col-span-6 space-y-6">
          <AgriCreditGauge
            score={agriCredit.creditScore}
            limit={agriCredit.creditLimit}
            available={agriCredit.availableCredit}
            ratingCategory={agriCredit.ratingCategory}
          />
        </div>

        {/* Right Column: Active Equipment Rental Status */}
        <div className="lg:col-span-6 bg-white border border-slate-200/90 rounded-3xl p-6 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Tractor className="w-5 h-5 text-agri-800" />
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  Active Rental Booking
                </h3>
              </div>
              <span className={clsx(
                'text-xs px-2.5 py-0.5 rounded-full font-bold',
                activeBooking ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
              )}>
                {activeBooking ? activeBooking.status : 'No Active Rentals'}
              </span>
            </div>

            {activeBooking ? (
              <div className="space-y-2">
                <div className="font-bold text-base text-slate-900">{activeBooking.machineModel}</div>
                <div className="text-xs text-slate-600 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-agri-700" />
                  <span>{new Date(activeBooking.startTime).toLocaleDateString()} • {activeBooking.bookedHours} hrs</span>
                </div>
                <div className="text-xs text-slate-600 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Amount: ₹{activeBooking.estimatedTotal.toLocaleString('en-IN')} ({activeBooking.paymentMethod.replace('_', ' ')})</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 mt-2">
                You currently have no scheduled rentals. Book harvesting or tillage equipment directly from verified local CHCs.
              </p>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              {farm.district ? `${farm.district} Regional Hub` : 'Regional CHC Hub'}
            </span>
            <button
              onClick={() => navigate(activeBooking ? '/farmer/rentals' : '/farmer/marketplace')}
              className="text-xs font-bold text-agri-800 hover:text-agri-950 flex items-center gap-1 cursor-pointer"
            >
              <span>{activeBooking ? 'Track Telematics' : 'Browse Machinery'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Real-Time Geospatial CHC Machinery Availability Module */}
      {isFarmConfigured && (
        <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-subtle space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                  Live Machinery Available Near Your Farm
                </h3>
                <span className="text-xs bg-emerald-100 text-emerald-800 font-extrabold px-2.5 py-0.5 rounded-full">
                  PostGIS Verified
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5 flex-wrap">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>
                  Anchored to <strong>{farm.farmName}</strong> ({farm.latitude ? farm.latitude.toFixed(4) : '23.1642'}° N, {farm.longitude ? farm.longitude.toFixed(4) : '77.1215'}° E)
                </span>
                <button
                  onClick={handleOpenFarmModal}
                  className="text-emerald-700 underline font-bold hover:text-emerald-900 ml-1 cursor-pointer"
                >
                  Adjust Pin
                </button>
              </p>
            </div>

            {/* Geofenced Radius Selector */}
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-50 p-1.5 rounded-2xl border border-slate-200/80">
              <span className="text-[11px] font-bold text-slate-500 uppercase px-2">Radius:</span>
              {[5, 10, 15, 25, 50].map(r => (
                <button
                  key={r}
                  onClick={() => setSelectedRadiusKm(r)}
                  className={clsx(
                    'px-2.5 py-1 text-xs font-bold rounded-xl transition-all cursor-pointer',
                    selectedRadiusKm === r
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-700 hover:bg-slate-200/60'
                  )}
                >
                  {r} km
                </button>
              ))}
            </div>
          </div>

          {/* Real-time Summary Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-emerald-50/70 border border-emerald-200/70 rounded-2xl p-4">
            <div>
              <div className="text-base sm:text-lg font-black text-emerald-950">
                {availabilitySnapshot ? availabilitySnapshot.totalAvailable : '...'} machines available within {selectedRadiusKm} km
              </div>
              <div className="text-xs text-emerald-800 font-medium">
                Found across {availabilitySnapshot ? availabilitySnapshot.chcsInRadius : 0} regional CHCs (Total {availabilitySnapshot?.totalInRadius || 0} units registered in geofence)
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate(`/farmer/marketplace?radius=${selectedRadiusKm}`)}
                className="btn-primary text-xs py-2 px-3.5 flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <span>Browse All {availabilitySnapshot?.totalAvailable || 0}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Dynamic Category Chips with Counts */}
          <div className="flex flex-wrap gap-2 pt-1">
            {[
              { label: 'All Equipment', value: 'ALL', count: availabilitySnapshot?.totalAvailable || 0, icon: '🚜' },
              { label: 'Tractors', value: 'TRACTOR', count: availabilitySnapshot?.byType['TRACTOR'] || 0, icon: '🚜' },
              { label: 'Harvesters', value: 'HARVESTER', count: availabilitySnapshot?.byType['HARVESTER'] || 0, icon: '🌾' },
              { label: 'Rotavators', value: 'ROTAVATOR', count: availabilitySnapshot?.byType['ROTAVATOR'] || 0, icon: '🔄' },
              { label: 'Seeders', value: 'SEEDER', count: availabilitySnapshot?.byType['SEEDER'] || 0, icon: '🌱' },
              { label: 'Sprayers', value: 'SPRAYER', count: availabilitySnapshot?.byType['SPRAYER'] || 0, icon: '💧' },
            ].map(cat => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategoryFilter(cat.value)}
                className={clsx(
                  'px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 cursor-pointer',
                  selectedCategoryFilter === cat.value
                    ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                )}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
                <span className={clsx(
                  'text-[10px] px-1.5 py-0.5 rounded-full font-mono font-extrabold',
                  selectedCategoryFilter === cat.value ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-700'
                )}>
                  {cat.count}
                </span>
              </button>
            ))}
          </div>

          {/* Machine Grid Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {availabilitySnapshot?.machines
              .filter(m => selectedCategoryFilter === 'ALL' || m.category === selectedCategoryFilter)
              .slice(0, 6)
              .map(m => {
                const dynamicPrice = calculateDynamicPrice(m, {
                  demandIndex: 94,
                  shortageUnits: 2,
                  distanceKm: m.distanceKm || 3.2,
                  config: {
                    minSurgeMultiplier: state.chcs.find(c => c.id === m.chcId)?.minSurgeMultiplier ?? 0.80,
                    maxSurgeMultiplier: state.chcs.find(c => c.id === m.chcId)?.maxSurgeMultiplier ?? 1.30,
                  },
                });

                return (
                  <div
                    key={m.id}
                    className="border border-slate-200 rounded-2xl p-4 bg-white hover:border-emerald-500/60 hover:shadow-md transition-all flex flex-col justify-between space-y-3 group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                          {m.category}
                        </span>
                        <span
                          className={clsx(
                            'text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1',
                            m.locationStatus === 'LIVE'
                              ? 'bg-emerald-100 text-emerald-800'
                              : m.locationStatus === 'RECENT'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-600'
                          )}
                        >
                          <span
                            className={clsx(
                              'w-1.5 h-1.5 rounded-full',
                              m.locationStatus === 'LIVE'
                                ? 'bg-emerald-600 animate-pulse'
                                : m.locationStatus === 'RECENT'
                                ? 'bg-amber-600'
                                : 'bg-slate-400'
                            )}
                          />
                          {m.locationFreshnessText}
                        </span>
                      </div>

                      <div className="font-extrabold text-sm text-slate-900 group-hover:text-emerald-800 transition-colors">
                        {m.brand} {m.model}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                        {m.identifier} • {m.chcName}
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-600 mt-2">
                        <span className="font-bold text-slate-800 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                          {m.distanceKm} km from farm
                        </span>
                        <span>•</span>
                        <span className="text-emerald-700 font-bold">
                          {m.healthScore}% Health
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <div className="text-sm font-black text-slate-900">₹{dynamicPrice.quotedRatePerHour}/hr</div>
                        <div className="text-[10px] text-slate-500">Live rate</div>
                      </div>

                      <button
                        onClick={() => setSelectedMachineForModal(m)}
                        disabled={!m.isBookable}
                        className={clsx(
                          'text-xs font-bold py-1.5 px-3 rounded-xl transition-all flex items-center gap-1 cursor-pointer',
                          m.isBookable
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        )}
                      >
                        <Zap className="w-3 h-3" />
                        <span>{m.isBookable ? 'Book Now' : 'Reserved'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Hero Recommended Machine Section */}
      {topMatch && isFarmConfigured ? (
        <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-subtle space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">
                  Recommended for Your {farm.sizeAcres}-Acre {farm.crop?.cropName || 'Crop'} Farmland
                </h3>
                <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  {topMatch.score}% Smart Match
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Optimal matching based on land acreage, crop variety, soil traction, and CHC distance.
              </p>
            </div>

            <button
              onClick={() => navigate('/farmer/marketplace')}
              className="text-xs font-bold text-agri-800 hover:text-agri-950 hidden sm:flex items-center gap-1 cursor-pointer"
            >
              <span>View All Machines</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center bg-surface-50 p-4 rounded-2xl border border-slate-200/80">
            <div className="md:col-span-4 h-48 rounded-xl overflow-hidden relative">
              <MachineThumbnail
                category={topMatch.machine.category}
                size="full"
                containerClassName="h-48 rounded-xl"
                showCategoryBadge={true}
              />
            </div>

            <div className="md:col-span-8 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h4 className="text-base font-extrabold text-slate-900">{topMatch.machine.brand} {topMatch.machine.model}</h4>
                  <p className="text-xs text-slate-500 font-mono">{topMatch.machine.identifier} • {topMatch.machine.specs.engine}</p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-black text-agri-900">₹{topMatch.priceQuote.quotedRatePerHour}/hr</div>
                  <div className="text-[11px] text-slate-500 font-medium">Dynamic transparent rate</div>
                </div>
              </div>

              {/* Match reasons tags */}
              <div className="flex flex-wrap gap-1.5">
                {topMatch.reasons.slice(0, 4).map((r, i) => (
                  <span key={i} className="text-[11px] bg-white border border-slate-200 px-2 py-0.5 rounded-lg text-slate-700 font-medium">
                    {r}
                  </span>
                ))}
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                <div className="text-xs text-slate-600 flex items-center gap-2">
                  <span className="flex items-center gap-1 font-bold text-slate-800">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    {topMatch.machine.rating} ({topMatch.machine.totalRentals} rentals)
                  </span>
                  <span>•</span>
                  <span className="text-emerald-700 font-semibold">Health: {topMatch.machine.healthScore}%</span>
                  <span>•</span>
                  <span>{topMatch.machine.distanceKm} km away</span>
                </div>

                <button
                  onClick={() => setSelectedMachineForModal(topMatch.machine)}
                  className="btn-primary text-xs py-2 px-4 shadow-sm cursor-pointer flex items-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Book Equipment Now</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Farmland Configuration Modal */}
      {isFarmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs animate-in fade-in"
            onClick={() => setIsFarmModalOpen(false)}
          />

          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 z-10 space-y-5 animate-in scale-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0">
                  <Sprout className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    {isFarmConfigured ? 'Update Farmland Profile' : 'Register Farmland & Acreage'}
                  </h3>
                  <p className="text-xs text-slate-500">Configure land size, district, and crop cycle</p>
                </div>
              </div>
              <button
                onClick={() => setIsFarmModalOpen(false)}
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
                  placeholder="e.g. Vansh Agro Acres"
                  value={formData.farmName}
                  onChange={e => setFormData({ ...formData, farmName: e.target.value })}
                  className="w-full bg-surface-50 border border-slate-200 rounded-xl px-3 py-2.5 font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Total Cultivated Land (Acres)</label>
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
                    placeholder="e.g. Indore, Bhopal, Ujjain, Hoshangabad, Ludhiana"
                    value={formData.district}
                    onChange={e => setFormData({ ...formData, district: e.target.value })}
                    className="w-full bg-surface-50 border border-slate-200 rounded-xl px-3 py-2.5 font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Village / Tehsil</label>
                  <input
                    type="text"
                    placeholder="e.g. Sanwer, Mandideep, Bilkisganj"
                    value={formData.village}
                    onChange={e => setFormData({ ...formData, village: e.target.value })}
                    className="w-full bg-surface-50 border border-slate-200 rounded-xl px-3 py-2.5 font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Primary Crop Variety</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Soybean, Wheat (Sharbati), Cotton, Paddy"
                    value={formData.cropName}
                    onChange={e => setFormData({ ...formData, cropName: e.target.value })}
                    className="w-full bg-surface-50 border border-slate-200 rounded-xl px-3 py-2.5 font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Crop Stage</label>
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
                    <option value="Pre-harvest">Pre-harvest</option>
                    <option value="Harvest-ready">Harvest-ready</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Soil Composition</label>
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
                  <label className="font-bold text-slate-700">Irrigation System</label>
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
                  onClick={() => setIsFarmModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save & Unlock Machinery</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Machine Details / Booking Modal */}
      {selectedMachineForModal && (
        <MachineDetailsModal
          machine={selectedMachineForModal}
          priceQuote={calculateDynamicPrice(selectedMachineForModal, {
            demandIndex: 94,
            shortageUnits: 2,
            distanceKm: selectedMachineForModal.distanceKm || 3.2,
            config: {
              minSurgeMultiplier: state.chcs.find(c => c.id === selectedMachineForModal.chcId)?.minSurgeMultiplier ?? 0.80,
              maxSurgeMultiplier: state.chcs.find(c => c.id === selectedMachineForModal.chcId)?.maxSurgeMultiplier ?? 1.30,
            },
          })}
          matchScore={
            scoreMachineForFarmer(selectedMachineForModal, { farm, activity: 'HARVESTING' }).matchScore
          }
          matchReasons={
            scoreMachineForFarmer(selectedMachineForModal, { farm, activity: 'HARVESTING' }).reasons
          }
          activity="HARVESTING"
          onClose={() => setSelectedMachineForModal(null)}
        />
      )}
    </div>
  );
};
