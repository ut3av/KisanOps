import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Tractor,
  Mail,
  Lock,
  User,
  ShieldCheck,
  Building2,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Wheat,
  Zap,
  Radio,
  Check
} from 'lucide-react';
import { useKisanOpsStore } from '../../store/kisanOpsStore';
import { UserRole, UserProfile } from '../../types';
import { signInWithEmail, signUpWithEmail } from '../../lib/supabaseClient';
import { SEEDED_PROFILES } from '../../data/seedData';
import { usePageTitle } from '../../hooks/usePageTitle';
import clsx from 'clsx';

export const LoginPage: React.FC = () => {
  usePageTitle(
    'Authentication Portal | Yukti',
    'Sign in or create your Yukti agricultural operations workspace account.'
  );
  const { loginUser } = useKisanOpsStore();
  const navigate = useNavigate();

  const [authMode, setAuthMode] = useState<'SIGN_IN' | 'SIGN_UP'>('SIGN_IN');
  const [selectedRole, setSelectedRole] = useState<UserRole>('FARMER');

  // Form Fields
  const [fullName, setFullName] = useState<string>('');
  const [emailOrPhone, setEmailOrPhone] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Status handling
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const roleConfigs: Record<
    UserRole,
    {
      label: string;
      icon: React.ComponentType<{ className?: string }>;
      desc: string;
      destination: string;
    }
  > = {
    FARMER: {
      label: 'Farmer',
      icon: Wheat,
      desc: 'Predictive equipment matching, deferred credit & booking',
      destination: '/farmer',
    },
    CHC_MANAGER: {
      label: 'CHC Provider',
      icon: Building2,
      desc: 'Fleet management, telematics tracking & rental dispatch',
      destination: '/chc',
    },
    OPERATOR: {
      label: 'Operator',
      icon: Zap,
      desc: 'In-field telemetry logging, diesel slips & job execution',
      destination: '/operator',
    },
    ADMIN: {
      label: 'Administrator',
      icon: ShieldCheck,
      desc: 'Inter-hub fleet rebalancing, demand forecasts & governance',
      destination: '/admin',
    },
    FLEET_MANAGER: {
      label: 'Fleet Manager',
      icon: Tractor,
      desc: 'Asset health monitoring & preventive maintenance',
      destination: '/chc/fleet',
    },
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    if (authMode === 'SIGN_UP') {
      if (!fullName.trim()) {
        setIsLoading(false);
        setErrorMessage('Please enter your full name.');
        return;
      }
      if (!emailOrPhone.trim() || !password) {
        setIsLoading(false);
        setErrorMessage('Please provide a valid email/phone and password.');
        return;
      }

      // Convert phone or email
      const email = emailOrPhone.includes('@')
        ? emailOrPhone.trim()
        : `${emailOrPhone.replace(/[^0-9]/g, '') || 'user'}@kisanops.in`;

      const res = await signUpWithEmail(email, password, fullName, selectedRole);
      setIsLoading(false);

      if (res.success && res.user) {
        setSuccessMessage('Account registered successfully! Entering your workspace...');
        setTimeout(() => completeAuth(res.user!), 600);
      } else {
        setErrorMessage(res.error || 'Registration failed. Please try again.');
      }
    } else {
      // Sign In
      if (!emailOrPhone.trim() || !password) {
        setIsLoading(false);
        setErrorMessage('Please enter both email/phone and password.');
        return;
      }

      const email = emailOrPhone.includes('@')
        ? emailOrPhone.trim()
        : `${emailOrPhone.replace(/[^0-9]/g, '') || 'user'}@kisanops.in`;

      const res = await signInWithEmail(email, password);
      setIsLoading(false);

      if (res.success && res.user) {
        completeAuth({
          ...res.user,
          role: selectedRole,
        });
      } else {
        setErrorMessage(res.error || 'Invalid email or password. Please verify your credentials or register a new account.');
      }
    }
  };

  const completeAuth = (profile: UserProfile) => {
    loginUser(profile);
    const dest = roleConfigs[profile.role]?.destination || '/farmer';
    navigate(dest);
  };

  const currentRoleConfig = roleConfigs[selectedRole];

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-3 sm:p-6 lg:p-10 font-sans selection:bg-emerald-500/20 selection:text-emerald-950">
      {/* Main Split Authentication Card */}
      <div className="bg-white rounded-[28px] sm:rounded-[36px] shadow-2xl border border-slate-200/90 max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* Left Column: Brand Hero Card */}
        <div className="lg:col-span-5 bg-gradient-to-br from-agri-900 via-agri-950 to-slate-950 text-white p-7 sm:p-10 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle Background Glows */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Brand Header */}
          <div className="relative z-10 space-y-6">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-2xl bg-white p-1 flex items-center justify-center border border-white/20 shadow-md group-hover:scale-105 transition-transform overflow-hidden">
                <img
                  src="/images/yukti-logo-transparent.png"
                  alt="Yukti Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="font-display text-2xl font-black text-white tracking-tight">
                  Yukti<span className="text-emerald-400">.ai</span>
                </span>
              </div>
            </Link>

            <div className="space-y-3 pt-4">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-snug">
                Smart Agricultural Operations Platform
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Enterprise-grade machinery demand forecasting, real-time fleet allocation, transparent pricing safeguards, and CAN-Bus telematics.
              </p>
            </div>
          </div>

          {/* Feature Checklist Strip */}
          <div className="relative z-10 space-y-3 pt-8 mt-8 border-t border-white/10 text-xs">
            <div className="flex items-center gap-2.5 text-slate-200">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0">
                <Check className="w-3.5 h-3.5" />
              </div>
              <span className="font-medium">Deterministic Fleet Allocation Optimizer</span>
            </div>

            <div className="flex items-center gap-2.5 text-slate-200">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0">
                <Check className="w-3.5 h-3.5" />
              </div>
              <span className="font-medium">Dynamic Pricing Guardrails (80% – 130%)</span>
            </div>

            <div className="flex items-center gap-2.5 text-slate-200">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0">
                <Check className="w-3.5 h-3.5" />
              </div>
              <span className="font-medium">Live CAN-Bus Telemetry & IoT Streaming</span>
            </div>

            <div className="flex items-center gap-2.5 text-slate-200">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0">
                <Check className="w-3.5 h-3.5" />
              </div>
              <span className="font-medium">Deferred AgriCredit & Instant Tax Invoicing</span>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Role Portal & Auth Form */}
        <div className="lg:col-span-7 p-7 sm:p-10 flex flex-col justify-center space-y-6">
          {/* Header Title */}
          <div>
            <div className="text-[10px] font-extrabold tracking-widest text-emerald-700 uppercase mb-1">
              AUTHENTICATION PORTAL
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {authMode === 'SIGN_IN' ? 'Sign In to Yukti' : 'Register on Yukti'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Select your role portal to access your designated workspace.
            </p>
          </div>

          {/* Role Portal Selector Cards (Horizontal Grid) */}
          <div className="grid grid-cols-2 gap-2.5">
            {(['FARMER', 'CHC_MANAGER', 'OPERATOR', 'ADMIN'] as UserRole[]).map(role => {
              const cfg = roleConfigs[role];
              const IconComp = cfg.icon;
              const isSelected = selectedRole === role;

              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => setSelectedRole(role)}
                  className={clsx(
                    'p-3.5 rounded-2xl border text-left transition-all relative flex flex-col justify-between cursor-pointer group',
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/40 shadow-xs ring-2 ring-emerald-600/20'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/70 bg-white'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <IconComp
                        className={clsx(
                          'w-4 h-4 shrink-0 transition-colors',
                          isSelected ? 'text-emerald-700' : 'text-slate-500 group-hover:text-slate-800'
                        )}
                      />
                      <span className={clsx(
                        'text-xs font-bold',
                        isSelected ? 'text-slate-900' : 'text-slate-700'
                      )}>
                        {cfg.label}
                      </span>
                    </div>

                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                    )}
                  </div>

                  <p className="text-[10px] text-slate-500 mt-1.5 line-clamp-2 leading-tight">
                    {cfg.desc}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Alerts */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleAuthSubmit} className="space-y-4 text-xs">
            {/* Full Name for Registration */}
            {authMode === 'SIGN_UP' && (
              <div className="space-y-1 animate-in fade-in">
                <label className="font-bold text-slate-700">Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar / Vansh"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-surface-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Email or Phone */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700">
                Email Address or Mobile Number *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="name@kisanops.in or +91 98765 43210"
                  value={emailOrPhone}
                  onChange={e => setEmailOrPhone(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-surface-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-700">Password *</label>
                {authMode === 'SIGN_IN' && (
                  <button
                    type="button"
                    onClick={() => setErrorMessage('Please enter your credentials or use any test password.')}
                    className="text-[11px] text-emerald-700 hover:text-emerald-900 font-bold cursor-pointer"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 bg-surface-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-agri-700 hover:bg-agri-800 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>
                    {authMode === 'SIGN_IN'
                      ? `Sign In to ${currentRoleConfig.label} Portal`
                      : `Register ${currentRoleConfig.label} Account`}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Toggle between Sign In and Sign Up */}
          <div className="text-center pt-2 border-t border-slate-100">
            {authMode === 'SIGN_IN' ? (
              <p className="text-xs text-slate-600">
                Need an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('SIGN_UP');
                    setErrorMessage(null);
                  }}
                  className="text-emerald-700 font-extrabold hover:underline cursor-pointer ml-1"
                >
                  Register new identity
                </button>
              </p>
            ) : (
              <p className="text-xs text-slate-600">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('SIGN_IN');
                    setErrorMessage(null);
                  }}
                  className="text-emerald-700 font-extrabold hover:underline cursor-pointer ml-1"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>

          {/* Quick Demo Credentials Autofill Row */}
          <div className="pt-2 border-t border-slate-100/80">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center justify-between">
              <span>Quick Test Identities</span>
              <span className="text-emerald-700 font-semibold lowercase">password: password123</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {SEEDED_PROFILES.map((prof) => (
                <button
                  key={prof.id}
                  type="button"
                  onClick={() => {
                    setEmailOrPhone(prof.email || '');
                    setPassword('password123');
                    setSelectedRole(prof.role);
                    setAuthMode('SIGN_IN');
                    setErrorMessage(null);
                  }}
                  className="px-2 py-1.5 rounded-lg bg-surface-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold truncate transition-colors text-left border border-slate-200/80 cursor-pointer"
                  title={`Use ${prof.fullName} (${prof.role})`}
                >
                  <div className="truncate font-extrabold text-slate-900">{prof.fullName}</div>
                  <div className="text-[9px] text-slate-500 capitalize">{prof.role.toLowerCase().replace('_', ' ')}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
