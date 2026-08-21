import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Calendar,
  CheckCircle2,
  Building2,
  Sprout,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Phone,
  Mail,
  User,
  Layers
} from 'lucide-react';
import { useKisanOpsStore } from '../../../store/kisanOpsStore';
import { UserRole } from '../../../types';
import { KisanLoader } from '../../../components/common/KisanLoader';

interface BookDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BookDemoModal: React.FC<BookDemoModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { switchRole } = useKisanOpsStore();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    roleInterest: 'CHC_MANAGER',
    fleetOrAcres: '10-25 Machines / 500+ Acres',
    preferredDate: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  const handleLaunchRole = (role: UserRole) => {
    switchRole(role);
    onClose();
    if (role === 'FARMER') navigate('/farmer');
    else if (role === 'ADMIN') navigate('/admin');
    else navigate('/chc');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-[#1b4d3e] to-[#28564a] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-[#9dc84d]" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Schedule a Platform Walkthrough</h3>
              <p className="text-xs text-emerald-200">
                Experience Yukti with real-time field telematics and fleet intelligence
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-4 text-center animate-in fade-in duration-200">
              <KisanLoader
                size="lg"
                text="Provisioning Dedicated AgTech Sandbox..."
                subtext="Configuring regional machinery telemetry & demand simulation models"
              />
            </div>
          ) : !submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Chandra"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-[#7aa32c]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Work Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="name@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-[#7aa32c]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Phone Number (Optional)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-[#7aa32c]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Organization / Farm
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sehore CHC Cluster"
                    value={formData.organization}
                    onChange={(e) =>
                      setFormData({ ...formData, organization: e.target.value })
                    }
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-[#7aa32c]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Fleet Size / Managed Area
                  </label>
                  <select
                    value={formData.fleetOrAcres}
                    onChange={(e) =>
                      setFormData({ ...formData, fleetOrAcres: e.target.value })
                    }
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-[#7aa32c] bg-white"
                  >
                    <option>1-5 Machines / &lt; 200 Acres</option>
                    <option>5-15 Machines / 200-1,000 Acres</option>
                    <option>15-50 Machines / 1,000-5,000 Acres</option>
                    <option>50+ Machines / 5,000+ Acres</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-[#7aa32c] hover:bg-[#6b9125] text-white font-extrabold text-xs shadow-md shadow-[#7aa32c]/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Confirm Walkthrough Request</span>
                </button>
              </div>

              <div className="text-center pt-2">
                <div className="text-[11px] text-stone-500">
                  Or launch the working platform directly without waiting:
                </div>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => handleLaunchRole('FARMER')}
                    className="text-xs font-bold text-emerald-700 hover:underline"
                  >
                    Farmer App
                  </button>
                  <span className="text-stone-300">•</span>
                  <button
                    type="button"
                    onClick={() => handleLaunchRole('CHC_MANAGER')}
                    className="text-xs font-bold text-[#7aa32c] hover:underline"
                  >
                    CHC Operations
                  </button>
                  <span className="text-stone-300">•</span>
                  <button
                    type="button"
                    onClick={() => handleLaunchRole('ADMIN')}
                    className="text-xs font-bold text-slate-700 hover:underline"
                  >
                    Admin Hub
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="py-6 text-center space-y-5 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-subtle">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h4 className="text-xl font-black text-stone-900">
                  Walkthrough Request Confirmed!
                </h4>
                <p className="text-xs text-stone-600 max-w-sm mx-auto mt-1">
                  Thank you, <span className="font-bold">{formData.name}</span>. An AgTech solutions engineer will reach out at{' '}
                  <span className="font-bold">{formData.email}</span> within 2 hours.
                </p>
              </div>

              {/* Instant Sandbox Launch */}
              <div className="p-4 bg-[#F5FAED] rounded-2xl border border-[#7aa32c]/30 text-left space-y-3">
                <div className="text-xs font-bold text-[#2e4013] uppercase tracking-wider">
                  Test Live Portals Right Now:
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => handleLaunchRole('CHC_MANAGER')}
                    className="w-full p-3 rounded-xl bg-white border border-stone-200 text-xs font-bold text-stone-900 hover:border-[#7aa32c] flex items-center justify-between shadow-subtle"
                  >
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-[#7aa32c]" />
                      <span>CHC Operations Hub (Telematics & Demand)</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#7aa32c]" />
                  </button>

                  <button
                    onClick={() => handleLaunchRole('FARMER')}
                    className="w-full p-3 rounded-xl bg-white border border-stone-200 text-xs font-bold text-stone-900 hover:border-emerald-500 flex items-center justify-between shadow-subtle"
                  >
                    <div className="flex items-center gap-2">
                      <Sprout className="w-4 h-4 text-emerald-600" />
                      <span>Farmer Mobile Portal (Rentals & AgriCredit)</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-emerald-600" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
