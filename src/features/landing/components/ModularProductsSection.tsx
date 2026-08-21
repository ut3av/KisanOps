import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Tractor,
  Satellite,
  ShoppingBag,
  Cpu,
  Truck,
  Boxes,
  Layers,
  LineChart,
  Building2,
  Leaf,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Activity,
  Gauge
} from 'lucide-react';

interface ProductItem {
  id: string;
  title: string;
  category: 'pre-harvest' | 'post-harvest' | 'operations';
  description: string;
  bullets: string[];
  image: string;
  imageAlt: string;
  metricBadge: string;
  metricValue: string;
  icon: React.ReactNode;
}

const PRODUCTS: ProductItem[] = [
  // Pre-Harvest
  {
    id: 'farm-management',
    category: 'pre-harvest',
    title: 'Farm Management Software',
    description:
      'Streamline operations from pre-sowing to harvest. Optimize agronomic practices, track real-time crop growth stages, and manage field inventory through centralized digital integration.',
    bullets: [
      'Digital field plot boundaries & soil texture logs',
      'Activity calendar scheduling (Sowing, Tilling, Spraying)',
      'Labor, chemical inputs and machine usage tracking'
    ],
    image: '/images/hero-agronomist.jpg',
    imageAlt: 'Farm Management Software Interface',
    metricBadge: 'Operational Efficiency',
    metricValue: '+32% Yield Regularity',
    icon: <Tractor className="w-5 h-5 text-[#7aa32c]" />
  },
  {
    id: 'remote-sensing',
    category: 'pre-harvest',
    title: 'Remote Sensing & Satellite GIS',
    description:
      'Monitor and manage farms remotely with high-resolution multispectral Sentinel satellite imagery. Track NDVI vegetative indices, nitrogen uptake, and soil moisture stress.',
    bullets: [
      '10m-Resolution NDVI crop vigor health heatmaps',
      'Sub-surface soil moisture stress detection',
      'Historical canopy index comparison charts'
    ],
    image: '/images/remote-sensing.jpg',
    imageAlt: 'Satellite GIS NDVI Vegetation Index Portal',
    metricBadge: 'Crop Health Accuracy',
    metricValue: '96.8% Detection Precision',
    icon: <Satellite className="w-5 h-5 text-[#7aa32c]" />
  },
  {
    id: 'm-commerce',
    category: 'pre-harvest',
    title: 'M-Commerce & Equipment Rentals',
    description:
      'Simplify on-demand equipment booking and agricultural input procurement through intuitive mobile channels with transparent pricing and real-time availability.',
    bullets: [
      'Self-service machinery booking with activity matching',
      'Certified implements catalog (Ploughs, Seed drills, Harvesters)',
      'Transparent distance-based mobilization rates'
    ],
    image: '/images/hero-tractor.jpg',
    imageAlt: 'M-Commerce Machinery Rental Platform',
    metricBadge: 'Booking Velocity',
    metricValue: '< 60 Sec Instant Reserve',
    icon: <ShoppingBag className="w-5 h-5 text-[#7aa32c]" />
  },
  {
    id: 'crop-advisory',
    category: 'pre-harvest',
    title: 'Crop Advisory & IoT Edge Sensors',
    description:
      'Deliver automated agronomist advice, micro-climate weather risk predictions, and computer-vision pest diagnostics to safeguard harvest quality.',
    bullets: [
      'Localized weather radar and rainfall probability',
      'Pest infestation risk modeling & spray advisory',
      'Automated fertigation & irrigation triggers'
    ],
    image: '/images/hero-agronomist.jpg',
    imageAlt: 'Crop Advisory AI Assistant',
    metricBadge: 'Pest Prevention',
    metricValue: '48h Early Warning',
    icon: <Cpu className="w-5 h-5 text-[#7aa32c]" />
  },

  // Post-Harvest
  {
    id: 'supply-chain',
    category: 'post-harvest',
    title: 'Supply Chain & Fleet Telematics',
    description:
      'Optimize harvest logistics, heavy machinery dispatch, transport routing, and procurement workflows with real-time CAN-Bus IoT streaming and geofenced telematics.',
    bullets: [
      'Live GPS fleet tracking with speed & geofencing alerts',
      'Inter-hub fleet reallocation optimizer (Bhopal ➔ Sehore)',
      'Driver task dispatching & turnaround optimization'
    ],
    image: '/images/hero-tractor.jpg',
    imageAlt: 'Supply Chain Telematics Control Center',
    metricBadge: 'Logistics Fleet Gain',
    metricValue: '+21% Asset Utilization',
    icon: <Truck className="w-5 h-5 text-[#7aa32c]" />
  },
  {
    id: 'food-traceability',
    category: 'post-harvest',
    title: 'Food Traceability & Audit Logs',
    description:
      'Ensure food safety, organic compliance, and chain-of-custody tracking by recording every operational step from seed variety to processing facility.',
    bullets: [
      'Immutable harvest batch provenance records',
      'QR code batch scanning for consumer & buyer verification',
      'GlobalGAP and organic compliance reporting'
    ],
    image: '/images/remote-sensing.jpg',
    imageAlt: 'Food Traceability Provenance Ledger',
    metricBadge: 'Audit Readiness',
    metricValue: '100% Traceable Batches',
    icon: <Boxes className="w-5 h-5 text-[#7aa32c]" />
  },
  {
    id: 'marketplace',
    category: 'post-harvest',
    title: 'Digital Machinery Marketplace',
    description:
      'Connect farm machinery owners, Custom Hiring Centres, and farmers in a transparent digital clearinghouse with dynamic peak-demand pricing.',
    bullets: [
      'Multi-CHC shared machinery repository',
      'Fair dynamic pricing with safety bounds (0.80x–1.30x)',
      'Verified operator licensing and safety certifications'
    ],
    image: '/images/hero-tractor.jpg',
    imageAlt: 'Digital Machinery Marketplace Platform',
    metricBadge: 'Market Liquidity',
    metricValue: '350+ Active Fleet Units',
    icon: <Layers className="w-5 h-5 text-[#7aa32c]" />
  },

  // Operations
  {
    id: 'financial-management',
    category: 'operations',
    title: 'Financials & Deferred AgriCredit',
    description:
      'Empower smallholder farmers with pre-approved deferred rental credit scored by on-ground data, allowing post-harvest settlement within 45 days.',
    bullets: [
      'Non-regulated 0-900 algorithmic credit scoring',
      'Instant deferred credit limits up to ₹10,000',
      'Automated reconciliation & downloadable GST tax invoices'
    ],
    image: '/images/hero-agronomist.jpg',
    imageAlt: 'AgriCredit Financial Operations Engine',
    metricBadge: 'Credit Recovery Rate',
    metricValue: '98.6% On-Time Repayment',
    icon: <LineChart className="w-5 h-5 text-[#7aa32c]" />
  },
  {
    id: 'farm-erp',
    category: 'operations',
    title: 'Enterprise Farm & CHC ERP',
    description:
      'Unify labor management, inventory tracking, equipment maintenance schedules, fuel monitoring, and executive P&L analytics under a single glass pane.',
    bullets: [
      'Real-time fuel burn rate & anomaly alerts (+17% deviation)',
      'Predictive maintenance work orders before breakdown',
      'Gross Merchandise Value (GMV) & utilization analytics'
    ],
    image: '/images/hero-tractor.jpg',
    imageAlt: 'Enterprise AgTech ERP Dashboard',
    metricBadge: 'Maintenance Downtime',
    metricValue: '-42% Unplanned Repairs',
    icon: <Building2 className="w-5 h-5 text-[#7aa32c]" />
  },
  {
    id: 'sustainability',
    category: 'operations',
    title: 'Sustainability & Carbon Verification',
    description:
      'Track regenerative agriculture practices, diesel fuel conservation, optimized chemical applications, and verifiable carbon credit offsets.',
    bullets: [
      'Tillage fuel reduction & emission accounting',
      'Soil organic matter enrichment logs',
      'Verifiable ESG audit export for green financing'
    ],
    image: '/images/remote-sensing.jpg',
    imageAlt: 'Sustainability ESG Measurement Portal',
    metricBadge: 'Emissions Saved',
    metricValue: '184 Tons CO2e Avoided',
    icon: <Leaf className="w-5 h-5 text-[#7aa32c]" />
  }
];

