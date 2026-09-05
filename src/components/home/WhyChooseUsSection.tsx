import React from 'react';
import Image from 'next/image';
import { FaHandHoldingUsd, FaBusinessTime, FaTrophy, FaPlay } from 'react-icons/fa';
import { HiOutlineUserGroup } from 'react-icons/hi';

const benefits = [
  {
    title: 'Affordable Price',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore...',
    icon: <FaHandHoldingUsd className="text-4xl text-white" />
  },
  {
    title: 'Professional Team',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore...',
    icon: <HiOutlineUserGroup className="text-4xl text-white" />
  },
  {
    title: '18+ Years Experience',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore...',
    icon: <FaBusinessTime className="text-4xl text-white" />
  },
  {
    title: 'Award Winning',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore...',
    icon: <FaTrophy className="text-4xl text-white" />
  }
];

const WhyChooseUsSection = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-navy text-white">
      {/* Background Text (Outline) */}
      <div className="absolute top-12 left-[-2%] text-[10rem] font-black select-none pointer-events-none z-0 uppercase tracking-tighter opacity-[0.05]" style={{ WebkitTextStroke: '2px #ffffff' }}>
        Why Choose Us
      </div>

      <div className="container relative z-10">
        <div className="flex flex-col lg:flex-row justify-between items-start mb-16 gap-8">
          <div className="flex flex-col gap-4 max-w-[600px]">
            <div className="flex items-center gap-2 font-semibold text-primary">
              <span className="text-2xl">//</span>
              <span className="uppercase tracking-widest text-sm">Why Choose Us</span>
            </div>
            <h2 className="text-5xl font-extrabold leading-[1.1]">
              Why Trust Us for<br />
              Your IT Needs?
            </h2>
          </div>
          <button className="bg-primary text-white px-10 py-4 rounded-full font-semibold transition-all hover:bg-primary-dark hover:-translate-y-1 shadow-lg hover:shadow-primary/30 mt-4 lg:mt-0">
            Get A Quote
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Side: Video Thumbnail */}
          <div className="relative group cursor-pointer">
            <div className="relative aspect-[4/3] rounded-[40px] overflow-hidden shadow-2xl">
              <Image 
                src="/video-thumb.png" 
                alt="Team Meeting" 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-navy/20 group-hover:bg-navy/40 transition-colors"></div>
              
              {/* Play Button */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform duration-500">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-primary shadow-xl">
                  <FaPlay className="ml-1 text-xl" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Benefits Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-12">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex flex-col gap-5 group">
                <div className="w-16 h-16 flex items-center justify-start transition-transform duration-500 group-hover:translate-x-2">
                  {benefit.icon}
                </div>
                <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">
                  {benefit.title}
                </h3>
                <p className="text-white/60 leading-relaxed text-sm">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;
