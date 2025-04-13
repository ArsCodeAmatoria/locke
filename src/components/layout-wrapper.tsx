'use client';

import { ReactNode } from 'react';
import { CyberTransition } from './page-transition';

interface LayoutWrapperProps {
  children: ReactNode;
  className?: string;
  centered?: boolean;
  maxWidth?: string;
  withPadding?: boolean;
  withTransition?: boolean;
}

export default function LayoutWrapper({
  children,
  className = '',
  centered = true,
  maxWidth = '6xl',
  withPadding = true,
  withTransition = true,
}: LayoutWrapperProps) {
  const content = (
    <main 
      className={`
        ${withPadding ? 'px-4 py-8 sm:px-6 sm:py-10 md:py-12' : ''}
        ${centered ? 'mx-auto' : ''}
        ${`max-w-${maxWidth}`}
        ${className}
      `}
    >
      {children}
    </main>
  );

  if (withTransition) {
    return <CyberTransition>{content}</CyberTransition>;
  }

  return content;
}

export function Section({
  children,
  className = '',
  centered = true,
  id,
  title,
  titleClassName = '',
  titleSize = 'large',
  withGlow = true,
}: {
  children: ReactNode;
  className?: string;
  centered?: boolean;
  id?: string;
  title?: string;
  titleClassName?: string;
  titleSize?: 'small' | 'medium' | 'large' | 'xl';
  withGlow?: boolean;
}) {
  const titleSizeClasses = {
    small: 'text-xl sm:text-2xl',
    medium: 'text-2xl sm:text-3xl',
    large: 'text-3xl sm:text-4xl',
    xl: 'text-4xl sm:text-5xl',
  };

  return (
    <section 
      id={id} 
      className={`mb-12 md:mb-16 ${className}`}
    >
      {title && (
        <h2 
          className={`
            font-bold mb-6 md:mb-8
            ${titleSizeClasses[titleSize]}
            ${withGlow ? 'cyber-glow' : ''}
            ${centered ? 'text-center' : ''}
            ${titleClassName}
          `}
        >
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}

export function Container({
  children,
  className = '',
  maxWidth = '4xl',
  centered = true,
}: {
  children: ReactNode;
  className?: string;
  maxWidth?: string;
  centered?: boolean;
}) {
  return (
    <div 
      className={`
        ${centered ? 'mx-auto' : ''}
        ${`max-w-${maxWidth}`}
        ${className}
      `}
    >
      {children}
    </div>
  );
} 