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
  RotateCcw,
  Database,
  Sprout,
  Check
} from 'lucide-react';
import { useKisanOpsStore } from '../../store/kisanOpsStore';
import { UserRole, UserProfile } from '../../types';
import {
  sendPhoneOtp,
  verifyPhoneOtp,
  signInWithEmail,
  signUpWithEmail,
  isSupabaseConfigured,
  supabase
} from '../../lib/supabaseClient';
import { SEEDED_PROFILES } from '../../data/seedData';
import clsx from 'clsx';

export const LoginPage: React.FC = () => {
  const { switchRole } = useKisanOpsStore();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'SIGN_IN' | 'SIGN_UP'>('SIGN_IN');
  const [authMethod, setAuthMethod] = useState<'EMAIL' | 'PHONE'>('EMAIL');
  const [selectedRole, setSelectedRole] = useState<UserRole>('FARMER');

  // Form Fields - Fresh & Empty Defaults
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [district, setDistrict] = useState<string>('Sehore');
  const [village, setVillage] = useState<string>('Bilkisganj');

  // OTP State
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otpCode, setOtpCode] = useState<string>('');
  const [resendTimer, setResendTimer] = useState<number>(30);

  // Status & Error Handling
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showDemoPersonas, setShowDemoPersonas] = useState<boolean>(false);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);

    const res = await sendPhoneOtp(phone);
    setIsLoading(false);

    if (res.success) {
      setOtpSent(true);
      setSuccessMessage(`Verification OTP sent to +91 ${phone}. ${!isSupabaseConfigured ? '(Demo OTP: 123456)' : ''}`);
      setResendTimer(30);
    } else {
      setErrorMessage(res.error || 'Failed to send OTP. Please check your connection.');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode) {
      setErrorMessage('Please enter the 6-digit verification code.');
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);

    const res = await verifyPhoneOtp(
      phone,
      otpCode,
      selectedRole,
      activeTab === 'SIGN_UP' ? fullName : undefined
    );
    setIsLoading(false);

    if (res.success && res.user) {
      completeAuth(res.user);
    } else {
      setErrorMessage(res.error || 'Invalid verification code. Please try again.');
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    if (activeTab === 'SIGN_UP') {
      if (!fullName.trim()) {
        setIsLoading(false);
        setErrorMessage('Please enter your full name.');
        return;
      }
      if (!email.trim() || !password) {
        setIsLoading(false);
        setErrorMessage('Please provide a valid email and password.');
        return;
      }

      const res = await signUpWithEmail(email, password, fullName, selectedRole, phone || '+91 98765 43210');
      setIsLoading(false);

      if (res.success && res.user) {
        setSuccessMessage('Account created successfully! Redirecting to your workspace...');
        setTimeout(() => completeAuth(res.user!), 600);
      } else {
        setErrorMessage(res.error || 'Sign up failed. Please try again.');
      }
    } else {
      // Sign In
      if (!email.trim() || !password) {
        setIsLoading(false);
        setErrorMessage('Please enter both email and password.');
        return;
      }

      const res = await signInWithEmail(email, password);
      setIsLoading(false);

      if (res.success && res.user) {
        completeAuth(res.user);
      } else {
        setErrorMessage(res.error || 'Invalid email or password.');
      }
    }
  };

  const handleQuickDemoSignIn = (profile: UserProfile) => {
    setIsLoading(true);
    setTimeout(() => {
      completeAuth(profile);
    }, 350);
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
    <div className="min-h-screen bg-[#F5FAED] flex flex-col justify-center py-10 sm:px-6 lg:px-8 font-sans selection:bg-[#7aa32c]/20 selection:text-[#2e4013]">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-3 group mb-2">
          <div className="w-12 h-12 rounded-2xl bg-white p-1 flex items-center justify-center border border-stone-200 shadow-md group-hover:scale-105 transition-transform overflow-hidden">
            <img
              src="/images/yukti-logo-transparent.png"
              alt="Yukti Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="font-typewriter text-2xl font-bold text-stone-900 tracking-tight">
                Yukti
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#7aa32c]/15 text-[#2e4013]">
                AUTH
              </span>
            </div>
            <p className="text-[11px] text-stone-500 font-medium">Predict. Allocate. Operate.</p>
          </div>
        </Link>

        {/* Supabase Connection Status Pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-stone-200 text-[11px] font-semibold text-stone-600 mt-2 shadow-subtle">
          <Database className="w-3.5 h-3.5 text-[#7aa32c]" />
          <span>Backend: </span>
          {isSupabaseConfigured ? (
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Supabase Connected
            </span>
          ) : (
            <span className="text-stone-700 font-medium flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Ready (Config in .env)
            </span>
          )}
        </div>
      </div>

      {/* Main Authentication Card */}
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-xl px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl shadow-xl border border-stone-200/90 space-y-6">
          {/* Main Mode Toggle: Sign In vs Create New Account */}
          <div className="flex p-1.5 bg-[#e8efde] rounded-2xl border border-stone-300/70">
            <button
              type="button"
              onClick={() => {
                setActiveTab('SIGN_IN');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={clsx(
                'flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer',
                activeTab === 'SIGN_IN'
                  ? 'bg-[#1b4d3e] text-white shadow-md'
                  : 'text-stone-700 hover:text-stone-900'
              )}
            >
              Sign In to Account
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('SIGN_UP');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={clsx(
                'flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer',
                activeTab === 'SIGN_UP'
                  ? 'bg-[#1b4d3e] text-white shadow-md'
                  : 'text-stone-700 hover:text-stone-900'
              )}
            >
              Create New Account
            </button>
          </div>

          {/* Role Selection for Registration */}
          {activeTab === 'SIGN_UP' && (
            <div className="space-y-2.5 animate-in fade-in duration-200">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                Select Your Role / Organization Type
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {/* Role 1: Farmer */}
                <div
                  onClick={() => setSelectedRole('FARMER')}
                  className={clsx(
                    'p-3 rounded-2xl border-2 transition-all cursor-pointer text-left',
                    selectedRole === 'FARMER'
                      ? 'border-[#7aa32c] bg-[#F5FAED] shadow-sm'
                      : 'border-stone-200 hover:border-stone-300 bg-stone-50/50'
                  )}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <Sprout className="w-5 h-5 text-emerald-600" />
                    {selectedRole === 'FARMER' && (
                      <span className="w-4 h-4 rounded-full bg-[#7aa32c] text-white flex items-center justify-center text-[10px]">
                        ✓
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-bold text-stone-900">Farmer</div>
                  <div className="text-[10px] text-stone-500 leading-tight mt-0.5">
                    Rent machinery, AgriCredit
                  </div>
                </div>

                {/* Role 2: CHC Manager */}
                <div
                  onClick={() => setSelectedRole('CHC_MANAGER')}
                  className={clsx(
                    'p-3 rounded-2xl border-2 transition-all cursor-pointer text-left',
                    selectedRole === 'CHC_MANAGER'
                      ? 'border-[#7aa32c] bg-[#F5FAED] shadow-sm'
                      : 'border-stone-200 hover:border-stone-300 bg-stone-50/50'
                  )}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <Building2 className="w-5 h-5 text-[#7aa32c]" />
                    {selectedRole === 'CHC_MANAGER' && (
                      <span className="w-4 h-4 rounded-full bg-[#7aa32c] text-white flex items-center justify-center text-[10px]">
                        ✓
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-bold text-stone-900">CHC Operator</div>
                  <div className="text-[10px] text-stone-500 leading-tight mt-0.5">
                    Fleet, Telematics, Bookings
                  </div>
                </div>

                {/* Role 3: Admin */}
                <div
                  onClick={() => setSelectedRole('ADMIN')}
                  className={clsx(
                    'p-3 rounded-2xl border-2 transition-all cursor-pointer text-left',
                    selectedRole === 'ADMIN'
                      ? 'border-[#7aa32c] bg-[#F5FAED] shadow-sm'
                      : 'border-stone-200 hover:border-stone-300 bg-stone-50/50'
                  )}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <ShieldCheck className="w-5 h-5 text-slate-700" />
                    {selectedRole === 'ADMIN' && (
                      <span className="w-4 h-4 rounded-full bg-[#7aa32c] text-white flex items-center justify-center text-[10px]">
                        ✓
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-bold text-stone-900">Administrator</div>
                  <div className="text-[10px] text-stone-500 leading-tight mt-0.5">
                    Multi-district governance
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sub-toggle for Sign In: Email vs Mobile OTP */}
          {activeTab === 'SIGN_IN' && (
            <div className="flex items-center justify-center gap-4 text-xs">
              <button
                type="button"
                onClick={() => {
                  setAuthMethod('EMAIL');
                  setOtpSent(false);
                  setErrorMessage(null);
                }}
                className={clsx(
                  'px-4 py-1.5 rounded-full font-bold transition-all cursor-pointer flex items-center gap-1.5',
                  authMethod === 'EMAIL'
                    ? 'bg-stone-900 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                )}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Email & Password</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthMethod('PHONE');
                  setErrorMessage(null);
                }}
                className={clsx(
                  'px-4 py-1.5 rounded-full font-bold transition-all cursor-pointer flex items-center gap-1.5',
                  authMethod === 'PHONE'
                    ? 'bg-stone-900 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                )}
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Mobile Phone OTP</span>
              </button>
            </div>
          )}

          {/* Error / Success Alerts */}
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Form: Email Auth (Sign In or Sign Up) */}
          {(authMethod === 'EMAIL' || activeTab === 'SIGN_UP') && (
            <form onSubmit={handleEmailAuth} className="space-y-4">
              {activeTab === 'SIGN_UP' && (
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Full Legal Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-[#7aa32c]"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-[#7aa32c]"
                  />
                </div>
              </div>

              {activeTab === 'SIGN_UP' && (
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Mobile Phone (+91)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      placeholder="9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-[#7aa32c]"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter secure password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-[#7aa32c]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-stone-400 hover:text-stone-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-[#1b4d3e] hover:bg-[#153e32] text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Processing Auth...</span>
                ) : activeTab === 'SIGN_UP' ? (
                  <>
                    <span>Create {selectedRole === 'FARMER' ? 'Farmer' : selectedRole === 'CHC_MANAGER' ? 'CHC Hub' : 'Admin'} Account</span>
                    <ArrowRight className="w-4 h-4 text-[#9dc84d]" />
                  </>
                ) : (
                  <>
                    <span>Sign In with Email</span>
                    <ArrowRight className="w-4 h-4 text-[#9dc84d]" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Form: Mobile Phone OTP (Sign In Only) */}
          {activeTab === 'SIGN_IN' && authMethod === 'PHONE' && (
            <div className="space-y-4">
              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Registered Mobile Number
                    </label>
                    <div className="relative">
                      <div className="absolute left-3.5 top-2.5 text-xs font-bold text-stone-500">
                        +91
                      </div>
                      <input
                        type="tel"
                        required
                        placeholder="98260 41234"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-12 pr-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-[#7aa32c]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 rounded-xl bg-[#7aa32c] hover:bg-[#6b9125] text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <span>{isLoading ? 'Sending SMS...' : 'Send Verification OTP'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4 animate-in fade-in">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-stone-700">
                        Enter 6-Digit SMS Code
                      </label>
                      <button
                        type="button"
                        onClick={() => setOtpSent(false)}
                        className="text-[11px] text-[#7aa32c] hover:underline"
                      >
                        Change Number
                      </button>
                    </div>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        maxLength={6}
                        required
                        placeholder="123456"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm font-mono tracking-widest text-stone-900 focus:outline-none focus:border-[#7aa32c]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 rounded-xl bg-[#1b4d3e] hover:bg-[#153e32] text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <span>{isLoading ? 'Verifying...' : 'Verify OTP & Launch Workspace'}</span>
                    <ArrowRight className="w-4 h-4 text-[#9dc84d]" />
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Quick Evaluator / Demo Personas Drawer */}
          <div className="pt-4 border-t border-stone-100">
            <button
              type="button"
              onClick={() => setShowDemoPersonas(!showDemoPersonas)}
              className="w-full text-center text-xs font-semibold text-stone-500 hover:text-[#7aa32c] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>{showDemoPersonas ? 'Hide Instant Evaluator Personas' : '⚡ Click to Test Pre-Seeded Evaluation Personas'}</span>
            </button>

            {showDemoPersonas && (
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2 animate-in fade-in duration-150">
                <button
                  type="button"
                  onClick={() => handleQuickDemoSignIn(SEEDED_PROFILES[0])}
                  className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-left border border-emerald-200 text-xs transition-colors cursor-pointer"
                >
                  <div className="font-bold flex items-center gap-1">
                    <Sprout className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Ramesh Kumar</span>
                  </div>
                  <div className="text-[10px] text-emerald-700">Farmer • 8-Acre Wheat</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoSignIn(SEEDED_PROFILES[1])}
                  className="p-2.5 rounded-xl bg-[#F5FAED] hover:bg-[#e4eed7] text-[#2e4013] text-left border border-[#7aa32c]/40 text-xs transition-colors cursor-pointer"
                >
                  <div className="font-bold flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-[#7aa32c]" />
                    <span>Rajesh Singh</span>
                  </div>
                  <div className="text-[10px] text-stone-600">CHC Hub Manager (Sehore)</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoSignIn(SEEDED_PROFILES[2])}
                  className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 text-left border border-slate-200 text-xs transition-colors cursor-pointer"
                >
                  <div className="font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-slate-700" />
                    <span>Dr. Amit Sharma</span>
                  </div>
                  <div className="text-[10px] text-slate-500">Platform Admin (MP Gov)</div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
