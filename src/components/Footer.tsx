'use client';

import Link from 'next/link';
import { Github, Globe } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="mt-auto py-8 border-t border-emerald-400/20 bg-black/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400">
              © {currentYear} zkID Login
            </span>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-4">
            <span className="text-sm text-slate-400">
              Developed by{' '}
              <Link 
                href="https://github.com/ArsCodeAmatoria" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                Ars Code Amatoria
              </Link>
            </span>
            
            <div className="flex items-center gap-3">
              <Link 
                href="https://github.com/ArsCodeAmatoria" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-emerald-400 transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </Link>
              <Link 
                href="https://www.arscode.org/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-emerald-400 transition-colors"
                aria-label="Website"
              >
                <Globe className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 