// src/components/FloatingNavbar.tsx
'use client';
import Link from 'next/link';
import { Wallet, Compass, Info, Menu, X } from 'lucide-react';
import { useState } from 'react';

export const FloatingNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 hidden md:block">
        <div className="bg-white/95 backdrop-blur-2xl rounded-2xl shadow-xl border border-gray-200/50 px-6 py-3">
          <div className="flex items-center justify-between gap-8">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                FundExplorer
              </span>
            </Link>
            
            <div className="flex items-center gap-2">
              <Link 
                href="/funds" 
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200 py-2.5 px-4 rounded-xl font-medium"
              >
                <Compass className="w-4 h-4" />
                <span>Explore Funds</span>
              </Link>
              <Link 
                href="/about" 
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200 py-2.5 px-4 rounded-xl font-medium"
              >
                <Info className="w-4 h-4" />
                <span>About</span>
              </Link>
              <Link 
                href="/calculator" 
                className="ml-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navbar */}
      <nav className="fixed top-4 left-4 right-4 z-50 md:hidden">
        <div className="bg-white/95 backdrop-blur-2xl rounded-2xl shadow-xl border border-gray-200/50 px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md">
                <Wallet className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                FundExplorer
              </span>
            </Link>
            
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
          
          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
              <Link 
                href="/funds" 
                className="flex items-center gap-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200 py-3 px-4 rounded-xl font-medium w-full"
                onClick={() => setIsMenuOpen(false)}
              >
                <Compass className="w-4 h-4" />
                <span>Explore Funds</span>
              </Link>
              <Link 
                href="/about" 
                className="flex items-center gap-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200 py-3 px-4 rounded-xl font-medium w-full"
                onClick={() => setIsMenuOpen(false)}
              >
                <Info className="w-4 h-4" />
                <span>About</span>
              </Link>
              <Link 
                href="/calculator" 
                className="flex items-center justify-center bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg mt-3 w-full"
                onClick={() => setIsMenuOpen(false)}
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};