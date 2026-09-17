'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/admin/Sidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { staffStore } from '@/lib/stores/StaffStore';
import { emailStore } from '@/lib/stores/EmailStore';
import { HiShieldExclamation } from 'react-icons/hi';
import Link from 'next/link';

const ROUTE_ROLE_MAP: { [routePrefix: string]: string } = {
  '/admin/emails': 'Emails',
  '/admin/customers': 'Customers',
  '/admin/jobs': 'Jobs',
  '/admin/projects': 'Projects',
  '/admin/pages/faq': 'FAQ',
  '/admin/pages/blogs': 'Blogs',
  '/admin/pages/testimonials': 'Testimonials',
  '/admin/pages/terms': 'Terms & Conditions',
  '/admin/company/settings': 'Settings',
  '/admin/company/positions': 'Positions',
  '/admin/company/staffs': 'Staffs',
  '/admin/company/email-templates': 'Email Templates',
  '/admin/company/notification-templates': 'Notification Templates',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  const userId = (session?.user as any)?.id;
  const userStatus = (session?.user as any)?.status;
  const sessionRole = (session?.user as any)?.role || (session?.user as any)?.duties || '';

  const [liveRole, setLiveRole] = useState<string>(sessionRole);

  useEffect(() => {
    if (sessionRole) {
      setLiveRole(sessionRole);
    }
    if (userId) {
      staffStore.getUserById(userId).then(u => {
        if (u) {
          const resolved = u.role || u.duties || '';
          if (resolved) {
            setLiveRole(resolved);
          }
        }
      });
    }
    // Auto-fetch incoming emails each time the admin refreshes/loads
    emailStore.syncIncomingEmails(true).catch(() => {});
  }, [userId, sessionRole]);

  // Check if current route requires a role permission that the staff user lacks
  let isAccessDenied = false;
  let requiredRoleName = '';

  if (userStatus === 'staff') {
    const roleTokens = (liveRole || '')
      .split(',')
      .map(d => d.trim().toLowerCase())
      .filter(Boolean);

    // If role is General it means that the staff can see every sidebar menus and can access all pages
    const isGeneralRole = roleTokens.includes('general') || (liveRole || '').trim().toLowerCase() === 'general';

    if (!isGeneralRole) {
      for (const [prefix, roleKey] of Object.entries(ROUTE_ROLE_MAP)) {
        if (pathname.startsWith(prefix)) {
          const key = roleKey.toLowerCase();
          const hasAccess = roleTokens.some(d => d === key || key.includes(d) || d.includes(key));
          if (!hasAccess) {
            isAccessDenied = true;
            requiredRoleName = roleKey;
            break;
          }
        }
      }
    }
  }

  return (
    <div className="flex bg-slate-50 h-screen h-[100dvh] overflow-hidden">
      {/* Sidebar - Fixed/Sticky Desktop, Sliding Overlay Mobile */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Main Content Area - Independently scrollable */}
      <div className="flex-1 flex flex-col h-screen h-[100dvh] min-w-0 overflow-y-auto overflow-x-hidden">
        {/* Admin Header with Mobile Hamburger Menu Icon Trigger */}
        <AdminHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 px-[10px] py-8 lg:p-8">
          {isAccessDenied ? (
            <div className="min-h-[420px] flex flex-col items-center justify-center text-center p-8 bg-white rounded-3xl border border-slate-100 shadow-sm max-w-xl mx-auto my-12 space-y-5">
              <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-600 flex items-center justify-center text-3xl">
                <HiShieldExclamation />
              </div>
              <div className="space-y-1.5">
                <h2 className="text-2xl font-black text-slate-900">Access Restricted</h2>
                <p className="text-sm font-medium text-slate-500 leading-relaxed">
                  Your assigned staff role does not grant access to the <strong className="text-slate-800 font-bold">{requiredRoleName}</strong> section. Contact an administrator if you require permissions.
                </p>
              </div>
              <Link
                href="/admin"
                className="bg-primary text-white px-6 py-3.5 rounded-2xl font-bold text-sm hover:bg-primary-dark transition-all shadow-md shadow-primary/20"
              >
                Return to Dashboard
              </Link>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}
