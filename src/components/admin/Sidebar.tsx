'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { staffStore } from '@/lib/stores/StaffStore';
import { emailStore } from '@/lib/stores/EmailStore';
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

interface MenuItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  isAlwaysAllowed?: boolean;
  roleKey?: string;
  dutyKey?: string;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const userId = (session?.user as any)?.id;
  const userStatus = (session?.user as any)?.status;
  const sessionRole = (session?.user as any)?.role || (session?.user as any)?.duties || '';

  const [liveRole, setLiveRole] = useState<string>(sessionRole);
  const [liveStatus, setLiveStatus] = useState<string>(userStatus || '');
  const [unreadEmails, setUnreadEmails] = useState(() => emailStore.unreadCount);

  useEffect(() => {
    const unsub = emailStore.subscribe(() => {
      setUnreadEmails(emailStore.unreadCount);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (sessionRole) {
      setLiveRole(sessionRole);
    }
    if (userId) {
      staffStore.getUserById(userId).then(u => {
        if (u) {
          const resolved = u.role || u.duties || '';
          if (resolved) setLiveRole(resolved);
          if (u.status) setLiveStatus(u.status);
        }
      });
    }

    // Keep in sync when the store updates (e.g. after profile save)
    const unsub = staffStore.subscribe(() => {
      const cached = userId ? staffStore.profilesById.get(userId) : null;
      if (cached) {
        const resolvedRole = cached.role || cached.duties || '';
        if (resolvedRole) setLiveRole(resolvedRole);
        if (cached.status) setLiveStatus(cached.status);
      }
    });
    return unsub;
  }, [userId, sessionRole]);

  const menuItems: MenuItem[] = [
    { name: 'Dashboard', href: '/admin', icon: HiChartPie, isAlwaysAllowed: true },
    { name: 'Profile', href: '/admin/profile', icon: HiUser, isAlwaysAllowed: true },
    { name: 'Emails', href: '/admin/emails', icon: HiMail, roleKey: 'Emails' },
    { name: 'Customers', href: '/admin/customers', icon: HiUsers, roleKey: 'Customers' },
    { name: 'Jobs', href: '/admin/jobs', icon: HiBriefcase, roleKey: 'Jobs' },
    { name: 'Projects', href: '/admin/projects', icon: HiCollection, roleKey: 'Projects' },
    { name: 'FAQ', href: '/admin/pages/faq', icon: HiDocumentText, roleKey: 'FAQ' },
    { name: 'Blogs', href: '/admin/pages/blogs', icon: HiDocumentText, roleKey: 'Blogs' },
    { name: 'Terms & Conditions', href: '/admin/pages/terms', icon: HiDocumentText, roleKey: 'Terms & Conditions' },
  ];

  const companyItems: MenuItem[] = [
    { name: 'Settings', href: '/admin/company/settings', icon: HiCog, roleKey: 'Settings' },
    { name: 'Positions', href: '/admin/company/positions', icon: HiBriefcase, roleKey: 'Positions' },
    { name: 'Staffs', href: '/admin/company/staffs', icon: HiUserGroup, roleKey: 'Staffs' },
    { name: 'Email Templates', href: '/admin/company/email-templates', icon: HiMail, roleKey: 'Email Templates' },
    { name: 'Notification Templates', href: '/admin/company/notification-templates', icon: HiBell, roleKey: 'Notification Templates' },
  ];



  const isMainAdmin = liveStatus === 'admin' || userStatus === 'admin';
  const effectiveRole = liveRole || sessionRole;
  const roleTokens = (effectiveRole || '')
    .split(',')
    .map((d: string) => d.trim().toLowerCase())
    .filter(Boolean);

  // If role is General it means that the staff can see every sidebar menus and can access all pages
  const isGeneralRole =
    isMainAdmin ||
    roleTokens.includes('general') ||
    (effectiveRole || '').trim().toLowerCase() === 'general';

  const hasRoleAccess = (item: MenuItem) => {
    if (isGeneralRole) return true;
    if (item.isAlwaysAllowed) return true;

    if (!effectiveRole) return false;

    const targetKey = (item.roleKey || item.dutyKey || item.name).toLowerCase();
    return roleTokens.some((d: string) => d === targetKey || targetKey.includes(d) || d.includes(targetKey));
  };

  const visibleMenuItems = menuItems.filter(hasRoleAccess);
  const visibleCompanyItems = companyItems.filter(hasRoleAccess);

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
        w-72 bg-white border-r border-slate-200 h-screen flex flex-col z-[1999] flex-shrink-0
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
              {visibleMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                  return (
                    <Link 
                      key={item.name} 
                      href={item.href}
                      onClick={onClose}
                      className={`
                        flex items-center justify-between px-4 py-3 rounded-xl font-semibold transition-all group
                        ${isActive 
                          ? 'bg-primary text-white shadow-md shadow-primary/20' 
                          : 'text-slate-600 hover:bg-slate-50 hover:text-primary'}
                      `}
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <Icon className={`text-xl flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-primary'}`} />
                        <span className="truncate">{item.name}</span>
                      </div>
                      {item.href === '/admin/emails' && unreadEmails > 0 && (
                        <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                          isActive ? 'bg-white text-primary' : 'bg-primary text-white'
                        }`}>
                          {unreadEmails}
                        </span>
                      )}
                    </Link>
                  );
              })}
            </nav>
          </div>

          {/* Company Section - Only shown if staff has permissions for company items */}
          {visibleCompanyItems.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest px-4">Company</p>
              <nav className="space-y-1">
                {visibleCompanyItems.map((item) => {
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
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
