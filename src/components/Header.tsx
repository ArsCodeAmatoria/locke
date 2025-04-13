'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, BookOpen, Terminal, Home, Lock, Layers, Cpu } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  
  const isActive = (path: string) => pathname === path;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Login', href: '/login', icon: Terminal },
    { name: 'Multi-Chain', href: '/multi-chain', icon: Layers },
    { name: 'Docs', href: '/docs', icon: BookOpen },
    { name: 'WASM ZKP Demo', href: '/examples/wasm-zkp', icon: Cpu },
  ];

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
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link 
                  key={item.href}
                  href={item.href} 
                  className={`text-sm font-medium transition-colors duration-200 flex items-center ${
                    isActive(item.href) ? 'text-emerald-400' : 'text-slate-300 hover:text-emerald-400'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-1" />
                  {item.name}
                </Link>
              );
            })}
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
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link 
                  key={item.href}
                  href={item.href} 
                  className={`text-sm font-medium p-2 rounded transition-colors duration-200 flex items-center ${
                    isActive(item.href) 
                      ? 'bg-emerald-400/10 text-emerald-400' 
                      : 'text-slate-300 hover:bg-emerald-400/10 hover:text-emerald-400'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
} 