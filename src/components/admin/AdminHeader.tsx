import React from 'react';
import { HiBell, HiLogout, HiMenuAlt3, HiUser } from 'react-icons/hi';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

interface AdminHeaderProps {
  onMenuClick?: () => void;
}

const AdminHeader = ({ onMenuClick }: AdminHeaderProps) => {
  const pathname = usePathname();
  const { data: session } = useSession();

  // Get page name from pathname
  const pageName = pathname === '/admin' 
    ? 'Dashboard' 
    : pathname.split('/').pop()?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Admin';

  return (
    <header className="h-20 bg-white border-b border-slate-200 px-[10px] lg:px-8 flex items-center justify-between sticky top-0 z-[100]">
      {/* Mobile Menu Icon & Responsive Page Title */}
      <div className="flex items-center gap-3">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-xl transition-all cursor-pointer"
          aria-label="Toggle Sidebar"
        >
          <HiMenuAlt3 className="text-2xl" />
        </button>
        <h1 className="hidden lg:block text-2xl font-bold text-slate-800">
          {pageName}
        </h1>
      </div>

      <div className="flex items-center gap-6">
        {/* Profile Link (placed before Notification Icon) */}
        <Link href="/admin/profile">
          <button 
            className="w-10 h-10 flex items-center justify-center text-slate-400 hover:bg-slate-50 hover:text-primary rounded-full transition-all cursor-pointer"
            title="Profile"
          >
            <HiUser className="text-2xl" />
          </button>
        </Link>

        {/* Notification Icon */}
        <button className="w-10 h-10 flex items-center justify-center text-slate-400 hover:bg-slate-50 hover:text-primary rounded-full transition-all relative">
          <HiBell className="text-2xl" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        {/* Logout Icon */}
        <button 
          onClick={() => signOut({ callbackUrl: '/' })}
          className="w-10 h-10 flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-full transition-all cursor-pointer"
          title="Logout"
        >
          <HiLogout className="text-2xl" />
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
