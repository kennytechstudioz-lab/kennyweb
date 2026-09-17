'use client';

import React, { useState, useEffect } from 'react';
import { companyStore, Company } from '@/lib/stores/CompanyStore';
import { HiShare } from 'react-icons/hi';
import { FaLinkedinIn, FaFacebookF, FaInstagram, FaYoutube, FaTiktok } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

interface Props {
  company: Company | null;
  onUpdate: (data: Company) => void;
}

export default function SocialMediaLinksForm({ company, onUpdate }: Props) {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [formData, setFormData] = useState({
    linkedin: '',
    facebook: '',
    x: '',
    instagram: '',
    youtube: '',
    tiktok: '',
  });

  useEffect(() => {
    if (company) {
      setFormData({
        linkedin: company.linkedin || '',
        facebook: company.facebook || '',
        x: company.x || '',
        instagram: company.instagram || '',
        youtube: company.youtube || '',
        tiktok: company.tiktok || '',
      });
    }
  }, [company]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    const updated = await companyStore.updateCompany(formData);
    if (updated) {
      onUpdate(updated);
      setMessage({ type: 'success', text: 'Social media links updated!' });
      setTimeout(() => setMessage(null), 3000);
    } else {
      setMessage({ type: 'error', text: 'Failed to update social media links.' });
    }
    setSaving(false);
  };

  const socialFields = [
    {
      name: 'linkedin',
      label: 'LinkedIn URL',
      icon: FaLinkedinIn,
      placeholder: 'https://linkedin.com/company/kennytech',
    },
    {
      name: 'facebook',
      label: 'Facebook URL',
      icon: FaFacebookF,
      placeholder: 'https://facebook.com/kennytech',
    },
    {
      name: 'x',
      label: 'X (Twitter) URL',
      icon: FaXTwitter,
      placeholder: 'https://x.com/kennytech',
    },
    {
      name: 'instagram',
      label: 'Instagram URL',
      icon: FaInstagram,
      placeholder: 'https://instagram.com/kennytech',
    },
    {
      name: 'youtube',
      label: 'YouTube URL',
      icon: FaYoutube,
      placeholder: 'https://youtube.com/@kennytech',
    },
    {
      name: 'tiktok',
      label: 'TikTok URL',
      icon: FaTiktok,
      placeholder: 'https://tiktok.com/@kennytech',
    },
  ];

  return (
    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden flex flex-col h-full">
      <div className="px-[10px] sm:px-8 py-6 border-b border-slate-100 bg-slate-50/50">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <HiShare className="text-primary text-xl" />
          Social Media Links
        </h3>
        <p className="text-xs text-slate-500 mt-1 font-medium">
          Links entered here will automatically appear in the Header, Footer, and Home Staff cards.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-[10px] sm:p-8 flex flex-col flex-1 space-y-5">
        {socialFields.map(({ name, label, icon: Icon, placeholder }) => (
          <div key={name} className="space-y-2">
            <label className="text-sm font-bold text-slate-600 uppercase tracking-wider ml-1">
              {label}
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-base">
                <Icon />
              </div>
              <input
                type="url"
                name={name}
                value={(formData as any)[name]}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-slate-900 text-sm"
                placeholder={placeholder}
              />
            </div>
          </div>
        ))}

        <div className="pt-4 mt-auto">
          {message && (
            <div
              className={`mb-4 p-3 rounded-xl text-sm font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300 ${
                message.type === 'success'
                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                  : 'bg-red-50 text-red-600 border border-red-100'
              }`}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full ${
                  message.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'
                }`}
              ></div>
              {message.text}
            </div>
          )}
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-primary text-white py-4 rounded-2xl font-black shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 cursor-pointer"
          >
            {saving ? 'Updating...' : 'Update Social Links'}
          </button>
        </div>
      </form>
    </div>
  );
}
