import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Wheat,
  Tractor,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Activity,
  Layers
} from 'lucide-react';
import { useKisanOpsStore } from '../../store/kisanOpsStore';
import { ActivityType } from '../../types';
import { AgriCreditGauge } from '../../components/common/AgriCreditGauge';
import { VoiceAssistantWidget } from '../../components/common/VoiceAssistantWidget';
import { scoreMachineForFarmer } from '../../lib/recommendationEngine';
import { calculateDynamicPrice } from '../../lib/pricingEngine';

export const FarmerHome: React.FC = () => {
  const { state } = useKisanOpsStore();
  const navigate = useNavigate();

  const { farm, machines, bookings, agriCredit } = state;
  const activeBooking = bookings.find(b => b.status !== 'COMPLETED' && b.status !== 'CANCELLED');

  const activities: Array<{ type: ActivityType; label: string; icon: string; desc: string; highlighted?: boolean }> = [
    {
      type: 'HARVESTING',
      label: 'Harvest Crop',
      icon: '🌾',
      desc: 'Combine Harvesters & Threshers',
      highlighted: true, // Urgent for Ramesh's Pre-harvest stage
    },
    {
      type: 'SOIL_PREPARATION',
      label: 'Prepare Soil',
      icon: '🚜',
      desc: 'Heavy Tractors & Rotavators',
    },
    {
      type: 'SOWING',
      label: 'Sow Seeds',
      icon: '🌱',
      desc: 'Zero-Till & Multi-Crop Drills',
    },
    {
      type: 'SPRAYING',
      label: 'Spray Crop',
      icon: '💧',
      desc: 'Boom & HTP Tractor Sprayers',
    },
    {
      type: 'CULTIVATION',
      label: 'Cultivate Land',
      icon: '⛏️',
      desc: 'Tine Cultivators & Ploughs',
    },
    {
      type: 'TRANSPORT',
      label: 'Haul & Transport',
      icon: '🚛',
      desc: 'Tipping Trailers & Trolleys',
    },
  ];

  // Find top recommended machine for current pre-harvest wheat activity
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
          <img
            src={state.currentUser.avatarUrl}
            alt={state.currentUser.fullName}
            className="w-14 h-14 rounded-2xl object-cover border-2 border-agri-200 shadow-sm"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Namaste, {state.currentUser.fullName}
              </h1>
              <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-md border border-emerald-200">
                Verified Farmer
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 flex items-center gap-1.5 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-agri-700" />
              <span>{farm.farmName} • {farm.village}, {farm.district} ({farm.sizeAcres} Acres)</span>
            </p>
          </div>
        </div>

        {/* Current Crop Stage Pill */}
        <div className="bg-amber-50/80 border border-amber-200/90 rounded-2xl p-3 px-4 flex items-center gap-3 w-full md:w-auto">
          <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-lg shrink-0">
            🌾
          </div>
          <div>
            <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">
              {farm.crop.cropName} • {farm.crop.cropStage}
            </div>
            <div className="text-xs text-amber-900 font-medium">
              Harvesting window starts in <strong>2 days</strong>
            </div>
          </div>
        </div>
      </div>

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
            Select your agricultural requirement. KisanOps predicts demand, matches ideal horsepower, and guarantees fair transparent pricing with deferred AgriCredit.
          </p>
        </div>

        {/* Activity Buttons Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 relative z-10">
          {activities.map(act => (
            <button
              key={act.type}
              onClick={() => navigate(`/farmer/marketplace?activity=${act.type}`)}
              className={`text-left p-3.5 rounded-2xl border transition-all flex flex-col justify-between group ${
                act.highlighted
                  ? 'bg-emerald-500/20 border-emerald-400/60 shadow-sm ring-2 ring-emerald-400/40 hover:bg-emerald-500/30'
                  : 'bg-white/10 border-white/10 hover:bg-white/15 hover:border-white/20'
              }`}
            >
              <div>
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">{act.icon}</div>
                <div className="font-bold text-xs sm:text-sm text-white">{act.label}</div>
              </div>
              <div className="text-[10px] text-slate-300 mt-2 leading-tight">{act.desc}</div>
              {act.highlighted && (
                <div className="mt-2 text-[9px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-950/60 px-1.5 py-0.5 rounded text-center">
                  Recommended Now
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Grid: AgriCredit Widget & Active Booking */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* AgriCredit Card */}
        <div className="lg:col-span-7">
          <AgriCreditGauge
            score={agriCredit.creditScore}
            limit={agriCredit.creditLimit}
            available={agriCredit.availableCredit}
            ratingCategory={agriCredit.ratingCategory}
          />
        </div>

        {/* Active Booking Banner */}
        <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Upcoming Booking</span>
              {activeBooking ? (
                <span className="text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200 px-2.5 py-0.5 rounded-full">
                  {activeBooking.status}
                </span>
              ) : (
                <span className="text-xs text-slate-400">No active rental</span>
              )}
            </div>

            {activeBooking ? (
              <div className="space-y-2">
                <div className="font-bold text-base text-slate-900">{activeBooking.machineModel}</div>
                <div className="text-xs text-slate-600 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-agri-700" />
                  <span>22 Aug 2026 • 08:00 AM – 02:00 PM ({activeBooking.bookedHours} hrs)</span>
                </div>
                <div className="text-xs text-slate-600 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>AgriCredit Deferred: ₹{activeBooking.estimatedTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 mt-2">
                You currently have no scheduled rentals. Book harvesting equipment ahead of the regional surge.
              </p>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">Sehore Agri Centre (3.2 km)</span>
            <button
              onClick={() => navigate(activeBooking ? '/farmer/rentals' : '/farmer/marketplace')}
              className="text-xs font-bold text-agri-800 hover:text-agri-950 flex items-center gap-1"
            >
              <span>{activeBooking ? 'Track Telematics' : 'Browse Machinery'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Hero Recommended Machine Section */}
      {topMatch && (
        <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-subtle space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">Recommended for Your 8-Acre Wheat Farm</h3>
                <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  {topMatch.score}% Smart Match
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Explainable fit based on farm size, wheat variety, soil condition, and operator reliability.
              </p>
            </div>

            <button
              onClick={() => navigate('/farmer/marketplace')}
              className="text-xs font-bold text-agri-800 hover:text-agri-950 hidden sm:flex items-center gap-1"
            >
              <span>View All Machines</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center bg-surface-50 p-4 rounded-2xl border border-slate-200/80">
            <div className="md:col-span-4 h-48 rounded-xl overflow-hidden relative">
              <img
                src={topMatch.machine.imageUrl}
                alt={topMatch.machine.model}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-2 left-2 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                {topMatch.machine.category}
              </span>
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
                  <span>★ {topMatch.machine.rating} ({topMatch.machine.totalRentals} rentals)</span>
                  <span>•</span>
                  <span className="text-emerald-700 font-semibold">Health: {topMatch.machine.healthScore}%</span>
                  <span>•</span>
                  <span>{topMatch.machine.distanceKm} km away</span>
                </div>

                <button
                  onClick={() => navigate('/farmer/marketplace')}
                  className="btn-primary text-xs py-2 px-4 shadow-sm"
                >
                  Book with AgriCredit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <VoiceAssistantWidget />
    </div>
  );
};
