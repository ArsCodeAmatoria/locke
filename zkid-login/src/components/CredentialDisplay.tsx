import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Award, FileBadge, ShieldCheck } from 'lucide-react';
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
    <div className="space-y-6 max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-blue-500" />
            Identity Credentials
          </CardTitle>
          <CardDescription>
            View your decentralized identity and credentials
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Wallet Account</h3>
            <div className="mt-1 flex items-center gap-2">
              <p className="font-medium">{account.meta.name}</p>
              <p className="text-xs bg-slate-100 px-2 py-1 rounded-full">{account.address.substring(0, 8)}...{account.address.substring(account.address.length - 8)}</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Decentralized ID (DID)</h3>
            <p className="mt-1 font-mono text-sm">{credentials.did}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <Award className="h-4 w-4" />
              Soul-Bound Tokens
            </h3>
            {credentials.sbts.length > 0 ? (
              <div className="mt-2 space-y-2">
                {credentials.sbts.map((sbt) => (
                  <div 
                    key={sbt.id}
                    className="bg-slate-50 p-3 rounded-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileBadge className="h-4 w-4 text-blue-500" />
                        <h4 className="font-medium">{sbt.name}</h4>
                      </div>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                        Soul-Bound
                      </span>
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      <p>Issuer: {sbt.issuer}</p>
                      <p>Issued: {new Date(sbt.issuedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-1 text-sm text-gray-500">No SBTs found for this identity</p>
            )}
          </div>
          
          <div className="pt-2">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-gray-500">Verification Status</h3>
              <VerificationBadge status={credentials.verificationStatus} />
            </div>
            <Button 
              onClick={onRequestProof}
              disabled={credentials.verificationStatus === 'generating'}
              className="w-full"
            >
              {credentials.verificationStatus === 'generating' ? 'Generating Proof...' : 'Generate ZK Proof'}
            </Button>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={onLogout}
          >
            Logout
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

function VerificationBadge({ status }: { status?: string }) {
  switch (status) {
    case 'verified':
      return (
        <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full bg-green-100 text-green-800">
          <CheckCircle className="h-3 w-3" /> Verified
        </span>
      );
    case 'failed':
      return (
        <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full bg-red-100 text-red-800">
          <XCircle className="h-3 w-3" /> Failed
        </span>
      );
    case 'generating':
      return (
        <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full bg-yellow-100 text-yellow-800">
          <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Generating
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-800">
          Unverified
        </span>
      );
  }
} 