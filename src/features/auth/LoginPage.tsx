import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Tractor,
  Phone,
  Mail,
  Lock,
  User,
  ShieldCheck,
  Building2,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Eye,
  EyeOff,
  RotateCcw
} from 'lucide-react';
import { useKisanOpsStore } from '../../store/kisanOpsStore';
import { UserRole, UserProfile } from '../../types';
import { sendPhoneOtp, verifyPhoneOtp, signInWithEmail, signUpWithEmail, isSupabaseConfigured } from '../../lib/supabaseClient';
import { SEEDED_PROFILES } from '../../data/seedData';
import clsx from 'clsx';

export const LoginPage: React.FC = () => {
  const { switchRole } = useKisanOpsStore();
  const navigate = useNavigate();

  const [authMethod, setAuthMethod] = useState<'PHONE' | 'EMAIL'>('PHONE');
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('FARMER');

  // Form Fields
  const [phone, setPhone] = useState<string>('9826041234');
  const [email, setEmail] = useState<string>('ramesh.kumar@kisanops.in');
  const [password, setPassword] = useState<string>('kisanops2026');
  const [fullName, setFullName] = useState<string>('Ramesh Kumar');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // OTP State
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otpCode, setOtpCode] = useState<string>('123456');
  const [resendTimer, setResendTimer] = useState<number>(30);

  // Status & Error handling
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    const res = await sendPhoneOtp(phone);
    setIsLoading(false);

    if (res.success) {
      setOtpSent(true);
      setSuccessMessage(`OTP sent to +91 ${phone}. (Demo OTP: 123456)`);
      setResendTimer(30);
    } else {
      setErrorMessage(res.error || 'Failed to send OTP. Please check the number.');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    const res = await verifyPhoneOtp(phone, otpCode, selectedRole, isSignUp ? fullName : undefined);
    setIsLoading(false);

    if (res.success && res.user) {
      completeAuth(res.user);
    } else {
      setErrorMessage(res.error || 'Invalid OTP code. Please try again.');
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    if (isSignUp) {
      const res = await signUpWithEmail(email, password, fullName, selectedRole, phone);
      setIsLoading(false);
      if (res.success && res.user) {
        completeAuth(res.user);
      } else {
        setErrorMessage(res.error || 'Sign up failed.');
      }
    } else {
      const res = await signInWithEmail(email, password);
      setIsLoading(false);
      if (res.success && res.user) {
        completeAuth(res.user);
      } else {
        setErrorMessage(res.error || 'Invalid credentials.');
      }
    }
  };

  const handleQuickDemoSignIn = (profile: UserProfile) => {
    setIsLoading(true);
    setTimeout(() => {
      completeAuth(profile);
    }, 400);
  };

  const completeAuth = (profile: UserProfile) => {
    switchRole(profile.role);
    if (profile.role === 'FARMER') {
      navigate('/farmer');
    } else if (profile.role === 'ADMIN') {
      navigate('/admin');
    } else {
      navigate('/chc');
    }
  };

  return (
    <div className="min-h-screen bg-surface-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-3 group mb-2">
          <div className="w-12 h-12 rounded-2xl bg-agri-800 flex items-center justify-center text-white shadow-md group-hover:bg-agri-900 transition-colors">
            <Tractor className="w-7 h-7" />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-agri-950 tracking-tight">KisanOps</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                AUTH
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Predict. Allocate. Operate.</p>
          </div>
        </Link>
        <h2 className="mt-2 text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          {isSignUp ? 'Create your KisanOps Account' : 'Sign in to your account'}
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          {isSupabaseConfigured
            ? 'Connected to Supabase Cloud Authentication'
            : 'Secure Phone OTP & Email Authentication System'}
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-xl px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-elevated rounded-3xl border border-slate-200/90 space-y-6">
          {/* Method Selector: Phone OTP vs Email */}
          <div className="flex items-center p-1 bg-surface-100 rounded-2xl border border-slate-200">
            <button
              type="button"
              onClick={() => {
                setAuthMethod('PHONE');
                setOtpSent(false);
                setErrorMessage(null);
              }}
              className={clsx(
                'flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all',
                authMethod === 'PHONE'
                  ? 'bg-white text-agri-950 shadow-subtle'
                  : 'text-slate-500 hover:text-slate-800'
              )}
            >
              <Phone className="w-4 h-4 text-emerald-600" />
              <span>Mobile Phone OTP</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthMethod('EMAIL');
                setErrorMessage(null);
              }}
              className={clsx(
                'flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all',
                authMethod === 'EMAIL'
                  ? 'bg-white text-agri-950 shadow-subtle'
                  : 'text-slate-500 hover:text-slate-800'
              )}
            >
              <Mail className="w-4 h-4 text-sky-600" />
              <span>Email & Password</span>
            </button>
          </div>

          {/* Error & Success Notifications */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-xs text-rose-800">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-2.5 text-xs text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Form 1: Phone OTP Authentication */}
          {authMethod === 'PHONE' && (
            <div>
              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  {isSignUp && (
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Full Name</label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={e => setFullName(e.target.value)}
                          placeholder="e.g. Ramesh Kumar"
                          className="w-full pl-10 pr-4 py-2.5 bg-surface-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-agri-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Mobile Phone Number</label>
                    <div className="flex items-center gap-2">
                      <span className="bg-surface-100 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700">
                        🇮🇳 +91
                      </span>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="98260 41234"
                        className="flex-1 px-4 py-2.5 bg-surface-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-agri-500 focus:outline-none"
                      />
                    </div>
                    <p className="text-[11px] text-slate-500">We'll send a 6-digit verification code via SMS.</p>
                  </div>

                  {isSignUp && (
                    <div className="space-y-1 pt-1">
                      <label className="text-xs font-bold text-slate-700">Register As</label>
                      <select
                        value={selectedRole}
                        onChange={e => setSelectedRole(e.target.value as UserRole)}
                        className="w-full bg-surface-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-agri-500 focus:outline-none"
                      >
                        <option value="FARMER">Farmer (Equipment Renter)</option>
                        <option value="OPERATOR">Machinery Operator</option>
                        <option value="CHC_MANAGER">Custom Hiring Centre (CHC) Manager</option>
                      </select>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full btn-primary text-xs py-3 shadow-md"
                  >
                    {isLoading ? 'Sending SMS OTP...' : 'Send Verification OTP'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-slate-700">Enter 6-Digit OTP Code</label>
                      <button
                        type="button"
                        onClick={() => setOtpSent(false)}
                        className="text-[11px] text-agri-700 font-bold hover:underline"
                      >
                        Change Number (+91 {phone})
                      </button>
                    </div>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        maxLength={6}
                        required
                        value={otpCode}
                        onChange={e => setOtpCode(e.target.value)}
                        placeholder="123456"
                        className="w-full pl-10 pr-4 py-2.5 bg-surface-50 border border-slate-200 rounded-xl text-center text-base tracking-[0.5em] font-mono font-extrabold text-slate-900 focus:ring-2 focus:ring-agri-500 focus:outline-none"
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                      <span>Demo test OTP: <strong>123456</strong></span>
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        className="text-agri-800 font-bold hover:underline"
                      >
                        Resend OTP
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || otpCode.length < 6}
                    className="w-full btn-primary text-xs py-3 shadow-md"
                  >
                    {isLoading ? 'Verifying with Supabase...' : 'Verify OTP & Log In'}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Form 2: Email & Password Authentication */}
          {authMethod === 'EMAIL' && (
            <form onSubmit={handleEmailAuth} className="space-y-4">
              {isSignUp && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full pl-10 pr-4 py-2.5 bg-surface-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-agri-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="name@kisanops.in"
                    className="w-full pl-10 pr-4 py-2.5 bg-surface-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-agri-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-700">Password</label>
                  {!isSignUp && (
                    <a href="#forgot" className="text-[11px] text-agri-700 font-bold hover:underline">
                      Forgot Password?
                    </a>
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
                    className="w-full pl-10 pr-10 py-2.5 bg-surface-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-agri-500 focus:outline-none"
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

              {isSignUp && (
                <div className="space-y-1 pt-1">
                  <label className="text-xs font-bold text-slate-700">Account Role</label>
                  <select
                    value={selectedRole}
                    onChange={e => setSelectedRole(e.target.value as UserRole)}
                    className="w-full bg-surface-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-agri-500 focus:outline-none"
                  >
                    <option value="FARMER">Farmer (Equipment Renter)</option>
                    <option value="OPERATOR">Machinery Operator</option>
                    <option value="CHC_MANAGER">Custom Hiring Centre (CHC) Manager</option>
                    <option value="ADMIN">Platform Administrator</option>
                  </select>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary text-xs py-3 shadow-md"
              >
                {isLoading ? 'Authenticating...' : isSignUp ? 'Create KisanOps Account' : 'Sign In with Email'}
              </button>
            </form>
          )}

          {/* Toggle Sign In vs Sign Up */}
          <div className="text-center pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className="text-xs text-slate-600 hover:text-agri-800 font-semibold"
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Register as Farmer / CHC"}
            </button>
          </div>

          {/* 1-Click Instant Demo Persona Logins */}
          <div className="pt-4 border-t border-slate-100 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
              <span>1-Click Seeded Demo Sign-In</span>
              <span className="text-[10px] font-mono text-emerald-600">Instant Access</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SEEDED_PROFILES.map(profile => (
                <button
                  key={profile.id}
                  type="button"
                  onClick={() => handleQuickDemoSignIn(profile)}
                  className="text-left p-2.5 rounded-2xl border border-slate-200/80 bg-surface-50 hover:bg-agri-50/70 hover:border-agri-300 transition-all flex items-center gap-2.5 group"
                >
                  {profile.avatarUrl ? (
                    <img
                      src={profile.avatarUrl}
                      alt={profile.fullName}
                      className="w-9 h-9 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-xl bg-agri-100 text-agri-900 font-bold flex items-center justify-center text-xs shrink-0">
                      {profile.fullName.charAt(0)}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-xs text-slate-900 group-hover:text-agri-900 truncate">
                      {profile.fullName}
                    </div>
                    <div className="text-[10px] text-slate-500 capitalize">
                      {profile.role.replace('_', ' ').toLowerCase()}
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-agri-800 group-hover:translate-x-0.5 transition-transform" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Security Footer Badge */}
        <div className="mt-6 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Protected by PostgreSQL Row Level Security (RLS) & 256-Bit SSL</span>
        </div>
      </div>
    </div>
  );
};
