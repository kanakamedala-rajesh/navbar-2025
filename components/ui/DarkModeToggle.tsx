// components/ui/DarkModeToggle.tsx
'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';

const DarkModeToggle = () => {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  // Avoid rendering mismatch by waiting for mount
  if (!mounted) {
    // Render a placeholder or null during server rendering/hydration
    return <div className="w-9 h-9" />; // Placeholder with same size
  }

  return (
    <motion.button
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      className="relative z-10 flex items-center justify-center w-9 h-9 rounded-full text-gray-700 dark:text-gray-300 bg-gray-200/50 dark:bg-gray-800/50 hover:bg-gray-300/70 dark:hover:bg-gray-700/70 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-950" // Adjusted dark offset
      whileHover={{ scale: 1.1, rotate: 15 }} // Added subtle rotate on hover
      whileTap={{ scale: 0.95, rotate: -5 }} // Added subtle rotate on tap
    >
      <AnimatePresence mode="wait" initial={false}>
        {resolvedTheme === 'dark' ? (
          <motion.div
            key="moon"
            initial={{ y: -20, opacity: 0, rotate: -90 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: 20, opacity: 0, rotate: 90 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="text-indigo-400" // Color the icon
          >
            <Moon className="w-5 h-5" />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ y: -20, opacity: 0, rotate: 90 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: 20, opacity: 0, rotate: -90 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="text-yellow-500" // Color the icon
          >
            <Sun className="w-5 h-5" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

export default DarkModeToggle;
