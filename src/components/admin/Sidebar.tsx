'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  HiChartPie, 
  HiUser, 
  HiUsers, 
  HiCollection, 
  HiDocumentText, 
  HiCog,
  HiBriefcase,
  HiUserGroup,
  HiMail,
  HiBell,
  HiX,
  HiAcademicCap
} from 'react-icons/hi';
import Image from 'next/image';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', href: '/admin', icon: HiChartPie },
    { name: 'Customers', href: '/admin/customers', icon: HiUsers },
    { name: 'Tutorial', href: '/admin/tutorials', icon: HiAcademicCap },
    { name: 'Jobs', href: '/admin/jobs', icon: HiBriefcase },
    { name: 'Projects', href: '/admin/projects', icon: HiCollection },
    { name: 'Services', href: '/admin/pages/services', icon: HiCollection },
    { name: 'FAQ', href: '/admin/pages/faq', icon: HiDocumentText },
    { name: 'Blogs', href: '/admin/pages/blogs', icon: HiDocumentText },
    { name: 'Terms & Conditions', href: '/admin/pages/terms', icon: HiDocumentText },
  ];

  const companyItems = [
    { name: 'Settings', href: '/admin/company/settings', icon: HiCog },
    { name: 'Positions', href: '/admin/company/positions', icon: HiBriefcase },
    { name: 'Staffs', href: '/admin/company/staffs', icon: HiUserGroup },
    { name: 'Email Templates', href: '/admin/company/email-templates', icon: HiMail },
    { name: 'Notification Templates', href: '/admin/company/notification-templates', icon: HiBell },
  ];

  return (
    <>
      {/* Mobile Sidebar Backdrop Overlay */}
      {isOpen && (
        <div 
          onClick={onClose} 
          className="fixed inset-0 z-[1998] bg-slate-950/40 backdrop-blur-sm lg:hidden transition-all duration-300"
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        w-72 bg-white border-r border-slate-200 h-screen flex flex-col z-[1999]
        fixed lg:sticky top-0 bottom-0 left-0
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        lg:flex flex-col
      `}>
        {/* Sidebar Header with Close Button on Mobile */}
        <div className="p-8 border-b border-slate-100 mb-4 flex items-center justify-between">
          <Link href="/" className="flex items-center justify-center" onClick={onClose}>
            <Image 
              src="/Logo.png" 
              alt="Kenny Tech Studios Logo" 
              width={150} 
              height={100} 
              className="object-contain"
            />
          </Link>
          {onClose && (
            <button 
              onClick={onClose}
              className="lg:hidden p-2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              aria-label="Close menu"
            >
              <HiX className="text-2xl" />
            </button>
          )}
        </div>
        
        <div className="px-4 py-4 space-y-8 flex-1 overflow-y-auto custom-scrollbar">
          {/* Main Menu Section */}
          <div className="space-y-2">
            <nav className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <Link 
                    key={item.name} 
                    href={item.href}
                    onClick={onClose}
                    className={`
                      flex items-center gap-4 px-4 py-3 rounded-xl font-semibold transition-all group
                      ${isActive 
                        ? 'bg-primary text-white shadow-md shadow-primary/20' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-primary'}
                    `}
                  >
                    <Icon className={`text-xl ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-primary'}`} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Company Section */}
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest px-4">Company</p>
            <nav className="space-y-1">
              {companyItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <Link 
                    key={item.name} 
                    href={item.href}
                    onClick={onClose}
                    className={`
                      flex items-center gap-4 px-4 py-3 rounded-xl font-semibold transition-all group
                      ${isActive 
                        ? 'bg-primary text-white shadow-md shadow-primary/20' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-primary'}
                    `}
                  >
                    <Icon className={`text-xl ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-primary'}`} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
