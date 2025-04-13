import { MultiChainIdentity } from '@/components/MultiChainIdentity';
import { PageTitle } from '@/components/PageTitle';

export const metadata = {
  title: 'Multi-Chain Identity | zkID Login',
  description: 'Manage your identity across multiple blockchains',
};

export default function MultiChainPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <PageTitle 
        title="Multi-Chain Identity" 
        subtitle="Manage your decentralized identity across multiple blockchains"
      />
      
      <div className="mt-6 flex flex-col gap-6">
        <div className="rounded-lg border bg-slate-50/50 p-6 dark:bg-slate-900/50">
          <h2 className="mb-4 text-lg font-medium">About Multi-Chain Support</h2>
          <p className="text-slate-600 dark:text-slate-300">
            The multi-chain identity system allows you to manage a single identity across multiple blockchains
            including Substrate, Ethereum, Solana, and more. Link accounts from different chains, create
            verifiable credentials, and prove your identity no matter which blockchain you're using.
          </p>
          
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
            <div className="rounded-md bg-white p-3 shadow-sm dark:bg-slate-800">
              <div className="text-center">
                <span className="text-lg font-bold text-emerald-500">Unified Identity</span>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  One identity across all chains
                </p>
              </div>
            </div>
            <div className="rounded-md bg-white p-3 shadow-sm dark:bg-slate-800">
              <div className="text-center">
                <span className="text-lg font-bold text-emerald-500">Cross-Chain Verification</span>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Verify credentials from any chain
                </p>
              </div>
            </div>
            <div className="rounded-md bg-white p-3 shadow-sm dark:bg-slate-800">
              <div className="text-center">
                <span className="text-lg font-bold text-emerald-500">Chain Agnostic</span>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Works with any supported blockchain
                </p>
              </div>
            </div>
            <div className="rounded-md bg-white p-3 shadow-sm dark:bg-slate-800">
              <div className="text-center">
                <span className="text-lg font-bold text-emerald-500">Identity Linking</span>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Link DIDs across multiple chains
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <MultiChainIdentity />
      </div>
    </div>
  );
} 