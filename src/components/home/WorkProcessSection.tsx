import React from 'react';
import { FaClipboardList, FaLightbulb, FaLayerGroup, FaRegSmile } from 'react-icons/fa';

const steps = [
  {
    number: '01',
    title: 'Consultation',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    icon: <FaClipboardList className="text-3xl" />
  },
  {
    number: '02',
    title: 'Strategy',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    icon: <FaLightbulb className="text-3xl" />
  },
  {
    number: '03',
    title: 'Implementation',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    icon: <FaLayerGroup className="text-3xl" />
  },
  {
    number: '04',
    title: 'Final Result',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    icon: <FaRegSmile className="text-3xl" />
  }
];

const WorkProcessSection = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-white">
      {/* Background Text (Outline) */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 text-[10rem] font-black select-none pointer-events-none z-0 uppercase tracking-tighter opacity-[0.03] whitespace-nowrap" style={{ WebkitTextStroke: '2px #0f172a' }}>
        Work Process
      </div>

      <div className="container relative z-10 text-center">
        <div className="flex flex-col items-center gap-4 mb-16">
          <div className="flex items-center gap-2 font-semibold text-primary">
            <span className="text-2xl">//</span>
            <span className="uppercase tracking-widest text-sm">Our Work Process</span>
          </div>
          <h2 className="text-5xl font-extrabold leading-[1.1] text-slate-900">
            Our Proven <span className="text-primary">Work Process</span>
          </h2>
        </div>

        <div className="relative flex flex-col lg:flex-row justify-between items-start gap-12 lg:gap-8 pt-10">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-[50px] left-[10%] right-[10%] h-[2px] bg-slate-100 -z-10"></div>
          
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center flex-1 group">
              <div className="relative mb-8">
                {/* Main Icon Circle */}
                <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center text-white shadow-xl transition-all duration-500 group-hover:scale-110 group-hover:bg-navy">
                  {step.icon}
                </div>
                {/* Number Badge */}
                <div className="absolute top-2 -right-2 w-10 h-10 bg-navy rounded-full border-4 border-white flex items-center justify-center text-white text-xs font-bold">
                  {step.number}
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-slate-900 mb-4 transition-colors group-hover:text-primary">
                {step.title}
              </h3>
              
              <p className="text-slate-500 max-w-[200px]">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkProcessSection;
