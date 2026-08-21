import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  Building2,
  Sparkles,
  ShieldCheck,
  Clock
} from 'lucide-react';
import { LandingNavbar } from '../components/LandingNavbar';
import { LandingFooter } from '../components/LandingFooter';

export const ContactPage: React.FC = () => {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    subject: 'Enterprise Farm ERP & CHC Telematics',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F5FAED] text-[#1c1d1f] flex flex-col font-sans selection:bg-[#7aa32c]/20 selection:text-[#2e4013]">
      <LandingNavbar />

      <main className="flex-1 pt-24 pb-20">
        {/* Page Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#7aa32c]/30 text-xs font-bold text-[#2e4013] mb-4 shadow-subtle">
            <Sparkles className="w-3.5 h-3.5 text-[#7aa32c]" />
            <span>Connect with Us</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[#1c1d1f] tracking-tight max-w-4xl mx-auto leading-tight">
            Talk with an AgTech Operations Specialist
          </h1>
          <p className="mt-4 text-base sm:text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Have questions regarding telematics hardware integrations, custom ERP deployments, or regional CHC hub onboarding? Our team is here to help.
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left: Contact Info & Office Addresses */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-8 rounded-3xl bg-white border border-stone-200 shadow-md space-y-6">
                <h3 className="text-xl font-bold text-stone-900">
                  Direct Inquiries
                </h3>

                <div className="space-y-4 text-xs sm:text-sm text-stone-700">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#F5FAED] text-[#7aa32c] flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-stone-900">Email Inquiries</div>
                      <a href="mailto:contact@yukti.ag" className="text-stone-600 hover:text-[#7aa32c]">
                        contact@yukti.ag
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#F5FAED] text-[#7aa32c] flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-stone-900">Phone Support</div>
                      <a href="tel:+919172283500" className="text-stone-600 hover:text-[#7aa32c]">
                        +91-91722-83500 (Toll Free)
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#F5FAED] text-[#7aa32c] flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-stone-900">Operating Hours</div>
                      <div className="text-stone-600">Monday - Saturday: 8:00 AM - 8:00 PM IST</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Office Locations */}
              <div className="p-8 rounded-3xl bg-white border border-stone-200 shadow-md space-y-4">
                <h3 className="text-xl font-bold text-stone-900">
                  Innovation Hubs
                </h3>

                <div className="space-y-4 text-xs sm:text-sm text-stone-600">
                  <div className="p-3.5 rounded-2xl bg-[#F5FAED] border border-[#7aa32c]/20">
                    <div className="font-bold text-stone-900 flex items-center gap-1.5 mb-1">
                      <MapPin className="w-4 h-4 text-[#7aa32c]" />
                      <span>Bhopal AgTech & CHC Network Centre</span>
                    </div>
                    <p className="text-[11px] text-stone-500">
                      Plot 42, MP State Electronics Complex, Bhopal, MP 462023
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#F5FAED] border border-[#7aa32c]/20">
                    <div className="font-bold text-stone-900 flex items-center gap-1.5 mb-1">
                      <MapPin className="w-4 h-4 text-[#7aa32c]" />
                      <span>Pune Deep-Tech R&D Lab</span>
                    </div>
                    <p className="text-[11px] text-stone-500">
                      Kharadi IT Park, Pune, Maharashtra 411014
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Message Form */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-stone-200 shadow-xl p-8 sm:p-10">
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h3 className="text-2xl font-extrabold text-stone-900 tracking-tight">
                    Send Us a Message
                  </h3>
                  <p className="text-xs text-stone-500">
                    Fill out the form below and an AgTech operations engineer will reply within 2 hours.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ramesh Chandra"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-[#7aa32c]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Work Email
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="name@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-[#7aa32c]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-[#7aa32c]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Organization / CHC Hub
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Sehore CHC Cluster"
                        value={formData.organization}
                        onChange={(e) =>
                          setFormData({ ...formData, organization: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-[#7aa32c]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-[#7aa32c]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Message
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Tell us about your fleet, acreage, or integration requirements..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-[#7aa32c]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-[#7aa32c] hover:bg-[#6b9125] text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Message to Operations Team</span>
                  </button>
                </form>
              ) : (
                <div className="py-12 text-center space-y-5 animate-in zoom-in-95 duration-200">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-subtle">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h4 className="text-2xl font-black text-stone-900">
                    Message Sent Successfully!
                  </h4>
                  <p className="text-xs sm:text-sm text-stone-600 max-w-sm mx-auto">
                    Thank you, <span className="font-bold">{formData.name}</span>. An AgTech solutions engineer will respond to{' '}
                    <span className="font-bold">{formData.email}</span> shortly.
                  </p>
                  <div className="pt-4">
                    <button
                      onClick={() => navigate('/login')}
                      className="px-6 py-3 rounded-full bg-[#1b4d3e] text-white text-xs font-bold shadow-md hover:bg-[#153e32] transition-colors"
                    >
                      Go to Authentication Login
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
};

export default ContactPage;
