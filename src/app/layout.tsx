// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ClientNavbarWrapper from '../components/ClientNavbarWrapper'
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FundExplorer - Mutual Fund SIP Calculator',
  description: 'Explore mutual funds and calculate potential SIP returns.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-cream`}>
        {/* ✅ Use the client wrapper here */}
        <ClientNavbarWrapper />
        <main className="pt-28 container mx-auto px-4">{children}</main>
      </body>
    </html>
  );
}
