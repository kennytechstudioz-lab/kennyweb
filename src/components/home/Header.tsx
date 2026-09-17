'use client';

import React, { useState, useEffect } from 'react';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaLinkedinIn, FaFacebookF, FaInstagram, FaYoutube, FaTiktok } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { companyStore, Company } from '@/lib/stores/CompanyStore';

const Header = () => {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompany = async () => {
      const data = await companyStore.getCompany();
      setCompany(data);
      setLoading(false);
    };
    fetchCompany();
  }, []);

  const socialLinks = [
    { key: 'linkedin', label: 'LinkedIn', icon: FaLinkedinIn, url: company?.linkedin },
    { key: 'facebook', label: 'Facebook', icon: FaFacebookF, url: company?.facebook },
    { key: 'x', label: 'X', icon: FaXTwitter, url: company?.x },
    { key: 'instagram', label: 'Instagram', icon: FaInstagram, url: company?.instagram },
    { key: 'youtube', label: 'YouTube', icon: FaYoutube, url: company?.youtube },
    { key: 'tiktok', label: 'TikTok', icon: FaTiktok, url: company?.tiktok },
  ].filter(item => Boolean(item.url && item.url.trim() !== ''));

  return (
    <header className="bg-navy text-white h-[48px] text-[0.85rem] overflow-hidden relative z-[110] hidden md:block">
      <div className="container flex justify-between items-center h-full !pr-0">
        <div className="flex gap-8 lg:gap-4 items-center">
          {loading ? (
            <div className="flex gap-8 lg:gap-4 animate-pulse">
              <div className="h-4 w-32 bg-white/10 rounded-full"></div>
              <div className="h-4 w-40 bg-white/10 rounded-full"></div>
              <div className="h-4 w-64 bg-white/10 rounded-full"></div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <FaPhoneAlt className="text-primary" />
                <span>{company?.phoneNumber || '(000) 000-0000'}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaEnvelope className="text-primary" />
                <span>{company?.email || 'info@kennytech.com'}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-primary" />
                <span className="truncate max-w-[300px] lg:max-w-none">{company?.address || 'Loading address...'}</span>
              </div>
            </>
          )}
        </div>
        
        {socialLinks.length > 0 && (
          <div className="relative h-full flex items-center pl-12 pr-8">
            <div className="absolute inset-0 -right-[50px] bg-primary -skew-x-[20deg] z-[1]"></div>
            <div className="relative z-[2] flex gap-[1.2rem]">
              {socialLinks.map(({ key, label, icon: Icon, url }) => (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex items-center justify-center transition-opacity hover:opacity-80 text-white"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;


