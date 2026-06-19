import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, BookOpen, Heart, Menu, X, LayoutDashboard, Users, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
