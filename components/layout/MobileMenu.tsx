"use client";

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
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
  // --- EXIT --- (Inverse of Enter)
  hidden: (custom: { width: number, height: number }) => ({
    clipPath: `circle(25px at calc(100% - ${ICON_OFFSET_X}) ${ICON_OFFSET_Y})`,
    opacity: 0,
    transition: {
      // Overall exit duration
      duration: 0.5, // Match enter duration for symmetry
      // Use separate transitions for properties if needed
      opacity: { duration: 0.3, ease: "linear", delay: 0.2 }, // Fade out towards the end
      clipPath: { duration: 0.5, ease: "easeIn" }, // EaseIn for closing feels natural
      // Control children exit timing
      when: "beforeChildren", // Let items finish animating out first
      staggerChildren: 0.09, // Increased stagger, matches enter
      staggerDirection: -1, // Crucial for inverse order
    },
  }),

  // --- ENTER --- (Focus on immediate feel + paced items)
  visible: (custom: { width: number, height: number }) => ({
    clipPath: `circle(${Math.max(custom.width, custom.height) * 1.5}px at calc(100% - ${ICON_OFFSET_X}) ${ICON_OFFSET_Y})`,
    opacity: 1,
    transition: {
      // Overall duration - mainly for clipPath now
      duration: 0.5, // Can adjust this main duration
      // Animate opacity almost instantly
      opacity: { duration: 0.1, ease: "linear" }, // Near instant fade-in
      // Animate clipPath smoothly
      clipPath: { duration: 0.5, ease: "easeOut" }, // Smooth reveal
      // Control children entry timing
      when: "beforeChildren", // Parent starts, then short delay, then children
      delayChildren: 0.05,    // Very short delay before first item
      staggerChildren: 0.09, // INCREASED - More time between items
    },
  }),
};

// Menu item variants (Keep individual animations simple)
// Using a default transition for simplicity, can override per variant if needed
const defaultItemTransition = { type: 'spring', damping: 15, stiffness: 100 };
const menuItemVariants = [
    { hidden: { opacity: 0, x: -30 }, visible: { opacity: 1, x: 0, transition: defaultItemTransition } },
    { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: defaultItemTransition } },
    { hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1, transition: defaultItemTransition } },
    { hidden: { opacity: 0, rotate: -10, x: -20 }, visible: { opacity: 1, rotate: 0, x: 0, transition: defaultItemTransition } },
    { hidden: { opacity: 0, y: -30 }, visible: { opacity: 1, y: 0, transition: defaultItemTransition } },
    { hidden: { opacity: 0, x: 30 }, visible: { opacity: 1, x: 0, transition: defaultItemTransition } },
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
    // AnimatePresence wraps the conditional rendering of the popover
    <AnimatePresence custom={dimensions} mode='wait'> {/* mode='wait' ensures exit anim completes first */}
        {isOpen && (
          <motion.div
            key="mobile-menu-popover"
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
              onClick={closeMenu} aria-label="Close menu"
              initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
              animate={{ opacity: 1, rotate: 0, scale: 1, transition: { delay: 0.2 } }} // Delay here is fine
              exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
              whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.1, rotate: -10 }}
            >
              <X className="h-6 w-6" />
            </motion.button>

            {/* Menu Items & Toggle Container */}
            {/* Wrap item list in its own motion.div for potential parent stagger */}
            <motion.div
              className="flex flex-col items-center justify-center h-full pt-10 pb-20 space-y-6"
              // Variants applied to children below
            >
              {menuItems.map((item, index) => (
                            <motion.div
                                key={item.name}
                                variants={menuItemVariants[index % menuItemVariants.length]}
                                // Rely on variants' defined transitions + parent stagger
                                className="overflow-hidden"
                            >
                                <Link
                                    href={item.href} onClick={closeMenu}
                                    className="block px-4 py-2 rounded-md text-2xl font-semibold text-gray-800 dark:text-gray-200 hover:bg-indigo-100/50 dark:hover:bg-indigo-900/30 transition-colors duration-200 transform hover:scale-105"
                                >
                                    {item.name}
                                </Link>
                            </motion.div>
                        ))}
                        {/* Dark mode toggle */}
                        <motion.div
                            variants={menuItemVariants[menuItems.length % menuItemVariants.length]}
                            className="mt-8 pt-4 border-t border-gray-300/50 dark:border-gray-700/50 w-1/2 flex justify-center"
                        >
                  <DarkModeToggle />
              </motion.div>
            </motion.div> {/* End Menu Items Container */}
          </motion.div> // End Popover
        )}
      </AnimatePresence>
  );
};

export default MobileMenu;