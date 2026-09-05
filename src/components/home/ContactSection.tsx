'use client';

import React, { useState, useEffect } from 'react';
import { FaFacebookF, FaTwitter, FaPinterestP, FaInstagram, FaYoutube, FaChevronDown } from 'react-icons/fa';
import { companyStore, Company } from '@/lib/stores/CompanyStore';

const ContactSection = () => {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompany = async () => {
      const data = await companyStore.getCompany();
      setCompany(data);
      setLoading(false);
    };
    fetchCompany();
  }, []);

  return (
    <section className="py-24 relative overflow-hidden bg-white">
      {/* Background Text (Outline) */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 text-[10rem] font-black select-none pointer-events-none z-0 uppercase tracking-tighter opacity-[0.03] whitespace-nowrap" style={{ WebkitTextStroke: '2px #0f172a' }}>
        Contact Us
      </div>

      <div className="container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Contact Info Card */}
          <div className="lg:col-span-5 relative bg-navy rounded-[40px] overflow-hidden px-[10px] py-12 md:p-12 text-white shadow-2xl min-h-[600px] flex flex-col justify-between">
            {/* Topographic Pattern Overlay */}
            <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('/topo-pattern.png')] bg-cover bg-center mix-blend-overlay"></div>
            
            <div className="relative z-10 space-y-12">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold border-l-4 border-primary pl-4">Address</h3>
                {loading ? (
                  <div className="space-y-3 animate-pulse">
                    <div className="h-4 w-48 bg-white/10 rounded-full"></div>
                    <div className="h-4 w-32 bg-white/10 rounded-full"></div>
                  </div>
                ) : (
                  <p className="text-white/70 text-lg leading-relaxed max-w-[300px]">
                    {company?.address || 'Loading address...'}
                  </p>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-bold border-l-4 border-primary pl-4">Contact</h3>
                {loading ? (
                  <div className="space-y-3 animate-pulse">
                    <div className="h-4 w-56 bg-white/10 rounded-full"></div>
                    <div className="h-4 w-48 bg-white/10 rounded-full"></div>
                  </div>
                ) : (
                  <div className="text-white/70 text-lg space-y-2">
                    <p>Phone : {company?.phoneNumber || '(000) 000-0000'}</p>
                    <p>Email : {company?.email || 'info@kennytech.com'}</p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-bold border-l-4 border-primary pl-4">Open Time</h3>
                <p className="text-white/70 text-lg">
                  Monday - Friday : 10:00 - 20:00
                </p>
              </div>
            </div>

            <div className="relative z-10 space-y-6 pt-12">
              <h3 className="text-xl font-bold">Stay Connected</h3>
              <div className="flex gap-4">
                {[FaFacebookF, FaTwitter, FaPinterestP, FaInstagram, FaYoutube].map((Icon, i) => (
                  <a 
                    key={i} 
                    href="#" 
                    className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white transition-all hover:bg-white hover:text-primary hover:-translate-y-2"
                  >
                    <Icon />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 font-semibold text-primary">
                <span className="text-2xl">//</span>
                <span className="uppercase tracking-widest text-sm">Contact Us</span>
              </div>
              <h2 className="text-5xl font-extrabold leading-[1.1] text-slate-900">
                Get Your <span className="text-primary">Free Quote</span> Today!
              </h2>
            </div>

            <form className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Your Name *</label>
                <input 
                  type="text" 
                  placeholder="Ex. John Doe" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-300"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Email *</label>
                <input 
                  type="email" 
                  placeholder="example@gmail.com" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-300"
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-bold text-slate-700">Phone *</label>
                <input 
                  type="tel" 
                  placeholder="Enter Phone Number" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-300"
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-bold text-slate-700">Your Message *</label>
                <textarea 
                  placeholder="Enter here.." 
                  rows={6}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-300 resize-none"
                ></textarea>
              </div>

              <div className="md:col-span-2 pt-4">
                <button 
                  type="submit" 
                  className="bg-primary text-white px-12 py-5 rounded-full font-bold text-lg transition-all hover:bg-primary-dark hover:-translate-y-1 shadow-lg hover:shadow-primary/40"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ContactSection;
