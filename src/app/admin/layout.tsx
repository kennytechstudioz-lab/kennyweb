'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/admin/Sidebar';
import AdminHeader from '@/components/admin/AdminHeader';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex bg-slate-50 min-h-screen relative overflow-x-hidden">
      {/* Sidebar - Fixed/Sticky Desktop, Sliding Overlay Mobile */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Admin Header with Mobile Hamburger Menu Icon Trigger */}
        <AdminHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 px-[10px] py-8 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
