import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

const FAQS: FaqItem[] = [
  {
    category: 'Hardware & IoT',
    question: 'How does Yukti integrate with existing tractors, harvesters, and GPS hardware?',
    answer:
      'Yukti connects directly via standard J1939 CAN-Bus protocol dongles or OBD-II telematics units, as well as standalone solar GPS trackers. We support major manufacturers including Mahindra, John Deere, Sonalika, New Holland, and Escorts with zero proprietary hardware lock-in.'
  },
  {
    category: 'AgriCredit & Finance',
    question: 'How does the AgriCredit Deferred-Payment model work?',
    answer:
      'Yukti computes a non-regulated 0–900 agricultural credit score based on verified historical acreage, crop health NDVI track record, and previous rental settlement history. Smallholders receive a pre-approved deferred credit limit (typically ₹8,000 to ₹15,000) enabling them to book equipment during harvest and repay within 45 days after selling at the APMC mandi.'
  },
  {
    category: 'Connectivity & Offline Sync',
    question: 'Can field executives and farmers use Yukti in low-connectivity rural zones?',
    answer:
      'Yes. Both the Executive App and Farmer Mobile App feature robust offline-first PWA architecture. Field observations, machine booking intents, and inspection checklists are stored locally in IndexedDB and automatically synchronize via delta-updates as soon as 2G/3G/4G connectivity is restored.'
  },
  {
    category: 'Demand Engine',
    question: 'How does the Predictive Machinery Demand engine calculate shortage alerts?',
    answer:
      'The engine runs neural forecasting models that cross-reference Sentinel-2 satellite crop maturity curves, sowing date calendars, historical rental velocity, and micro-climate weather forecasts. When demand exceeds available hub inventory by +20%, the system flags shortage alerts and triggers deterministic inter-hub reallocation recommendations.'
  },
  {
    category: 'Data Privacy & Security',
    question: 'How is farm, yield, and proprietary business data secured?',
    answer:
      'Each enterprise client operates within dedicated multi-tenant isolated databases backed by Row-Level Security (RLS), encrypted at rest (AES-256) and in transit (TLS 1.3). Farmer land records and commercial contract pricing are strictly confidential and never shared with third-party aggregators.'
  },
  {
    category: 'Deployment',
    question: 'How quickly can a Custom Hiring Centre or enterprise agribusiness onboard?',
    answer:
      'A typical CHC hub can be fully onboarded within 48 to 72 hours. Our onboarding team helps import fleet rosters, map operator rosters, configure regional tariff boundaries, and conduct hands-on mobile training for hub supervisors.'
  }
];

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-[#F5FAED] border-b border-stone-200/60">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-stone-200 text-xs font-bold text-[#2e4013] mb-3 shadow-subtle">
            <HelpCircle className="w-3.5 h-3.5 text-[#7aa32c]" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1c1d1f] tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-base text-stone-600">
            Everything you need to know about Yukti AgTech SaaS platform, deployment, and integrations.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="rounded-2xl bg-white border border-stone-200 shadow-sm overflow-hidden transition-all card-interactive-spotlight"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left p-6 flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#F5FAED] text-[#7aa32c] border border-[#7aa32c]/20">
                      {faq.category}
                    </span>
                    <span className="text-base font-bold text-stone-900 leading-snug">
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-stone-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#7aa32c]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-sm text-stone-600 leading-relaxed border-t border-stone-100 animate-in fade-in slide-in-from-top-1 duration-200">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
