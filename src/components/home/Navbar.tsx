'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { HiMenuAlt3, HiX, } from 'react-icons/hi';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const userStatus = (session?.user as any)?.status;
  const pathname = usePathname();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'Projects', href: '/projects' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <nav className="h-[80px] bg-white/90 backdrop-blur-[10px] flex items-center shadow-sm sticky top-0 z-[1000] w-full px-[10px] md:px-0">
      <div className="container w-full flex justify-between items-center">
        <div className="logo">
          <Link href="/">
            <div className="flex items-center gap-[0.8rem]">
              <Image
                src="/Logo.png"
                alt="Kenny Tech Studios Logo"
                width={150}
                height={100}
                className="object-contain"
              />
            </div>
          </Link>
        </div>

        <ul className={`
          fixed md:relative top-[80px] md:top-0 left-0 right-0 
          bg-white md:bg-transparent border-b md:border-b-0 border-slate-100
          flex flex-col md:flex-row gap-0 md:gap-10 py-8 md:py-0 px-[10px] md:px-0
          transition-all duration-400 z-[99] md:z-auto
          ${isOpen ? 'translate-y-0 opacity-100 pointer-events-auto shadow-xl' : 'translate-y-[-20px] md:translate-y-0 opacity-0 md:opacity-100 pointer-events-none md:pointer-events-auto'}
        `}>
          {navLinks.map((link) => {
            const isActive = pathname === link.href;

            return (
              <li key={link.name} className="w-full md:w-auto opacity-100 transition-all duration-300">
                <Link
                  href={link.href}
                  className={`
                    block md:inline px-8 md:px-0 py-4 md:py-0 text-lg md:text-base font-medium transition-colors
                    ${isActive
                      ? 'text-primary md:text-primary relative md:after:absolute md:after:bottom-[-5px] md:after:left-0 md:after:w-full md:after:h-[2px] md:after:bg-primary'
                      : 'text-slate-600 hover:text-primary'
                    }
                  `}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              </li>
            );
          })}

          {session ? (
            <li className="md:hidden px-[10px] py-6 flex flex-col gap-4">
              <Link
                href={userStatus === 'admin' || userStatus === 'staff' ? "/admin" : "/dashboard"}
                onClick={() => setIsOpen(false)}
              >
                <button className="w-full bg-primary text-white py-3 rounded-full font-semibold cursor-pointer mb-2">Admin</button>
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="w-full bg-red-500 text-white py-3 rounded-full font-semibold cursor-pointer"
              >
                Logout
              </button>
            </li>
          ) : (
            <li className="md:hidden px-[10px] py-6 flex flex-col gap-4">
              <Link href="/signup" className="w-full" onClick={() => setIsOpen(false)}>
                <button className="w-full bg-primary text-white py-3 rounded-full font-semibold cursor-pointer">Signup</button>
              </Link>
              <Link href="/signin" className="w-full" onClick={() => setIsOpen(false)}>
                <button className="w-full border border-primary text-primary py-3 rounded-full font-semibold cursor-pointer">Sign In</button>
              </Link>
            </li>
          )}
        </ul>

        <div className="flex items-center gap-4">
          {session ? (
            <div className="hidden md:flex items-center gap-4">
              <Link href={userStatus === 'admin' || userStatus === 'staff' ? "/admin" : "/dashboard"}>
                <button className="bg-primary text-white px-6 py-2 rounded-full text-sm font-semibold transition-all hover:bg-primary-dark cursor-pointer">Admin</button>
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="bg-red-500 text-white px-6 py-2 rounded-full text-sm font-semibold transition-all hover:bg-red-600 cursor-pointer"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link href="/signup" className="hidden md:block">
                <button className="bg-primary text-white px-8 py-3 rounded-full font-semibold transition-all hover:bg-primary-dark hover:-translate-y-0.5 hover:shadow-lg cursor-pointer">Signup</button>
              </Link>
              <Link href="/signin" className="hidden md:block">
                <button className="border border-primary text-primary px-8 py-3 rounded-full font-semibold transition-all hover:bg-primary/5 hover:-translate-y-0.5 hover:shadow-lg cursor-pointer">Sign In</button>
              </Link>
            </>
          )}
          <button
            className="flex md:hidden text-3xl text-slate-900 transition-colors hover:text-primary cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
          >
            {isOpen ? <HiX /> : <HiMenuAlt3 />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;



