'use client';

import React, { useEffect } from 'react';
import Script from 'next/script';
import { usePathname } from 'next/navigation';

export default function SmartsuppChat() {
  const pathname = usePathname();

  // Show in home ('/') and user dashboard ('/dashboard')
  const isTarget = pathname === '/' || pathname === '/dashboard' || pathname?.startsWith('/dashboard');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const win = window as any;
      if (win.smartsupp) {
        try {
          if (isTarget) {
            win.smartsupp('chat:show');
          } else {
            win.smartsupp('chat:hide');
          }
        } catch (e) {}
      }
    }

    return () => {
      if (typeof window !== 'undefined') {
        const win = window as any;
        if (win.smartsupp) {
          try {
            win.smartsupp('chat:hide');
          } catch (e) {}
        }
      }
    };
  }, [pathname, isTarget]);

  return (
    <>
      <Script
        id="smartsupp-chat"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            var _smartsupp = _smartsupp || {};
            _smartsupp.key = '95c7ede4c1c920c1baa052e2f66eeb586525edf0';
            window.smartsupp||(function(d) {
              var s,c,o=smartsupp=function(){ o._.push(arguments)};o._=[];
              s=d.getElementsByTagName('script')[0];c=d.createElement('script');
              c.type='text/javascript';c.charset='utf-8';c.async=true;
              c.src='https://www.smartsuppchat.com/loader.js?';s.parentNode.insertBefore(c,s);
            })(document);
          `,
        }}
        onLoad={() => {
          if (typeof window !== 'undefined') {
            const win = window as any;
            if (win.smartsupp) {
              try {
                if (isTarget) {
                  win.smartsupp('chat:show');
                } else {
                  win.smartsupp('chat:hide');
                }
              } catch (e) {}
            }
          }
        }}
      />
      {isTarget ? (
        <noscript>
          Powered by{' '}
          <a href="https://www.smartsupp.com" target="_blank" rel="noopener noreferrer">
            Smartsupp
          </a>
        </noscript>
      ) : (
        <style jsx global>{`
          iframe[id*="smartsupp"],
          #smartsupp-widget-container,
          div[id*="smartsupp"],
          div[class*="smartsupp"] {
            display: none !important;
          }
        `}</style>
      )}
    </>
  );
}
