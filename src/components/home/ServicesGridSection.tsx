'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  const IconComponent = IconMap[name] || HiSparkles;
  return <IconComponent className={className} />;
};

const ServicesGridSection = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await serviceStore.getServices();
        setServices(data);
      } catch (error) {
        console.error('Failed to load services:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  return (
    <section id="services" className="py-24 relative overflow-hidden bg-slate-50 scroll-mt-20">
      {/* Background Text (Outline) */}
      <div 
        className="absolute top-12 left-[-5%] text-[12rem] font-black select-none pointer-events-none z-0 uppercase tracking-tighter opacity-[0.03]" 
        style={{ WebkitTextStroke: '2px #0f172a' }}
      >
        Services
      </div>

      <div className="container relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
          <div className="flex flex-col gap-4 max-w-[650px]">
            <div className="flex items-center gap-2 font-semibold text-primary">
              <span className="text-2xl">//</span>
              <span className="uppercase tracking-widest text-sm">Our Services</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold leading-[1.1] text-slate-900">
              Services We Provide to<br />
              <span className="text-primary">Elevate Your Business</span>
            </h2>
          </div>
          <Link 
            href="/contact"
            className="bg-primary text-white px-8 py-4 rounded-full font-semibold transition-all hover:bg-primary-dark hover:-translate-y-1 shadow-lg hover:shadow-primary/30 text-center cursor-pointer flex items-center gap-3"
          >
            <span>Start a Project</span>
            <FaArrowRight className="text-sm" />
          </Link>
        </div>

        {loading ? (
          /* Skeletons */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm animate-pulse space-y-6">
                <div className="h-44 bg-slate-200 rounded-2xl"></div>
                <div className="w-14 h-14 bg-slate-200 rounded-2xl"></div>
                <div className="space-y-3">
                  <div className="h-6 bg-slate-200 rounded-md w-3/4"></div>
                  <div className="h-4 bg-slate-200 rounded-md w-1/2"></div>
                  <div className="h-16 bg-slate-200 rounded-md w-full"></div>
                </div>
                <div className="h-6 bg-slate-200 rounded-md w-1/3 pt-4"></div>
              </div>
            ))}
          </div>
        ) : services.length === 0 ? (
          <div className="bg-white border border-dashed border-slate-200 rounded-[32px] p-16 text-center text-slate-500 max-w-xl mx-auto">
            <HiSparkles className="text-5xl text-primary/40 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-slate-800 mb-2">No Services Available Yet</h3>
            <p className="text-slate-500">Check back soon for our latest service offerings and solutions.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const isHighlighted = index === 0;
              const contactUrl = `/contact?service=${encodeURIComponent(service.title)}`;
              return (
                <div 
                  key={service._id || index}
                  onClick={() => router.push(contactUrl)}
                  className={`
                    bg-white rounded-[32px] overflow-hidden transition-all duration-500 group cursor-pointer
                    flex flex-col justify-between shadow-sm hover:shadow-2xl hover:-translate-y-2 h-full min-h-[460px]
                    ${isHighlighted ? 'border-2 border-primary/40' : 'border border-slate-100'}
                  `}
                >
                  {/* Service Image Header */}
                  {service.image && (
                    <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                      <Image 
                        src={service.image} 
                        alt={service.title} 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform duration-700" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
                      <div className="absolute bottom-4 left-6">
                        <div className="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:rotate-[360deg] shadow-lg shadow-primary/30">
                          <DynamicIcon name={service.icon} className="text-2xl" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Body Content */}
                  <div className="p-8 flex-1 flex flex-col justify-between space-y-6">
                    {!service.image && (
                      <div className="w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:rotate-[360deg] shadow-lg shadow-primary/25">
                        <DynamicIcon name={service.icon} className="text-3xl" />
                      </div>
                    )}

                    <div className="space-y-3">
                      <div className="space-y-1">
                        <h3 className="text-2xl font-bold text-slate-900 group-hover:text-primary transition-colors">
                          {service.title}
                        </h3>
                        <p className="text-sm font-semibold text-primary/80">{service.subtitle}</p>
                      </div>
                      
                      <div 
                        className="text-slate-500 leading-relaxed text-sm line-clamp-3 prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: service.content }}
                      />
                    </div>
                    
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-primary font-bold">
                      <span className="text-sm group-hover:underline">Inquire About Service</span>
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all group-hover:translate-x-1">
                        <FaArrowRight className="text-xs" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default ServicesGridSection;
