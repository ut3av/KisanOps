import React, { useState } from 'react';
import { DemoScenarioBar } from '../../components/demo/DemoScenarioBar';
import { LandingNavbar } from './components/LandingNavbar';
import { HeroSection } from './components/HeroSection';
import { TrustMarquee } from './components/TrustMarquee';
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
import { BookDemoModal } from './components/BookDemoModal';

export const LandingPage: React.FC = () => {
  const [isBookDemoOpen, setIsBookDemoOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-[#F5FAED] text-[#0f172a] flex flex-col font-sans selection:bg-[#7aa32c]/20 selection:text-[#2e4013]">
      {/* Interactive Scenario Bar for Rapid Testing */}
      <DemoScenarioBar />

      {/* Sticky Navigation */}
      <LandingNavbar onOpenBookDemo={() => setIsBookDemoOpen(true)} />

      {/* Hero Banner (Matching the attached photo) */}
      <main className="flex-1">
        <HeroSection onOpenBookDemo={() => setIsBookDemoOpen(true)} />

        {/* Brands and Ecosystem Marquee */}
        <TrustMarquee />

        {/* How It Works Closed-Loop Pipeline */}
        <HowItWorksSection />

        {/* Modular Products (Pre-Harvest, Post-Harvest, Operations) */}
        <ModularProductsSection />

        {/* Multi-Device Platform Ecosystem & Tech Pillars */}
        <PlatformEcosystemSection />

        {/* Industries We Serve */}
        <IndustriesSection />

        {/* Interactive ROI & Fleet Efficiency Calculator */}
        <RoiCalculatorSection onOpenBookDemo={() => setIsBookDemoOpen(true)} />

        {/* Why KisanOps & Impact Stats */}
        <StatsImpactSection onOpenBookDemo={() => setIsBookDemoOpen(true)} />

        {/* Verified Field Testimonials & Case Studies */}
        <TestimonialsSection />

        {/* Frequently Asked Questions Accordion */}
        <FaqSection />

        {/* High-Conversion Bottom Banner */}
        <CtaBanner onOpenBookDemo={() => setIsBookDemoOpen(true)} />
      </main>

      {/* Comprehensive AgTech SaaS Footer */}
      <LandingFooter />

      {/* Book a Demo Modal */}
      <BookDemoModal
        isOpen={isBookDemoOpen}
        onClose={() => setIsBookDemoOpen(false)}
      />
    </div>
  );
};

export default LandingPage;
