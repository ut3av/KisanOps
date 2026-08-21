import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  ShieldCheck,
  ArrowUp,
  ExternalLink,
  LogIn
} from 'lucide-react';

export const LandingFooter: React.FC = () => {
  const navigate = useNavigate();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#1c1d1f] text-white pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-stone-800/80">
          {/* Col 1: Brand & Contact Info */}
          <div className="space-y-4 lg:col-span-1">
            <Link
              to="/"
              className="flex items-center gap-2.5 cursor-pointer"
              onClick={scrollToTop}
            >
              <div className="w-9 h-9 rounded-xl bg-white/90 p-1 flex items-center justify-center border border-stone-700 shadow-sm overflow-hidden">
                <img
                  src="/images/yukti-logo-transparent.png"
                  alt="Yukti Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-typewriter text-2xl font-bold tracking-tight text-white">
                Yukti
              </span>
            </Link>

            <p className="text-xs text-stone-400 leading-relaxed font-sans">
              Cloud-based SaaS platform for agricultural machinery intelligence, predictive demand allocation, and Custom Hiring Centre operations.
            </p>

            <div className="space-y-2 pt-2 text-xs text-stone-300">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#7aa32c] shrink-0" />
                <a href="mailto:contact@yukti.ag" className="hover:text-white">
                  contact@yukti.ag
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#7aa32c] shrink-0" />
                <a href="tel:+919172283500" className="hover:text-white">
                  +91-91722-83500 (IN)
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#7aa32c] shrink-0" />
                <span>Bhopal & Pune AgTech Innovation Hub</span>
              </div>
            </div>
          </div>

          {/* Col 2: Products */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-300">
              Products
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <Link to="/products/pre-harvest" className="hover:text-white transition-colors">
                  Farm Management Software
                </Link>
              </li>
              <li>
                <Link to="/products/pre-harvest" className="hover:text-white transition-colors">
                  Remote Sensing & GIS (NDVI)
                </Link>
              </li>
              <li>
                <Link to="/products/post-harvest" className="hover:text-white transition-colors">
                  Supply Chain & Fleet Telematics
                </Link>
              </li>
              <li>
                <Link to="/products/pre-harvest" className="hover:text-white transition-colors">
                  Crop Advisory & IoT Sensors
                </Link>
              </li>
              <li>
                <Link to="/products/post-harvest" className="hover:text-white transition-colors">
                  Food Traceability & Audit Logs
                </Link>
              </li>
              <li>
                <Link to="/products/operations" className="hover:text-white transition-colors">
                  Financials & Deferred AgriCredit
                </Link>
              </li>
              <li>
                <Link to="/products/operations" className="hover:text-white transition-colors">
                  Enterprise Farm & CHC ERP
                </Link>
              </li>
              <li>
                <Link to="/products/operations" className="hover:text-white transition-colors">
                  Sustainability & Carbon Offsets
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Industries */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-300">
              Industries
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <Link to="/solutions/chc" className="hover:text-white transition-colors">
                  Custom Hiring Centres (CHCs)
                </Link>
              </li>
              <li>
                <Link to="/solutions/chc" className="hover:text-white transition-colors">
                  Enterprise & Corporate Farms
                </Link>
              </li>
              <li>
                <Link to="/solutions/chc" className="hover:text-white transition-colors">
                  Plantations & Orchards
                </Link>
              </li>
              <li>
                <Link to="/solutions/chc" className="hover:text-white transition-colors">
                  Agri-Input Manufacturers
                </Link>
              </li>
              <li>
                <Link to="/solutions/chc" className="hover:text-white transition-colors">
                  Food & Beverage Processors
                </Link>
              </li>
              <li>
                <Link to="/solutions/chc" className="hover:text-white transition-colors">
                  Cooperatives & FPOs
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Live Portals & Resources */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-300">
              Live Product Portals
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button
                  onClick={() => navigate('/farmer')}
                  className="hover:text-[#7aa32c] transition-colors text-left flex items-center gap-1 cursor-pointer"
                >
                  <span>Farmer Mobile Experience</span>
                  <ExternalLink className="w-3 h-3 text-[#7aa32c]" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/chc')}
                  className="hover:text-[#7aa32c] transition-colors text-left flex items-center gap-1 cursor-pointer"
                >
                  <span>CHC Operations Hub</span>
                  <ExternalLink className="w-3 h-3 text-[#7aa32c]" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/admin')}
                  className="hover:text-[#7aa32c] transition-colors text-left flex items-center gap-1 cursor-pointer"
                >
                  <span>Platform Governance Hub</span>
                  <ExternalLink className="w-3 h-3 text-[#7aa32c]" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/login')}
                  className="hover:text-white transition-colors text-left flex items-center gap-1 cursor-pointer"
                >
                  <LogIn className="w-3 h-3 text-[#7aa32c]" />
                  <span>Platform Sign In</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Company & Compliance */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-300">
              Company & Compliance
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About Yukti
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-white transition-colors">
                  ROI & Fleet Calculator
                </Link>
              </li>
            </ul>

            <div className="pt-2">
              <div className="p-3 rounded-xl bg-stone-900 border border-stone-800 text-[11px] text-stone-400 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-white">
                  <ShieldCheck className="w-4 h-4 text-[#7aa32c]" />
                  <span>Enterprise Ready</span>
                </div>
                <p>SOC2 Type II • ISO 27001 • AES-256 Encryption</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div>
            © {new Date().getFullYear()} Yukti AgTech Platform. All Rights Reserved.
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate('/login')}
              className="hover:text-stone-300 transition-colors cursor-pointer"
            >
              Sign In
            </button>
            <Link to="/about" className="hover:text-stone-300 transition-colors">
              About
            </Link>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-full bg-stone-800 hover:bg-[#7aa32c] text-white transition-colors cursor-pointer"
              title="Back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
