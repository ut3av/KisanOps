import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Award,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Sprout,
  Users,
  Cpu,
  TrendingUp,
  Globe2,
  HeartHandshake
} from 'lucide-react';
import { LandingNavbar } from '../components/LandingNavbar';
import { LandingFooter } from '../components/LandingFooter';
import { StatsImpactSection } from '../components/StatsImpactSection';
import { PlatformEcosystemSection } from '../components/PlatformEcosystemSection';
import { TestimonialsSection } from '../components/TestimonialsSection';
import { CtaBanner } from '../components/CtaBanner';

export const AboutPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F5FAED] text-[#1c1d1f] flex flex-col font-sans selection:bg-[#7aa32c]/20 selection:text-[#2e4013]">
      <LandingNavbar />

      <main className="flex-1 pt-24 pb-20">
        {/* Page Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-14 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#7aa32c]/30 text-xs font-bold text-[#2e4013] mb-4 shadow-subtle">
            <Sparkles className="w-3.5 h-3.5 text-[#7aa32c]" />
            <span>Our Mission & Vision</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[#1c1d1f] tracking-tight max-w-4xl mx-auto leading-tight">
            Building the Operating System for Modern Agriculture
          </h1>
          <p className="mt-4 text-base sm:text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Yukti combines over 25 years of domain agronomy expertise with edge IoT telematics and neural predictive models to maximize equipment efficiency and empower smallholders.
          </p>
        </div>

        {/* Impact Section */}
        <StatsImpactSection onOpenBookDemo={() => navigate('/login')} />

        {/* 4 Pillars & Platform Ecosystem */}
        <PlatformEcosystemSection />

        {/* Testimonials */}
        <TestimonialsSection />

        {/* CTA */}
        <div className="pt-16">
          <CtaBanner onOpenBookDemo={() => navigate('/login')} />
        </div>
      </main>

      <LandingFooter />
    </div>
  );
};

export default AboutPage;
