import React from 'react';
import Image from 'next/image';

const stats = [
  { value: '150+', label: 'Team Members' },
  { value: '2000+', label: 'Happy Clients' },
  { value: '99%', label: 'Customer Satisfaction' },
  { value: '18+', label: 'Years Experience' }
];

const StatsSection = () => {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/video-thumb.png" 
          alt="Stats Background" 
          fill 
          className="object-cover"
        />
        <div className="absolute inset-0 bg-navy/90 backdrop-blur-[2px]"></div>
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
