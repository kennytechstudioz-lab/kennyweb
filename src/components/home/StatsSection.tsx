'use client';

import React, { useEffect, useState } from 'react';
import { companyStore, Company } from '@/lib/stores/CompanyStore';

const StatsSection = () => {
  const [company, setCompany] = useState<Company | null>(companyStore.company);

  useEffect(() => {
    companyStore.getCompany().then(data => {
      if (data) setCompany(data);
    });
  }, []);

  const completedJobs = company?.completedJobs || '150+';
  const clients = company?.clients || '2000+';
  let satisfaction = company?.customerSatisfaction || '99%';
  if (satisfaction && !satisfaction.endsWith('%') && !isNaN(Number(satisfaction))) {
    satisfaction = `${satisfaction}%`;
  }
  const years = company?.yearsExperience || '18+';

  const stats = [
    { value: completedJobs, label: 'Completed Jobs' },
    { value: clients, label: 'Happy Clients' },
    { value: satisfaction, label: 'Customer Satisfaction' },
    { value: years, label: 'Years Experience' },
  ];

  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-r from-navy via-[#0c1830] to-navy border-y border-white/5">
      {/* Background Decorative Tech Glows */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl translate-y-1/2"></div>
      </div>

      <div className="container relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className={`flex flex-col items-center text-center p-4 ${index !== stats.length - 1 ? 'lg:border-r border-white/10' : ''}`}
            >
              <span className="text-5xl md:text-6xl font-black text-white mb-2 tracking-tight">
                {stat.value}
              </span>
              <span className="text-white/60 font-semibold uppercase tracking-widest text-sm md:text-base">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
