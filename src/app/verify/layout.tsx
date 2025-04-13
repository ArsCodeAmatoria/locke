import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Verify Identity | zkID Login',
  description: 'Verify your identity with trusted real-world providers to obtain verifiable credentials',
};

export default function VerifyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 