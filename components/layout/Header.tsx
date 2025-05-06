// components/layout/Header.tsx
import React from 'react';
import NavBar from './NavBar'; // Adjust path

const Header = () => {
  // This component acts as a clean wrapper for the NavBar
  // Could potentially fetch site-wide header data in the future
  return <NavBar />;
};

export default Header;
