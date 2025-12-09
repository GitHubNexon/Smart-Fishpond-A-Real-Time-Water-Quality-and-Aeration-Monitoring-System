'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogIn, UserPlus, Menu, X } from 'lucide-react';
import HeaderNavDesktop from './header-nav-desktop';
import HeaderNavMobile from './header-nav-mobile';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="relative bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-950 dark:to-blue-900 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          {/* Left: Logo */}
          <Link
            href="/"
            className="flex items-center space-x-3 hover:opacity-90 transition-opacity"
          >
            <Avatar className="h-12 w-12 border-2 border-white dark:border-blue-400">
              <AvatarImage
                src="/images/bagong-pilipinas-logo.png"
                alt="Barangay Luntian Logo"
              />
              <AvatarFallback className="bg-blue-600 text-white font-bold text-lg">
                BL
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-white font-bold text-md leading-tight">
                Barangay Luntian
              </span>
              <span className="text-green-400 dark:text-green-300 text-sm font-medium">
                E-Services
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center">
            <HeaderNavDesktop />
          </div>

          <div className="flex items-center space-x-2">
            {/* Login/Register */}
            <div className="hidden lg:flex items-center space-x-2">
              <Link href="/login">
                <Button
                  variant="ghost"
                  className="text-white hover:bg-blue-800 dark:hover:bg-blue-800 hover:text-white"
                  size="sm"
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  className="bg-white text-blue-700 hover:bg-blue-100 dark:bg-blue-700 dark:text-white dark:hover:bg-blue-800"
                  size="sm"
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Register
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-md text-white hover:bg-blue-800 transition-colors"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden pb-3 overflow-hidden"
            >
              <div className="border-t border-blue-400/30 mt-2 pt-3 space-y-2">
                <HeaderNavMobile onNavigate={() => setIsOpen(false)} />
                <div className="flex flex-col items-start space-y-2 px-2 pt-2 border-t border-blue-400/30">
                  <Link href="/login" className="w-full">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-white hover:bg-blue-800 dark:hover:bg-blue-800 hover:text-white"
                      size="sm"
                    >
                      <LogIn className="mr-2 h-4 w-4" />
                      Login
                    </Button>
                  </Link>
                  <Link href="/register" className="w-full">
                    <Button
                      className="w-full justify-start bg-white text-blue-700 hover:bg-blue-100 dark:bg-blue-700 dark:text-white dark:hover:bg-blue-800"
                      size="sm"
                    >
                      <UserPlus className="mr-2 h-4 w-4" />
                      Register
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
