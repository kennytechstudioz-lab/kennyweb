'use client';

import React, { useState, useEffect } from 'react';
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

const ServicesList = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchServices = async () => {
      const data = await serviceStore.getServices();
      setServices(data);
      setLoading(false);
    };
    fetchServices();
  }, []);

  if (loading) {
    return (
      <section className="py-24 bg-white text-center text-slate-500 font-medium">
        Loading services...
      </section>
    );
  }

  return (
    <section className="py-24 bg-white">
      <div className="container">
        {/* Header Section */}
        <div className="text-center mb-16 space-y-4">
          <div className="flex items-center justify-center gap-2 font-semibold text-primary">
            <span className="text-2xl">//</span>
            <span className="uppercase tracking-widest text-sm">Our Services</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
            Services We Provide to<br />
            <span className="text-primary">Elevate Your Business</span>
          </h2>
        </div>

        {/* Grid Section */}
        {services.length === 0 ? (
          <div className="text-center py-8 text-slate-500 font-semibold">
            No services registered yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const isHighlighted = index === 0;
              return (
                <div 
                  key={service._id || index}
                  onClick={() => router.push(`/services/${service._id}`)}
                  className={`
                    p-8 md:p-10 rounded-[30px] transition-all duration-300 group cursor-pointer
                    flex flex-col justify-between shadow-[0_0_50px_rgba(0,0,0,0.03)] hover:shadow-[0_0_50px_rgba(59,130,246,0.1)] hover:-translate-y-2 h-full min-h-[360px]
                    ${isHighlighted ? 'border-2 border-primary bg-white' : 'border border-slate-50 bg-white'}
                  `}
                >
                  <div className="space-y-6">
                    <div className="w-16 h-16 bg-primary text-white rounded-xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 shadow-md shadow-primary/20">
                      <DynamicIcon name={service.icon} className="text-3xl" />
                    </div>
                    
                    <div className="space-y-1">
                      <h3 className="text-2xl font-bold text-slate-900 group-hover:text-primary transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-xs font-semibold text-slate-400">{service.subtitle}</p>
                    </div>
                    
                    <div 
                      className="text-slate-500 leading-relaxed text-sm line-clamp-4 prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: service.content }}
                    />
                  </div>
                  
                  <div className="mt-8 pt-4 border-t border-slate-50 flex items-center gap-2 text-primary font-bold group-hover:gap-4 transition-all">
                    <span className="text-sm">Learn more</span>
                    <FaArrowRight className="text-xs" />
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

export default ServicesList;
