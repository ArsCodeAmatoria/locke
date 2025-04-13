'use client';

import Link from 'next/link';
import Image from 'next/image';
import { 
  Wallet, Shield, Lock, FileBadge, ArrowRight, Terminal, 
  Code, CircleSlash, Eye, KeyRound, Database, BookOpen, 
  Globe, Share2, LucideUserCheck, Bitcoin, Network
} from 'lucide-react';
import LayoutWrapper, { Section, Container } from '@/components/layout-wrapper';
import { Card, CardGrid, SectionDivider } from '@/components/ui/card';
import { CyberGlitch } from '@/components/ui/motion-component';
import { TerminalType, GlitchReveal } from '@/components/ui/advanced-motion';

// Social icons component
const SocialLoginIcons = () => (
  <div className="flex justify-center gap-4 mb-4">
    <div className="rounded-full bg-white p-2 w-8 h-8 flex items-center justify-center">
      <Image src="/social/google.svg" alt="Google" width={16} height={16} />
    </div>
    <div className="rounded-full bg-white/90 p-2 w-8 h-8 flex items-center justify-center">
      <Image src="/social/github.svg" alt="GitHub" width={16} height={16} className="text-black" />
    </div>
    <div className="rounded-full bg-white/90 p-2 w-8 h-8 flex items-center justify-center">
      <Image src="/social/twitter.svg" alt="Twitter" width={16} height={16} />
    </div>
    <div className="rounded-full bg-white/90 p-2 w-8 h-8 flex items-center justify-center">
      <Image src="/social/discord.svg" alt="Discord" width={16} height={16} />
    </div>
  </div>
);

// Blockchain icons
const ChainIcon = ({ name }: { name: string }) => {
  switch (name.toLowerCase()) {
    case 'ethereum':
      return <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center"><span className="text-white text-[8px] font-bold">Ξ</span></div>;
    case 'polkadot':
      return <div className="w-5 h-5 bg-pink-500 rounded-full"></div>;
    case 'solana':
      return <div className="w-5 h-5 bg-gradient-to-r from-purple-600 to-purple-400 rounded-full"></div>;
    case 'cosmos':
      return <div className="w-5 h-5 bg-black border-2 border-white rounded-full flex items-center justify-center"><Network className="h-3 w-3 text-white" /></div>;
    case 'near':
      return <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center"><Database className="h-3 w-3 text-white" /></div>;
    default:
      return <Bitcoin className="h-5 w-5 text-amber-500" />;
  }
};

