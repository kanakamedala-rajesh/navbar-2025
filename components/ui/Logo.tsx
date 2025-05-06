// components/ui/Logo.tsx
import Link from 'next/link';
import { Playfair_Display } from 'next/font/google'; // Example creative font

// Configure font weights and subsets as needed
const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['700'], // Use a bold weight
});

const Logo = () => {
  return (
    <Link href="/" className="z-10 flex-shrink-0">
      {' '}
      {/* Added flex-shrink-0 */}
      <span
        className={`
          text-3xl font-bold text-gray-900 dark:text-gray-100
          cursor-pointer transition-colors duration-300 ease-in-out
          hover:text-indigo-600 dark:hover:text-indigo-400
          ${playfair.className} // Apply the creative font
        `}
        style={{ fontVariantLigatures: 'common-ligatures' }} // Optional: explore font features
      >
        RK
      </span>
    </Link>
  );
};

export default Logo;
