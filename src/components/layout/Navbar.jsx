import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, BookOpen, Heart, Menu, X, LayoutDashboard, Users, Lightbulb, LogOut, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isLoggedIn, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: 'خانه', path: '/', icon: Home },
    { name: 'داشبورد', path: '/Dashboard', icon: LayoutDashboard },
    { name: 'آموزش زبان', path: '/LanguageLearning', icon: BookOpen },
    { name: 'کلاس‌های من', path: '/MyClasses', icon: Users },
    { name: 'امکانات', path: '/Features', icon: Lightbulb },
    { name: 'درباره کلاس یار', path: '/About', icon: Heart },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-lg border-b border-purple-200/50 clay-element">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl clay-element flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                کلاس یار
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-2">
              {navItems.map((item) => (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive(item.path) ? "default" : "ghost"}
                    className={`rounded-xl ${
                      isActive(item.path) 
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                        : ''
                    }`}
                  >
                    <item.icon className="w-4 h-4 ml-2" />
                    {item.name}
                  </Button>
                </Link>
              ))}
            </div>

            {/* User Section */}
            <div className="hidden md:flex items-center gap-2 mx-2">
              {isLoggedIn ? (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-sm font-bold">
                    {user?.photoURL ? (
                      <img src={user.photoURL} alt="" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      user?.name?.charAt(0) || "U"
                    )}
                  </div>
                  <span className="text-sm text-gray-600 max-w-[100px] truncate">{user?.name}</span>
                  <Button variant="ghost" size="icon" onClick={logout} className="text-gray-400 hover:text-red-500">
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Link to="/Login">
                  <Button variant="outline" className="rounded-xl border-purple-300 text-purple-600 hover:bg-purple-50">
                    <LogIn className="w-4 h-4 ml-2" />
                    ورود
                  </Button>
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-b border-purple-200/50 shadow-lg md:hidden"
          >
            <div className="px-4 py-4 space-y-2">
              {isLoggedIn && (
                <div className="flex items-center gap-3 px-3 py-2 mb-2 bg-purple-50 rounded-xl">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-sm font-bold shrink-0">
                    {user?.photoURL ? (
                      <img src={user.photoURL} alt="" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      user?.name?.charAt(0) || "U"
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-700 truncate">{user?.name}</span>
                </div>
              )}
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button
                    variant={isActive(item.path) ? "default" : "ghost"}
                    className={`w-full justify-start rounded-xl ${
                      isActive(item.path) 
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                        : ''
                    }`}
                  >
                    <item.icon className="w-4 h-4 ml-2" />
                    {item.name}
                  </Button>
                </Link>
              ))}
              <div className="border-t border-gray-100 pt-2">
                {isLoggedIn ? (
                  <Button
                    variant="ghost"
                    className="w-full justify-start rounded-xl text-red-500 hover:bg-red-50"
                    onClick={() => { logout(); setMobileMenuOpen(false); }}
                  >
                    <LogOut className="w-4 h-4 ml-2" />
                    خروج
                  </Button>
                ) : (
                  <Link to="/Login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full justify-start rounded-xl border-purple-300 text-purple-600">
                      <LogIn className="w-4 h-4 ml-2" />
                      ورود
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
