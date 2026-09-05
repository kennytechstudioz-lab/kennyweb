'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function SignupSuccessContent() {
  const searchParams = useSearchParams();
  const name = searchParams.get('name') || '';

  return (
    <div className="min-h-[75vh] bg-slate-50 flex items-center justify-center py-20 px-[10px] md:px-0 overflow-hidden relative">
      {/* Background Decorative Light Glow Blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse delay-700"></div>

      <div className="max-w-xl w-full bg-white border border-slate-100 px-[15px] py-12 md:p-12 rounded-[32px] shadow-2xl text-center space-y-8 relative z-10 animate-in fade-in zoom-in-95 duration-500">
        
        {/* Animated Checkmark Badge */}
        <div className="relative flex items-center justify-center">
          <div className="w-24 h-24 bg-emerald-50 text-emerald-500 border border-emerald-100 rounded-full flex items-center justify-center animate-bounce">
            <svg 
              className="w-12 h-12 text-emerald-500 animate-in fade-in zoom-in-50 duration-700 delay-300" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          {/* Subtle Outer Glow Ring */}
          <div className="absolute w-28 h-28 border border-emerald-500/20 rounded-full animate-ping opacity-25"></div>
        </div>

        {/* Successful Message */}
        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">
            Account Created!
          </h1>
          <p className="text-xl font-semibold text-primary">
            Registration Completed Successfully.
          </p>
          {name ? (
            <p className="text-slate-600 max-w-md mx-auto">
              Welcome, <span className="text-slate-900 font-bold">{name}</span>! Your account has been registered. You can now sign in using the button below.
            </p>
          ) : (
            <p className="text-slate-600 max-w-md mx-auto">
              Your account has been registered. You can now sign in using the button below.
            </p>
          )}
        </div>

        {/* Divider */}
        <div className="h-px bg-slate-100 w-full my-2"></div>

        {/* Navigation Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Link href="/signin" className="w-full sm:w-auto">
            <button className="w-full sm:px-8 py-4 bg-gradient-to-r from-primary to-primary-dark text-white rounded-2xl font-bold transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1 cursor-pointer active:scale-95">
              Sign In to Your Account
            </button>
          </Link>
          <Link href="/" className="w-full sm:w-auto">
            <button className="w-full sm:px-8 py-4 bg-slate-100 text-slate-700 border border-slate-200 rounded-2xl font-semibold transition-all duration-300 hover:bg-slate-200 hover:-translate-y-1 cursor-pointer active:scale-95">
              Explore Homepage
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SignupSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-[75vh] flex items-center justify-center bg-slate-50 text-slate-500 font-medium">Loading success details...</div>}>
      <SignupSuccessContent />
    </Suspense>
  );
}
