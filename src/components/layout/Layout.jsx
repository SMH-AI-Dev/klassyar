import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import FloatingEmojis from '@/components/shared/FloatingEmojis';

export default function Layout({ children }) {
  const location = useLocation();
  const hideNavbarPaths = ['/Play', '/Edit', '/Create'];
  const shouldHideNavbar = hideNavbarPaths.some(path => location.pathname.startsWith(path));
  const noDecorPaths = ['/Play', '/Edit'];
  const shouldShowDecor = !noDecorPaths.some(path => location.pathname.startsWith(path));

  return (
    <div className="min-h-screen relative">
      {shouldShowDecor && <FloatingEmojis count={8} />}
      <div className="relative z-10">
        {!shouldHideNavbar && <Navbar />}
        <main className={shouldHideNavbar ? '' : 'pt-16'}>
          {children}
        </main>
      </div>
    </div>
  );
}
