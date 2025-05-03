// components/layout/DesktopMenu.tsx
"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { menuItems, MenuItem } from '@/config/menuItems'; // Adjust path
import { usePathname } from 'next/navigation'; // Or use scrollspy logic
import React from 'react';

const navContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.3, // Delay start of children animation
    },
  },
};

const navItemVariants = {
  hidden: { opacity: 0, y: -15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 120, damping: 10 },
   },
};

const DesktopMenu = () => {
  const pathname = usePathname(); // Use for active state if needed

  return (
    <motion.nav
      className="hidden md:flex items-center space-x-6 lg:space-x-8"
      variants={navContainerVariants}
      initial="hidden"
      animate="visible"
    >
      {menuItems.map((item) => (
        <motion.div key={item.name} variants={navItemVariants}>
          <NavItem item={item} isActive={pathname === item.href} />
        </motion.div>
      ))}
    </motion.nav>
  );
};

// Sub-component for individual nav items with hover effect
const NavItem = ({ item, isActive }: { item: MenuItem; isActive: boolean }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Link
        href={item.href}
        className="relative group px-2 py-1 text-sm lg:text-base font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
      >
        {item.name}
        {/* Animated underline/highlight effect */}
        <motion.span
          className="absolute left-0 -bottom-1 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full" // Use rounded full for pill shape
          style={{ originX: 0.5 }} // Animate from center
          initial={{ width: 0 }}
          animate={{ width: isHovered || isActive ? '100%' : 0 }}
          transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }} // Smoother ease
        />
      </Link>
    </motion.div>
  );
};

export default DesktopMenu;