import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, Shield, Lock, FileBadge, ArrowRight, Terminal, Code, CircleSlash, Eye, KeyRound, Database } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground cyber-scanline">
      <div className="container mx-auto py-12 px-4">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 cyber-glow terminal-text">
            <span className="cyber-glitch" data-text="zkID Login">zkID Login</span>
          </h1>
          <p className="text-xl text-emerald-400 max-w-2xl mx-auto font-mono">
            Decentralized identity verification powered by zero-knowledge cryptography
          </p>
          <div className="mt-6 flex justify-center">
            <div className="inline-block bg-black/30 p-3 rounded-lg border border-emerald-400/30">
              <code className="text-sm text-emerald-400 font-mono">$ decrypt --identity --zero-knowledge --secure</code>
            </div>
          </div>
        </div>
        
        <div className="hacker-divider"></div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="cyber-card backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-emerald-400" />
                <span className="terminal-text">Polkadot Wallet Auth</span>
              </CardTitle>
              <CardDescription className="text-slate-400">
                Secure blockchain-backed authentication
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-300">
                Connect using the Polkadot.js browser extension for seamless and secure authentication without exposing your private keys.
              </p>
              <div className="mt-4 p-2 bg-black/40 rounded border border-emerald-400/20 font-mono text-xs text-slate-300">
                <span className="text-emerald-400">{`>`}</span> auth.connect(wallet) <span className="text-emerald-400 animate-pulse">|</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="cyber-card backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-purple-400" />
                <span className="terminal-text">Decentralized Identity</span>
              </CardTitle>
              <CardDescription className="text-slate-400">
                Self-sovereign identity on Substrate
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-300">
                Your Decentralized Identifier (DID) is securely stored on the blockchain, giving you full control over your digital identity.
              </p>
              <div className="mt-4 p-2 bg-black/40 rounded border border-emerald-400/20 font-mono text-xs text-slate-300">
                <span className="text-purple-400">{`>`}</span> did:substrate:0x7f9...e8e3 <span className="text-purple-400 animate-pulse">|</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="cyber-card backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileBadge className="h-5 w-5 text-blue-400" />
                <span className="terminal-text">Soul-Bound Tokens</span>
              </CardTitle>
              <CardDescription className="text-slate-400">
                Non-transferable cryptographic credentials
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-300">
                Your credentials are issued as Soul-Bound Tokens (SBTs), permanently linked to your identity and impossible to transfer or forge.
              </p>
              <div className="mt-4 p-2 bg-black/40 rounded border border-emerald-400/20 font-mono text-xs text-slate-300">
                <span className="text-blue-400">{`>`}</span> sbt.verify(credentials) <span className="text-blue-400 animate-pulse">|</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="cyber-card backdrop-blur-sm md:col-span-2 lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-emerald-400" />
                <span className="terminal-text">Zero-Knowledge Proofs</span>
              </CardTitle>
              <CardDescription className="text-slate-400">
                Cryptographic proof without data exposure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-300 mb-4">
                Our system uses zero-knowledge proofs to verify your credentials without revealing any personal data. This means you can prove you own a credential (like KYC verification) without sharing any of the underlying personal information.
              </p>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-black/30 p-3 rounded-lg border border-emerald-400/20">
                  <div className="flex items-center mb-2">
                    <CircleSlash className="h-4 w-4 text-emerald-400 mr-2" />
                    <h3 className="font-mono text-emerald-400">Privacy-First</h3>
                  </div>
                  <p className="text-xs text-slate-300">
                    Prove credential ownership without revealing personal data
                  </p>
                </div>
                <div className="bg-black/30 p-3 rounded-lg border border-emerald-400/20">
                  <div className="flex items-center mb-2">
                    <Terminal className="h-4 w-4 text-emerald-400 mr-2" />
                    <h3 className="font-mono text-emerald-400">WASM-Powered</h3>
                  </div>
                  <p className="text-xs text-slate-300">
                    Fast, browser-based ZK proof generation using WebAssembly
                  </p>
                </div>
                <div className="bg-black/30 p-3 rounded-lg border border-emerald-400/20">
                  <div className="flex items-center mb-2">
                    <Database className="h-4 w-4 text-emerald-400 mr-2" />
                    <h3 className="font-mono text-emerald-400">On-Chain Verification</h3>
                  </div>
                  <p className="text-xs text-slate-300">
                    Proofs verified on Substrate blockchain for maximum security
                  </p>
                </div>
              </div>
              <div className="mt-8 p-3 bg-black/40 rounded-lg border border-emerald-400/20 font-mono text-xs text-slate-300 overflow-auto">
                <span className="text-emerald-400">{`>`}</span> <span className="text-blue-400">zkProof</span>.generate({'{'}
                <br />
                &nbsp;&nbsp;credential: <span className="text-purple-400">"did:substrate:0x7f9e8e3"</span>,
                <br />
                &nbsp;&nbsp;claim: <span className="text-purple-400">"identity-verification"</span>,
                <br />
                &nbsp;&nbsp;revealData: <span className="text-red-400">false</span>
                <br />
                {'}'}) <span className="text-emerald-400 animate-pulse">|</span>
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/login" className="w-full">
                <button className="cyber-button w-full flex items-center justify-center">
                  Access Secure Terminal
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </Link>
            </CardFooter>
          </Card>
        </div>
        
        <div className="hacker-divider"></div>
        
        <div className="max-w-xl mx-auto text-center mb-12">
          <h2 className="text-2xl font-mono text-emerald-400 mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-purple-500">
              SYSTEM PROTOCOLS
            </span>
          </h2>
          <ol className="text-left space-y-4 mb-8">
            <li className="flex gap-3 bg-black/30 p-3 rounded-lg border border-emerald-400/20">
              <div className="bg-emerald-900/40 text-emerald-400 rounded-full h-6 w-6 flex items-center justify-center shrink-0 border border-emerald-400/30">1</div>
              <div>
                <p className="text-slate-200 font-mono">CONNECT_WALLET()</p>
                <p className="text-xs text-slate-400">Authenticate your blockchain address via Polkadot.js extension</p>
              </div>
            </li>
            <li className="flex gap-3 bg-black/30 p-3 rounded-lg border border-emerald-400/20">
              <div className="bg-emerald-900/40 text-emerald-400 rounded-full h-6 w-6 flex items-center justify-center shrink-0 border border-emerald-400/30">2</div>
              <div>
                <p className="text-slate-200 font-mono">RETRIEVE_DID_SBT()</p>
                <p className="text-xs text-slate-400">System retrieves your DID and Soul-Bound Tokens from Substrate</p>
              </div>
            </li>
            <li className="flex gap-3 bg-black/30 p-3 rounded-lg border border-emerald-400/20">
              <div className="bg-emerald-900/40 text-emerald-400 rounded-full h-6 w-6 flex items-center justify-center shrink-0 border border-emerald-400/30">3</div>
              <div>
                <p className="text-slate-200 font-mono">GENERATE_ZK_PROOF()</p>
                <p className="text-xs text-slate-400">Create cryptographic proof to verify credentials without data exposure</p>
              </div>
            </li>
            <li className="flex gap-3 bg-black/30 p-3 rounded-lg border border-emerald-400/20">
              <div className="bg-emerald-900/40 text-emerald-400 rounded-full h-6 w-6 flex items-center justify-center shrink-0 border border-emerald-400/30">4</div>
              <div>
                <p className="text-slate-200 font-mono">VERIFY_ON_CHAIN()</p>
                <p className="text-xs text-slate-400">Proof verification grants access to credential-gated services</p>
              </div>
            </li>
          </ol>
          
          <Link href="/login">
            <button className="cyber-button px-8 py-3">
              <KeyRound className="inline-block mr-2 h-4 w-4" />
              INITIALIZE SECURE LOGIN
            </button>
          </Link>
        </div>
        
        <div className="border-t border-emerald-400/20 pt-6 mt-12 text-center">
          <p className="text-xs text-slate-500 font-mono">
            [SYSTEM: SECURE // ENCRYPTED // DECENTRALIZED]
          </p>
        </div>
      </div>
    </main>
  )
}
