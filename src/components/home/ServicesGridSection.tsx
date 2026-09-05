'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaArrowRight } from 'react-icons/fa';
import { serviceStore, Service } from '@/lib/stores/ServiceStore';
import { 
  HiCode, 
  HiCamera, 
  HiVideoCamera, 
  HiServer, 
  HiDatabase, 
  HiShieldCheck, 
  HiDeviceMobile, 
  HiDesktopComputer, 
  HiTrendingUp, 
  HiLightningBolt, 
  HiSupport, 
  HiTemplate, 
  HiGlobe, 
  HiBriefcase, 
  HiSparkles,
  HiQuestionMarkCircle
} from 'react-icons/hi';

const IconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
  HiCode,
  HiCamera,
  HiVideoCamera,
  HiServer,
  HiDatabase,
  HiShieldCheck,
  HiDeviceMobile,
  HiDesktopComputer,
  HiTrendingUp,
  HiLightningBolt,
  HiSupport,
  HiTemplate,
  HiGlobe,
  HiBriefcase,
  HiSparkles
};

const DynamicIcon = ({ name, className }: { name: string; className?: string }) => {
  const IconComponent = IconMap[name] || HiQuestionMarkCircle;
  return <IconComponent className={className} />;
};

const ServicesGridSection = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchServices = async () => {
      const data = await serviceStore.getServices();
      // Show first 3 services on the landing page
      setServices(data.slice(0, 3));
      setLoading(false);
    };
    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className="py-24 text-center text-slate-500 font-medium bg-slate-50">
        Loading services...
      </div>
    );
  }

  return (
    <section className="py-24 relative overflow-hidden bg-slate-50">
      {/* Background Text (Outline) */}
      <div className="absolute top-12 left-[-5%] text-[12rem] font-black select-none pointer-events-none z-0 uppercase tracking-tighter opacity-[0.03]" style={{ WebkitTextStroke: '2px #0f172a' }}>
        Services
      </div>

      <div className="container relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="flex flex-col gap-4 max-w-[600px]">
            <div className="flex items-center gap-2 font-semibold text-primary">
              <span className="text-2xl">//</span>
              <span className="uppercase tracking-widest text-sm">Our Services</span>
            </div>
            <h2 className="text-5xl font-extrabold leading-[1.1] text-slate-900">
              Services We Provide to<br />
              <span className="text-primary">Elevate Your Business</span>
            </h2>
          </div>
          <Link 
            href="/services"
            className="bg-primary text-white px-10 py-4 rounded-full font-semibold transition-all hover:bg-primary-dark hover:-translate-y-1 shadow-lg hover:shadow-primary/30 text-center cursor-pointer"
          >
            View All Services
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const isHighlighted = index === 0; // Highlight the first one to keep dynamic design wowy
            return (
              <div 
                key={service._id || index}
                onClick={() => router.push(`/services/${service._id}`)}
                className={`
                  bg-white p-10 rounded-[40px] transition-all duration-500 group cursor-pointer
                  flex flex-col justify-between shadow-sm hover:shadow-xl hover:-translate-y-2 h-full min-h-[380px]
                  ${isHighlighted ? 'border-b-4 border-l-4 border-primary' : 'border border-slate-100'}
                `}
              >
                <div className="space-y-6">
                  <div className="w-20 h-20 bg-primary text-white rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:rotate-[360deg] shadow-lg shadow-primary/25">
                    <DynamicIcon name={service.icon} className="text-4xl" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-slate-900 group-hover:text-primary transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-sm font-semibold text-slate-400">{service.subtitle}</p>
                  </div>
                  
                  <div 
                    className="text-slate-500 leading-relaxed text-sm line-clamp-4 prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: service.content }}
                  />
                </div>
                
                <div className="mt-8 pt-4 border-t border-slate-50 flex items-center gap-2 text-primary font-bold group-hover:gap-4 transition-all">
                  <span>Learn more</span>
                  <FaArrowRight className="text-sm" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesGridSection;
