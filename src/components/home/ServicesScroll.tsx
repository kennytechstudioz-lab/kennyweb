import React from 'react';
import { PiSparkleFill } from 'react-icons/pi';

const services = [
  'UI & UX Design',
  'Web Development',
  'Mobile App Development',
  'Digital Marketing',
  'SEO',
  'Video Editing & 3D Animation'
];

const ServicesScroll = () => {
  return (
    <div className="py-8 bg-primary overflow-hidden border-y border-white/10">
      <div className="flex items-center gap-12">
        <div className="animate-scroll">
          {/* First set of services */}
          {services.map((service, index) => (
            <div key={`s1-${index}`} className="flex items-center gap-8 whitespace-nowrap px-8">
              <PiSparkleFill className="text-3xl text-white" />
              <span className="text-white text-2xl font-bold uppercase tracking-wider">{service}</span>
            </div>
          ))}
          {/* Duplicate set for seamless scrolling */}
          {services.map((service, index) => (
            <div key={`s2-${index}`} className="flex items-center gap-8 whitespace-nowrap px-8">
              <PiSparkleFill className="text-3xl text-white" />
              <span className="text-white text-2xl font-bold uppercase tracking-wider">{service}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicesScroll;


