'use client';

import { Metadata } from 'next';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Spinner } from '@/components/ui/spinner';
import { CheckCircle2, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { PageTitle } from '@/components/PageTitle';

// Define the type for verification results
interface VerificationResult {
  verified: boolean;
  message: string;
}

// Metadata for the page
export const metadata = {
  title: 'Verify Identity | zkID Login',
  description: 'Verify your identity with trusted real-world providers to obtain verifiable credentials',
};

export default function VerifyPage() {
  const [proofInput, setProofInput] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const { toast } = useToast();

  // Mock verification function
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
      // Simulate verification process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Parse the input
      let isValid = false;
      try {
        const proofData = JSON.parse(proofInput);
        if (proofData && proofData.proof && proofData.publicInputs) {
          isValid = Math.random() > 0.3; // 70% chance of success for demo
        }
      } catch (e) {
        throw new Error('Invalid proof format. Please provide a valid JSON proof string.');
      }
      
      setResult({
        verified: isValid,
        message: isValid 
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
    <div className="container max-w-5xl mx-auto px-4 py-8">
      <PageTitle 
        title="Verify Identity" 
        subtitle="Connect with trusted identity providers to verify your credentials"
        className="mb-10"
      />
      
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
    </div>
  );
} 