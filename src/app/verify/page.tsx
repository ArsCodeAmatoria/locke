import { Metadata } from 'next';
import { CredentialVerify } from '@/components/CredentialVerify';
import { PageTitle } from '@/components/PageTitle';

export const metadata: Metadata = {
  title: 'Verify Identity | zkID Login',
  description: 'Verify your identity with trusted real-world providers to obtain verifiable credentials',
};

export default function VerifyPage() {
  return (
    <div className="container max-w-5xl mx-auto px-4 py-8">
      <PageTitle 
        title="Verify Identity" 
        subtitle="Connect with trusted identity providers to verify your credentials"
        className="mb-10"
      />
      
      <CredentialVerify />
    </div>
  );
} 