'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { FaFacebookF, FaLinkedinIn, FaInstagram, FaYoutube, FaTiktok } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { staffStore, Staff } from '@/lib/stores/StaffStore';
import { companyStore, Company } from '@/lib/stores/CompanyStore';

const fallbackTeam: Partial<Staff>[] = [
  {
    _id: 'f1',
    name: 'Executive Leadership',
    position: 'Chief Executive Officer',
    staffRank: 1,
  },
  {
    _id: 'f2',
    name: 'Technical Architecture',
    position: 'Lead Software Engineer',
    staffRank: 2,
  },
  {
    _id: 'f3',
    name: 'Product Delivery',
    position: 'Senior Project Manager',
    staffRank: 3,
  },
];

const TeamSection = () => {
  const [teamMembers, setTeamMembers] = useState<Partial<Staff>[]>(
    staffStore.teamMembers.length > 0 ? staffStore.teamMembers : []
  );
  const [company, setCompany] = useState<Company | null>(companyStore.company);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const [teamData, companyData] = await Promise.all([
          staffStore.getPublicTeam(),
          companyStore.getCompany(),
        ]);
        if (isMounted) {
          if (teamData && teamData.length > 0) {
            // Sort by staffRank ascending (1, 2, 3...)
            const sorted = [...teamData].sort(
              (a, b) => (a.staffRank ?? 99) - (b.staffRank ?? 99)
            );
            setTeamMembers(sorted);
          } else if (teamMembers.length === 0) {
            setTeamMembers(fallbackTeam);
          }
          if (companyData) {
            setCompany(companyData);
          }
        }
      } catch (err) {
        console.error('Error loading team or company data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const socialLinks = [
    { key: 'linkedin', icon: FaLinkedinIn, url: company?.linkedin, label: 'LinkedIn' },
    { key: 'facebook', icon: FaFacebookF, url: company?.facebook, label: 'Facebook' },
    { key: 'x', icon: FaXTwitter, url: company?.x, label: 'X' },
    { key: 'instagram', icon: FaInstagram, url: company?.instagram, label: 'Instagram' },
    { key: 'youtube', icon: FaYoutube, url: company?.youtube, label: 'YouTube' },
    { key: 'tiktok', icon: FaTiktok, url: company?.tiktok, label: 'TikTok' },
  ].filter(item => Boolean(item.url && item.url.trim() !== ''));

  return (
    <section className="py-20 relative overflow-hidden bg-white">
      {/* Background Text (Outline) */}
      <div
        className="absolute top-12 left-[2%] text-[10rem] font-black select-none pointer-events-none z-0 uppercase tracking-tighter opacity-[0.03]"
        style={{ WebkitTextStroke: '2px #0f172a' }}
      >
        Team
      </div>

      <div className="container relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 font-semibold text-primary">
              <span className="text-2xl">//</span>
              <span className="uppercase tracking-widest text-sm">Our Team</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold leading-[1.1] text-slate-900">
              Meet Our <span className="text-primary">Expert Team</span>
            </h2>
          </div>
          <button className="bg-primary text-white px-8 py-3.5 rounded-full font-semibold transition-all hover:bg-primary-dark hover:-translate-y-1 shadow-lg hover:shadow-primary/30 cursor-pointer text-sm">
            View All
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => {
            const initials = member.name
              ? member.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .substring(0, 2)
                  .toUpperCase()
              : 'ST';

            return (
              <div
                key={member._id || index}
                className="group relative rounded-[32px] overflow-hidden bg-white border border-slate-100 shadow-xl transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl"
              >
                {/* Reduced height aspect ratio: aspect-[4/4.1] instead of aspect-[4/5] */}
                <div className="relative aspect-[4/4.1] overflow-hidden bg-slate-100">
                  {member.picture && member.picture.trim() !== '' ? (
                    <Image
                      src={member.picture}
                      alt={member.name || 'Team Member'}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center">
                      <span className="text-5xl font-black text-primary/40">
                        {initials}
                      </span>
                    </div>
                  )}

                  {/* Social Icons Overlay (Bottom of Image) */}
                  {socialLinks.length > 0 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2.5 transform translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-20">
                      {socialLinks.map(({ key, icon: Icon, url, label }) => (
                        <a
                          key={key}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={label}
                          className="w-9 h-9 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/40 hover:bg-primary hover:border-primary transition-all cursor-pointer"
                        >
                          <Icon className="text-xs" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                {/* Reduced card padding and title size for reduced overall card height */}
                <div className="p-5 text-center bg-white">
                  <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-primary transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-slate-400 font-medium text-sm">
                    {member.position || 'Specialist'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
