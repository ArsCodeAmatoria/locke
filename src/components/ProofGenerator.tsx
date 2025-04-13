import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Loader2, ShieldCheck, CheckCircle, XCircle, Lock } from 'lucide-react';
import { toast } from 'sonner';

interface ProofGeneratorProps {
  did: string;
  onProofGenerated: (status: 'verified' | 'failed') => void;
  onClose: () => void;
}

// This is a simulated component as the actual WASM proof generation
// would be implemented separately
export function ProofGenerator({ did, onProofGenerated, onClose }: ProofGeneratorProps) {
  const [status, setStatus] = useState<'idle' | 'generating' | 'verifying' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  
  const generateProof = async () => {
    try {
      setStatus('generating');
      
      // Simulate proof generation progress
      for (let i = 0; i <= 100; i += 10) {
        setProgress(i);
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      
      setStatus('verifying');
      
      // Simulate verification
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, randomly succeed or fail (90% success rate)
      const isSuccess = Math.random() < 0.9;
      
      if (isSuccess) {
        setStatus('success');
        onProofGenerated('verified');
        toast.success('ZK proof successfully verified!');
      } else {
        setStatus('error');
        onProofGenerated('failed');
        toast.error('ZK proof verification failed');
      }
      
    } catch (error) {
      setStatus('error');
      onProofGenerated('failed');
      toast.error('Error generating ZK proof');
    }
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-5 w-5" />
          Zero-Knowledge Proof
        </CardTitle>
        <CardDescription>
          Generate a ZK proof to verify your credentials without revealing data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {status === 'idle' && (
            <div className="bg-slate-50 p-4 rounded-lg text-center">
              <Lock className="h-12 w-12 mx-auto mb-3 text-slate-400" />
              <p className="text-sm text-slate-600 mb-4">
                A zero-knowledge proof allows you to prove ownership of your credentials
                without revealing any personal information.
              </p>
              <Button onClick={generateProof} className="w-full">
                Generate ZK Proof
              </Button>
            </div>
          )}
          
          {status === 'generating' && (
            <div className="space-y-4">
              <div className="flex items-center justify-center mb-4">
                <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
              </div>
              <p className="text-center text-sm font-medium">Generating ZK Proof...</p>
              <div className="w-full bg-slate-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-500 h-2.5 rounded-full transition-all duration-300" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-center text-xs text-slate-500">Please wait while we generate your proof</p>
            </div>
          )}
          
          {status === 'verifying' && (
            <div className="space-y-4">
              <div className="flex items-center justify-center mb-4">
                <ShieldCheck className="h-12 w-12 text-amber-500 animate-pulse" />
              </div>
              <p className="text-center font-medium">Verifying Proof</p>
              <p className="text-center text-sm text-slate-500">
                Verifying your credential proof on the blockchain...
              </p>
            </div>
          )}
          
          {status === 'success' && (
            <div className="space-y-4">
              <div className="flex items-center justify-center mb-4">
                <div className="rounded-full bg-green-100 p-3">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
              </div>
              <p className="text-center font-medium text-green-600">Proof Verified!</p>
              <p className="text-center text-sm text-slate-600">
                Your credentials have been verified without revealing your personal data.
              </p>
            </div>
          )}
          
          {status === 'error' && (
            <div className="space-y-4">
              <div className="flex items-center justify-center mb-4">
                <div className="rounded-full bg-red-100 p-3">
                  <XCircle className="h-10 w-10 text-red-600" />
                </div>
              </div>
              <p className="text-center font-medium text-red-600">Verification Failed</p>
              <p className="text-center text-sm text-slate-600">
                There was an issue verifying your credentials. Please try again.
              </p>
              <Button 
                variant="outline" 
                onClick={generateProof} 
                className="w-full"
              >
                Retry
              </Button>
            </div>
          )}
        </div>
      </CardContent>
      {(status === 'success' || status === 'error') && (
        <CardFooter>
          <Button 
            variant="ghost" 
            onClick={onClose} 
            className="w-full"
          >
            Close
          </Button>
        </CardFooter>
      )}
    </Card>
  );
} 