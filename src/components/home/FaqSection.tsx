'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaPlus, FaMinus, FaPhoneAlt, FaRegComments } from 'react-icons/fa';
import { companyStore, Company } from '@/lib/stores/CompanyStore';
import { faqStore, Faq } from '@/lib/stores/FaqStore';

const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [company, setCompany] = useState<Company | null>(companyStore.company);
  const [faqs, setFaqs] = useState<Faq[]>(() => faqStore.faqs);
  const [loading, setLoading] = useState(faqStore.faqs.length === 0);

  useEffect(() => {
    let isMounted = true;
    companyStore.getCompany().then((c) => {
      if (isMounted) setCompany(c);
    });

    faqStore.getFaqs().then((data) => {
      if (isMounted) {
        if (data && data.length > 0) {
          setFaqs(data);
        }
        setLoading(false);
      }
    });

    const unsubscribe = faqStore.subscribe(() => {
      if (isMounted) {
        setFaqs([...faqStore.faqs]);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

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
              {loading && faqs.length === 0 ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((n) => (
                    <div key={n} className="bg-white rounded-2xl p-6 border border-slate-100 animate-pulse space-y-3">
                      <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                      <div className="h-4 bg-slate-100 rounded w-full"></div>
                    </div>
                  ))}
                </div>
              ) : faqs.length === 0 ? (
                <div className="bg-white rounded-2xl p-10 text-center text-slate-500 border border-slate-100">
                  <p className="font-semibold">No questions available at the moment.</p>
                </div>
              ) : (
                faqs.map((faq, index) => (
                  <div 
                    key={faq._id || index} 
                    className={`rounded-2xl transition-all duration-500 overflow-hidden ${openIndex === index ? 'bg-primary text-white shadow-xl' : 'bg-white text-slate-900 border border-slate-100/80 shadow-sm'}`}
                  >
                    <button 
                      onClick={() => setOpenIndex(openIndex === index ? null : index)}
                      className="w-full flex justify-between items-center p-6 text-left font-bold text-lg md:text-xl gap-4"
                    >
                      <div className="flex flex-col items-start gap-1">
                        {faq.category && (
                          <span className={`text-[11px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full ${openIndex === index ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'}`}>
                            {faq.category}
                          </span>
                        )}
                        <span>{faq.question}</span>
                      </div>
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${openIndex === index ? 'bg-white text-primary rotate-180' : 'bg-slate-50 text-slate-400'}`}>
                        {openIndex === index ? <FaMinus size={12} /> : <FaPlus size={12} />}
                      </span>
                    </button>
                    
                    <div 
                      className={`transition-all duration-500 ease-in-out px-6 overflow-hidden ${openIndex === index ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}
                    >
                      <p className={`${openIndex === index ? 'text-white/90' : 'text-slate-500'} leading-relaxed text-sm md:text-base`}>
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                ))
              )}
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
              
              <Link 
                href="/contact"
                className="relative z-10 bg-primary text-white px-10 py-4 rounded-full font-bold transition-all hover:bg-white hover:text-primary cursor-pointer text-center"
              >
                Contact Us
              </Link>
            </div>

            {/* White Service Card */}
            <div className="bg-white rounded-[40px] p-10 flex items-center gap-6 shadow-lg border border-slate-100">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary text-2xl">
                <FaPhoneAlt />
              </div>
              <div className="space-y-1">
                <p className="text-slate-400 text-sm font-medium">Your Comfort, Our Priority</p>
                <h4 className="text-2xl font-black text-slate-900">24/7 Service</h4>
                <p className="text-slate-600 font-bold">{company?.phoneNumber || '(000) 000-0000'}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default FaqSection;
