import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Loader2, ShieldCheck, CheckCircle, XCircle, Lock, Terminal, Code, FileCode, Cpu, FileWarning, Shield } from 'lucide-react';
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
  const [logs, setLogs] = useState<string[]>([]);
  
  const addLog = (message: string) => {
    setLogs(prev => [...prev, message]);
  };
  
  const generateProof = async () => {
    try {
      setStatus('generating');
      addLog('Initializing zero-knowledge circuit...');
      
      // Simulate proof generation progress
      for (let i = 0; i <= 100; i += 5) {
        setProgress(i);
        
        if (i === 10) addLog('Loading WASM module...');
        if (i === 25) addLog('Building circuit constraints...');
        if (i === 40) addLog('Generating witness...');
        if (i === 55) addLog('Computing proof points...');
        if (i === 70) addLog('Applying zk-SNARK transformation...');
        if (i === 85) addLog('Finalizing cryptographic proof...');
        if (i === 95) addLog('Preparing verification key...');
        
        await new Promise(resolve => setTimeout(resolve, 180));
      }
      
      addLog('Proof generated successfully.');
      addLog('Submitting to verification service...');
      
      setStatus('verifying');
      
      // Simulate verification
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, randomly succeed or fail (90% success rate)
      const isSuccess = Math.random() < 0.9;
      
      if (isSuccess) {
        addLog('Verification successful!');
        setStatus('success');
        onProofGenerated('verified');
        toast.success('ZK proof successfully verified!');
      } else {
        addLog('ERROR: Verification failed - invalid proof structure');
        setStatus('error');
        onProofGenerated('failed');
        toast.error('ZK proof verification failed');
      }
      
    } catch (error) {
      addLog('ERROR: Proof generation failed');
      setStatus('error');
      onProofGenerated('failed');
      toast.error('Error generating ZK proof');
    }
  };
  
  return (
    <Card className="cyber-card border-2 backdrop-blur-lg">
      <CardHeader className="border-b border-emerald-400/30">
        <CardTitle className="flex items-center gap-2 terminal-text">
          <FileCode className="h-5 w-5 text-emerald-400" />
          Zero-Knowledge Proof Generator
        </CardTitle>
        <CardDescription className="text-slate-400">
          Cryptographic proof verification without data exposure
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          {status === 'idle' && (
            <div className="bg-black/50 p-4 rounded-md text-center border border-emerald-400/20">
              <div className="inline-block p-3 rounded-full bg-emerald-900/20 border border-emerald-400/30 mb-4">
                <Lock className="h-10 w-10 text-emerald-400" />
              </div>
              <p className="text-sm text-slate-300 font-mono mb-4 leading-relaxed">
                A zero-knowledge proof allows you to prove ownership of your credentials
                without revealing any personal information or credential contents.
              </p>
              
              <div className="p-2 mb-4 bg-black/40 rounded border border-emerald-400/10 text-left">
                <div className="flex items-center gap-2 mb-1">
                  <Shield className="h-3 w-3 text-emerald-400" />
                  <p className="text-xs text-emerald-400 font-mono">CREDENTIAL: <span className="text-slate-400">{did.substring(0, 16)}...</span></p>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="h-3 w-3 text-emerald-400" />
                  <p className="text-xs text-emerald-400 font-mono">PRIVACY: <span className="text-slate-400">MAXIMUM</span></p>
                </div>
              </div>
              
              <button onClick={generateProof} className="cyber-button w-full">
                <Terminal className="mr-2 h-4 w-4" />
                INITIALIZE PROOF GENERATION
              </button>
            </div>
          )}
          
          {(status === 'generating' || status === 'verifying') && (
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                {status === 'generating' ? (
                  <div className="relative">
                    <Cpu className="h-16 w-16 text-emerald-400 animate-pulse" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-2 w-2 bg-emerald-400 rounded-full animate-ping"></div>
                    </div>
                  </div>
                ) : (
                  <ShieldCheck className="h-16 w-16 text-purple-400 animate-pulse" />
                )}
              </div>
              
              <div className="text-center">
                <p className="text-sm font-mono text-emerald-400 mb-1">
                  {status === 'generating' ? 'GENERATING ZK PROOF' : 'VERIFYING PROOF'}
                </p>
                <p className="text-xs text-slate-400">
                  {status === 'generating' 
                    ? 'Computing cryptographic proof in browser using WASM' 
                    : 'Verifying proof validity on Substrate chain'}
                </p>
              </div>
              
              {status === 'generating' && (
                <div className="w-full bg-black/60 rounded-full h-2 mb-4 border border-emerald-400/20">
                  <div 
                    className="bg-gradient-to-r from-emerald-400 to-purple-500 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              )}
              
              <div className="mt-2 p-2 bg-black/60 rounded-md border border-emerald-400/20 font-mono text-xs max-h-48 overflow-auto custom-scrollbar">
                <div className="space-y-1">
                  {logs.map((log, index) => (
                    <div key={index} className="flex">
                      <span className="text-emerald-400 mr-2">{`>`}</span>
                      <span className={log.includes('ERROR') ? 'text-red-400' : 'text-slate-300'}>
                        {log}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {status === 'success' && (
            <div className="space-y-4 text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="p-4 rounded-full bg-emerald-900/20 border-2 border-emerald-400">
                  <CheckCircle className="h-14 w-14 text-emerald-400" />
                </div>
              </div>
              <p className="text-lg font-mono text-emerald-400 font-bold">PROOF VERIFIED</p>
              <p className="text-sm text-slate-300">
                Your credentials have been cryptographically verified without revealing your private data.
              </p>
              
              <div className="p-3 bg-black/50 rounded-md border border-emerald-400/30 mt-4 text-left">
                <p className="text-xs font-mono mb-2 text-emerald-400">VERIFICATION DETAILS:</p>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="text-slate-400">Timestamp:</div>
                  <div className="text-emerald-300">{new Date().toISOString()}</div>
                  <div className="text-slate-400">Status:</div>
                  <div className="text-emerald-300">VALID</div>
                  <div className="text-slate-400">Verified by:</div>
                  <div className="text-emerald-300">Substrate Chain</div>
                  <div className="text-slate-400">Protocol:</div>
                  <div className="text-emerald-300">zk-SNARK</div>
                </div>
              </div>
            </div>
          )}
          
          {status === 'error' && (
            <div className="space-y-4 text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="p-4 rounded-full bg-red-900/20 border-2 border-red-400">
                  <FileWarning className="h-14 w-14 text-red-400" />
                </div>
              </div>
              <p className="text-lg font-mono text-red-400 font-bold">VERIFICATION FAILED</p>
              <p className="text-sm text-slate-300">
                There was an issue verifying your cryptographic credentials.
              </p>
              
              <div className="p-3 bg-black/50 rounded-md border border-red-400/30 mt-4 text-left">
                <p className="text-xs font-mono mb-2 text-red-400">ERROR DETAILS:</p>
                <div className="text-xs font-mono text-slate-400">
                  <p>Proof verification failed with code: 0x4E56</p>
                  <p className="mt-1">Possible causes:</p>
                  <ul className="list-disc pl-4 mt-1 space-y-1 text-slate-500">
                    <li>Invalid proof structure</li>
                    <li>Circuit constraints not satisfied</li>
                    <li>Blockchain verification rejected</li>
                  </ul>
                </div>
              </div>
              
              <button 
                onClick={generateProof} 
                className="mt-4 w-full bg-black/40 hover:bg-black/60 text-red-400 border border-red-400/30 py-2 px-4 rounded font-mono text-sm"
              >
                RETRY PROOF GENERATION
              </button>
            </div>
          )}
        </div>
      </CardContent>
      {(status === 'success' || status === 'error') && (
        <CardFooter className="border-t border-emerald-400/20 pt-4">
          <button 
            onClick={onClose} 
            className="w-full text-slate-400 bg-black/30 hover:bg-black/50 border border-slate-500/20 py-2 rounded font-mono text-sm"
          >
            CLOSE TERMINAL
          </button>
        </CardFooter>
      )}
    </Card>
  );
} 