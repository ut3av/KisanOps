import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ChevronDown,
  Menu,
  X,
  Tractor,
  Building2,
  ShieldCheck,
  Satellite,
  Cpu,
  Layers,
  ArrowRight,
  Truck,
  Leaf,
  Boxes,
  Compass,
  LogIn,
  CreditCard,
  Building,
  QrCode,
  ShoppingCart,
  Calculator,
  Info,
  PhoneCall,
  Sparkles,
  Sprout
} from 'lucide-react';
import { useKisanOpsStore } from '../../../store/kisanOpsStore';
import { UserRole } from '../../../types';

export const LandingNavbar: React.FC = () => {
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

  const handleNavClick = (path: string) => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
          <Link
            to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2.5 group select-none cursor-pointer"
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
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {/* Products Mega Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown('products')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                onClick={() => handleNavClick('/products/pre-harvest')}
                className="flex items-center gap-1 px-3 py-2 text-sm font-semibold text-stone-700 hover:text-[#7aa32c] rounded-xl transition-colors cursor-pointer"
              >
                <span>Products</span>
                <ChevronDown className="w-4 h-4 text-stone-400 transition-transform duration-200" />
              </button>

              {activeDropdown === 'products' && (
                <div className="absolute top-full -left-20 w-[680px] bg-white rounded-2xl shadow-xl border border-stone-200/80 p-6 grid grid-cols-3 gap-6 animate-in fade-in slide-in-from-top-2 duration-200">
                  {/* Column 1: Pre-Harvest */}
                  <div className="space-y-3">
                    <div
                      onClick={() => handleNavClick('/products/pre-harvest')}
                      className="text-xs font-bold uppercase tracking-wider text-[#7aa32c] pb-1 border-b border-stone-100 cursor-pointer flex items-center justify-between group"
                    >
                      <span>Pre-Harvest</span>
                      <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    <div
                      onClick={() => handleNavClick('/products/pre-harvest')}
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
                      onClick={() => handleNavClick('/products/pre-harvest')}
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
                      onClick={() => handleNavClick('/products/pre-harvest')}
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

                  {/* Column 2: Post-Harvest & Logistics */}
                  <div className="space-y-3">
                    <div
                      onClick={() => handleNavClick('/products/post-harvest')}
                      className="text-xs font-bold uppercase tracking-wider text-[#7aa32c] pb-1 border-b border-stone-100 cursor-pointer flex items-center justify-between group"
                    >
                      <span>Post-Harvest</span>
                      <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    <div
                      onClick={() => handleNavClick('/products/post-harvest')}
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
                      onClick={() => handleNavClick('/products/post-harvest')}
                      className="group cursor-pointer p-2 rounded-xl hover:bg-[#F5FAED] transition-colors"
                    >
                      <div className="flex items-center gap-2 font-bold text-xs text-stone-800 group-hover:text-[#28564a]">
                        <QrCode className="w-4 h-4 text-[#7aa32c]" />
                        <span>Food Traceability</span>
                      </div>
                      <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">
                        Auditable farm-to-fork batch certification.
                      </p>
                    </div>

                    <div
                      onClick={() => handleNavClick('/products/post-harvest')}
                      className="group cursor-pointer p-2 rounded-xl hover:bg-[#F5FAED] transition-colors"
                    >
                      <div className="flex items-center gap-2 font-bold text-xs text-stone-800 group-hover:text-[#28564a]">
                        <ShoppingCart className="w-4 h-4 text-[#7aa32c]" />
                        <span>Equipment Marketplace</span>
                      </div>
                      <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">
                        Dynamic multi-hub rental & attachment pool.
                      </p>
                    </div>
                  </div>

                  {/* Column 3: Operations & Finance */}
                  <div className="space-y-3">
                    <div
                      onClick={() => handleNavClick('/products/operations')}
                      className="text-xs font-bold uppercase tracking-wider text-[#7aa32c] pb-1 border-b border-stone-100 cursor-pointer flex items-center justify-between group"
                    >
                      <span>Operations & Finance</span>
                      <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    <div
                      onClick={() => handleNavClick('/products/operations')}
                      className="group cursor-pointer p-2 rounded-xl hover:bg-[#F5FAED] transition-colors"
                    >
                      <div className="flex items-center gap-2 font-bold text-xs text-stone-800 group-hover:text-[#28564a]">
                        <CreditCard className="w-4 h-4 text-[#7aa32c]" />
                        <span>Financials & AgriCredit</span>
                      </div>
                      <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">
                        Deferred harvest payments & 0-900 scoring.
                      </p>
                    </div>

                    <div
                      onClick={() => handleNavClick('/products/operations')}
                      className="group cursor-pointer p-2 rounded-xl hover:bg-[#F5FAED] transition-colors"
                    >
                      <div className="flex items-center gap-2 font-bold text-xs text-stone-800 group-hover:text-[#28564a]">
                        <Building className="w-4 h-4 text-[#7aa32c]" />
                        <span>Farm & CHC ERP</span>
                      </div>
                      <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">
                        Resource, fuel & GST invoice management.
                      </p>
                    </div>

                    <div
                      onClick={() => handleNavClick('/products/operations')}
                      className="group cursor-pointer p-2 rounded-xl hover:bg-[#F5FAED] transition-colors"
                    >
                      <div className="flex items-center gap-2 font-bold text-xs text-stone-800 group-hover:text-[#28564a]">
                        <Leaf className="w-4 h-4 text-[#7aa32c]" />
                        <span>Sustainability ESG</span>
                      </div>
                      <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">
                        Carbon footprint & diesel optimization.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Solutions Link */}
            <button
              onClick={() => handleNavClick('/solutions/chc')}
              className="px-3 py-2 text-sm font-semibold text-stone-700 hover:text-[#7aa32c] rounded-xl transition-colors cursor-pointer"
            >
              Solutions
            </button>

            {/* Pricing & ROI Link */}
            <button
              onClick={() => handleNavClick('/pricing')}
              className="px-3 py-2 text-sm font-semibold text-stone-700 hover:text-[#7aa32c] rounded-xl transition-colors cursor-pointer"
            >
              ROI Calculator
            </button>

            {/* About Link */}
            <button
              onClick={() => handleNavClick('/about')}
              className="px-3 py-2 text-sm font-semibold text-stone-700 hover:text-[#7aa32c] rounded-xl transition-colors cursor-pointer"
            >
              About Us
            </button>
          </nav>

          {/* Right Action Area */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Live Role Portal Launcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setPortalDropdownOpen(!portalDropdownOpen)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-xs font-bold text-stone-700 hover:border-stone-400 transition-colors shadow-subtle cursor-pointer"
              >
                <Compass className="w-3.5 h-3.5 text-[#7aa32c]" />
                <span>Live Portals</span>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
              </button>

              {portalDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-stone-200 p-2 z-50 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-stone-400">
                    Switch Workspace Role
                  </div>
                  <button
                    onClick={() => handleLaunchRole('FARMER')}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-emerald-50 text-xs font-bold text-stone-800 flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <Sprout className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <div>Farmer Mobile App</div>
                      <div className="text-[10px] text-stone-500 font-normal">Rentals, Plots & AgriCredit</div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleLaunchRole('CHC_MANAGER')}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-[#F5FAED] text-xs font-bold text-stone-800 flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <Building2 className="w-4 h-4 text-[#7aa32c] shrink-0" />
                    <div>
                      <div>CHC Operations Hub</div>
                      <div className="text-[10px] text-stone-500 font-normal">Telematics, Radar & Allocation</div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleLaunchRole('ADMIN')}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 text-xs font-bold text-stone-800 flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-slate-700 shrink-0" />
                    <div>
                      <div>Platform Governance</div>
                      <div className="text-[10px] text-stone-500 font-normal">Multi-District Administration</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Direct Login Button (Replaces Book a Demo) */}
            <button
              onClick={() => navigate('/login')}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#1b4d3e] hover:bg-[#153e32] text-white text-xs font-bold shadow-md shadow-[#1b4d3e]/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <LogIn className="w-4 h-4 text-[#9dc84d]" />
              <span>Sign In</span>
            </button>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => navigate('/login')}
              className="px-3.5 py-1.5 rounded-full bg-[#1b4d3e] text-white text-xs font-bold"
            >
              Sign In
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

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-stone-200 px-4 pt-4 pb-6 space-y-3 animate-in slide-in-from-top duration-200">
          <div className="space-y-1">
            <button
              onClick={() => handleNavClick('/products/pre-harvest')}
              className="w-full text-left py-2 px-3 rounded-lg text-sm font-semibold text-stone-800 hover:bg-stone-50"
            >
              Pre-Harvest Suite
            </button>
            <button
              onClick={() => handleNavClick('/products/post-harvest')}
              className="w-full text-left py-2 px-3 rounded-lg text-sm font-semibold text-stone-800 hover:bg-stone-50"
            >
              Post-Harvest & Logistics
            </button>
            <button
              onClick={() => handleNavClick('/products/operations')}
              className="w-full text-left py-2 px-3 rounded-lg text-sm font-semibold text-stone-800 hover:bg-stone-50"
            >
              Operations & AgriCredit
            </button>
            <button
              onClick={() => handleNavClick('/solutions/chc')}
              className="w-full text-left py-2 px-3 rounded-lg text-sm font-semibold text-stone-800 hover:bg-stone-50"
            >
              Solutions for CHCs & Enterprises
            </button>
            <button
              onClick={() => handleNavClick('/pricing')}
              className="w-full text-left py-2 px-3 rounded-lg text-sm font-semibold text-stone-800 hover:bg-stone-50"
            >
              ROI Calculator
            </button>
            <button
              onClick={() => handleNavClick('/about')}
              className="w-full text-left py-2 px-3 rounded-lg text-sm font-semibold text-stone-800 hover:bg-stone-50"
            >
              About Us
            </button>
          </div>

          <div className="pt-3 border-t border-stone-100 space-y-2">
            <div className="text-xs font-bold text-stone-400 uppercase tracking-wider">
              Quick Workspace Access
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
                <span>CHC Hub</span>
              </button>
            </div>
            <button
              onClick={() => handleNavClick('/login')}
              className="w-full py-3 rounded-xl bg-[#1b4d3e] text-white text-center font-bold text-xs shadow-md"
            >
              Sign In to Yukti Platform
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default LandingNavbar;
