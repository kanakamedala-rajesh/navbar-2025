// components/layout/NavBar.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import Logo from '@/components/ui/Logo'; // Adjust path
import DarkModeToggle from '@/components/ui/DarkModeToggle'; // Adjust path
import DesktopMenu from './DesktopMenu'; // Adjust path
import MobileMenu from './MobileMenu'; // Adjust path

const NavBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const { scrollY } = useScroll();

  // Scroll detection for showing/hiding NavBar and changing background
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    const diff = latest - previous;
    const scrollThreshold = 80; // Pixels scrolled before changing state
    const hideThreshold = 10;   // Sensitivity for hiding/showing on scroll direction change

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


  return (
    <motion.header
      variants={{
        visible: { y: 0, opacity: 1 },
        hidden: { y: "-110%", opacity: 0 }, // Move further up and fade
      }}
      animate={isHidden ? "hidden" : "visible"}
      transition={{ duration: 0.4, ease: "easeInOut" }} // Slightly slower, smoother ease
      className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 ease-in-out
                 ${isScrolled
                   ? 'shadow-lg bg-white/80 dark:bg-gray-950/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-white/10' // Enhanced glassy effect
                   : 'bg-transparent border-b border-transparent' // Fully transparent at top
                 }`}
    >
      {/* Optional: Add a subtle top gradient shadow when scrolled */}
       <div className={`absolute inset-x-0 top-full h-8 bg-gradient-to-b from-black/5 to-transparent pointer-events-none transition-opacity duration-300 ${isScrolled ? 'opacity-100' : 'opacity-0'}`} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20"> {/* Consistent height */}
          {/* Logo */}
          <Logo />

          {/* Desktop Menu & Dark Mode (Center Right) */}
          <div className="hidden md:flex items-center space-x-6">
             <DesktopMenu />
             <DarkModeToggle />
          </div>

          {/* Mobile Menu Trigger & Dark Mode (Right) */}
          <div className="flex md:hidden items-center space-x-4">
             {/* Keep dark mode toggle visible on mobile nav bar itself */}
             <DarkModeToggle />
             <MobileMenu isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default NavBar;