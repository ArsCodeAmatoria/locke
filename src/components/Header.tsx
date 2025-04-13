'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, BookOpen, Terminal, Home, Lock, Layers } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  
  const isActive = (path: string) => pathname === path;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-emerald-400/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Lock className="h-5 w-5 text-emerald-400 mr-2" />
            <span className="text-lg font-bold text-emerald-400 cyber-glow terminal-text">zkID</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6 items-center">
            <Link 
              href="/" 
              className={`text-sm font-medium transition-colors duration-200 flex items-center ${
                isActive('/') ? 'text-emerald-400' : 'text-slate-300 hover:text-emerald-400'
              }`}
            >
              <Home className="h-4 w-4 mr-1" />
              Home
            </Link>
            <Link 
              href="/login" 
              className={`text-sm font-medium transition-colors duration-200 flex items-center ${
                isActive('/login') ? 'text-emerald-400' : 'text-slate-300 hover:text-emerald-400'
              }`}
            >
              <Terminal className="h-4 w-4 mr-1" />
              Login
            </Link>
            <Link 
              href="/multi-chain" 
              className={`text-sm font-medium transition-colors duration-200 flex items-center ${
                isActive('/multi-chain') ? 'text-emerald-400' : 'text-slate-300 hover:text-emerald-400'
              }`}
            >
              <Layers className="h-4 w-4 mr-1" />
              Multi-Chain
            </Link>
            <Link 
              href="/docs" 
              className={`text-sm font-medium transition-colors duration-200 flex items-center ${
                isActive('/docs') ? 'text-emerald-400' : 'text-slate-300 hover:text-emerald-400'
              }`}
            >
              <BookOpen className="h-4 w-4 mr-1" />
              Documentation
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 rounded-lg bg-black/30 border border-emerald-400/20"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-5 w-5 text-emerald-400" /> : <Menu className="h-5 w-5 text-emerald-400" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-black/90 border-b border-emerald-400/20 py-4 px-4">
          <nav className="flex flex-col space-y-4">
            <Link 
              href="/" 
              className={`text-sm font-medium p-2 rounded transition-colors duration-200 flex items-center ${
                isActive('/') 
                  ? 'bg-emerald-400/10 text-emerald-400' 
                  : 'text-slate-300 hover:bg-emerald-400/10 hover:text-emerald-400'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <Home className="h-4 w-4 mr-2" />
              Home
            </Link>
            <Link 
              href="/login" 
              className={`text-sm font-medium p-2 rounded transition-colors duration-200 flex items-center ${
                isActive('/login') 
                  ? 'bg-emerald-400/10 text-emerald-400' 
                  : 'text-slate-300 hover:bg-emerald-400/10 hover:text-emerald-400'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <Terminal className="h-4 w-4 mr-2" />
              Login
            </Link>
            <Link 
              href="/multi-chain" 
              className={`text-sm font-medium p-2 rounded transition-colors duration-200 flex items-center ${
                isActive('/multi-chain') 
                  ? 'bg-emerald-400/10 text-emerald-400' 
                  : 'text-slate-300 hover:bg-emerald-400/10 hover:text-emerald-400'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <Layers className="h-4 w-4 mr-2" />
              Multi-Chain
            </Link>
            <Link 
              href="/docs" 
              className={`text-sm font-medium p-2 rounded transition-colors duration-200 flex items-center ${
                isActive('/docs') 
                  ? 'bg-emerald-400/10 text-emerald-400' 
                  : 'text-slate-300 hover:bg-emerald-400/10 hover:text-emerald-400'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Documentation
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
} 