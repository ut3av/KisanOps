import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Brain,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  IndianRupee,
  Calendar,
  CloudRain,
  ShieldAlert,
  Sliders,
  CheckCircle2,
  Volume2,
  VolumeX,
  Languages,
  Printer,
  ChevronRight,
  Database,
  ArrowRight,
  RefreshCw,
  Tractor,
  Wheat,
  Layers,
  FileText,
  Activity,
} from 'lucide-react';
import { useKisanOpsStore } from '../../store/kisanOpsStore';
import { usePageTitle } from '../../hooks/usePageTitle';
import { IntelligenceReportModal } from '../../components/common/IntelligenceReportModal';
import { ScenarioSimulationInput, ScenarioSimulationResult } from '../../types';
import clsx from 'clsx';

export const FarmIntelligence: React.FC = () => {
  usePageTitle(
    'Farm Decision Intelligence | Economics & Risk Outlook',
    'Real-time agronomic profit models, harvest window optimization, what-if simulations, and multi-dimensional risk scores.'
  );

  const { state, refreshFarmIntelligence, runCustomScenarioSimulation, recordRecommendationOutcome, loadDemoData } = useKisanOpsStore();
  const navigate = useNavigate();

  const { farm, machines, farmProfitModel, farmRiskAssessment, dailyFarmBrief, weeklyFarmReport, externalRiskEvents, recommendationOutcomes } = state;

  const [isHindi, setIsHindi] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Scenario Simulator interactive sliders state
  const [scenarioInput, setScenarioInput] = useState<ScenarioSimulationInput>({
    rainfallDeltaPercent: 25,
    harvestDelayDays: 2,
    sellingPriceDeltaPercent: -5,
    machineryRateDeltaPercent: 10,
  });
  const [activeScenarios, setActiveScenarios] = useState<ScenarioSimulationResult[]>([]);

  // Outcome logger modal state
  const [showOutcomeModal, setShowOutcomeModal] = useState(false);
  const [outcomeForm, setOutcomeForm] = useState({
    actualRainfallMm: 15.0,
    actualYieldQuintal: 146,
    actualMandiPrice: 2520,
    adopted: true,
  });

  useEffect(() => {
    if (!farmProfitModel && farm.sizeAcres > 0) {
      refreshFarmIntelligence();
    }
  }, [farm.sizeAcres]);

  useEffect(() => {
    const results = runCustomScenarioSimulation(scenarioInput);
    setActiveScenarios(results);
  }, [scenarioInput, farmProfitModel]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshFarmIntelligence();
    setIsRefreshing(false);
  };

  const handleToggleVoice = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      const text = isHindi
        ? dailyFarmBrief?.audioVoiceScriptHindi || 'नमस्ते। आपके खेत के लिए मौसम और कटाई की स्थिति अनुकूल है।'
        : dailyFarmBrief?.audioVoiceScript || 'Good morning. Your farm operational window is currently optimal.';
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = isHindi ? 'hi-IN' : 'en-IN';
      utterance.rate = 0.95;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);

      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  const handleLogOutcome = () => {
    recordRecommendationOutcome({
      id: `out-${Date.now()}`,
      recommendationId: dailyFarmBrief?.id || 'brief-01',
      entityType: 'FARMER',
      entityId: farm.id,
      recommendationType: 'HARVEST_WINDOW_BOOKING',
      recommendedAction: dailyFarmBrief?.topRecommendation || 'Harvest during dry window',
      recommendedAt: new Date().toISOString(),
      adoptedByFarmer: outcomeForm.adopted,
      actualRainfallMm: outcomeForm.actualRainfallMm,
      actualHarvestYieldQuintal: outcomeForm.actualYieldQuintal,
      actualSellingPricePerQuintal: outcomeForm.actualMandiPrice,
      predictionAccuracyPercent: 93.5,
      verifiedAt: new Date().toISOString(),
      notes: 'Recorded by farmer from harvest log.',
    });
    setShowOutcomeModal(false);
  };

  const isConfigured = farm.sizeAcres > 0;

  return (
    <div className="space-y-6">
      {/* Clean State Notification if not configured */}
      {!isConfigured && (
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300 rounded-3xl p-5 shadow-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                Farm Profile Required for Real-Time Decision Intelligence
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Configure your farmland acreage, crop type, and village coordinates to unlock personalized economics and weather sentinels.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => navigate('/farmer/profile')}
              className="btn-primary text-xs py-2 px-3.5 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
            >
              Configure Farm
            </button>
            <button
              onClick={() => loadDemoData()}
              className="btn-secondary text-xs py-2 px-3.5 flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Load 8-Acre Demo Farm</span>
            </button>
          </div>
        </div>
      )}

      {/* Top Banner: KisanOps Daily Farm Intelligence Brief */}
      {dailyFarmBrief && (
        <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-6 border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black shadow-lg">
                <Brain className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                    KisanOps Daily Farm Brief
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {dailyFarmBrief.date} • {farm.village || farm.district} ({farm.sizeAcres} Acres {farm.crop.cropName})
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-extrabold text-white mt-1">
                  {isHindi ? dailyFarmBrief.headlineHindi : dailyFarmBrief.headline}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <button
                onClick={() => setIsHindi(!isHindi)}
                className="btn-secondary text-xs py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 flex items-center gap-1.5 cursor-pointer"
              >
                <Languages className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isHindi ? 'English' : 'हिंदी'}</span>
              </button>
              <button
                onClick={handleToggleVoice}
                className={clsx(
                  'text-xs py-2 px-3 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer',
                  isPlayingAudio
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'bg-emerald-500 hover:bg-emerald-600 text-slate-950'
                )}
              >
                {isPlayingAudio ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                <span>{isPlayingAudio ? 'Stop Voice' : 'Audio Brief'}</span>
              </button>
              <button
                onClick={() => setIsReportModalOpen(true)}
                className="btn-secondary text-xs py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 flex items-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-emerald-400" />
                <span>Weekly Report</span>
              </button>
            </div>
          </div>

          <div className="pt-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-center relative z-10">
            <div className="md:col-span-8">
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                {isHindi ? dailyFarmBrief.topRecommendationHindi : dailyFarmBrief.topRecommendation}
              </p>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-3 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <CloudRain className="w-3.5 h-3.5 text-sky-400" />
                  <span>{dailyFarmBrief.weatherSummary}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Tractor className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{dailyFarmBrief.machinerySummary}</span>
                </span>
              </div>
            </div>

            <div className="md:col-span-4 flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center md:items-end justify-between gap-2.5">
              <button
                onClick={() => navigate('/farmer/marketplace')}
                className="btn-primary text-xs py-2.5 px-4 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold flex items-center justify-center gap-1.5 shadow-lg cursor-pointer"
              >
                <span>Find & Book Harvester</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <div className="text-[11px] text-slate-400 text-right">
                Confidence: <strong className="text-emerald-400">{dailyFarmBrief.confidencePercent}%</strong> • Based on 5 verified feeds
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid: Farm Profit Model & Multi-Dimensional Risk Sentinels */}
      {farmProfitModel && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (7 cols): Farm Profit Economics & Ranges */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-subtle space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
                    <IndianRupee className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">
                      Farm Economics & Expected Profit Range
                    </h3>
                    <p className="text-xs text-slate-500">
                      Based on {farmProfitModel.sizeAcres} Acres {farmProfitModel.cropName} • ₹{farmProfitModel.expectedSellingPricePerQuintal}/q Mandi Benchmark
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleRefresh}
                  className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 cursor-pointer"
                  title="Refresh calculations"
                >
                  <RefreshCw className={clsx('w-4 h-4', isRefreshing && 'animate-spin')} />
                </button>
              </div>

              {/* 3 Range Scenario Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80">
                  <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">
                    Conservative
                  </span>
                  <div className="text-xl font-extrabold text-amber-950 mt-1">
                    ₹{farmProfitModel.profitRange.conservative.toLocaleString('en-IN')}
                  </div>
                  <p className="text-[10px] text-amber-700 mt-0.5">Assumes rain delay & quality dockage</p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 shadow-sm relative overflow-hidden">
                  <div className="absolute top-1 right-2 text-[9px] font-black uppercase text-emerald-800 bg-emerald-200 px-1.5 py-0.5 rounded">
                    Expected
                  </div>
                  <span className="text-[11px] font-extrabold text-emerald-900 uppercase tracking-wider">
                    Expected Return
                  </span>
                  <div className="text-2xl font-black text-emerald-950 mt-1">
                    ₹{farmProfitModel.expectedNetProfit.toLocaleString('en-IN')}
                  </div>
                  <p className="text-[10px] text-emerald-800 font-semibold mt-0.5">
                    ₹{farmProfitModel.profitPerAcre.toLocaleString('en-IN')}/acre • ROI {farmProfitModel.expectedRoiPercent}%
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-200/80">
                  <span className="text-[11px] font-bold text-sky-800 uppercase tracking-wider">
                    Favorable
                  </span>
                  <div className="text-xl font-extrabold text-sky-950 mt-1">
                    ₹{farmProfitModel.profitRange.favorable.toLocaleString('en-IN')}
                  </div>
                  <p className="text-[10px] text-sky-700 mt-0.5">Assumes peak luster premium (+6%)</p>
                </div>
              </div>

              {/* Economics Summary Metrics Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-center">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Gross Revenue</div>
                  <div className="text-xs font-extrabold text-slate-900 mt-0.5">
                    ₹{farmProfitModel.expectedGrossRevenue.toLocaleString('en-IN')}
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Total Expenses</div>
                  <div className="text-xs font-extrabold text-rose-700 mt-0.5">
                    ₹{farmProfitModel.expenses.totalCost.toLocaleString('en-IN')}
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Break-Even Yield</div>
                  <div className="text-xs font-extrabold text-slate-900 mt-0.5">
                    {farmProfitModel.breakEvenYieldQuintalPerAcre} q/acre
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Break-Even Price</div>
                  <div className="text-xs font-extrabold text-slate-900 mt-0.5">
                    ₹{farmProfitModel.breakEvenPricePerQuintal}/q
                  </div>
                </div>
              </div>

              {/* Itemized Expenses Breakdown */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Itemized Cost Breakdown (₹{farmProfitModel.expenses.costPerAcre.toLocaleString('en-IN')}/acre)
                </h4>
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
                    <span className="text-slate-700">🌱 Certified Seeds & Treatments</span>
                    <span className="font-bold text-slate-900">₹{farmProfitModel.expenses.seedsCost.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
                    <span className="text-slate-700">🧪 Fertilizers (DAP, Urea, Zinc)</span>
                    <span className="font-bold text-slate-900">₹{farmProfitModel.expenses.fertilizersCost.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50/70 border border-emerald-200">
                    <span className="text-emerald-950 font-bold">🚜 Machinery Rental (KisanOps Network)</span>
                    <span className="font-extrabold text-emerald-900">₹{farmProfitModel.expenses.machineryRentalCost.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
                    <span className="text-slate-700">👥 Field Labor & Threshing</span>
                    <span className="font-bold text-slate-900">₹{farmProfitModel.expenses.laborCost.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Uncertainty Drivers Note */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1">
                <div className="font-bold text-slate-800">Key Uncertainty Drivers:</div>
                <ul className="list-disc pl-4 space-y-0.5">
                  {farmProfitModel.profitRange.keyUncertaintyDrivers.map((driver, idx) => (
                    <li key={idx}>{driver}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): Multi-Dimensional Risk Sentinels */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-subtle space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">
                      Multi-Dimensional Risk Sentinels
                    </h3>
                    <p className="text-xs text-slate-500">
                      Overall Farm Risk: <strong className="text-amber-800">{farmRiskAssessment?.overallRiskLevel} ({farmRiskAssessment?.overallScoreOutOf100}/100)</strong>
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {farmRiskAssessment?.riskDrivers.map((driver, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black uppercase text-slate-800 tracking-wider">
                        {driver.category} RISK
                      </span>
                      <span
                        className={clsx(
                          'text-[10px] font-black uppercase px-2 py-0.5 rounded',
                          driver.riskLevel === 'CRITICAL'
                            ? 'bg-rose-100 text-rose-800'
                            : driver.riskLevel === 'HIGH'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        )}
                      >
                        {driver.riskLevel} ({driver.scoreOutOf100}/100)
                      </span>
                    </div>

                    <div className="text-xs font-bold text-slate-900 leading-snug">
                      {driver.what}
                    </div>

                    <div className="text-[11px] text-slate-600 space-y-1 pt-1 border-t border-slate-200/60">
                      <div><strong>Why:</strong> {driver.why}</div>
                      <div><strong>When:</strong> {driver.when}</div>
                      <div className="text-emerald-900 font-semibold">
                        <strong>Recommended Action:</strong> {driver.recommendedAction}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interactive "What-If" Scenario Simulator */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-subtle space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                Interactive "What-If" Farm Scenario Simulator
              </h3>
              <p className="text-xs text-slate-500">
                Simulate how weather shifts, harvest delays, and market price movements impact your expected net profit.
              </p>
            </div>
          </div>
        </div>

        {/* Sliders Control Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
              <span>Rainfall Change:</span>
              <span className="text-sky-700 font-mono">{scenarioInput.rainfallDeltaPercent >= 0 ? '+' : ''}{scenarioInput.rainfallDeltaPercent}%</span>
            </div>
            <input
              type="range"
              min="-50"
              max="100"
              step="5"
              value={scenarioInput.rainfallDeltaPercent}
              onChange={(e) => setScenarioInput(prev => ({ ...prev, rainfallDeltaPercent: Number(e.target.value) }))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
              <span>Harvest Delay:</span>
              <span className="text-amber-700 font-mono">+{scenarioInput.harvestDelayDays} Days</span>
            </div>
            <input
              type="range"
              min="0"
              max="7"
              step="1"
              value={scenarioInput.harvestDelayDays}
              onChange={(e) => setScenarioInput(prev => ({ ...prev, harvestDelayDays: Number(e.target.value) }))}
              className="w-full accent-amber-600 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
              <span>Mandi Price Delta:</span>
              <span className="text-indigo-700 font-mono">{scenarioInput.sellingPriceDeltaPercent >= 0 ? '+' : ''}{scenarioInput.sellingPriceDeltaPercent}%</span>
            </div>
            <input
              type="range"
              min="-20"
              max="20"
              step="2"
              value={scenarioInput.sellingPriceDeltaPercent}
              onChange={(e) => setScenarioInput(prev => ({ ...prev, sellingPriceDeltaPercent: Number(e.target.value) }))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
              <span>Machinery Rate Shift:</span>
              <span className="text-rose-700 font-mono">{scenarioInput.machineryRateDeltaPercent >= 0 ? '+' : ''}{scenarioInput.machineryRateDeltaPercent}%</span>
            </div>
            <input
              type="range"
              min="-15"
              max="30"
              step="5"
              value={scenarioInput.machineryRateDeltaPercent}
              onChange={(e) => setScenarioInput(prev => ({ ...prev, machineryRateDeltaPercent: Number(e.target.value) }))}
              className="w-full accent-rose-600 cursor-pointer"
            />
          </div>
        </div>

        {/* Results Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {activeScenarios.map((sc, idx) => (
            <div
              key={idx}
              className={clsx(
                'p-4 rounded-2xl border transition-all space-y-2',
                idx === 0
                  ? 'bg-slate-900 text-white border-slate-800'
                  : 'bg-slate-50 border-slate-200 text-slate-900'
              )}
            >
              <div className="flex items-center justify-between">
                <span className={clsx('text-xs font-bold', idx === 0 ? 'text-emerald-400' : 'text-slate-700')}>
                  {sc.scenarioName}
                </span>
              </div>

              <div className="text-lg font-black mt-1">
                ₹{sc.projectedProfit.toLocaleString('en-IN')}
              </div>
              <div
                className={clsx(
                  'text-xs font-bold',
                  sc.profitDeltaFromExpected >= 0 ? 'text-emerald-400' : 'text-rose-500'
                )}
              >
                {sc.profitDeltaFromExpected >= 0 ? '+' : ''}₹{sc.profitDeltaFromExpected.toLocaleString('en-IN')} vs expected
              </div>

              <div className={clsx('text-[11px] pt-2 border-t space-y-1', idx === 0 ? 'border-slate-800 text-slate-300' : 'border-slate-200 text-slate-600')}>
                <div>Projected Yield: <strong>{sc.projectedYieldQuintal} q</strong></div>
                <div>Lodging Risk Score: <strong>{sc.lodgingRiskScore}/100</strong></div>
                <div className="mt-1.5 font-medium">{sc.recommendedMitigation}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Closed-Loop Learning & Outcomes Panel */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-subtle space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                Closed-Loop Outcome Tracking & Verification
              </h3>
              <p className="text-xs text-slate-500">
                Compare KisanOps recommendations against actual field harvest outcomes to validate predictive precision.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowOutcomeModal(true)}
            className="btn-primary text-xs py-2 px-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold flex items-center gap-1 cursor-pointer"
          >
            <span>+ Log Actual Outcome</span>
          </button>
        </div>

        <div className="border border-slate-200 rounded-2xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3">Recommendation</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actual Harvest Yield</th>
                <th className="p-3">Actual Mandi Rate</th>
                <th className="p-3">Model Accuracy</th>
                <th className="p-3">Verification Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recommendationOutcomes.map((out, idx) => (
                <tr key={idx}>
                  <td className="p-3 font-semibold text-slate-900">{out.recommendedAction}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {out.adoptedByFarmer ? 'Adopted' : 'Skipped'}
                    </span>
                  </td>
                  <td className="p-3 font-mono font-bold text-slate-800">{out.actualHarvestYieldQuintal || '—'} q</td>
                  <td className="p-3 font-mono font-bold text-slate-800">₹{out.actualSellingPricePerQuintal || '—'}/q</td>
                  <td className="p-3 font-mono font-bold text-emerald-800">{out.predictionAccuracyPercent}%</td>
                  <td className="p-3 text-slate-600 text-[11px]">{out.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Outcome Modal */}
      {showOutcomeModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-extrabold text-slate-900">
              Log Field Harvest Outcome
            </h3>
            <p className="text-xs text-slate-500">
              Record your real harvest results to benchmark predictive accuracy and improve future seasonal planning.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700">Actual Harvest Yield (Total Quintals)</label>
                <input
                  type="number"
                  value={outcomeForm.actualYieldQuintal}
                  onChange={(e) => setOutcomeForm(prev => ({ ...prev, actualYieldQuintal: Number(e.target.value) }))}
                  className="w-full mt-1 p-2 rounded-xl border border-slate-200 font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">Actual Mandi Realized Price (₹/Quintal)</label>
                <input
                  type="number"
                  value={outcomeForm.actualMandiPrice}
                  onChange={(e) => setOutcomeForm(prev => ({ ...prev, actualMandiPrice: Number(e.target.value) }))}
                  className="w-full mt-1 p-2 rounded-xl border border-slate-200 font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">Recorded Precipitation during Harvest (mm)</label>
                <input
                  type="number"
                  value={outcomeForm.actualRainfallMm}
                  onChange={(e) => setOutcomeForm(prev => ({ ...prev, actualRainfallMm: Number(e.target.value) }))}
                  className="w-full mt-1 p-2 rounded-xl border border-slate-200 font-bold"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowOutcomeModal(false)}
                className="btn-secondary text-xs py-2 px-3.5 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleLogOutcome}
                className="btn-primary text-xs py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer"
              >
                Save Outcome
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Intelligence Weekly Report Modal */}
      <IntelligenceReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        farmerReport={weeklyFarmReport}
      />
    </div>
  );
};
