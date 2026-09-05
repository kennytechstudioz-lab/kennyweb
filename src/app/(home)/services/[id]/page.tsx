'use client';

import React, { useState, useEffect } from 'react';
import { serviceStore, Service } from '@/lib/stores/ServiceStore';
import { companyStore, Company } from '@/lib/stores/CompanyStore';
import Image from 'next/image';
import Link from 'next/link';
import { 
  HiArrowLeft, 
  HiVideoCamera, 
  HiCheckCircle, 
  HiMail, 
  HiPhone, 
  HiCalendar, 
  HiCode, 
  HiCamera, 
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

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ServiceDetailPage({ params }: PageProps) {
  const resolvedParams = React.use(params);
  const id = resolvedParams.id;

  const [service, setService] = useState<Service | null>(null);
  const [otherServices, setOtherServices] = useState<Service[]>([]);
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const [allServices, compData] = await Promise.all([
        serviceStore.getServices(),
        companyStore.getCompany()
      ]);
      const current = allServices.find((s) => s._id === id);
      if (current) {
        setService(current);
        setOtherServices(allServices.filter((s) => s._id !== id).slice(0, 3));
      }
      setCompany(compData);
      setLoading(false);
    };
    loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-500 font-medium text-lg">Loading service details...</div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8 text-center space-y-6">
        <h1 className="text-4xl font-extrabold text-slate-900">Service Not Found</h1>
        <p className="text-slate-500 max-w-md">
          The service details you are looking for could not be found. It may have been renamed or removed.
        </p>
        <Link 
          href="/services" 
          className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-bold hover:bg-primary-dark transition-all shadow-lg"
        >
          <HiArrowLeft />
          Back to Services
        </Link>
      </div>
    );
  }

  return (
    <main className="bg-slate-50 min-h-screen">
      {/* Dynamic Hero Banner */}
      <section className="relative bg-navy py-28 text-white overflow-hidden">
        {/* Background Image / Blur Effect */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <Image 
            src={service.image} 
            alt={service.title} 
            fill 
            className="object-cover blur-[2px]"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/90 to-transparent"></div>
        
        <div className="container relative z-10 space-y-6">
          <Link 
            href="/services" 
            className="inline-flex items-center gap-2 text-primary hover:text-white transition-colors font-bold text-sm"
          >
            <HiArrowLeft />
            Back to Services
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30">
              <DynamicIcon name={service.icon} className="text-3xl" />
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight">{service.title}</h1>
              <p className="text-xl text-slate-300 font-semibold">{service.subtitle}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-20">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            
            {/* Left Content Column */}
            <div className="lg:col-span-2 space-y-12">
              
              {/* Main Service Image */}
              <div className="relative aspect-[16/9] rounded-2xl md:rounded-[40px] overflow-hidden bg-slate-200">
                <Image 
                  src={service.image} 
                  alt={service.title} 
                  fill 
                  className="object-cover"
                />
              </div>

              {/* Description Content */}
              <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-100 shadow-sm space-y-8">
                <h2 className="text-3xl font-extrabold text-slate-900">Service Overview</h2>
                
                <div 
                  className="text-slate-600 leading-relaxed text-lg prose prose-blue max-w-none prose-p:mb-4 prose-ul:list-disc prose-ul:pl-6"
                  dangerouslySetInnerHTML={{ __html: service.content }}
                />

                {service.videoUrl && (
                  <div className="mt-8 p-6 px-[10px] md:px-6 bg-red-50/50 rounded-3xl border border-red-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 min-w-[3rem] flex-shrink-0 bg-red-500 text-white rounded-2xl flex items-center justify-center shadow-md">
                        <HiVideoCamera className="text-2xl" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">Video Presentation Available</p>
                        <p className="text-sm text-slate-500">Watch an intro presentation about our service flow.</p>
                      </div>
                    </div>
                    <a 
                      href={service.videoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-red-500 text-white px-6 py-3 rounded-2xl font-bold hover:bg-red-600 transition-all shadow-md shadow-red-500/20 text-center w-full sm:w-auto"
                    >
                      Watch Video
                    </a>
                  </div>
                )}
              </div>


            </div>

            {/* Right Meta/CTA Column */}
            <div className="lg:col-span-1 space-y-8">
              
              {/* Connect Card */}
              <div className="bg-navy rounded-[2.5rem] px-[10px] md:p-10 py-10 text-white relative overflow-hidden shadow-xl">
                <div className="absolute inset-0 opacity-10 bg-repeat bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
                <div className="relative z-10 space-y-8">
                  <div className="space-y-2">
                    <p className="text-primary text-xs font-bold uppercase tracking-widest">// START YOUR PROJECT</p>
                    <h3 className="text-2xl font-black">Need custom solution for your business?</h3>
                    <p className="text-slate-400 text-sm">
                      Get in touch with us to discuss your requirements and receive a customized quote.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                        <HiMail className="text-primary text-xl" />
                      </div>
                      <div>
                        <p className="text-white/60 text-xs font-bold uppercase tracking-wider">Email Us</p>
                        <a 
                          href={`mailto:${company?.email || 'hello@kennytechstudios.com'}`} 
                          className="font-bold hover:text-primary transition-colors text-sm"
                        >
                          {company?.email || 'hello@kennytechstudios.com'}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                        <HiPhone className="text-primary text-xl" />
                      </div>
                      <div>
                        <p className="text-white/60 text-xs font-bold uppercase tracking-wider">Call Us</p>
                        <a 
                          href={`tel:${company?.phoneNumber || '+1234567890'}`} 
                          className="font-bold hover:text-primary transition-colors text-sm"
                        >
                          {company?.phoneNumber || '+1 (234) 567-890'}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                        <HiCalendar className="text-primary text-xl" />
                      </div>
                      <div>
                        <p className="text-white/60 text-xs font-bold uppercase tracking-wider">Working Hours</p>
                        <p className="font-bold text-sm">Mon - Fri: 9:00 AM - 6:00 PM</p>
                      </div>
                    </div>
                  </div>

                  <Link 
                    href="/contact" 
                    className="block text-center w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-primary/25"
                  >
                    Contact Us Today
                  </Link>
                </div>
              </div>

              {/* Other Services Navigation List */}
              <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
                <h4 className="text-lg font-extrabold text-slate-900">Explore Other Services</h4>
                <div className="space-y-4">
                  {otherServices.map((other) => (
                    <Link 
                      key={other._id} 
                      href={`/services/${other._id}`}
                      className="flex items-center gap-4 p-3 rounded-2xl border border-slate-50 hover:border-slate-100 hover:bg-slate-50 transition-all group"
                    >
                      <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                        <DynamicIcon name={other.icon} className="text-xl" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-800 text-sm truncate group-hover:text-primary transition-colors">{other.title}</p>
                        <p className="text-xs text-slate-400 truncate">{other.subtitle}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
