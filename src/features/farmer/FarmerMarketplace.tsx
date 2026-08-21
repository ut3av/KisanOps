import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  SlidersHorizontal,
  MapPin,
  Star,
  Sparkles,
  ShieldCheck,
  Zap,
  Map,
  List,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { useKisanOpsStore } from '../../store/kisanOpsStore';
import { MachineCategory, ActivityType, Machine } from '../../types';
import { scoreMachineForFarmer } from '../../lib/recommendationEngine';
import { calculateDynamicPrice } from '../../lib/pricingEngine';
import { MachineDetailsModal } from './MachineDetailsModal';
import { LeafletFleetMap } from '../../components/common/LeafletFleetMap';
import clsx from 'clsx';

export const FarmerMarketplace: React.FC = () => {
  const { state } = useKisanOpsStore();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialActivity = (searchParams.get('activity') as ActivityType) || 'HARVESTING';

  const [selectedActivity, setSelectedActivity] = useState<ActivityType>(initialActivity);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [maxDistance, setMaxDistance] = useState<number>(35);
  const [minHealth, setMinHealth] = useState<number>(85);
  const [sortBy, setSortBy] = useState<'MATCH' | 'PRICE_ASC' | 'DISTANCE_ASC' | 'HEALTH_DESC'>('MATCH');
  const [viewMode, setViewMode] = useState<'LIST' | 'MAP'>('LIST');

  const [selectedMachineForModal, setSelectedMachineForModal] = useState<Machine | null>(null);

  const { farm, machines, chcs, currentTelemetry } = state;

  // Process scored and priced machines
  const processedMachines = useMemo(() => {
    return machines
      .filter(m => {
        if (selectedCategory !== 'ALL' && m.category !== selectedCategory) return false;
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          const matchName = `${m.brand} ${m.model} ${m.category} ${m.identifier}`.toLowerCase();
          if (!matchName.includes(q)) return false;
        }
        if (m.distanceKm && m.distanceKm > maxDistance) return false;
        if (m.healthScore < minHealth) return false;
        return true;
      })
      .map(machine => {
        const scoreResult = scoreMachineForFarmer(machine, {
          farm,
          activity: selectedActivity,
        });

        const priceQuote = calculateDynamicPrice(machine, {
          demandIndex: 94,
          shortageUnits: 2,
          distanceKm: machine.distanceKm || 3.2,
        });

        return {
          machine,
          matchScore: scoreResult.matchScore,
          matchReasons: scoreResult.reasons,
          priceQuote,
        };
      })
      .sort((a, b) => {
        if (sortBy === 'MATCH') return b.matchScore - a.matchScore;
        if (sortBy === 'PRICE_ASC') return a.priceQuote.quotedRatePerHour - b.priceQuote.quotedRatePerHour;
        if (sortBy === 'DISTANCE_ASC') return (a.machine.distanceKm || 0) - (b.machine.distanceKm || 0);
        if (sortBy === 'HEALTH_DESC') return b.machine.healthScore - a.machine.healthScore;
        return 0;
      });
  }, [machines, farm, selectedActivity, selectedCategory, searchQuery, maxDistance, minHealth, sortBy]);

  const categories: { label: string; value: string }[] = [
    { label: 'All Equipment', value: 'ALL' },
    { label: 'Harvesters', value: 'HARVESTER' },
    { label: 'Tractors', value: 'TRACTOR' },
    { label: 'Rotavators', value: 'ROTAVATOR' },
    { label: 'Seeders', value: 'SEEDER' },
    { label: 'Sprayers', value: 'SPRAYER' },
  ];

  return (
    <div className="space-y-6">
      {/* Header with Title and Search */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-subtle flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Agricultural Machinery Marketplace
            </h1>
            <span className="text-xs bg-agri-100 text-agri-800 font-bold px-2 py-0.5 rounded-md">
              {processedMachines.length} Available
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time equipment availability from Custom Hiring Centres in Sehore & surrounding hubs.
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2 bg-surface-100 p-1.5 rounded-2xl border border-slate-200">
          <button
            onClick={() => setViewMode('LIST')}
            className={clsx(
              'px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all',
              viewMode === 'LIST' ? 'bg-white text-agri-900 shadow-subtle' : 'text-slate-500 hover:text-slate-800'
            )}
          >
            <List className="w-3.5 h-3.5" />
            <span>List</span>
          </button>

          <button
            onClick={() => setViewMode('MAP')}
            className={clsx(
              'px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all',
              viewMode === 'MAP' ? 'bg-white text-agri-900 shadow-subtle' : 'text-slate-500 hover:text-slate-800'
            )}
          >
            <Map className="w-3.5 h-3.5" />
            <span>Map</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-subtle space-y-4">
        {/* Search Input & Category Pills */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by brand, model (e.g. John Deere, Mahindra 575, Harvester)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-surface-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-agri-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-semibold hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="bg-surface-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-agri-500"
            >
              <option value="MATCH">Highest Smart Match</option>
              <option value="PRICE_ASC">Lowest Price (₹/hr)</option>
              <option value="DISTANCE_ASC">Nearest Distance</option>
              <option value="HEALTH_DESC">Highest Health %</option>
            </select>
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-100">
          {categories.map(cat => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={clsx(
                'px-3 py-1.5 rounded-xl text-xs font-bold transition-all',
                selectedCategory === cat.value
                  ? 'bg-agri-800 text-white shadow-sm'
                  : 'bg-surface-100 text-slate-600 hover:bg-surface-200'
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content: Map or Grid */}
      {viewMode === 'MAP' ? (
        <div className="bg-white border border-slate-200/90 rounded-3xl p-4 shadow-subtle">
          <LeafletFleetMap
            chcs={chcs}
            farm={farm}
            machines={machines}
            activeTelemetry={currentTelemetry}
            height="560px"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {processedMachines.map(({ machine, matchScore, matchReasons, priceQuote }) => (
            <div
              key={machine.id}
              className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-subtle hover:shadow-card transition-all flex flex-col justify-between"
            >
              <div>
                {/* Image & Match Badge */}
                <div className="relative h-48 bg-slate-900 overflow-hidden">
                  <img
                    src={machine.imageUrl}
                    alt={machine.model}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-lg">
                    {machine.category}
                  </div>

                  {matchScore >= 88 && (
                    <div className="absolute top-3 right-3 bg-emerald-500 text-white text-[11px] font-black px-2.5 py-1 rounded-lg shadow-md flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      {matchScore}% Match
                    </div>
                  )}

                  <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md text-slate-900 text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-agri-700" />
                    <span>{machine.distanceKm} km away</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-base leading-tight">
                        {machine.brand} {machine.model}
                      </h3>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">{machine.identifier} • {machine.chcName}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-lg font-black text-agri-950">₹{priceQuote.quotedRatePerHour}/hr</div>
                      <div className="text-[10px] text-slate-500">Dynamic quote</div>
                    </div>
                  </div>

                  {/* Explainable Reasons */}
                  <div className="space-y-1 bg-surface-50 p-2.5 rounded-xl border border-slate-100 text-[11px] text-slate-600">
                    {matchReasons.slice(0, 3).map((r, i) => (
                      <div key={i} className="flex items-center gap-1.5 truncate">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span className="truncate">{r.replace(/^✓\s*/, '')}</span>
                      </div>
                    ))}
                  </div>

                  {/* Badges: Rating & Health */}
                  <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                    <span className="flex items-center gap-1 font-semibold text-slate-800">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {machine.rating} ({machine.totalRentals} rentals)
                    </span>

                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 text-[11px]">
                      Health: {machine.healthScore}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Actions */}
              <div className="p-5 pt-0 flex items-center gap-2">
                <button
                  onClick={() => setSelectedMachineForModal(machine)}
                  className="btn-secondary text-xs py-2 px-3 flex-1"
                >
                  View Details
                </button>

                <button
                  onClick={() => setSelectedMachineForModal(machine)}
                  className="btn-primary text-xs py-2 px-4 shadow-sm flex items-center gap-1"
                >
                  <span>Book</span>
                  <Zap className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Machine Details Modal */}
      {selectedMachineForModal && (
        <MachineDetailsModal
          machine={selectedMachineForModal}
          priceQuote={calculateDynamicPrice(selectedMachineForModal, {
            demandIndex: 94,
            shortageUnits: 2,
            distanceKm: selectedMachineForModal.distanceKm || 3.2,
          })}
          matchScore={
            scoreMachineForFarmer(selectedMachineForModal, { farm, activity: selectedActivity }).matchScore
          }
          matchReasons={
            scoreMachineForFarmer(selectedMachineForModal, { farm, activity: selectedActivity }).reasons
          }
          activity={selectedActivity}
          onClose={() => setSelectedMachineForModal(null)}
        />
      )}
    </div>
  );
};
