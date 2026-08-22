import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Tractor,
  User,
  Building2,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  Radio,
  CreditCard,
  Cpu,
  Layers,
  Phone,
  Mail,
  Zap,
  Lock
} from 'lucide-react';
import { useKisanOpsStore } from '../../store/kisanOpsStore';
import { UserRole, UserProfile } from '../../types';
import { sendPhoneOtp, verifyPhoneOtp, signInWithEmail, signUpWithEmail, isSupabaseConfigured } from '../../lib/supabaseClient';
import { SEEDED_PROFILES } from '../../data/seedData';
import clsx from 'clsx';

interface RoleOption {
  role: UserRole;
  title: string;
  hindiTitle: string;
  desc: string;
  icon: React.ElementType;
  demoUser: UserProfile;
  accentColor: string;
  badge: string;
}

export const LoginPage: React.FC = () => {
  const { switchRole } = useKisanOpsStore();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState<UserRole>('FARMER');
  const [emailOrPhone, setEmailOrPhone] = useState<string>('ramesh.kumar@kisanops.in');
  const [password, setPassword] = useState<string>('kisanops2026');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [fullName, setFullName] = useState<string>('Ramesh Kumar');

  // Status & loading
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const roleOptions: RoleOption[] = [
    {
      role: 'FARMER',
      title: 'Farmer',
      hindiTitle: 'किसान पोर्टल',
      desc: 'Equipment booking, crop advisory, AgriCredit, live machine tracking',
      icon: User,
      demoUser: SEEDED_PROFILES.find(p => p.role === 'FARMER') || SEEDED_PROFILES[0],
      accentColor: 'from-emerald-500 to-emerald-700 text-emerald-600 border-emerald-500/30',
      badge: 'Mobile-First'
    },
    {
      role: 'CHC_MANAGER',
      title: 'CHC Operator / Hub',
      hindiTitle: 'हब प्रबंधक',
      desc: 'Fleet telematics, demand forecasting, bookings dispatch, maintenance',
      icon: Building2,
      demoUser: SEEDED_PROFILES.find(p => p.role === 'CHC_MANAGER') || SEEDED_PROFILES[1],
      accentColor: 'from-sky-500 to-sky-700 text-sky-600 border-sky-500/30',
      badge: 'Ops Hub'
    },
    {
      role: 'OPERATOR',
      title: 'Machinery Operator',
      hindiTitle: 'मशीन ऑपरेटर',
      desc: 'Active field execution, telemetry sensor sync & job completion logs',
      icon: Tractor,
      demoUser: SEEDED_PROFILES.find(p => p.role === 'OPERATOR') || SEEDED_PROFILES[2],
      accentColor: 'from-amber-500 to-amber-700 text-amber-600 border-amber-500/30',
      badge: 'Field App'
    },
    {
      role: 'ADMIN',
      title: 'Administrator',
      hindiTitle: 'प्रशासक',
      desc: 'Full institutional governance, subsidy verification & system analytics',
      icon: ShieldCheck,
      demoUser: SEEDED_PROFILES.find(p => p.role === 'ADMIN') || SEEDED_PROFILES[3],
      accentColor: 'from-purple-500 to-purple-700 text-purple-600 border-purple-500/30',
      badge: 'Governance'
    },
  ];

  const activeRoleConfig = roleOptions.find(r => r.role === selectedRole) || roleOptions[0];

  // Update input fields when role card changes
  const handleSelectRole = (role: UserRole) => {
    setSelectedRole(role);
    const targetConfig = roleOptions.find(r => r.role === role);
    if (targetConfig) {
      setEmailOrPhone(targetConfig.demoUser.email || targetConfig.demoUser.phoneNumber);
      setFullName(targetConfig.demoUser.fullName);
    }
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    // Simulate rapid auth verification with local profiles or Supabase
    setTimeout(() => {
      setIsLoading(false);
      const userProfile = roleOptions.find(r => r.role === selectedRole)?.demoUser || SEEDED_PROFILES[0];
      completeAuth(userProfile);
    }, 450);
  };

  const completeAuth = (profile: UserProfile) => {
    switchRole(profile.role);
    if (profile.role === 'FARMER') {
      navigate('/farmer');
    } else if (profile.role === 'ADMIN') {
      navigate('/admin');
    } else if (profile.role === 'OPERATOR') {
      navigate('/operator');
    } else {
      navigate('/chc');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900/95 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.15),rgba(255,255,255,0))]">
      {/* Central Split Card Modal Container */}
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row border border-slate-200/80 transition-all duration-300">
        
        {/* LEFT PANE: Vibrant Rich Brand Card */}
        <div className="lg:w-5/12 bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-950 p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Subtle Background Glow circles */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

          {/* Top Logo & Platform Name */}
          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-emerald-400 shadow-inner">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-2xl font-black tracking-tight text-white">Yukti</span>
                  <span className="text-2xl font-black text-amber-400">.ai</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 ml-1">
                    v2.6 PROD
                  </span>
                </div>
                <p className="text-[11px] text-indigo-200 font-mono">AgriFlow • KisanOps National Grid</p>
              </div>
            </div>

            {/* Hero Main Copy */}
            <div className="mt-8 space-y-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
                Smart Agricultural <br />
                <span className="text-amber-400">Operations Platform</span>
              </h1>
              <p className="text-xs sm:text-sm text-indigo-200 leading-relaxed font-normal">
                National agricultural machinery intelligence grid connecting farmers, custom hiring centers, operators, and governance with real-time telematics and automated dispatch.
              </p>
            </div>
          </div>

          {/* Middle: Feature Highlights Checklist */}
          <div className="my-8 space-y-3 relative z-10 border-t border-white/10 pt-6">
            <div className="flex items-center gap-3 text-xs text-indigo-100">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-400/30">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <span className="font-medium">AI Machine Recommendation & Voice Booking</span>
            </div>

            <div className="flex items-center gap-3 text-xs text-indigo-100">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-400/30">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <span className="font-medium">Live CAN-Bus Telematics & Fuel Anomaly Triage</span>
            </div>

            <div className="flex items-center gap-3 text-xs text-indigo-100">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-400/30">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <span className="font-medium">AgriCredit Deferred Scoring & Instant Invoicing</span>
            </div>

            <div className="flex items-center gap-3 text-xs text-indigo-100">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-400/30">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <span className="font-medium">Cross-Hub Regional Demand Surge Allocation</span>
            </div>
          </div>

          {/* Bottom Security Badge */}
          <div className="relative z-10 flex items-center justify-between text-[11px] text-indigo-300 border-t border-white/10 pt-4">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>256-Bit SSL Encrypted</span>
            </div>
            <span className="font-mono text-[10px] text-indigo-400">PostgreSQL RLS</span>
          </div>
        </div>

        {/* RIGHT PANE: Authentication & Role Selection Form */}
        <div className="lg:w-7/12 p-6 sm:p-10 flex flex-col justify-between bg-white">
          <div>
            {/* Subtitle & Title */}
            <div className="space-y-1">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-indigo-600">
                AUTHENTICATION PORTAL
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Sign In to KisanOps
              </h2>
              <p className="text-xs text-slate-500">
                Select your role portal to access your designated workspace.
              </p>
            </div>

            {/* Error / Success Notifications */}
            {errorMessage && (
              <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-xs text-rose-800 animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}
            {successMessage && (
              <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-2.5 text-xs text-emerald-800 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Role Cards Grid (4 Roles) */}
            <div className="mt-6">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                Active Portal View
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {roleOptions.map(option => {
                  const isSelected = selectedRole === option.role;
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.role}
                      type="button"
                      onClick={() => handleSelectRole(option.role)}
                      className={clsx(
                        'text-left p-3.5 rounded-2xl border transition-all relative flex flex-col justify-between group',
                        isSelected
                          ? 'bg-indigo-50/70 border-indigo-600 shadow-sm ring-1 ring-indigo-600'
                          : 'bg-surface-50 border-slate-200 hover:border-slate-300 hover:bg-slate-50/80'
                      )}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <div className="flex items-center gap-2">
                          <div
                            className={clsx(
                              'w-7 h-7 rounded-xl flex items-center justify-center text-xs transition-colors',
                              isSelected
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-200 text-slate-700 group-hover:bg-slate-300'
                            )}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <span
                            className={clsx(
                              'text-xs font-bold',
                              isSelected ? 'text-indigo-950' : 'text-slate-800'
                            )}
                          >
                            {option.title}
                          </span>
                        </div>
                        {isSelected && (
                          <div className="w-2 h-2 rounded-full bg-indigo-600 ring-4 ring-indigo-100" />
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 leading-snug line-clamp-2 mt-1">
                        {option.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dynamic Sign-In Form */}
            <form onSubmit={handleSignIn} className="mt-6 space-y-4">
              {/* Full Name when registering */}
              {isSignUp && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Full Name *</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full pl-10 pr-4 py-2.5 bg-surface-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Email / Username Input */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  {selectedRole === 'FARMER' ? 'Email or Mobile Number *' : 'Work Email Address *'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={emailOrPhone}
                    onChange={e => setEmailOrPhone(e.target.value)}
                    placeholder={
                      selectedRole === 'FARMER'
                        ? 'ramesh.kumar@kisanops.in'
                        : selectedRole === 'CHC_MANAGER'
                        ? 'rajesh@sehoreagri.in'
                        : selectedRole === 'OPERATOR'
                        ? 'raju.v@kisanops.in'
                        : 'admin@kisanops.in'
                    }
                    className="w-full pl-10 pr-4 py-2.5 bg-surface-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-700">Password *</label>
                  {!isSignUp && (
                    <button
                      type="button"
                      onClick={() => setPassword('kisanops2026')}
                      className="text-[11px] text-indigo-600 font-bold hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-surface-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Dynamic Primary CTA Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl font-bold text-xs text-white shadow-lg transition-all duration-200 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 active:scale-[0.99]"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Accessing {activeRoleConfig.title} Portal...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to {activeRoleConfig.title} Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Bottom Switch Links & Quick Demo Sign In Bar */}
          <div className="mt-6 pt-4 border-t border-slate-100 text-center space-y-3">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setErrorMessage(null);
              }}
              className="text-xs text-slate-500 hover:text-indigo-700 font-semibold transition-colors"
            >
              {isSignUp
                ? 'Already have an institutional identity? Sign In'
                : 'Need an account? Register new identity'}
            </button>

            {/* Quick Demo Sign-in chips */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
              <span className="text-[10px] text-slate-400 font-semibold mr-1">Demo Quick-Logins:</span>
              {roleOptions.map(opt => (
                <button
                  key={opt.role}
                  type="button"
                  onClick={() => {
                    handleSelectRole(opt.role);
                    completeAuth(opt.demoUser);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-surface-100 hover:bg-indigo-50 border border-slate-200 text-[10px] font-bold text-slate-700 hover:text-indigo-800 transition-colors"
                >
                  {opt.title.split(' ')[0]} ({opt.demoUser.fullName.split(' ')[0]})
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
