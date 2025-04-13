import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, Shield, Lock, FileBadge, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="container mx-auto py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">zkID Login</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Decentralized identity verification with zero-knowledge proofs for privacy-preserving authentication
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-blue-500" />
                Polkadot Wallet Login
              </CardTitle>
              <CardDescription>
                Secure authentication with your existing Polkadot wallet
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">
                Connect using the Polkadot.js browser extension for seamless and secure authentication without sharing your private keys.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-500" />
                Decentralized Identity
              </CardTitle>
              <CardDescription>
                Your identity stored on Substrate blockchain
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">
                Your Decentralized Identifier (DID) is securely stored on the blockchain, giving you full control over your digital identity.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileBadge className="h-5 w-5 text-purple-500" />
                Soul-Bound Tokens
              </CardTitle>
              <CardDescription>
                Non-transferable credentials as SBTs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">
                Your credentials are issued as Soul-Bound Tokens (SBTs), which are permanently linked to your identity and cannot be transferred.
              </p>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2 lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-amber-500" />
                Zero-Knowledge Proofs
              </CardTitle>
              <CardDescription>
                Prove ownership without revealing sensitive data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">
                Our system uses zero-knowledge proofs to verify your credentials without revealing any personal data. This means you can prove you own a credential (like KYC verification) without sharing any of the underlying personal information.
              </p>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-100 p-3 rounded-lg">
                  <h3 className="font-medium mb-1">Privacy-First</h3>
                  <p className="text-xs text-slate-600">
                    Prove credential ownership without revealing the credential's contents
                  </p>
                </div>
                <div className="bg-slate-100 p-3 rounded-lg">
                  <h3 className="font-medium mb-1">WASM-Powered</h3>
                  <p className="text-xs text-slate-600">
                    Fast, browser-based ZK proof generation using WebAssembly
                  </p>
                </div>
                <div className="bg-slate-100 p-3 rounded-lg">
                  <h3 className="font-medium mb-1">On-Chain Verification</h3>
                  <p className="text-xs text-slate-600">
                    Proofs verified on Substrate blockchain for maximum security
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/login" className="w-full">
                <Button className="w-full">
                  Try zkID Login
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
        
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">How It Works</h2>
          <ol className="text-left space-y-4 text-sm text-slate-600 mb-8">
            <li className="flex gap-3">
              <div className="bg-blue-100 text-blue-700 rounded-full h-6 w-6 flex items-center justify-center shrink-0">1</div>
              <p>Connect your Polkadot wallet to authenticate your blockchain address</p>
            </li>
            <li className="flex gap-3">
              <div className="bg-blue-100 text-blue-700 rounded-full h-6 w-6 flex items-center justify-center shrink-0">2</div>
              <p>The app retrieves your DID and any Soul-Bound Tokens (SBTs) from the Substrate chain</p>
            </li>
            <li className="flex gap-3">
              <div className="bg-blue-100 text-blue-700 rounded-full h-6 w-6 flex items-center justify-center shrink-0">3</div>
              <p>Generate a zero-knowledge proof to verify credential ownership without revealing private data</p>
            </li>
            <li className="flex gap-3">
              <div className="bg-blue-100 text-blue-700 rounded-full h-6 w-6 flex items-center justify-center shrink-0">4</div>
              <p>The proof is verified on-chain and grants you access to services requiring those credentials</p>
            </li>
          </ol>
          
          <Link href="/login">
            <Button size="lg">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