export default function Home() {
  return (
    <LayoutWrapper>
      {/* Hero Section */}
      <Section className="min-h-[85vh] relative flex items-center justify-center py-12 overflow-hidden">
        <div className="absolute inset-0 bg-black/30 z-0"></div>
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat opacity-20 z-0"></div>
        <Container className="relative z-10 max-w-4xl">
          <div className="text-center mb-10">
            <h1 className="text-6xl font-bold mb-6 cyber-glow terminal-text">
              <CyberGlitch data-text="zkID Login">zkID Login</CyberGlitch>
            </h1>
            <div className="text-xl text-emerald-400 max-w-2xl mx-auto font-mono mb-8">
              <GlitchReveal>Decentralized identity verification powered by zero-knowledge cryptography</GlitchReveal>
            </div>
            <div className="inline-block bg-black/60 p-4 rounded-lg border border-emerald-400/40 shadow-[0_0_15px_rgba(22,255,177,0.3)]">
              <code className="text-sm text-emerald-400 font-mono">$ decrypt --identity --zero-knowledge --secure</code>
            </div>
          </div>
          
          <div className="mt-10 flex flex-col md:flex-row gap-4 justify-center">
            <Link href="/login" className="block md:w-auto">
              <button className="cyber-button w-full md:w-64 flex items-center justify-center py-3">
                Access Secure Terminal
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </Link>
            
            <Link href="/docs" className="block md:w-auto">
              <button className="cyber-button-secondary w-full md:w-64 flex items-center justify-center py-3">
                Documentation
                <BookOpen className="ml-2 h-4 w-4" />
              </button>
            </Link>
          </div>
        </Container>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 16L6 10H18L12 16Z" fill="#16ffb1"/>
          </svg>
        </div>
      </Section>
      
      <SectionDivider />
      
      {/* Multi-Chain Support Section - NEW */}
      <Section className="py-16 bg-black/40">
        <Container className="max-w-5xl">
          <h2 className="text-2xl font-mono mb-8 text-center">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500 cyber-glow">
              MULTI-CHAIN IDENTITY SYSTEM
            </span>
          </h2>
          
          <Card 
            title="Cross-Chain Identity Resolution" 
            titleGlow 
            scanlineEffect 
            className="mb-8" 
            animated 
            delay={0.2}
            borderGlow
          >
            <div className="mb-4 flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-400" />
              <span className="text-slate-400">Your identity, everywhere</span>
            </div>
            <p className="text-sm text-slate-300 mb-6">
              Our multi-chain identity system allows you to maintain a single decentralized identity that works across multiple blockchains. Link accounts from different chains to create a unified digital identity with cross-chain credential verification.
            </p>
            
            <div className="bg-black/50 p-4 rounded-lg border border-emerald-400/20 mb-6">
              <h3 className="text-emerald-400 font-mono text-sm mb-3">SUPPORTED BLOCKCHAINS</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {['Polkadot', 'Ethereum', 'Solana', 'Cosmos', 'Near'].map((chain) => (
                  <div key={chain} className="flex items-center gap-2 bg-black/40 p-2 rounded border border-emerald-400/20">
                    <ChainIcon name={chain} />
                    <span className="text-xs text-slate-300">{chain}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-3 bg-black/40 rounded-lg border border-emerald-400/20 font-mono text-xs text-slate-300 overflow-auto">
              <span className="text-emerald-400">{`>`}</span> <span className="text-blue-400">crossChainIdentity</span>.resolveIdentity({'{'}
              <br />
              &nbsp;&nbsp;did: <span className="text-purple-400">"did:multi:eth:1:0x7f9..."</span>,
              <br />
              &nbsp;&nbsp;targetChains: [<span className="text-green-400">"substrate", "solana"</span>]
              <br />
              {'}'}) <span className="text-emerald-400 animate-pulse">|</span>
            </div>
          </Card>
        </Container>
      </Section>
      
      {/* Features Section */}
      <Section className="py-16 bg-black/30">
        <Container className="max-w-5xl">
          <h2 className="text-2xl font-mono mb-8 text-center">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-purple-500 cyber-glow">
              CORE SECURITY PROTOCOLS
            </span>
          </h2>
          
          <CardGrid columns={{ default: 1, md: 2, lg: 3 }}>
            <Card 
              title="Blockchain Auth" 
              titleGlow 
              scanlineEffect 
              animated 
              delay={0.1}
              hoverable
            >
              <div className="mb-4 flex items-center gap-2">
                <Wallet className="h-5 w-5 text-emerald-400" />
                <span className="text-slate-400">Secure blockchain-backed authentication</span>
              </div>
              <p className="text-sm text-slate-300 mb-4">
                Connect using the Polkadot.js browser extension or other blockchain wallets for seamless and secure authentication without exposing your private keys.
              </p>
              <div className="p-2 bg-black/40 rounded border border-emerald-400/20 font-mono text-xs text-slate-300">
                <span className="text-emerald-400">{`>`}</span> auth.connect(wallet) <span className="text-emerald-400 animate-pulse">|</span>
              </div>
            </Card>
            
            <Card 
              title="Social Login" 
              titleGlow 
              scanlineEffect 
              animated 
              delay={0.1}
              hoverable
            >
              <div className="mb-4 flex items-center gap-2">
                <LucideUserCheck className="h-5 w-5 text-emerald-400" />
                <span className="text-slate-400">Multiple authentication methods</span>
              </div>
              <p className="text-sm text-slate-300 mb-4">
                Alternatively, log in with popular social accounts and link them to your blockchain identity for a seamless user experience.
              </p>
              
              <SocialLoginIcons />
              
              <div className="p-2 bg-black/40 rounded border border-emerald-400/20 font-mono text-xs text-slate-300">
                <span className="text-emerald-400">{`>`}</span> identity.linkSocial(provider) <span className="text-emerald-400 animate-pulse">|</span>
              </div>
            </Card>
            
            <Card 
              title="Decentralized Identity" 
              titleGlow 
              scanlineEffect 
              animated 
              delay={0.2}
              hoverable
            >
              <div className="mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5 text-purple-400" />
                <span className="text-slate-400">Self-sovereign identity on Substrate</span>
              </div>
              <p className="text-sm text-slate-300 mb-4">
                Your Decentralized Identifier (DID) is securely stored on the blockchain, giving you full control over your digital identity.
              </p>
              <div className="p-2 bg-black/40 rounded border border-emerald-400/20 font-mono text-xs text-slate-300">
                <span className="text-purple-400">{`>`}</span> did:substrate:0x7f9...e8e3 <span className="text-purple-400 animate-pulse">|</span>
              </div>
            </Card>
            
            <Card 
              title="Soul-Bound Tokens" 
              titleGlow 
              scanlineEffect 
              animated 
              delay={0.3}
              hoverable
            >
              <div className="mb-4 flex items-center gap-2">
                <FileBadge className="h-5 w-5 text-blue-400" />
                <span className="text-slate-400">Non-transferable cryptographic credentials</span>
              </div>
              <p className="text-sm text-slate-300 mb-4">
                Your credentials are issued as Soul-Bound Tokens (SBTs), permanently linked to your identity and impossible to transfer or forge.
              </p>
              <div className="p-2 bg-black/40 rounded border border-emerald-400/20 font-mono text-xs text-slate-300">
                <span className="text-blue-400">{`>`}</span> sbt.verify(credentials) <span className="text-blue-400 animate-pulse">|</span>
              </div>
            </Card>
            
            <Card 
              title="Terminal UI" 
              titleGlow 
              scanlineEffect 
              animated 
              delay={0.3}
              hoverable
            >
              <div className="mb-4 flex items-center gap-2">
                <Terminal className="h-5 w-5 text-green-400" />
                <span className="text-slate-400">Cyberpunk-inspired interface</span>
              </div>
              <p className="text-sm text-slate-300 mb-4">
                Experience our retro-futuristic terminal UI with command-line style interactions, cyberpunk aesthetics, and real-time feedback.
              </p>
              <div className="p-2 bg-black/40 rounded border border-emerald-400/20 font-mono text-xs text-slate-300">
                <span className="text-green-400">{`>`}</span> ui.renderTerminal() <span className="text-green-400 animate-pulse">|</span>
              </div>
            </Card>
            
            <Card 
              title="Cross-Chain Linking" 
              titleGlow 
              scanlineEffect 
              animated 
              delay={0.3}
              hoverable
            >
              <div className="mb-4 flex items-center gap-2">
                <Share2 className="h-5 w-5 text-orange-400" />
                <span className="text-slate-400">Connect identities across chains</span>
              </div>
              <p className="text-sm text-slate-300 mb-4">
                Link your identities from multiple blockchains into a unified profile, allowing seamless credential verification across different ecosystems.
              </p>
              <div className="p-2 bg-black/40 rounded border border-emerald-400/20 font-mono text-xs text-slate-300">
                <span className="text-orange-400">{`>`}</span> identity.link(chains) <span className="text-orange-400 animate-pulse">|</span>
              </div>
            </Card>
          </CardGrid>
        </Container>
      </Section>
      
      {/* ZK Proofs Section */}
      <Section className="py-16">
        <Container className="max-w-4xl">
          <Card 
            title="Zero-Knowledge Proofs" 
            titleGlow 
            scanlineEffect 
            className="mb-8" 
            animated 
            delay={0.4}
            borderGlow
          >
            <div className="mb-4 flex items-center gap-2">
              <Lock className="h-5 w-5 text-emerald-400" />
              <span className="text-slate-400">Cryptographic proof without data exposure</span>
            </div>
            <p className="text-sm text-slate-300 mb-4">
              Our system uses zero-knowledge proofs to verify your credentials without revealing any personal data. This means you can prove you own a credential (like KYC verification) without sharing any of the underlying personal information.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-black/30 p-3 rounded-lg border border-emerald-400/20 hover:border-emerald-400/40 transition-colors">
                <div className="flex items-center mb-2">
                  <CircleSlash className="h-4 w-4 text-emerald-400 mr-2" />
                  <h3 className="font-mono text-emerald-400">Privacy-First</h3>
                </div>
                <p className="text-xs text-slate-300">
                  Prove credential ownership without revealing personal data
                </p>
              </div>
              <div className="bg-black/30 p-3 rounded-lg border border-emerald-400/20 hover:border-emerald-400/40 transition-colors">
                <div className="flex items-center mb-2">
                  <Terminal className="h-4 w-4 text-emerald-400 mr-2" />
                  <h3 className="font-mono text-emerald-400">WASM-Powered</h3>
                </div>
                <p className="text-xs text-slate-300">
                  Fast, browser-based ZK proof generation using WebAssembly
                </p>
              </div>
              <div className="bg-black/30 p-3 rounded-lg border border-emerald-400/20 hover:border-emerald-400/40 transition-colors">
                <div className="flex items-center mb-2">
                  <Database className="h-4 w-4 text-emerald-400 mr-2" />
                  <h3 className="font-mono text-emerald-400">On-Chain Verification</h3>
                </div>
                <p className="text-xs text-slate-300">
                  Proofs verified on Substrate blockchain for maximum security
                </p>
              </div>
            </div>
            <div className="p-3 bg-black/40 rounded-lg border border-emerald-400/20 font-mono text-xs text-slate-300 overflow-auto mb-6">
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
          </Card>
        </Container>
      </Section>
      
      {/* Protocol Steps Section */}
      <Section className="py-16 bg-black/30">
        <Container className="max-w-4xl">
          <h2 className="text-2xl font-mono mb-6 text-center">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-purple-500 cyber-glow">
              SYSTEM PROTOCOLS
            </span>
          </h2>
          <div className="bg-black/40 p-6 rounded-xl border border-emerald-400/30 shadow-[0_0_15px_rgba(22,255,177,0.2)]">
            <ol className="text-left space-y-4 mb-8">
              <li className="flex gap-3 bg-black/30 p-3 rounded-lg border border-emerald-400/20">
                <div className="bg-emerald-900/40 text-emerald-400 rounded-full h-6 w-6 flex items-center justify-center shrink-0 border border-emerald-400/30">1</div>
                <div>
                  <p className="text-slate-200 font-mono">CONNECT_WALLET_OR_SOCIAL()</p>
                  <p className="text-xs text-slate-400">Authenticate using blockchain wallet or social account</p>
                </div>
              </li>
              <li className="flex gap-3 bg-black/30 p-3 rounded-lg border border-emerald-400/20">
                <div className="bg-emerald-900/40 text-emerald-400 rounded-full h-6 w-6 flex items-center justify-center shrink-0 border border-emerald-400/30">2</div>
                <div>
                  <p className="text-slate-200 font-mono">RETRIEVE_MULTI_CHAIN_DID()</p>
                  <p className="text-xs text-slate-400">System retrieves your DIDs and Soul-Bound Tokens across chains</p>
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
            
            <div className="flex justify-center">
              <Link href="/login">
                <button className="cyber-button px-8 py-3 shadow-[0_0_25px_rgba(22,255,177,0.3)]">
                  <KeyRound className="inline-block mr-2 h-4 w-4" />
                  INITIALIZE SECURE LOGIN
                </button>
              </Link>
            </div>
          </div>
        </Container>
      </Section>
      
      <div className="border-t border-emerald-400/20 pt-6 mt-6 mb-6 text-center">
        <p className="text-xs text-slate-500 font-mono">
          [SYSTEM: SECURE // MULTI-CHAIN // ENCRYPTED // DECENTRALIZED]
        </p>
      </div>
    </LayoutWrapper>
  );
}
