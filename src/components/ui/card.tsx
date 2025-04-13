'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { CyberGlitch } from './motion-component';
import { DigitalNoise } from './advanced-motion';

interface CardProps {
  children: ReactNode;
  className?: string;
  glowEffect?: boolean;
  scanlineEffect?: boolean;
  glitchEffect?: boolean;
  noiseEffect?: boolean;
  animated?: boolean;
  delay?: number;
  title?: string;
  titleGlow?: boolean;
}

export function Card({
  children,
  className = '',
  glowEffect = false,
  scanlineEffect = false,
  glitchEffect = false,
  noiseEffect = false,
  animated = false,
  delay = 0,
  title,
  titleGlow = true,
}: CardProps) {
  const content = (
    <div className={`cyber-card p-6 ${className}`}>
      {title && (
        <h3 className={`text-xl mb-4 ${titleGlow ? 'cyber-glow' : ''}`}>{title}</h3>
      )}
      {children}
    </div>
  );

  // Apply effects in a specific order
  let wrappedContent = content;

  if (scanlineEffect) {
    wrappedContent = <div className="cyber-scanline">{wrappedContent}</div>;
  }

  if (glitchEffect) {
    wrappedContent = (
      <CyberGlitch delay={delay} data-text={title}>
        {wrappedContent}
      </CyberGlitch>
    );
  }

  if (noiseEffect) {
    wrappedContent = (
      <DigitalNoise delay={delay}>
        {wrappedContent}
      </DigitalNoise>
    );
  }

  if (animated) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
      >
        {wrappedContent}
      </motion.div>
    );
  }

  return wrappedContent;
}

// Helper components for layout
export function CardGrid({ 
  children, 
  className = '', 
  columns = { default: 1, md: 2, lg: 3 }
}: { 
  children: ReactNode; 
  className?: string;
  columns?: { 
    default: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
}) {
  // Build the responsive grid class
  const gridCols = [
    `grid-cols-${columns.default}`,
    columns.sm && `sm:grid-cols-${columns.sm}`,
    columns.md && `md:grid-cols-${columns.md}`,
    columns.lg && `lg:grid-cols-${columns.lg}`,
    columns.xl && `xl:grid-cols-${columns.xl}`,
  ].filter(Boolean).join(' ');

  return (
    <div className={`grid ${gridCols} gap-6 ${className}`}>
      {children}
    </div>
  );
}

export function CardContainer({ 
  children, 
  className = '',
  maxWidth = '4xl', // xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, 6xl, 7xl
  centered = true
}: { 
  children: ReactNode; 
  className?: string;
  maxWidth?: string;
  centered?: boolean;
}) {
  return (
    <div className={`${centered ? 'mx-auto' : ''} max-w-${maxWidth} ${className}`}>
      {children}
    </div>
  );
}

// Section divider component
export function SectionDivider({ 
  label, 
  className = '' 
}: { 
  label?: string;
  className?: string;
}) {
  return (
    <div className={`hacker-divider my-8 ${className}`}>
      {label && (
        <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
          bg-background px-2 text-sm text-primary-foreground">
          {label}
        </span>
      )}
    </div>
  );
}
