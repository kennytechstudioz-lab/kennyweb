import React from 'react';
import Link from 'next/link';

const ProjectsHero = () => {
  return (
    <div className="relative h-[300px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("/services-hero-bg.png")' }}
      >
        <div className="absolute inset-0 bg-navy/80 backdrop-blur-[2px]"></div>
      </div>

      {/* Content */}
      <div className="container relative z-10 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4">
          Projects
        </h1>
        <div className="flex items-center justify-center gap-2 text-white/80 font-medium">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span className="text-primary">/</span>
          <span className="text-white">Projects</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectsHero;
