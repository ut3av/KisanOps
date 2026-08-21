import React from 'react';
import { Star, Quote, CheckCircle2, ShieldCheck } from 'lucide-react';

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Rajesh Singh',
    role: 'Managing Director',
    organization: 'Sehore Agri Machinery CHC Hub',
    avatar: 'RS',
    rating: 5,
    quote:
      'Yukti transformed our 28-machine fleet operations. The predictive relocation optimizer identified surplus harvesters in Bhopal and routed them to Sehore during peak wheat maturity, unlocking ₹4.2 Lakhs in extra rental revenue in 10 days.',
    metric: '+28% Fleet Utilization',
    cluster: 'Madhya Pradesh Central Belt'
  },
  {
    id: 2,
    name: 'Dr. Sunita Deshmukh',
    role: 'Head of Agronomy & Supply Chain',
    organization: 'Mahindra Agri Solutions Partner',
    avatar: 'SD',
    rating: 5,
    quote:
      'The combination of multispectral Sentinel NDVI satellite imagery and real-time CAN-Bus telematics gives our agronomists unmatched visibility. Fuel anomaly detection immediately caught +17% diesel leaks on three tractors.',
    metric: '18% Fuel Costs Saved',
    cluster: 'Maharashtra Soybean Cluster'
  },
  {
    id: 3,
    name: 'Ramesh Kumar',
    role: 'Progressive Farmer (8-Acre Wheat)',
    organization: 'Sehore Smallholders Cooperative',
    avatar: 'RK',
    rating: 5,
    quote:
      'Getting access to high-capacity harvesters during rain threats was our biggest bottleneck. With Yukti AgriCredit, I booked a certified harvester in 1 minute and paid post-harvest after selling at the mandi.',
    metric: 'Zero Harvest Spoilage',
    cluster: 'Sehore Farmer Cluster'
  }
];

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-20 bg-white border-b border-stone-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5FAED] border border-[#7aa32c]/30 text-xs font-bold text-[#2e4013] mb-3">
            <Quote className="w-3.5 h-3.5 text-[#7aa32c]" />
            <span>Proven Field Impact</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1c1d1f] tracking-tight">
            Trusted by Leaders Across the Agri-Value Chain
          </h2>
          <p className="mt-4 text-base sm:text-lg text-stone-600 leading-relaxed">
            Discover how Custom Hiring Centres, agribusiness managers, and smallholder farmers rely on Yukti to maximize equipment efficiency and ensure seamless operations.
          </p>
        </div>

        {/* Testimonial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="p-8 rounded-3xl bg-[#F5FAED]/60 border border-stone-200/80 flex flex-col justify-between space-y-6 hover:bg-[#F5FAED] hover:shadow-lg transition-all"
            >
              <div className="space-y-4">
                {/* Rating & Metric */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-[#7aa32c]/20 text-[#2e4013]">
                    {t.metric}
                  </span>
                </div>

                {/* Quote */}
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed italic">
                  "{t.quote}"
                </p>
              </div>

              {/* Author */}
              <div className="pt-4 border-t border-stone-200/60 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#7aa32c] text-white flex items-center justify-center font-bold text-xs shadow-subtle">
                  {t.avatar}
                </div>
                <div>
                  <div className="text-sm font-bold text-stone-900">{t.name}</div>
                  <div className="text-[11px] text-stone-500 font-medium">{t.role}</div>
                  <div className="text-[10px] text-[#7aa32c] font-semibold">{t.organization}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
