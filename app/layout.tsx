import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; // Or your chosen font
import './globals.css';
import { ThemeProvider } from './providers';
import Header from '@/components/layout/Header'; // Adjust path if needed
import Footer from '@/components/layout/Footer'; // Adjust path if needed

const inter = Inter({ subsets: ['latin'] }); // Configure your font

export const metadata: Metadata = {
  title: 'RK Portfolio', // Example Title
  description: 'Creative Portfolio Showcase',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} bg-gray-50 dark:bg-gray-950 transition-colors duration-300`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          {/* Adjust pt-20 based on your final NavBar height */}
          <main className="pt-20 md:pt-24 min-h-screen">
            {' '}
            {/* Added min-h-screen for better footer placement */}
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
