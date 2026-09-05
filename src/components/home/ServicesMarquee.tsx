import React from 'react';
import { HiOutlineSparkles } from 'react-icons/hi';

const serviceNames = [
  "UI & UX Design",
  "Web Development",
  "Mobile App Development",
  "Digital Marketing",
  "SEO",
  "Video Editing & 3D Animation"
];

const ServicesMarquee = () => {
  return (
    <div className="bg-primary py-6 overflow-hidden border-t border-white/10">
      <div className="animate-scroll whitespace-nowrap flex items-center">
        {/* Duplicate the list to ensure seamless looping */}
        {[...serviceNames, ...serviceNames].map((name, index) => (
          <div key={index} className="flex items-center gap-8 mx-8">
            <span className="text-white text-xl md:text-2xl font-bold uppercase tracking-wider">
              {name}
            </span>
            <HiOutlineSparkles className="text-white text-3xl" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesMarquee;
