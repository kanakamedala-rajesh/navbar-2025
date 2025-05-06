// components/layout/Footer.tsx
import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="py-8 mt-24 bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700/50">
      <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400 text-sm">
        {/* You can add more elements here - social links, etc. */}
        <p>© {currentYear} RK Creative Works. All rights reserved.</p>
        <p className="mt-2 text-xs">Built with Next.js, Tailwind CSS, and Framer Motion</p>
      </div>
    </footer>
  );
};

export default Footer;
