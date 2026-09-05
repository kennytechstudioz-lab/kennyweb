'use client';

import React, { useState, useEffect } from 'react';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaFacebookF, FaTwitter, FaPinterestP, FaInstagram, FaYoutube } from 'react-icons/fa';
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
        
        <div className="relative h-full flex items-center pl-12 pr-8">
          <div className="absolute inset-0 -right-[50px] bg-primary -skew-x-[20deg] z-[1]"></div>
          <div className="relative z-[2] flex gap-[1.2rem]">
            <a href="#" aria-label="Facebook" className="flex items-center justify-center transition-opacity hover:opacity-80"><FaFacebookF /></a>
            <a href="#" aria-label="X" className="flex items-center justify-center transition-opacity hover:opacity-80"><FaTwitter /></a>
            <a href="#" aria-label="Pinterest" className="flex items-center justify-center transition-opacity hover:opacity-80"><FaPinterestP /></a>
            <a href="#" aria-label="Instagram" className="flex items-center justify-center transition-opacity hover:opacity-80"><FaInstagram /></a>
            <a href="#" aria-label="Youtube" className="flex items-center justify-center transition-opacity hover:opacity-80"><FaYoutube /></a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;


