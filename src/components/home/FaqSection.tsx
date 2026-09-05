'use client';

import React, { useState } from 'react';
import { FaPlus, FaMinus, FaPhoneAlt, FaRegComments } from 'react-icons/fa';

const faqs = [
  {
    question: 'What services does your company provide?',
    answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.'
  },
  {
    question: 'What industries do you serve?',
    answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.'
  },
  {
    question: 'Do you offer customized IT solutions?',
    answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.'
  },
  {
    question: 'How can I contact your support team?',
    answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.'
  },
  {
    question: 'How secure are your IT solutions?',
    answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.'
  },
  {
    question: 'Do you offer 24/7 technical support?',
    answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.'
  }
];

const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState(1); // Second one open by default as per image

  return (
    <section className="py-24 relative overflow-hidden bg-slate-50">
      {/* Background Text (Outline) */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 text-[10rem] font-black select-none pointer-events-none z-0 uppercase tracking-tighter opacity-[0.03] whitespace-nowrap" style={{ WebkitTextStroke: '2px #0f172a' }}>
        FAQs
      </div>

      <div className="container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Accordions */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="flex flex-col gap-4 mb-8">
              <div className="flex items-center gap-2 font-semibold text-primary">
                <span className="text-2xl">//</span>
                <span className="uppercase tracking-widest text-sm">FAQs</span>
              </div>
              <h2 className="text-5xl font-extrabold leading-[1.1] text-slate-900">
                Question? <span className="text-primary">Look here.</span>
              </h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div 
                  key={index} 
                  className={`rounded-2xl transition-all duration-500 overflow-hidden ${openIndex === index ? 'bg-primary text-white shadow-xl' : 'bg-white text-slate-900'}`}
                >
                  <button 
                    onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                    className="w-full flex justify-between items-center p-6 text-left font-bold text-xl"
                  >
                    <span>{faq.question}</span>
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${openIndex === index ? 'bg-white text-primary rotate-180' : 'bg-slate-50 text-slate-400'}`}>
                      {openIndex === index ? <FaMinus size={12} /> : <FaPlus size={12} />}
                    </span>
                  </button>
                  
                  <div 
                    className={`transition-all duration-500 ease-in-out px-6 ${openIndex === index ? 'max-h-40 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}
                  >
                    <p className={`${openIndex === index ? 'text-white/80' : 'text-slate-500'} leading-relaxed`}>
                      {faq.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Support Cards */}
          <div className="lg:col-span-5 space-y-8">
            {/* Dark Support Card */}
            <div className="relative bg-navy rounded-[40px] p-10 text-white overflow-hidden text-center flex flex-col items-center gap-6 shadow-2xl">
              <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('/topo-pattern.png')] bg-cover bg-center mix-blend-overlay"></div>
              
              <div className="relative z-10 w-20 h-20 bg-primary/20 rounded-2xl flex items-center justify-center">
                <FaRegComments className="text-primary text-4xl" />
              </div>
              
              <div className="relative z-10 space-y-2">
                <h3 className="text-2xl font-bold">You have different questions?</h3>
                <p className="text-white/60">Our team will answer all your questions. We ensure a quick response.</p>
              </div>
              
              <button className="relative z-10 bg-primary text-white px-10 py-4 rounded-full font-bold transition-all hover:bg-white hover:text-primary">
                Contact Us
              </button>
            </div>

            {/* White Service Card */}
            <div className="bg-white rounded-[40px] p-10 flex items-center gap-6 shadow-lg border border-slate-100">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary text-2xl">
                <FaPhoneAlt />
              </div>
              <div className="space-y-1">
                <p className="text-slate-400 text-sm font-medium">Your Comfort, Our Priority</p>
                <h4 className="text-2xl font-black text-slate-900">24/7 Service</h4>
                <p className="text-slate-600 font-bold">(000) 000-0000</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default FaqSection;
