import React from 'react';
import { HiOutlineMail } from 'react-icons/hi';

const NewsletterSection = () => {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background Text (Outline) */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 text-[10rem] font-black select-none pointer-events-none z-0 uppercase tracking-tighter opacity-[0.02] whitespace-nowrap" style={{ WebkitTextStroke: '2px #0f172a' }}>
        NEWSLETTER
      </div>

      <div className="container relative z-10">
        <div className="max-w-[800px] mx-auto text-center space-y-8">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 font-semibold text-primary">
              <span className="text-2xl">//</span>
              <span className="uppercase tracking-widest text-sm">Our Newsletter</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
              Subscribe for <span className="text-primary">Expert IT</span><br />
              Tips & Special Offers
            </h2>
          </div>

          <form className="relative max-w-[600px] mx-auto group">
            <div className="relative flex flex-col md:flex-row gap-4 p-2 bg-white rounded-full shadow-[0_0_50px_rgba(0,0,0,0.05)] border border-slate-100 focus-within:border-primary transition-all">
              <div className="flex-1 flex items-center px-6 gap-4">
                <HiOutlineMail className="text-2xl text-slate-400 group-focus-within:text-primary transition-colors" />
                <input 
                  type="email" 
                  placeholder="Enter Email Address" 
                  className="w-full bg-transparent border-none focus:outline-none text-slate-900 font-medium py-4"
                  required
                />
              </div>
              <button className="bg-primary text-white px-10 py-4 rounded-full font-bold transition-all hover:bg-navy shadow-lg shadow-primary/20">
                Subscribe
              </button>
            </div>
          </form>

          <p className="text-slate-400 text-sm font-medium">
            * We promise not to spam your inbox. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
