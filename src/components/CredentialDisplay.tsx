import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Award, FileBadge, ShieldCheck, LogOut, Key, Terminal, Fingerprint } from 'lucide-react';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';

interface UserCredentials {
  did: string;
  sbts: Array<{
    id: string;
    name: string;
    issuer: string;
    issuedAt: string;
  }>;
  verificationStatus?: 'verified' | 'unverified' | 'generating' | 'failed';
}

interface CredentialDisplayProps {
  account: InjectedAccountWithMeta;
  credentials: UserCredentials;
  onLogout: () => void;
  onRequestProof: () => void;
}

export function CredentialDisplay({ 
  account, 
  credentials, 
  onLogout,
  onRequestProof 
}: CredentialDisplayProps) {
  return (
    <div className="space-y-4">
      <Card className="cyber-card backdrop-blur-sm">
        <CardHeader className="border-b border-emerald-400/20">
          <CardTitle className="flex items-center gap-2 terminal-text">
            <Fingerprint className="h-5 w-5 text-emerald-400" />
            Decentralized Identity Credentials
          </CardTitle>
          <CardDescription className="text-slate-400">
            Your blockchain-verified identity and credentials
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <div className="p-3 bg-black/30 rounded-md border border-emerald-400/20">
            <h3 className="text-sm font-mono text-slate-400 mb-1 flex items-center">
              <Terminal className="h-3 w-3 mr-1 text-emerald-400" />
              WALLET ACCOUNT
            </h3>
            <div className="flex items-center gap-2">
              <p className="font-mono text-emerald-400">{account.meta.name}</p>
              <div className="bg-black/60 px-2 py-1 rounded-full border border-emerald-400/20">
                <p className="text-xs text-slate-500 font-mono">
                  {account.address.substring(0, 6)}...{account.address.substring(account.address.length - 6)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-3 bg-black/30 rounded-md border border-emerald-400/20">
            <h3 className="text-sm font-mono text-slate-400 mb-1 flex items-center">
              <Fingerprint className="h-3 w-3 mr-1 text-purple-400" />
              DECENTRALIZED ID (DID)
            </h3>
            <p className="font-mono text-xs text-purple-400 break-all">
              {credentials.did}
            </p>
            <div className="mt-1 flex items-center gap-1">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
              <p className="text-[10px] text-slate-500 font-mono">VERIFIED ON-CHAIN</p>
            </div>
          </div>
          
          <div className="p-3 bg-black/30 rounded-md border border-emerald-400/20">
            <h3 className="text-sm font-mono text-slate-400 flex items-center justify-between">
              <span className="flex items-center">
                <Award className="h-3 w-3 mr-1 text-blue-400" />
                SOUL-BOUND TOKENS
              </span>
              <span className="text-[10px] bg-blue-900/40 text-blue-400 px-2 py-0.5 rounded-full border border-blue-400/20">
                NON-TRANSFERABLE
              </span>
            </h3>
            
            {credentials.sbts.length > 0 ? (
              <div className="mt-2 space-y-2">
                {credentials.sbts.map((sbt) => (
                  <div 
                    key={sbt.id}
                    className="bg-black/50 p-2 rounded-md border border-blue-400/20"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileBadge className="h-4 w-4 text-blue-400" />
                        <h4 className="font-mono text-blue-400 text-sm">{sbt.name}</h4>
                      </div>
                    </div>
                    <div className="mt-1 text-xs text-slate-500 font-mono">
                      <p>ISSUER: {sbt.issuer}</p>
                      <p>TIMESTAMP: {new Date(sbt.issuedAt).toLocaleDateString()}</p>
                      <p className="text-[10px] mt-1 text-slate-600">ID: {sbt.id.substring(0, 12)}...</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-1 text-sm text-slate-500 font-mono">
                NO CREDENTIALS FOUND FOR THIS IDENTITY
              </p>
            )}
          </div>
          
          <div className="pt-2">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-mono text-slate-400 flex items-center">
                <ShieldCheck className="h-3 w-3 mr-1 text-emerald-400" />
                ZK PROOF STATUS
              </h3>
              <VerificationBadge status={credentials.verificationStatus} />
            </div>
            
            <button 
              onClick={onRequestProof}
              disabled={credentials.verificationStatus === 'generating'}
              className="cyber-button w-full flex items-center justify-center"
            >
              {credentials.verificationStatus === 'generating' ? (
                <>
                  <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  GENERATING PROOF...
                </>
              ) : (
                <>
                  <Key className="mr-2 h-4 w-4" />
                  GENERATE ZERO-KNOWLEDGE PROOF
                </>
              )}
            </button>
            
            <div className="mt-2 p-2 bg-black/40 rounded border border-emerald-400/10">
              <p className="text-xs text-slate-500 font-mono">
                <span className="text-emerald-400">{`>`}</span> Zero-knowledge proofs verify credentials without revealing personal data
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t border-emerald-400/20 pt-4">
          <button 
            className="w-full bg-black/30 hover:bg-black/50 text-red-400 border border-red-400/20 hover:border-red-400/50 py-2 rounded font-mono text-sm flex items-center justify-center transition-all"
            onClick={onLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            TERMINATE SESSION
          </button>
        </CardFooter>
      </Card>
    </div>
  );
}

function VerificationBadge({ status }: { status?: string }) {
  switch (status) {
    case 'verified':
      return (
        <span className="inline-flex items-center gap-1 text-xs font-mono px-2.5 py-0.5 rounded-full bg-emerald-900/30 text-emerald-400 border border-emerald-400/30">
          <CheckCircle className="h-3 w-3" /> VERIFIED
        </span>
      );
    case 'failed':
      return (
        <span className="inline-flex items-center gap-1 text-xs font-mono px-2.5 py-0.5 rounded-full bg-red-900/30 text-red-400 border border-red-400/30">
          <XCircle className="h-3 w-3" /> FAILED
        </span>
      );
    case 'generating':
      return (
        <span className="inline-flex items-center gap-1 text-xs font-mono px-2.5 py-0.5 rounded-full bg-yellow-900/30 text-yellow-400 border border-yellow-400/30">
          <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          PROCESSING
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 text-xs font-mono px-2.5 py-0.5 rounded-full bg-slate-900/30 text-slate-400 border border-slate-400/30">
          UNVERIFIED
        </span>
      );
  }
} 