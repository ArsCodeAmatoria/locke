'use client';

import Link from 'next/link';
import { FileText, TerminalSquare, Code, Database } from 'lucide-react';

export default function SubstrateLoginDocPage() {
  return (
    <div className="min-h-screen bg-background cyber-scanline">
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <nav className="mb-8 flex items-center text-sm text-slate-400">
            <Link href="/docs" className="hover:text-emerald-400 transition-colors">
              Documentation
            </Link>
            <span className="mx-2">/</span>
            <span className="text-emerald-400">Substrate Login</span>
          </nav>
          
          <h1 className="text-3xl font-bold mb-6 text-emerald-400 cyber-glow terminal-text">
            Substrate Login Integration
          </h1>
          
          <div className="prose prose-invert prose-emerald max-w-none space-y-6 terminal-text">
            <div className="p-6 bg-black/30 border border-emerald-400/20 rounded-lg">
              <p className="text-slate-300">
                The zkID Login system uses Polkadot/Substrate for blockchain-based decentralized identity management. This guide explains how to set up and use the Substrate integration.
              </p>
            </div>
            
            <h2 className="text-xl font-bold text-emerald-400 mt-8">Architecture Overview</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="p-4 border border-emerald-400/20 rounded-lg bg-black/20">
                <div className="flex items-center mb-3">
                  <Database className="h-5 w-5 text-emerald-400 mr-2" />
                  <h3 className="text-lg font-bold text-emerald-400">Substrate Chain</h3>
                </div>
                <p className="text-sm text-slate-300">The blockchain backend that stores DIDs and SBTs securely in decentralized storage.</p>
              </div>
              
              <div className="p-4 border border-emerald-400/20 rounded-lg bg-black/20">
                <div className="flex items-center mb-3">
                  <Code className="h-5 w-5 text-emerald-400 mr-2" />
                  <h3 className="text-lg font-bold text-emerald-400">Pallets</h3>
                </div>
                <p className="text-sm text-slate-300">Custom Substrate modules (DID Pallet and SBT Pallet) that implement the identity logic.</p>
              </div>
              
              <div className="p-4 border border-emerald-400/20 rounded-lg bg-black/20">
                <div className="flex items-center mb-3">
                  <FileText className="h-5 w-5 text-emerald-400 mr-2" />
                  <h3 className="text-lg font-bold text-emerald-400">WASM ZK Proofs</h3>
                </div>
                <p className="text-sm text-slate-300">WebAssembly module compiled from Rust that generates and verifies zero-knowledge proofs in the browser.</p>
              </div>
              
              <div className="p-4 border border-emerald-400/20 rounded-lg bg-black/20">
                <div className="flex items-center mb-3">
                  <TerminalSquare className="h-5 w-5 text-emerald-400 mr-2" />
                  <h3 className="text-lg font-bold text-emerald-400">Substrate Client</h3>
                </div>
                <p className="text-sm text-slate-300">TypeScript interface that connects the frontend to the Substrate blockchain.</p>
              </div>
            </div>
            
            <h2 className="text-xl font-bold text-emerald-400 mt-8">Setup Options</h2>
            
            <div className="mt-4 space-y-6">
              <div className="p-4 border border-emerald-400/20 rounded-lg bg-black/20">
                <h3 className="text-lg font-bold text-emerald-400 mb-3">Mock Mode (Development)</h3>
                <p className="text-sm text-slate-300 mb-4">For development and testing without requiring a blockchain node:</p>
                <div className="bg-black/40 p-3 rounded font-mono text-sm">
                  <div className="text-slate-400"># In .env.local</div>
                  <div className="text-emerald-400">NEXT_PUBLIC_USE_REAL_NODE=<span className="text-red-400">false</span></div>
                </div>
                <div className="mt-3 bg-black/40 p-3 rounded font-mono text-sm">
                  <div className="text-slate-400"># Start the frontend</div>
                  <div className="text-emerald-400">npm run dev</div>
                </div>
              </div>
              
              <div className="p-4 border border-emerald-400/20 rounded-lg bg-black/20">
                <h3 className="text-lg font-bold text-emerald-400 mb-3">Real Node Mode (Production)</h3>
                <p className="text-sm text-slate-300 mb-4">For connecting to an actual Substrate blockchain:</p>
                <div className="bg-black/40 p-3 rounded font-mono text-sm">
                  <div className="text-slate-400"># In .env.local</div>
                  <div className="text-emerald-400">NEXT_PUBLIC_USE_REAL_NODE=<span className="text-green-400">true</span></div>
                  <div className="text-emerald-400">NEXT_PUBLIC_SUBSTRATE_NODE_URL=<span className="text-yellow-400">ws://your-node-address:9944</span></div>
                </div>
                <div className="mt-3 bg-black/40 p-3 rounded font-mono text-sm">
                  <div className="text-slate-400"># Start the frontend with real node</div>
                  <div className="text-emerald-400">npm run dev:real</div>
                </div>
              </div>
            </div>
            
            <h2 className="text-xl font-bold text-emerald-400 mt-8">Running a Local Node</h2>
            
            <p className="text-slate-300">
              For development, you can run a local Substrate node. We've included a helper script that downloads and runs a Substrate node:
            </p>
            
            <div className="bg-black/40 p-3 rounded font-mono text-sm">
              <div className="text-slate-400"># Make the script executable</div>
              <div className="text-emerald-400">chmod +x start-substrate-node.sh</div>
              <div className="text-slate-400 mt-2"># Run the script</div>
              <div className="text-emerald-400">./start-substrate-node.sh</div>
            </div>
            
            <div className="p-4 border border-yellow-500/20 rounded-lg bg-yellow-500/5 mt-4">
              <p className="text-yellow-400 text-sm">
                <strong>Note:</strong> Building a Substrate node takes time and requires significant 
                disk space. The script will guide you through the process.
              </p>
            </div>
            
            <h2 className="text-xl font-bold text-emerald-400 mt-8">Using the Substrate Client</h2>
            
            <p className="text-slate-300 mb-4">
              The Substrate client is a TypeScript class that handles all blockchain interactions. Here's how to use it:
            </p>
            
            <div className="bg-black/40 p-4 rounded font-mono text-sm">
              <div className="text-blue-400">import</div> <span className="text-slate-300">{'{'}</span> <span className="text-emerald-400">SubstrateClient</span> <span className="text-slate-300">{'}'}</span> <div className="text-blue-400">from</div> <span className="text-yellow-400">'@/lib/substrate-client'</span><span className="text-slate-300">;</span>
              <br/>
              <br/>
              <div className="text-green-400">// Get client instance</div>
              <div className="text-purple-400">const</div> <span className="text-slate-300">client = SubstrateClient.getInstance();</span>
              <br/>
              <div className="text-green-400">// Connect to node</div>
              <div className="text-blue-400">await</div> <span className="text-slate-300">client.connect();</span>
              <br/>
              <div className="text-green-400">// Get user identity</div>
              <div className="text-purple-400">const</div> <span className="text-slate-300">identity = </span><div className="text-blue-400">await</div> <span className="text-slate-300">client.getUserIdentity(account);</span>
              <br/>
              <div className="text-green-400">// Create DID if needed</div>
              <div className="text-blue-400">if</div> <span className="text-slate-300">(!identity) {'{'}</span>
              <br/>
              <span className="text-slate-300">  </span><div className="text-blue-400">await</div> <span className="text-slate-300">client.createDid(account);</span>
              <br/>
              <span className="text-slate-300">{'}'}</span>
            </div>
            
            <h2 className="text-xl font-bold text-emerald-400 mt-8">Zero-Knowledge Proofs</h2>
            
            <p className="text-slate-300 mb-4">
              The system uses zero-knowledge proofs to verify credentials without revealing sensitive data:
            </p>
            
            <div className="bg-black/40 p-4 rounded font-mono text-sm">
              <div className="text-blue-400">import</div> <span className="text-slate-300">{'{'}</span> <span className="text-emerald-400">ZkProver</span> <span className="text-slate-300">{'}'}</span> <div className="text-blue-400">from</div> <span className="text-yellow-400">'@/lib/wasm-zkp'</span><span className="text-slate-300">;</span>
              <br/>
              <br/>
              <div className="text-green-400">// Initialize the ZK prover</div>
              <div className="text-purple-400">const</div> <span className="text-slate-300">prover = ZkProver.getInstance();</span>
              <div className="text-blue-400">await</div> <span className="text-slate-300">prover.init();</span>
              <br/>
              <div className="text-green-400">// Generate a proof</div>
              <div className="text-purple-400">const</div> <span className="text-slate-300">result = </span><div className="text-blue-400">await</div> <span className="text-slate-300">prover.generateProof(secretValue);</span>
              <br/>
              <div className="text-green-400">// Verify a proof</div>
              <div className="text-purple-400">const</div> <span className="text-slate-300">isValid = </span><div className="text-blue-400">await</div> <span className="text-slate-300">prover.verifyProof(proofStr, publicInput);</span>
            </div>
            
            <div className="flex justify-between mt-8 pt-6 border-t border-emerald-400/20">
              <Link href="/docs" className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Documentation
              </Link>
              <Link href="/docs/substrate-login/advanced" className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center">
                Advanced Topics
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 