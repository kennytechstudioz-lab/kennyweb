'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

const UserDashboard = () => {
  const { data: session } = useSession();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-slate-50 py-20 px-[10px]">
      <div className="max-w-md w-full bg-white px-[10px] py-10 md:p-10 rounded-3xl shadow-xl text-center space-y-8 border border-slate-100">
        <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto text-4xl font-bold">
          {session?.user?.name?.charAt(0) || 'U'}
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-900">Welcome, {session?.user?.name}!</h1>
          <p className="text-slate-500">Your personal dashboard is under construction. Stay tuned for exciting features!</p>
        </div>
        <div className="pt-4">
          <Link href="/">
            <button className="w-full bg-primary text-white py-4 rounded-2xl font-bold transition-all hover:bg-primary-dark hover:shadow-lg hover:-translate-y-1 cursor-pointer">
              Explore Our Services
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
