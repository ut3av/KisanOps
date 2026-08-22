import React from 'react';
import { LandingNavbar } from './components/LandingNavbar';
import { HeroSection } from './components/HeroSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { ModularProductsSection } from './components/ModularProductsSection';
import { PlatformEcosystemSection } from './components/PlatformEcosystemSection';
import { IndustriesSection } from './components/IndustriesSection';
import { RoiCalculatorSection } from './components/RoiCalculatorSection';
import { StatsImpactSection } from './components/StatsImpactSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { FaqSection } from './components/FaqSection';
import { CtaBanner } from './components/CtaBanner';
import { LandingFooter } from './components/LandingFooter';
import { usePageTitle } from '../../hooks/usePageTitle';

export const LandingPage: React.FC = () => {
  usePageTitle(
    'Yukti — Agricultural Machinery Intelligence & CHC Platform',
    'Yukti predicts agricultural machinery demand, allocates fleet, dynamically prices rentals, enables deferred AgriCredit, and streams live CAN-Bus telematics.'
  );

  return (
    <div className="min-h-screen bg-[#F5FAED] text-[#0f172a] flex flex-col font-sans selection:bg-[#7aa32c]/20 selection:text-[#2e4013]">
      {/* Sticky Navigation */}
      <LandingNavbar />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Banner */}
        <HeroSection />

        {/* Closed-Loop Operating Pipeline */}
        <HowItWorksSection />

        {/* Machinery Intelligence Core Engines */}
        <ModularProductsSection />

        {/* Multi-Device Platform Ecosystem & Tech Pillars */}
        <PlatformEcosystemSection />

        {/* Interactive Industry Solutions */}
        <IndustriesSection />

        {/* Interactive ROI & Fleet Efficiency Calculator */}
        <RoiCalculatorSection />

        {/* Why Yukti & Impact Stats */}
        <StatsImpactSection />

        {/* Verified Field Testimonials & Case Studies */}
        <TestimonialsSection />

        {/* Frequently Asked Questions Accordion */}
        <FaqSection />

        {/* High-Conversion Bottom Banner */}
        <CtaBanner />
      </main>

      {/* Comprehensive AgTech SaaS Footer */}
      <LandingFooter />
    </div>
  );
};

export default LandingPage;
