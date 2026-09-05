'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Header from '@/components/home/Header';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Give it a brief, high-end delay to let resources fetch and components render
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="home-layout relative">
      {/* Sleek Premium Loader */}
      {loading && (
        <div className="fixed inset-0 z-[9999] bg-navy flex flex-col items-center justify-center transition-all duration-500">
          <div className="relative flex flex-col items-center gap-6 animate-pulse">
            {/* Outer spinning gradient ring */}
            <div className="w-24 h-24 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin absolute -top-2"></div>
            
            {/* Central Logo */}
            <div className="relative w-48 h-20 flex items-center justify-center">
              <Image 
                src="/Logo.png" 
                alt="Kenny Tech Studios Logo" 
                width={180} 
                height={120} 
                className="object-contain filter brightness-110"
                priority
              />
            </div>
            
            {/* Glowing progress line */}
            <div className="w-32 h-1 bg-white/10 rounded-full overflow-hidden relative">
              <div className="absolute top-0 left-0 h-full bg-primary w-1/2 animate-[loading-bar_1.2s_ease-in-out_infinite]"></div>
            </div>
          </div>
        </div>
      )}

      {/* Main Page Layout */}
      <div className={`transition-opacity duration-700 ${loading ? 'opacity-0' : 'opacity-100'}`}>
        <Header />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </div>

      <style jsx global>{`
        @keyframes loading-bar {
          0% {
            left: -50%;
            width: 30%;
          }
          50% {
            width: 40%;
          }
          100% {
            left: 100%;
            width: 20%;
          }
        }
      `}</style>
    </div>
  );
}
