'use client';

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import Logo from '@/components/ui/Logo'; // Adjust path
import DarkModeToggle from '@/components/ui/DarkModeToggle'; // Adjust path
import DesktopMenu from './DesktopMenu'; // Adjust path
import MobileMenu from './MobileMenu'; // Adjust path
import { Menu as MenuIcon } from 'lucide-react'; // Import MenuIcon here

const NavBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const { scrollY } = useScroll();

  // Function to handle opening, prevents opening if animating
  const handleOpenMenu = () => {
    if (!isAnimating) {
      setIsMobileMenuOpen(true);
    }
  };

  // Scroll detection for showing/hiding NavBar and changing background
  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    const diff = latest - previous;
    const scrollThreshold = 80; // Pixels scrolled before changing state
    const hideThreshold = 10; // Sensitivity for hiding/showing on scroll direction change

    // Add background/shadow when scrolled past a certain point
    if (latest > scrollThreshold) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }

    // Hide on scroll down, show on scroll up (only if not at the top)
    // Prevents hiding when scrolling near the top or very slowly
    if (latest > scrollThreshold && diff > hideThreshold) {
      setIsHidden(true);
    } else if (diff < -hideThreshold || latest <= scrollThreshold) {
      setIsHidden(false);
    }
  });

  // Close mobile menu if window resizes to desktop width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMobileMenuOpen) {
        // 768px is Tailwind's default 'md' breakpoint
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMenuOpen]);

  return (
    <>
      {' '}
      {/* Use Fragment to contain NavBar and MobileMenu which needs AnimatePresence */}
      <motion.header
        // Header animation (scroll hide/show)
        variants={{
          visible: { y: 0, opacity: 1 },
          hidden: { y: '-110%', opacity: 0 },
        }}
        animate={isHidden ? 'hidden' : 'visible'}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
        className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 ease-in-out
                   ${
                     isScrolled
                       ? 'shadow-lg bg-white/80 dark:bg-gray-950/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-white/10'
                       : 'bg-transparent border-b border-transparent'
                   }`}
      >
        {/* Optional gradient shadow */}
        <div
          className={`absolute inset-x-0 top-full h-8 bg-gradient-to-b from-black/5 to-transparent pointer-events-none transition-opacity duration-300 ${isScrolled ? 'opacity-100' : 'opacity-0'}`}
        />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo */}
            <Logo />
            {/* Desktop Menu & Dark Mode (Center Right) */}
            <div className="hidden md:flex items-center space-x-6">
              <DesktopMenu />
              <DarkModeToggle />
            </div>
            {/* --- Mobile Section (Right) --- */}
            <div className="flex md:hidden items-center space-x-4">
              {/* Dark Mode Toggle always visible on mobile header */}
              <DarkModeToggle />

              {/* --- Hamburger Icon - Animated --- */}
              <AnimatePresence initial={false} onExitComplete={() => setIsAnimating(false)}>
                {' '}
                {/* initial=false prevents animation on initial load */}
                {!isMobileMenuOpen && ( // Only show if menu is NOT open
                  <motion.button
                    key="hamburger-button"
                    className={`relative z-50 p-2 -mr-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-200/50 dark:hover:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 ${isAnimating ? 'cursor-not-allowed' : ''} `} // <<< Style when disabled
                    onClick={handleOpenMenu} // Use handler
                    disabled={isAnimating} // Disable button
                    aria-label="Open menu"
                    initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
                    animate={{
                      opacity: isAnimating ? 0.1 : 1,
                      scale: 1,
                      rotate: 0,
                    }}
                    exit={{ opacity: 0, scale: 0.5, rotate: -90 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    whileTap={{ scale: 0.9 }}
                    whileHover={{ scale: 1.1 }}
                  >
                    <MenuIcon className="h-6 w-6" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>{' '}
            {/* End Mobile Section */}
          </div>{' '}
          {/* End Flex Container */}
        </div>{' '}
        {/* End Container */}
      </motion.header>
      {/* --- Mobile Menu Popover Component --- */}
      {/* Pass state down. AnimatePresence is handled INSIDE MobileMenu now */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        setIsOpen={setIsMobileMenuOpen}
        isAnimating={isAnimating} // Pass down isAnimating
        setIsAnimating={setIsAnimating} // Pass down setter
      />
    </>
  );
};

export default NavBar;
