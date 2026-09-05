import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-[10px] md:px-8">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="relative">
          <h1 className="text-[12rem] md:text-[15rem] font-black text-slate-100 leading-none select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
              Page Not Found
            </h2>
          </div>
        </div>
        
        <p className="text-lg text-slate-600 max-w-md mx-auto">
          Oops! The page you're looking for seems to have gone on a digital vacation. 
          Let's get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/">
            <button className="bg-primary text-white px-10 py-4 rounded-full font-bold transition-all hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/30 cursor-pointer">
              Back to Home
            </button>
          </Link>
          <Link href="/about">
            <button className="border border-slate-200 text-slate-600 px-10 py-4 rounded-full font-bold transition-all hover:bg-slate-50 cursor-pointer">
              Contact Support
            </button>
          </Link>
        </div>

        <div className="pt-12">
          <div className="flex items-center justify-center gap-2 text-primary font-semibold">
            <span className="w-8 h-[2px] bg-primary"></span>
            <span>Kenny Tech IT Solutions</span>
            <span className="w-8 h-[2px] bg-primary"></span>
          </div>
        </div>
      </div>
    </div>
  );
}
