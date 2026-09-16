'use client';

import React, { useState, useEffect } from 'react';
import { FaFacebookF, FaLinkedinIn, FaPaperPlane } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { HiCheckCircle, HiInformationCircle, HiExclamationCircle } from 'react-icons/hi';
import Image from 'next/image';
import Link from 'next/link';
import { companyStore, Company } from '@/lib/stores/CompanyStore';
import { usePathname } from 'next/navigation';
import { subscribeToNewsletter, SubscribeStatus } from '@/lib/subscribeNewsletter';

const Footer = () => {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const isContactPage = pathname === '/contact';

  // Newsletter subscribe state
  const [subEmail, setSubEmail] = useState('');
  const [subLoading, setSubLoading] = useState(false);
  const [subResult, setSubResult] = useState<{ status: SubscribeStatus; message: string } | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subEmail) return;
    setSubLoading(true);
    setSubResult(null);
    const res = await subscribeToNewsletter(subEmail);
    setSubResult(res);
    setSubLoading(false);
    if (res.status === 'success') setSubEmail('');
  };

  const subStatusStyles: Record<SubscribeStatus, { icon: React.ReactNode; cls: string }> = {
    success: { icon: <HiCheckCircle className="shrink-0" />, cls: 'text-emerald-400' },
    already_subscribed: { icon: <HiInformationCircle className="shrink-0" />, cls: 'text-amber-400' },
    error: { icon: <HiExclamationCircle className="shrink-0" />, cls: 'text-red-400' },
  };

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
              {[
                { Icon: FaFacebookF, href: '#', label: 'Facebook' },
                { Icon: FaLinkedinIn, href: '#', label: 'LinkedIn' },
                { Icon: FaXTwitter, href: '#', label: 'X (Twitter)' },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
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
              {[
                { label: 'About Us', href: '/#about' },
                { label: 'Testimonial', href: '/#testimonial' },
                { label: 'Projects', href: '/projects' },
                { label: 'FAQs', href: '/faqs' },
                { label: 'Contact', href: '/contact' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="hover:text-primary transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-all"></span>
                    {label}
                  </Link>
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
          <div className="space-y-4">
            <h3 className="text-xl font-bold border-l-4 border-primary pl-4">Get the latest information</h3>
            <form onSubmit={handleSubscribe}>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Email address"
                  value={subEmail}
                  onChange={(e) => setSubEmail(e.target.value)}
                  required
                  disabled={subLoading}
                  className="w-full bg-white/5 border border-white/10 rounded-full py-4 pl-6 pr-16 focus:outline-none focus:border-primary transition-all text-sm disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={subLoading}
                  className="absolute right-1 top-1 bottom-1 aspect-square bg-primary rounded-full flex items-center justify-center hover:bg-white hover:text-primary transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <FaPaperPlane className="text-xs" />
                </button>
              </div>
            </form>
            {subResult && (
              <div className={`flex items-start gap-2 text-xs font-semibold leading-relaxed ${subStatusStyles[subResult.status].cls}`}>
                {subStatusStyles[subResult.status].icon}
                <span>{subResult.message}</span>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-primary py-6">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-semibold text-white">
          <p>Copyright © {new Date().getFullYear()} {company?.name || 'Kenny Tech Studios'}. All Rights Reserved.</p>
          <div className="flex gap-6">
            <Link href="/terms-and-conditions" className="hover:underline">User Terms &amp; Conditions</Link>
            <span className="opacity-40">|</span>
            <Link href="/privacy-policy" className="hover:underline">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