export const ModularProductsSection: React.FC = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<'pre-harvest' | 'post-harvest' | 'operations'>('pre-harvest');
  const [activeProductId, setActiveProductId] = useState<string>('farm-management');

  const filteredProducts = PRODUCTS.filter((p) => p.category === activeCategory);
  const activeProduct =
    filteredProducts.find((p) => p.id === activeProductId) || filteredProducts[0];

  const handleTabChange = (category: 'pre-harvest' | 'post-harvest' | 'operations') => {
    setActiveCategory(category);
    const firstProduct = PRODUCTS.find((p) => p.category === category);
    if (firstProduct) setActiveProductId(firstProduct.id);
  };

  return (
    <section id="modular-products" className="py-20 bg-[#efe7db]/40 border-b border-stone-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header (Inspired by KhetiBuddy) */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-stone-200 text-xs font-bold text-[#2e4013] mb-3 shadow-subtle">
            <Sparkles className="w-3.5 h-3.5 text-[#7aa32c]" />
            <span>Modular Enterprise Suite</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1c1d1f] tracking-tight">
            Focus on core business operations; we’ll handle the technology.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-stone-600 leading-relaxed">
            We offer a SaaS platform with modular solutions to digitize every stage of the agri-value chain. Our platform ensures smooth, efficient operations tailored to your business needs with agricultural machinery intelligence.
          </p>
        </div>

        {/* 3 Major Category Tabs */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex p-1.5 rounded-full bg-[#efe7db] border border-stone-300/80 shadow-sm">
            <button
              onClick={() => handleTabChange('pre-harvest')}
              className={`px-6 sm:px-8 py-3 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeCategory === 'pre-harvest'
                  ? 'bg-[#4a2711] text-white shadow-md'
                  : 'text-[#5e615e] hover:text-[#4a2711] hover:bg-white/50'
              }`}
            >
              Pre-Harvest
            </button>

            <button
              onClick={() => handleTabChange('post-harvest')}
              className={`px-6 sm:px-8 py-3 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeCategory === 'post-harvest'
                  ? 'bg-[#4a2711] text-white shadow-md'
                  : 'text-[#5e615e] hover:text-[#4a2711] hover:bg-white/50'
              }`}
            >
              Post-Harvest & Logistics
            </button>

            <button
              onClick={() => handleTabChange('operations')}
              className={`px-6 sm:px-8 py-3 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeCategory === 'operations'
                  ? 'bg-[#4a2711] text-white shadow-md'
                  : 'text-[#5e615e] hover:text-[#4a2711] hover:bg-white/50'
              }`}
            >
              Operations & Finance
            </button>
          </div>
        </div>

        {/* Two-Column Layout: Left Accordion & Right Live Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Accordion Items */}
          <div className="lg:col-span-6 space-y-4">
            {filteredProducts.map((product) => {
              const isOpen = product.id === activeProduct.id;
              return (
                <div
                  key={product.id}
                  onClick={() => setActiveProductId(product.id)}
                  className={`rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden ${
                    isOpen
                      ? 'bg-white border-[#4a2711] shadow-lg border-l-4 border-l-[#7aa32c]'
                      : 'bg-white/80 border-stone-200/80 hover:bg-white hover:border-stone-300'
                  }`}
                >
                  <div className="p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-xl transition-colors ${
                            isOpen
                              ? 'bg-[#F5FAED] text-[#2e4013]'
                              : 'bg-stone-100 text-stone-600'
                          }`}
                        >
                          {product.icon}
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-stone-900">
                          {product.title}
                        </h3>
                      </div>
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                          isOpen
                            ? 'bg-[#7aa32c]/20 text-[#2e4013]'
                            : 'bg-stone-100 text-stone-500'
                        }`}
                      >
                        {product.metricValue}
                      </span>
                    </div>

                    {/* Expandable Body */}
                    {isOpen && (
                      <div className="mt-4 pt-4 border-t border-stone-100 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                          {product.description}
                        </p>

                        <ul className="space-y-1.5 pt-1">
                          {product.bullets.map((b, idx) => (
                            <li
                              key={idx}
                              className="text-xs text-stone-700 font-medium flex items-center gap-2"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#7aa32c] shrink-0" />
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>

                        <div className="pt-2 flex items-center justify-between">
                          <span className="text-[11px] font-bold text-[#7aa32c] uppercase tracking-wider">
                            {product.metricBadge}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/products/${product.category}`);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="text-xs font-bold text-[#4a2711] hover:text-[#7aa32c] flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <span>Explore Module</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Visual Preview with Dynamic Screen Mocks */}
          <div className="lg:col-span-6 sticky top-28">
            <div className="bg-white rounded-3xl border border-stone-200/90 shadow-2xl p-4 sm:p-6 space-y-4 overflow-hidden relative group">
              {/* Top Window Bar */}
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                <div className="text-[11px] font-mono text-stone-400 font-semibold truncate max-w-[200px]">
                  kisanops.ag/{activeProduct.category}/{activeProduct.id}
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#7aa32c]">
                  <Activity className="w-3.5 h-3.5 animate-pulse" />
                  <span>LIVE DEMO</span>
                </div>
              </div>

              {/* Main Image Frame */}
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-stone-200 shadow-inner group">
                <img
                  src={activeProduct.image}
                  alt={activeProduct.imageAlt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />

                {/* Glassmorphic Live Metric Overlay */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                  <div className="glass-pill px-3 py-1.5 rounded-xl text-xs font-bold text-stone-900 flex items-center gap-2">
                    <Gauge className="w-4 h-4 text-[#7aa32c]" />
                    <span>{activeProduct.metricBadge}</span>
                  </div>
                  <div className="glass-pill px-3 py-1.5 rounded-xl text-xs font-black text-[#2e4013]">
                    {activeProduct.metricValue}
                  </div>
                </div>

                {/* Bottom Overlay Info */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-4 text-white">
                  <div className="text-sm font-bold">{activeProduct.title}</div>
                  <p className="text-[11px] text-stone-300 truncate">
                    {activeProduct.description}
                  </p>
                </div>
              </div>

              {/* Bottom Quick Metric Tickers */}
              <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200">
                  <div className="text-[10px] uppercase font-bold text-stone-400">
                    Integration
                  </div>
                  <div className="text-xs font-bold text-stone-900">Cloud API & IoT</div>
                </div>
                <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200">
                  <div className="text-[10px] uppercase font-bold text-stone-400">
                    Deployment
                  </div>
                  <div className="text-xs font-bold text-stone-900">Dedicated Tenant</div>
                </div>
                <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200">
                  <div className="text-[10px] uppercase font-bold text-stone-400">
                    SLA Guarantee
                  </div>
                  <div className="text-xs font-bold text-[#7aa32c]">99.95% Uptime</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
