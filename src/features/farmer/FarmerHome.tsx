import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Clock,
  MapPin,
  Activity,
  Mic
} from 'lucide-react';
import { useKisanOpsStore } from '../../store/kisanOpsStore';
import { ActivityType } from '../../types';
import { AgriCreditGauge } from '../../components/common/AgriCreditGauge';
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

  const triggerYuktiQuery = (query: string) => {
    window.dispatchEvent(new CustomEvent('open-yukti-ai', { detail: { query } }));
  };

  return (
    <div className="space-y-6">
      {/* Welcome & Farm Context Banner */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-subtle flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3.5">
          <img
            src={state.currentUser.avatarUrl}
            alt={state.currentUser.fullName}
            className="w-14 h-14 rounded-2xl object-cover border-2 border-indigo-200 shadow-sm"
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
              <MapPin className="w-3.5 h-3.5 text-indigo-700" />
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

      {/* YUKTI AI HERO BAR */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-emerald-900 rounded-3xl p-5 sm:p-6 text-white shadow-elevated border border-white/10 relative overflow-hidden">
        <div className="absolute right-0 top-0 -mr-10 -mt-10 w-48 h-48 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-amber-400 text-xl shrink-0 shadow-inner">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  Yukti AI • Kisan Mitra
                </span>
                <span className="text-xs font-mono text-amber-300">Vernacular Voice Co-Pilot</span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white mt-0.5">
                बोलकर या लिखकर कृषि यंत्र बुक करें और सलाह प्राप्त करें
              </h2>
              <p className="text-xs text-indigo-200">
                Ask in Hindi or English: equipment bookings, AgriCredit limits, and stage-specific agronomy advice.
              </p>
            </div>
          </div>

          <button
            onClick={() => triggerYuktiQuery('मुझे 8 एकड़ गेहूं कटाई के लिए हार्वेस्टर चाहिए')}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold text-xs shadow-lg transition-all flex items-center gap-2 shrink-0 active:scale-95 border border-white/20"
          >
            <Mic className="w-4 h-4" />
            <span>Ask Yukti AI Now</span>
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap gap-2 text-xs">
          <span className="text-indigo-200 text-[11px] font-semibold self-center">Quick Ask:</span>
          <button
            onClick={() => triggerYuktiQuery('8 एकड़ गेहूं के लिए हार्वेस्टर बुक करो')}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-indigo-100 text-xs font-medium backdrop-blur-sm transition-colors border border-white/10"
          >
            🌾 Book Harvester for 8 Acres
          </button>
          <button
            onClick={() => triggerYuktiQuery('मेरी AgriCredit लिमिट और क्रेडिट स्कोर क्या है?')}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-indigo-100 text-xs font-medium backdrop-blur-sm transition-colors border border-white/10"
          >
            💳 Check AgriCredit Limit
          </button>
          <button
            onClick={() => triggerYuktiQuery('मेरी बुक की गई मशीन कहाँ है?')}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-indigo-100 text-xs font-medium backdrop-blur-sm transition-colors border border-white/10"
          >
            📍 Track My Active Machine
          </button>
        </div>
      </div>

      {/* Hero CTA: What do you need to do? */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-elevated relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full mb-3">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>AI Activity Engine</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
            What farm activity do you need machinery for today?
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 mt-2">
            Select an activity to find smart-matched machinery from verified Sehore CHCs with instant dynamic pricing.
          </p>
        </div>

        {/* Activity Buttons Grid */}
        <div className="relative z-10 mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {activities.map(act => (
            <button
              key={act.type}
              onClick={() => navigate(`/farmer/marketplace?activity=${act.type}`)}
              className={`text-left p-3.5 rounded-2xl transition-all flex flex-col justify-between group ${
                act.highlighted
                  ? 'bg-white text-slate-900 shadow-md ring-2 ring-emerald-500'
                  : 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm'
              }`}
            >
              <div>
                <span className="text-2xl block mb-2">{act.icon}</span>
                <span className="font-bold text-xs block leading-tight">{act.label}</span>
                <span
                  className={`text-[10px] line-clamp-2 mt-1 ${
                    act.highlighted ? 'text-slate-500' : 'text-slate-300'
                  }`}
                >
                  {act.desc}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between text-[11px] font-bold">
                <span className={act.highlighted ? 'text-emerald-700' : 'text-emerald-300'}>
                  {act.highlighted ? 'Optimal Match' : 'Browse'}
                </span>
                <ArrowRight
                  className={`w-3.5 h-3.5 group-hover:translate-x-1 transition-transform ${
                    act.highlighted ? 'text-emerald-700' : 'text-emerald-300'
                  }`}
                />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Two Column Layout: Active Booking Tracker & AgriCredit Gauge */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Rental Job Tracker */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-700" />
              <span>Current Machinery Rental Status</span>
            </h2>
            <button
              onClick={() => navigate('/farmer/rentals')}
              className="text-xs font-bold text-indigo-700 hover:text-indigo-900"
            >
              View All Rentals ➔
            </button>
          </div>

          {activeBooking ? (
            <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-subtle space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-500">
                      {activeBooking.bookingNumber}
                    </span>
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        activeBooking.status === 'IN_PROGRESS'
                          ? 'bg-emerald-100 text-emerald-800 animate-pulse'
                          : activeBooking.status === 'DISPATCHED'
                          ? 'bg-sky-100 text-sky-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {activeBooking.status.replace('_', ' ')}
                    </span>
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900 mt-1">
                    {activeBooking.machineModel} ({activeBooking.machineIdentifier})
                  </h3>
                </div>

                <div className="text-right">
                  <div className="text-xs text-slate-500">Authorized Total</div>
                  <div className="text-lg font-black text-slate-900">
                    ₹{activeBooking.estimatedTotal.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Progress Milestones */}
              <div className="grid grid-cols-4 gap-2 py-2 text-center text-xs">
                <div className="space-y-1">
                  <div className="w-6 h-6 mx-auto rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">
                    ✓
                  </div>
                  <div className="text-[11px] font-bold text-slate-800">Confirmed</div>
                </div>
                <div className="space-y-1">
                  <div
                    className={`w-6 h-6 mx-auto rounded-full flex items-center justify-center text-xs font-bold ${
                      activeBooking.status === 'DISPATCHED' || activeBooking.status === 'IN_PROGRESS'
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {activeBooking.status === 'DISPATCHED' || activeBooking.status === 'IN_PROGRESS' ? '✓' : '2'}
                  </div>
                  <div className="text-[11px] font-bold text-slate-800">Dispatched</div>
                </div>
                <div className="space-y-1">
                  <div
                    className={`w-6 h-6 mx-auto rounded-full flex items-center justify-center text-xs font-bold ${
                      activeBooking.status === 'IN_PROGRESS'
                        ? 'bg-emerald-500 text-white animate-pulse'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    3
                  </div>
                  <div className="text-[11px] font-bold text-slate-800">In Field</div>
                </div>
                <div className="space-y-1">
                  <div className="w-6 h-6 mx-auto rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-xs font-bold">
                    4
                  </div>
                  <div className="text-[11px] font-bold text-slate-500">Invoice</div>
                </div>
              </div>

              {/* Driver & Telematics Snapshot */}
              <div className="bg-surface-50 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-900 font-bold flex items-center justify-center text-sm">
                    RV
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Operator: Raju Verma</div>
                    <div className="text-[11px] text-slate-500">Rating: 4.9★ • Contact: +91 97550 12399</div>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/farmer/rentals')}
                  className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5 w-full sm:w-auto justify-center"
                >
                  <Activity className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Live GPS Tracking</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200/90 rounded-3xl p-8 text-center shadow-subtle space-y-3">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-50 text-indigo-800 flex items-center justify-center text-xl">
                🚜
              </div>
              <h3 className="text-base font-bold text-slate-800">No Active Rental Right Now</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Your wheat crop is entering harvest stage in 2 days. Book a combine harvester in advance to avoid surge pricing!
              </p>
              <button
                onClick={() => navigate('/farmer/marketplace?activity=HARVESTING')}
                className="btn-primary text-xs py-2.5 px-5 shadow-sm"
              >
                Browse Combine Harvesters
              </button>
            </div>
          )}
        </div>

        {/* Right 1 Col: AgriCredit Trust Gauge */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>AgriCredit Trust Score</span>
            </h2>
            <button
              onClick={() => navigate('/farmer/credit')}
              className="text-xs font-bold text-indigo-700 hover:text-indigo-900"
            >
              Details ➔
            </button>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-subtle space-y-4 flex flex-col justify-between">
            <AgriCreditGauge
              score={agriCredit.creditScore}
              limit={agriCredit.creditLimit}
              available={agriCredit.availableCredit}
              ratingCategory={agriCredit.ratingCategory}
            />

            <div className="pt-2 border-t border-slate-100 text-xs text-slate-600 space-y-2">
              <div className="flex justify-between">
                <span>Available Deferred Limit:</span>
                <span className="font-bold text-slate-900">₹{agriCredit.availableCredit.toLocaleString('en-IN')}</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-snug">
                You can rent any machine immediately and pay after crop selling at the Mandi.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Top AI Recommended Machine for Ramesh's Current Crop Stage */}
      {topMatch && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>Top AI Recommended Equipment for Your Wheat Harvest</span>
            </h2>
            <span className="text-xs font-mono font-bold text-slate-500">
              Match Score: {topMatch.score}/100
            </span>
          </div>

          <div className="bg-white border-2 border-indigo-200 rounded-3xl p-5 sm:p-6 shadow-subtle flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <img
                src={topMatch.machine.imageUrl}
                alt={topMatch.machine.model}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-slate-200 shrink-0"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                    {topMatch.score}% Match
                  </span>
                  <span className="text-xs text-slate-500">{topMatch.machine.chcName}</span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  {topMatch.machine.brand} {topMatch.machine.model} ({topMatch.machine.powerHp} HP)
                </h3>
                <p className="text-xs text-slate-600">
                  Optimal for 8.0 Acres • Rate: <strong>₹{topMatch.machine.baseRatePerHour}/hr</strong>
                </p>
              </div>
            </div>

            <div className="w-full md:w-auto md:min-w-[280px] space-y-2 border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-6">
              <div className="text-xs font-bold text-slate-700">AI Scoring Explanations:</div>
              <div className="space-y-1">
                {topMatch.reasons.slice(0, 3).map((r, i) => (
                  <span key={i} className="text-xs text-emerald-700 block">
                    {r}
                  </span>
                ))}
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                <div className="text-xs text-slate-600 flex items-center gap-2">
                  <span>★ {topMatch.machine.rating}</span>
                  <span>•</span>
                  <span className="text-emerald-700 font-semibold">Health: {topMatch.machine.healthScore}%</span>
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
    </div>
  );
};
