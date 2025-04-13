'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { AdvancedZkProver } from '@/lib/advanced-zkp';
import { SubstrateClient } from '@/lib/substrate-client';
import { Spinner } from '@/components/ui/spinner';
import { CheckCircle2, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface VerificationResult {
  verified: boolean;
  message: string;
}

export function CredentialVerify() {
  const [proofInput, setProofInput] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const { toast } = useToast();

  const handleVerify = async () => {
    if (!proofInput.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a valid proof string',
        variant: 'destructive',
      });
      return;
    }

    setVerifying(true);
    setResult(null);

    try {
      let proofData;
      try {
        proofData = JSON.parse(proofInput);
      } catch (e) {
        throw new Error('Invalid proof format. Please provide a valid JSON proof string.');
      }

      // Initialize ZK prover
      const zkProver = AdvancedZkProver.getInstance();
      await zkProver.initialize();
      
      // Connect to Substrate
      const substrateClient = SubstrateClient.getInstance();
      await substrateClient.connect();
      
      // Verify the proof
      const isVerified = await zkProver.verifyProof(proofData.proof, proofData.publicInputs);
      
      setResult({
        verified: isVerified,
        message: isVerified 
          ? 'Credential verified successfully! The proof is valid.' 
          : 'Verification failed. The provided proof is invalid.',
      });
    } catch (error) {
      console.error('Verification error:', error);
      toast({
        title: 'Verification Error',
        description: error instanceof Error ? error.message : 'Failed to verify the credential',
        variant: 'destructive',
      });
      setResult({
        verified: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred during verification',
      });
    } finally {
      setVerifying(false);
    }
  };

  return (
    <Card className="p-6 w-full max-w-3xl mx-auto">
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="proof">Credential Proof</Label>
          <textarea
            id="proof"
            placeholder="Paste the proof JSON here..."
            className="h-32 font-mono text-sm w-full rounded-md border border-input bg-background px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={proofInput}
            onChange={(e) => setProofInput(e.target.value)}
          />
        </div>

        <Button 
          onClick={handleVerify} 
          disabled={verifying || !proofInput.trim()}
          className="w-full"
        >
          {verifying ? <Spinner size="sm" className="mr-2" /> : null}
          {verifying ? 'Verifying...' : 'Verify Credential'}
        </Button>

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 border rounded-md ${
              result.verified 
                ? 'bg-green-50 border-green-200 text-green-800' 
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            <div className="flex items-center">
              {result.verified ? (
                <CheckCircle2 className="h-5 w-5 mr-2 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 mr-2 text-red-600" />
              )}
              <p>{result.message}</p>
            </div>
          </motion.div>
        )}
      </div>
    </Card>
  );
} 