'use client';

import React, { useState, useEffect } from 'react';
import { FaFacebookF, FaTwitter, FaPinterestP, FaInstagram, FaYoutube, FaPaperPlane } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';
import { companyStore, Company } from '@/lib/stores/CompanyStore';
import { usePathname } from 'next/navigation';

const Footer = () => {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const isContactPage = pathname === '/contact';

  useEffect(() => {
    const fetchCompany = async () => {
      const data = await companyStore.getCompany();
      setCompany(data);
      setLoading(false);
    };
    fetchCompany();
  }, []);

  return (
    <footer className="bg-navy text-white relative overflow-hidden">
      {/* Top CTA Banner */}
      {!isContactPage && (
        <div className="container py-8 md:py-16 border-b border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-8">
            <h2 className="text-2xl md:text-5xl font-extrabold text-center md:text-left">
              Let's <span className="text-primary">Connect</span> there
            </h2>
            <Link 
              href="/contact" 
              className="bg-primary text-white px-6 py-3 md:px-10 md:py-4 rounded-full font-bold transition-all hover:bg-white hover:text-primary shadow-lg hover:shadow-primary/40 text-center cursor-pointer"
            >
              Contact Us
            </Link>
          </div>
        </div>
      )}

      {/* Main Footer Content */}
      <div className="container py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Logo & About */}
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <Link href="/">
                <Image
                  src="/LightLogo.png"
                  alt="Kenny Tech Studios Logo"
                  width={150}
                  height={100}
                  className="object-contain"
                />
              </Link>
            </div>
            <p className="text-white/60 leading-relaxed max-w-xs">
              Kenny Tech Studios is a leading provider of innovative digital solutions, specializing in software development, web & mobile applications, and high-impact digital marketing.
            </p>
            <div className="flex gap-4">
              {[FaFacebookF, FaTwitter, FaPinterestP, FaInstagram, FaYoutube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-primary transition-all hover:-translate-y-1"
                >
                  <Icon className="text-sm" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-8">
            <h3 className="text-xl font-bold border-l-4 border-primary pl-4">Navigation</h3>
            <ul className="space-y-4 text-white/60 font-medium">
              {['Our Team', 'Career', 'About Us', 'Testimonial', 'FAQs'].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-primary transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-all"></span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <h3 className="text-xl font-bold border-l-4 border-primary pl-4">Contact</h3>
            <div className="space-y-6 text-white/60 font-medium">
              {loading ? (
                <div className="space-y-4 animate-pulse">
                  <div className="h-4 w-32 bg-white/10 rounded-full"></div>
                  <div className="h-4 w-40 bg-white/10 rounded-full"></div>
                  <div className="h-12 w-48 bg-white/10 rounded-xl"></div>
                </div>
              ) : (
                <>
                  <p>{company?.phoneNumber || '(000) 000-0000'}</p>
                  <p>{company?.email || 'info@kennytech.com'}</p>
                  <p className="max-w-[200px] leading-relaxed">
                    {company?.address || 'Loading address...'}
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-8">
            <h3 className="text-xl font-bold border-l-4 border-primary pl-4">Get the latest information</h3>
            <div className="relative">
              <input
                type="email"
                placeholder="Email address"
                className="w-full bg-white/5 border border-white/10 rounded-full py-4 pl-6 pr-16 focus:outline-none focus:border-primary transition-all text-sm"
              />
              <button className="absolute right-1 top-1 bottom-1 aspect-square bg-primary rounded-full flex items-center justify-center hover:bg-white hover:text-primary transition-all">
                <FaPaperPlane className="text-xs" />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-primary py-6">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-semibold text-white">
          <p>Copyright © {new Date().getFullYear()} {company?.name || 'Kenny Tech Studios'}. All Rights Reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:underline">User Terms & Conditions</a>
            <span className="opacity-40">|</span>
            <a href="#" className="hover:underline">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
