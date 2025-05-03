"use client";

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Menu as MenuIcon } from 'lucide-react';
import Link from 'next/link';
import { menuItems, MenuItem } from '@/config/menuItems'; // Adjust path
import DarkModeToggle from '@/components/ui/DarkModeToggle'; // Adjust path

interface MobileMenuProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

// Define origin based on expected icon position (adjust as needed)
const ICON_OFFSET_X = '30px'; // Approx distance from right edge
const ICON_OFFSET_Y = '30px'; // Approx distance from top edge

const popoverVariants = {
  hidden: (custom: { width: number, height: number }) => ({ // Pass window dimensions if needed, or use fixed points
    clipPath: `circle(25px at calc(100% - ${ICON_OFFSET_X}) ${ICON_OFFSET_Y})`,
    opacity: 0,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 40,
      staggerChildren: 0.05, // Stagger items closing
      staggerDirection: -1,
      when: "afterChildren",
    },
  }),
  visible: (custom: { width: number, height: number }) => ({
    clipPath: `circle(${Math.max(custom.width, custom.height) * 1.5}px at calc(100% - ${ICON_OFFSET_X}) ${ICON_OFFSET_Y})`, // Dynamic circle size
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 90,
      damping: 15,
      restDelta: 0.001,
      staggerChildren: 0.07, // Slightly slower stagger
      when: "beforeChildren",
    },
  }),
};

// Diverse menu item animations
const menuItemVariants = [
  { hidden: { opacity: 0, x: -30 }, visible: { opacity: 1, x: 0 } }, // Slide L-R
  { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }, // Slide B-T
  { hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1 } }, // Scale Up
  { hidden: { opacity: 0, rotate: -10, x: -20 }, visible: { opacity: 1, rotate: 0, x: 0 } }, // Rotate In
  { hidden: { opacity: 0, y: -30 }, visible: { opacity: 1, y: 0 } }, // Slide T-B
  { hidden: { opacity: 0, x: 30 }, visible: { opacity: 1, x: 0 } }, // Slide R-L
];

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, setIsOpen }) => {
  const closeMenu = () => setIsOpen(false);
  const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 });

  // Get window dimensions for circle animation
  React.useEffect(() => {
    const updateDimensions = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    updateDimensions(); // Initial call
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);


  // Effect to lock body scroll when menu is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { // Cleanup function
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      {/* Hamburger Trigger is now handled with AnimatePresence in NavBar.tsx */}
      {/* Popover Menu */}
      <AnimatePresence custom={dimensions}>
        {isOpen && (
          <motion.div
            key="mobile-menu-popover" // Changed key slightly for clarity
            custom={dimensions}
            variants={popoverVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed inset-0 z-40 h-[100dvh] w-screen bg-white/90 dark:bg-black/90 backdrop-blur-md"
          >
            {/* Close Button */}
            <motion.button
              className="absolute top-4 right-4 z-50 p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-200/50 dark:hover:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              onClick={closeMenu}
              aria-label="Close menu"
              initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
              animate={{ opacity: 1, rotate: 0, scale: 1, transition: { delay: 0.2 } }} // Slight delay for X button is ok
              exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.1, rotate: -10 }}
            >
              <X className="h-6 w-6" />
            </motion.button>

            {/* Menu Items & Toggle */}
            <motion.div className="flex flex-col items-center justify-center h-full pt-10 pb-20 space-y-6">
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  custom={index}
                  variants={menuItemVariants[index % menuItemVariants.length]}
                  transition={{ type: 'spring', damping: 15, stiffness: 100 }}
                  className="overflow-hidden"
                 >
                  <Link
                    href={item.href}
                    onClick={closeMenu}
                    className="block px-4 py-2 rounded-md text-2xl font-semibold text-gray-800 dark:text-gray-200 hover:bg-indigo-100/50 dark:hover:bg-indigo-900/30 transition-colors duration-200 transform hover:scale-105"
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                 variants={menuItemVariants[menuItems.length % menuItemVariants.length]}
                 transition={{ type: 'spring', damping: 15, stiffness: 100 }}
                 className="mt-8 pt-4 border-t border-gray-300/50 dark:border-gray-700/50 w-1/2 flex justify-center"
               >
                  <DarkModeToggle />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileMenu;