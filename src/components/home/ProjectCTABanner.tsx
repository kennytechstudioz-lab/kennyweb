import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const ProjectCTABanner = () => {
  return (
    <section className="hidden md:block py-20 bg-white">
      <div className="container">
        <div className="bg-navy rounded-[40px] overflow-hidden relative min-h-[400px] flex items-center">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4"></div>
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-primary rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4"></div>
          </div>

          <div className="container relative z-10 py-12 md:py-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8 max-w-[600px]">
                <div className="flex items-center gap-2 font-semibold text-primary">
                  <span className="text-2xl">//</span>
                  <span className="uppercase tracking-widest text-sm">Contact Us</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
                  Need Consultation or Help<br />
                  with Your Next Project?
                </h2>
                <Link 
                  href="/contact"
                  className="inline-block bg-primary text-white px-10 py-4 rounded-full font-bold transition-all hover:bg-white hover:text-primary shadow-lg shadow-primary/20 text-center cursor-pointer"
                >
                  Contact Us
                </Link>
              </div>

              <div className="relative hidden lg:block">
                <div className="absolute -bottom-12 right-0 w-[120%] h-[500px]">
                  <Image 
                    src="/cta-woman.png" 
                    alt="Consultant" 
                    fill 
                    className="object-contain object-bottom"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectCTABanner;
