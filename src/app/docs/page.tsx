'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronRight, Book, Code, Users, HelpCircle, FileText } from 'lucide-react';

type SectionKey = 'guides' | 'api' | 'resources';

export default function DocumentationPage() {
  const [openSections, setOpenSections] = useState<Record<SectionKey, boolean>>({
    'guides': true,
    'api': false,
    'resources': false
  });

  const toggleSection = (section: SectionKey) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="min-h-screen bg-background cyber-scanline">
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="sticky top-8 border border-emerald-400/20 rounded-lg overflow-hidden bg-black/30">
              <div className="p-4 border-b border-emerald-400/20">
                <h3 className="text-lg font-bold text-emerald-400 terminal-text">Documentation</h3>
              </div>
              
              <div className="p-2">
                {/* Guides Section */}
                <div>
                  <button 
                    onClick={() => toggleSection('guides')}
                    className="flex items-center w-full p-2 hover:bg-black/50 text-slate-200 rounded transition-colors"
                  >
                    {openSections.guides ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    <Book size={16} className="ml-1 mr-2 text-emerald-400" />
                    <span className="terminal-text">Guides</span>
                  </button>
                  
                  {openSections.guides && (
                    <div className="ml-6 border-l border-slate-700 pl-2 mt-1 space-y-1">
                      <Link href="/docs/installation" className="flex items-center p-1 text-sm text-slate-400 hover:text-emerald-400 transition-colors terminal-text">
                        Installation
                      </Link>
                      <Link href="/docs/user-guide" className="flex items-center p-1 text-sm text-slate-400 hover:text-emerald-400 transition-colors terminal-text">
                        User Guide
                      </Link>
                      <Link href="/docs/integration" className="flex items-center p-1 text-sm text-slate-400 hover:text-emerald-400 transition-colors terminal-text">
                        Integration
                      </Link>
                      <Link href="/docs/development-setup" className="flex items-center p-1 text-sm text-slate-400 hover:text-emerald-400 transition-colors terminal-text">
                        Development Setup
                      </Link>
                    </div>
                  )}
                </div>
                
                {/* API Section */}
                <div>
                  <button 
                    onClick={() => toggleSection('api')}
                    className="flex items-center w-full p-2 hover:bg-black/50 text-slate-200 rounded transition-colors"
                  >
                    {openSections.api ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    <Code size={16} className="ml-1 mr-2 text-emerald-400" />
                    <span className="terminal-text">API Reference</span>
                  </button>
                  
                  {openSections.api && (
                    <div className="ml-6 border-l border-slate-700 pl-2 mt-1 space-y-1">
                      <Link href="/docs/substrate-client" className="flex items-center p-1 text-sm text-slate-400 hover:text-emerald-400 transition-colors terminal-text">
                        Substrate Client
                      </Link>
                      <Link href="/docs/did-pallet" className="flex items-center p-1 text-sm text-slate-400 hover:text-emerald-400 transition-colors terminal-text">
                        DID Pallet
                      </Link>
                      <Link href="/docs/sbt-pallet" className="flex items-center p-1 text-sm text-slate-400 hover:text-emerald-400 transition-colors terminal-text">
                        SBT Pallet
                      </Link>
                      <Link href="/docs/zk-proof" className="flex items-center p-1 text-sm text-slate-400 hover:text-emerald-400 transition-colors terminal-text">
                        ZK Proof
                      </Link>
                    </div>
                  )}
                </div>
                
                {/* Resources Section */}
                <div>
                  <button 
                    onClick={() => toggleSection('resources')}
                    className="flex items-center w-full p-2 hover:bg-black/50 text-slate-200 rounded transition-colors"
                  >
                    {openSections.resources ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    <FileText size={16} className="ml-1 mr-2 text-emerald-400" />
                    <span className="terminal-text">Resources</span>
                  </button>
                  
                  {openSections.resources && (
                    <div className="ml-6 border-l border-slate-700 pl-2 mt-1 space-y-1">
                      <Link href="/docs/glossary" className="flex items-center p-1 text-sm text-slate-400 hover:text-emerald-400 transition-colors terminal-text">
                        Glossary
                      </Link>
                      <Link href="/docs/faq" className="flex items-center p-1 text-sm text-slate-400 hover:text-emerald-400 transition-colors terminal-text">
                        FAQ
                      </Link>
                      <Link href="/docs/troubleshooting" className="flex items-center p-1 text-sm text-slate-400 hover:text-emerald-400 transition-colors terminal-text">
                        Troubleshooting
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="md:col-span-3">
            <h1 className="text-3xl font-bold mb-6 text-emerald-400 cyber-glow terminal-text">zkID Login Documentation</h1>
            <div className="prose prose-invert prose-emerald max-w-none space-y-6">
              <div className="p-6 bg-black/30 border border-emerald-400/20 rounded-lg">
                <p className="terminal-text text-slate-300">
                  Welcome to the zkID Login documentation. This guide will help you understand how to use, integrate, and extend the zkID Login system.
                </p>
              </div>
              
              <h2 className="text-xl font-bold text-emerald-400 terminal-text mt-8">Overview</h2>
              <p className="terminal-text text-slate-300">
                zkID Login is a decentralized identity verification system built on Polkadot and Substrate with Zero-Knowledge Proofs for privacy-preserving authentication. It allows users to:
              </p>
              
              <ul className="list-disc pl-6 terminal-text text-slate-300 space-y-2">
                <li>Connect with Polkadot wallets</li>
                <li>Create and manage decentralized identities (DIDs)</li>
                <li>Receive and verify Soul-Bound Tokens (SBTs) as credentials</li>
                <li>Prove credential ownership without revealing sensitive data</li>
              </ul>
              
              <h2 className="text-xl font-bold text-emerald-400 terminal-text mt-8">Core Components</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 border border-emerald-400/20 rounded-lg bg-black/20">
                  <h3 className="text-lg font-bold text-emerald-400 terminal-text mb-2">Frontend UI</h3>
                  <p className="text-sm text-slate-300 terminal-text">Next.js application with a cyberpunk-inspired interface</p>
                </div>
                
                <div className="p-4 border border-emerald-400/20 rounded-lg bg-black/20">
                  <h3 className="text-lg font-bold text-emerald-400 terminal-text mb-2">Substrate Client</h3>
                  <p className="text-sm text-slate-300 terminal-text">Bridge between frontend and blockchain</p>
                </div>
                
                <div className="p-4 border border-emerald-400/20 rounded-lg bg-black/20">
                  <h3 className="text-lg font-bold text-emerald-400 terminal-text mb-2">DID Pallet</h3>
                  <p className="text-sm text-slate-300 terminal-text">Substrate pallet for decentralized identity management</p>
                </div>
                
                <div className="p-4 border border-emerald-400/20 rounded-lg bg-black/20">
                  <h3 className="text-lg font-bold text-emerald-400 terminal-text mb-2">SBT Pallet</h3>
                  <p className="text-sm text-slate-300 terminal-text">Substrate pallet for Soul-Bound Token credentials</p>
                </div>
                
                <div className="p-4 border border-emerald-400/20 rounded-lg bg-black/20">
                  <h3 className="text-lg font-bold text-emerald-400 terminal-text mb-2">ZK Proof Module</h3>
                  <p className="text-sm text-slate-300 terminal-text">WebAssembly-powered zero-knowledge proof generation and verification</p>
                </div>
              </div>
              
              <h2 className="text-xl font-bold text-emerald-400 terminal-text mt-8">Quick Start</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="p-4 border border-emerald-400/20 rounded-lg bg-black/20 hover:bg-black/40 transition-colors">
                  <Link href="/docs/installation" className="block h-full">
                    <h3 className="text-lg font-bold text-emerald-400 terminal-text mb-2">Installation Guide</h3>
                    <p className="text-sm text-slate-300 terminal-text">Set up zkID Login locally</p>
                  </Link>
                </div>
                
                <div className="p-4 border border-emerald-400/20 rounded-lg bg-black/20 hover:bg-black/40 transition-colors">
                  <Link href="/docs/integration" className="block h-full">
                    <h3 className="text-lg font-bold text-emerald-400 terminal-text mb-2">Integration Guide</h3>
                    <p className="text-sm text-slate-300 terminal-text">Add zkID Login to your application</p>
                  </Link>
                </div>
                
                <div className="p-4 border border-emerald-400/20 rounded-lg bg-black/20 hover:bg-black/40 transition-colors">
                  <Link href="/docs/user-guide" className="block h-full">
                    <h3 className="text-lg font-bold text-emerald-400 terminal-text mb-2">User Guide</h3>
                    <p className="text-sm text-slate-300 terminal-text">Learn how to use zkID Login</p>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 