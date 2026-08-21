import React from 'react';
import { Award, ShieldCheck } from 'lucide-react';

const PARTNERS = [
  { name: 'Himalaya Wellness', subtitle: 'Organic Crop Monitoring' },
  { name: 'Sula Vineyards', subtitle: 'Plantation Fleet Operations' },
  { name: 'Syngenta AgTech', subtitle: 'Input & Crop Advisory' },
  { name: 'Dhanuka Agritech', subtitle: 'Enterprise Farm ERP' },
  { name: 'Banas Dairy & Farms', subtitle: 'Cooperative Traceability' },
  { name: 'Mahindra Agri', subtitle: 'CHC Machinery Network' },
  { name: 'ICAR - KVK Centers', subtitle: 'Agronomy Research & GIS' },
  { name: 'AWS AgTech Partner', subtitle: 'Cloud Scale Infrastructure' },
  { name: 'BioEnterprise', subtitle: 'AgTech Acceleration' },
  { name: 'Tesa Forestry & Agri', subtitle: 'Heavy Machinery Telematics' },
  { name: 'MP State CHC Hubs', subtitle: 'Public-Private Machinery Ops' }
];

export const TrustMarquee: React.FC = () => {
  return (
    <section className="py-12 bg-white border-y border-stone-200/70 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 text-center">
        <h2 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-stone-500 flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#7aa32c]" />
          <span>Trusted by Enterprise Farms, CHC Hubs & Global Agri-Food Leaders</span>
        </h2>
      </div>

      {/* Marquee Track */}
      <div className="relative w-full overflow-hidden flex items-center">
        {/* Left Fade Gradient */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        {/* Right Fade Gradient */}
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div className="animate-marquee flex items-center gap-8 sm:gap-12 py-2">
          {/* Double list to ensure smooth infinite loop */}
          {[...PARTNERS, ...PARTNERS].map((partner, idx) => (
            <div
              key={`${partner.name}-${idx}`}
              className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-stone-50/80 border border-stone-200/60 hover:bg-[#F5FAED] hover:border-[#7aa32c]/30 transition-all shrink-0 group cursor-default"
            >
              <div className="w-8 h-8 rounded-xl bg-white text-[#7aa32c] flex items-center justify-center font-bold text-xs shadow-subtle group-hover:scale-110 transition-transform">
                {partner.name.charAt(0)}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-sm font-bold text-stone-800 tracking-tight group-hover:text-[#2e4013]">
                  {partner.name}
                </span>
                <span className="text-[10px] text-stone-500 font-medium">
                  {partner.subtitle}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
