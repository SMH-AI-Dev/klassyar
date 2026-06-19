import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout({ children }) {
  const location = useLocation();
  const hideNavbarPaths = ['/Play'];
  const shouldHideNavbar = hideNavbarPaths.some(path => location.pathname.startsWith(path));

  return (
    <div className="min-h-screen">
      {!shouldHideNavbar && <Navbar />}
      <main className={shouldHideNavbar ? '' : 'pt-16'}>
        {children}
      </main>
    </div>
  );
}
