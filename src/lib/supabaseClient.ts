import { createClient } from '@supabase/supabase-js';
import { UserProfile, UserRole } from '../types';
import { SEEDED_PROFILES } from '../data/seedData';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const isSupabaseConfigured = Boolean(
  import.meta.env.VITE_SUPABASE_URL && 
  import.meta.env.VITE_SUPABASE_ANON_KEY &&
  !import.meta.env.VITE_SUPABASE_URL.includes('placeholder')
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export interface AuthResponse {
  success: boolean;
  user?: UserProfile;
  error?: string;
  sessionToken?: string;
  otpSent?: boolean;
}

/**
 * Sends OTP via SMS using Supabase Auth or fallback simulator
 */
export async function sendPhoneOtp(phone: string): Promise<AuthResponse> {
  const cleanPhone = phone.startsWith('+') ? phone : `+91${phone.replace(/\D/g, '')}`;

  if (isSupabaseConfigured) {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: cleanPhone,
      });
      if (error) return { success: false, error: error.message };
      return { success: true, otpSent: true };
    } catch (e: any) {
      return { success: false, error: e.message || 'Failed to send OTP' };
    }
  }

  // Fallback simulator for demo / local testing
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ success: true, otpSent: true });
    }, 600);
  });
}

/**
 * Verifies OTP code and authenticates user
 */
export async function verifyPhoneOtp(
  phone: string,
  otpCode: string,
  targetRole: UserRole = 'FARMER',
  fullName?: string
): Promise<AuthResponse> {
  const cleanPhone = phone.startsWith('+') ? phone : `+91${phone.replace(/\D/g, '')}`;

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone: cleanPhone,
        token: otpCode,
        type: 'sms',
      });
      if (error) return { success: false, error: error.message };

      const userProfile: UserProfile = {
        id: data.user?.id || `user-${Date.now()}`,
        fullName: data.user?.user_metadata?.full_name || fullName || 'KisanOps User',
        phoneNumber: cleanPhone,
        role: (data.user?.user_metadata?.role as UserRole) || targetRole,
        district: 'Sehore',
        village: 'Bilkisganj',
      };

      return { success: true, user: userProfile, sessionToken: data.session?.access_token };
    } catch (e: any) {
      return { success: false, error: e.message || 'Invalid OTP code' };
    }
  }

  // Local verification simulation
  return new Promise(resolve => {
    setTimeout(() => {
      // Find matching seeded persona if phone matches, else construct new profile
      const matched = SEEDED_PROFILES.find(p => p.phoneNumber.replace(/\s+/g, '') === cleanPhone.replace(/\s+/g, ''));
      if (matched) {
        resolve({ success: true, user: matched, sessionToken: `sim_token_${Date.now()}` });
      } else {
        const newProfile: UserProfile = {
          id: `user-${Date.now()}`,
          fullName: fullName || (targetRole === 'FARMER' ? 'Ramesh Kumar' : 'Rajesh Singh'),
          phoneNumber: cleanPhone,
          role: targetRole,
          district: 'Sehore',
          village: 'Bilkisganj',
        };
        resolve({ success: true, user: newProfile, sessionToken: `sim_token_${Date.now()}` });
      }
    }, 700);
  });
}

/**
 * Authenticates user via Email and Password
 */
export async function signInWithEmail(email: string, password: string): Promise<AuthResponse> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) return { success: false, error: error.message };

      const userProfile: UserProfile = {
        id: data.user?.id || `user-${Date.now()}`,
        fullName: data.user?.user_metadata?.full_name || email.split('@')[0],
        email,
        phoneNumber: data.user?.phone || '+91 98260 41234',
        role: (data.user?.user_metadata?.role as UserRole) || 'FARMER',
        district: 'Sehore',
        village: 'Bilkisganj',
      };

      return { success: true, user: userProfile, sessionToken: data.session?.access_token };
    } catch (e: any) {
      return { success: false, error: e.message || 'Authentication failed' };
    }
  }

  // Local email password simulation
  return new Promise((resolve) => {
    setTimeout(() => {
      const matched = SEEDED_PROFILES.find(p => p.email?.toLowerCase() === email.toLowerCase());
      if (matched) {
        resolve({ success: true, user: matched, sessionToken: `sim_token_${Date.now()}` });
      } else {
        resolve({
          success: true,
          user: {
            id: `user-${Date.now()}`,
            fullName: email.split('@')[0],
            email,
            phoneNumber: '+91 98260 00000',
            role: 'FARMER',
            district: 'Sehore',
            village: 'Bilkisganj',
          },
          sessionToken: `sim_token_${Date.now()}`
        });
      }
    }, 600);
  });
}

/**
 * Registers new user via Email and Password with role metadata
 */
export async function signUpWithEmail(
  email: string,
  password: string,
  fullName: string,
  role: UserRole,
  phone?: string
): Promise<AuthResponse> {
  const finalPhone = phone || `+91 ${Math.floor(6000000000 + Math.random() * 3999999999)}`;

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role,
            phone_number: finalPhone,
          },
        },
      });
      if (error) return { success: false, error: error.message };

      const userProfile: UserProfile = {
        id: data.user?.id || `user-${Date.now()}`,
        fullName,
        email,
        phoneNumber: finalPhone,
        role,
        district: 'Sehore',
        village: 'Bilkisganj',
      };

      return { success: true, user: userProfile };
    } catch (e: any) {
      return { success: false, error: e.message || 'Registration failed' };
    }
  }

  // Local sign-up simulation
  return new Promise(resolve => {
    setTimeout(() => {
      const newUser: UserProfile = {
        id: `user-${Date.now()}`,
        fullName,
        email,
        phoneNumber: finalPhone,
        role,
        district: 'Sehore',
        village: 'Bilkisganj',
      };
      resolve({ success: true, user: newUser });
    }, 700);
  });
}
