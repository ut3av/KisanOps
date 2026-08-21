import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sprout,
  ChevronDown,
  Menu,
  X,
  Tractor,
  Building2,
  ShieldCheck,
  Calendar,
  Satellite,
  BarChart3,
  Cpu,
  Layers,
  ArrowRight,
  Truck,
  Leaf,
  Boxes,
  Compass
} from 'lucide-react';
import { useKisanOpsStore } from '../../../store/kisanOpsStore';
import { UserRole } from '../../../types';

interface LandingNavbarProps {
  onOpenBookDemo: () => void;
}

export const LandingNavbar: React.FC<LandingNavbarProps> = ({ onOpenBookDemo }) => {
  const navigate = useNavigate();
  const { switchRole } = useKisanOpsStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [portalDropdownOpen, setPortalDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLaunchRole = (role: UserRole) => {
    switchRole(role);
    setPortalDropdownOpen(false);
    setMobileMenuOpen(false);
    if (role === 'FARMER') navigate('/farmer');
    else if (role === 'ADMIN') navigate('/admin');
    else navigate('/chc');
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm py-3 border-b border-stone-200/60'
          : 'bg-[#F5FAED]/90 backdrop-blur-sm py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-2xl bg-white/90 p-1 flex items-center justify-center shadow-sm border border-stone-200/80 group-hover:scale-105 transition-transform overflow-hidden">
              <img
                src="/images/yukti-logo-transparent.png"
                alt="Yukti Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-typewriter text-2xl font-bold tracking-tight text-[#1c1d1f]">
                  Yukti
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider bg-[#7aa32c]/15 text-[#2e4013] px-2 py-0.5 rounded-full font-sans">
                  AgTech SaaS
                </span>
              </div>
              <span className="text-[10px] text-stone-500 font-medium tracking-tight -mt-0.5 font-sans">
                Machinery Intelligence & CHC Platform
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {/* Products Mega Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown('products')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center gap-1 px-3 py-2 text-sm font-semibold text-stone-700 hover:text-[#7aa32c] rounded-xl transition-colors">
                <span>Products</span>
                <ChevronDown className="w-4 h-4 text-stone-400 transition-transform duration-200" />
              </button>

              {activeDropdown === 'products' && (
                <div className="absolute top-full -left-20 w-[680px] bg-white rounded-2xl shadow-xl border border-stone-200/80 p-6 grid grid-cols-3 gap-6 animate-in fade-in slide-in-from-top-2 duration-200">
                  {/* Column 1: Pre-Harvest */}
                  <div className="space-y-3">
                    <div className="text-xs font-bold uppercase tracking-wider text-[#7aa32c] pb-1 border-b border-stone-100">
                      Pre-Harvest
                    </div>
                    <div
                      onClick={() => scrollToSection('modular-products')}
                      className="group cursor-pointer p-2 rounded-xl hover:bg-[#F5FAED] transition-colors"
                    >
                      <div className="flex items-center gap-2 font-bold text-xs text-stone-800 group-hover:text-[#28564a]">
                        <Tractor className="w-4 h-4 text-[#7aa32c]" />
                        <span>Farm Management</span>
                      </div>
                      <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">
                        Sowing, practice logs & centralized operations.
                      </p>
                    </div>

                    <div
                      onClick={() => scrollToSection('modular-products')}
                      className="group cursor-pointer p-2 rounded-xl hover:bg-[#F5FAED] transition-colors"
                    >
                      <div className="flex items-center gap-2 font-bold text-xs text-stone-800 group-hover:text-[#28564a]">
                        <Satellite className="w-4 h-4 text-[#7aa32c]" />
                        <span>Remote Sensing (NDVI)</span>
                      </div>
                      <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">
                        Satellite GIS crop & soil moisture mapping.
                      </p>
                    </div>

                    <div
                      onClick={() => scrollToSection('modular-products')}
                      className="group cursor-pointer p-2 rounded-xl hover:bg-[#F5FAED] transition-colors"
                    >
                      <div className="flex items-center gap-2 font-bold text-xs text-stone-800 group-hover:text-[#28564a]">
                        <Cpu className="w-4 h-4 text-[#7aa32c]" />
                        <span>Crop Advisory & IoT</span>
                      </div>
                      <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">
                        Real-time pest, weather & fertilizer advisory.
                      </p>
                    </div>
                  </div>

                  {/* Column 2: Post-Harvest */}
                  <div className="space-y-3">
                    <div className="text-xs font-bold uppercase tracking-wider text-[#7aa32c] pb-1 border-b border-stone-100">
                      Post-Harvest & Logistics
                    </div>
                    <div
                      onClick={() => scrollToSection('modular-products')}
                      className="group cursor-pointer p-2 rounded-xl hover:bg-[#F5FAED] transition-colors"
                    >
                      <div className="flex items-center gap-2 font-bold text-xs text-stone-800 group-hover:text-[#28564a]">
                        <Truck className="w-4 h-4 text-[#7aa32c]" />
                        <span>Supply Chain & Fleet</span>
                      </div>
                      <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">
                        Live telematics, relocation & dispatch.
                      </p>
                    </div>

                    <div
                      onClick={() => scrollToSection('modular-products')}
                      className="group cursor-pointer p-2 rounded-xl hover:bg-[#F5FAED] transition-colors"
                    >
                      <div className="flex items-center gap-2 font-bold text-xs text-stone-800 group-hover:text-[#28564a]">
                        <Boxes className="w-4 h-4 text-[#7aa32c]" />
                        <span>Food Traceability</span>
                      </div>
                      <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">
                        Auditable farm-to-fork batch certification.
                      </p>
                    </div>

                    <div
                      onClick={() => scrollToSection('modular-products')}
                      className="group cursor-pointer p-2 rounded-xl hover:bg-[#F5FAED] transition-colors"
                    >
                      <div className="flex items-center gap-2 font-bold text-xs text-stone-800 group-hover:text-[#28564a]">
                        <Layers className="w-4 h-4 text-[#7aa32c]" />
                        <span>Equipment Marketplace</span>
                      </div>
                      <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">
                        Dynamic multi-hub rental & attachment pool.
                      </p>
                    </div>
                  </div>

                  {/* Column 3: Operations */}
                  <div className="space-y-3">
                    <div className="text-xs font-bold uppercase tracking-wider text-[#7aa32c] pb-1 border-b border-stone-100">
                      Operations & Finance
                    </div>
                    <div
                      onClick={() => scrollToSection('modular-products')}
                      className="group cursor-pointer p-2 rounded-xl hover:bg-[#F5FAED] transition-colors"
                    >
                      <div className="flex items-center gap-2 font-bold text-xs text-stone-800 group-hover:text-[#28564a]">
                        <BarChart3 className="w-4 h-4 text-[#7aa32c]" />
                        <span>Financials & AgriCredit</span>
                      </div>
                      <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">
                        Deferred harvest payments & 0-900 scoring.
                      </p>
                    </div>

                    <div
                      onClick={() => scrollToSection('modular-products')}
                      className="group cursor-pointer p-2 rounded-xl hover:bg-[#F5FAED] transition-colors"
                    >
                      <div className="flex items-center gap-2 font-bold text-xs text-stone-800 group-hover:text-[#28564a]">
                        <Building2 className="w-4 h-4 text-[#7aa32c]" />
                        <span>Farm & CHC ERP</span>
                      </div>
                      <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">
                        Real-time resource, fuel & revenue analytics.
                      </p>
                    </div>

                    <div
                      onClick={() => scrollToSection('modular-products')}
                      className="group cursor-pointer p-2 rounded-xl hover:bg-[#F5FAED] transition-colors"
                    >
                      <div className="flex items-center gap-2 font-bold text-xs text-stone-800 group-hover:text-[#28564a]">
                        <Leaf className="w-4 h-4 text-[#7aa32c]" />
                        <span>Sustainability ESG</span>
                      </div>
                      <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">
                        Carbon footprint & input optimization tracking.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* How It Works */}
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="px-3 py-2 text-sm font-semibold text-stone-700 hover:text-[#7aa32c] rounded-xl transition-colors"
            >
              How it works
            </button>

            {/* Platform Ecosystem */}
            <button
              onClick={() => scrollToSection('platform-ecosystem')}
              className="px-3 py-2 text-sm font-semibold text-stone-700 hover:text-[#7aa32c] rounded-xl transition-colors"
            >
              Platform
            </button>

            {/* Industries */}
            <button
              onClick={() => scrollToSection('industries')}
              className="px-3 py-2 text-sm font-semibold text-stone-700 hover:text-[#7aa32c] rounded-xl transition-colors"
            >
              Industries
            </button>

            {/* ROI Calculator */}
            <button
              onClick={() => scrollToSection('roi-calculator')}
              className="px-3 py-2 text-sm font-semibold text-stone-700 hover:text-[#7aa32c] rounded-xl transition-colors"
            >
              ROI Calculator
            </button>

            {/* FAQ */}
            <button
              onClick={() => scrollToSection('faq')}
              className="px-3 py-2 text-sm font-semibold text-stone-700 hover:text-[#7aa32c] rounded-xl transition-colors"
            >
              FAQ
            </button>
          </nav>

          {/* Action CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Launch App Dropdown */}
            <div className="relative">
              <button
                onClick={() => setPortalDropdownOpen(!portalDropdownOpen)}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-stone-300/80 bg-white text-xs font-bold text-stone-800 hover:bg-stone-50 shadow-sm transition-all"
              >
                <Compass className="w-4 h-4 text-[#7aa32c]" />
                <span>Live Portals</span>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
              </button>

              {portalDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-stone-200 p-2 space-y-1 z-50">
                  <div
                    onClick={() => handleLaunchRole('FARMER')}
                    className="p-2.5 rounded-xl hover:bg-emerald-50 cursor-pointer transition-colors flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                      <Sprout className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-stone-900">Farmer Portal</div>
                      <div className="text-[10px] text-stone-500">Rentals, AgriCredit & Tracking</div>
                    </div>
                  </div>

                  <div
                    onClick={() => handleLaunchRole('CHC_MANAGER')}
                    className="p-2.5 rounded-xl hover:bg-[#F5FAED] cursor-pointer transition-colors flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#7aa32c]/20 text-[#2e4013] flex items-center justify-center">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-stone-900">CHC Operations Hub</div>
                      <div className="text-[10px] text-stone-500">Fleet, Telematics & Dispatch</div>
                    </div>
                  </div>

                  <div
                    onClick={() => handleLaunchRole('ADMIN')}
                    className="p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-stone-900">Admin Governance</div>
                      <div className="text-[10px] text-stone-500">System Logs & Analytics</div>
                    </div>
                  </div>

                  <div className="pt-1 border-t border-stone-100">
                    <button
                      onClick={() => {
                        setPortalDropdownOpen(false);
                        navigate('/login');
                      }}
                      className="w-full text-left px-2.5 py-1.5 text-[11px] font-semibold text-stone-600 hover:text-stone-900 flex items-center justify-between"
                    >
                      <span>Supabase / Phone OTP Login</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Book a Demo Button */}
            <button
              onClick={onOpenBookDemo}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#7aa32c] hover:bg-[#6b9125] text-white text-xs font-bold shadow-md shadow-[#7aa32c]/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Book a Demo</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={onOpenBookDemo}
              className="px-3 py-1.5 rounded-full bg-[#7aa32c] text-white text-xs font-bold"
            >
              Demo
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-stone-100 text-stone-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-stone-200 px-4 pt-4 pb-6 space-y-3 animate-in slide-in-from-top duration-200">
          <div className="space-y-1">
            <button
              onClick={() => scrollToSection('modular-products')}
              className="w-full text-left py-2 px-3 rounded-lg text-sm font-semibold text-stone-800 hover:bg-stone-50"
            >
              Products & Solutions
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="w-full text-left py-2 px-3 rounded-lg text-sm font-semibold text-stone-800 hover:bg-stone-50"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('platform-ecosystem')}
              className="w-full text-left py-2 px-3 rounded-lg text-sm font-semibold text-stone-800 hover:bg-stone-50"
            >
              Multi-Device Platform
            </button>
            <button
              onClick={() => scrollToSection('industries')}
              className="w-full text-left py-2 px-3 rounded-lg text-sm font-semibold text-stone-800 hover:bg-stone-50"
            >
              Industries We Serve
            </button>
            <button
              onClick={() => scrollToSection('roi-calculator')}
              className="w-full text-left py-2 px-3 rounded-lg text-sm font-semibold text-stone-800 hover:bg-stone-50"
            >
              ROI Calculator
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className="w-full text-left py-2 px-3 rounded-lg text-sm font-semibold text-stone-800 hover:bg-stone-50"
            >
              FAQ
            </button>
          </div>

          <div className="pt-3 border-t border-stone-100 space-y-2">
            <div className="text-xs font-bold text-stone-400 uppercase tracking-wider">
              Launch Live Demonstration
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleLaunchRole('FARMER')}
                className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold text-left flex items-center gap-2"
              >
                <Sprout className="w-4 h-4 text-emerald-600" />
                <span>Farmer App</span>
              </button>
              <button
                onClick={() => handleLaunchRole('CHC_MANAGER')}
                className="p-2.5 bg-[#F5FAED] text-[#2e4013] rounded-xl text-xs font-bold text-left flex items-center gap-2"
              >
                <Building2 className="w-4 h-4 text-[#7aa32c]" />
                <span>CHC Operations</span>
              </button>
            </div>
            <button
              onClick={onOpenBookDemo}
              className="w-full py-3 rounded-xl bg-[#7aa32c] text-white text-center font-bold text-xs shadow-md"
            >
              Book an Interactive Demo Walkthrough
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
