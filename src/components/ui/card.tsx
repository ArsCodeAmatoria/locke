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
  borderGlow?: boolean;
  hoverable?: boolean;
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
  borderGlow = true,
  hoverable = false,
}: CardProps) {
  const cardClass = `cyber-card p-6 ${borderGlow ? 'shadow-[0_0_15px_rgba(22,255,177,0.15)]' : ''} 
    ${hoverable ? 'transition-all duration-300 hover:transform hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(22,255,177,0.25)]' : ''} 
    ${className}`;
  
  const content = (
    <div className={cardClass}>
      {title && (
        <h3 className={`text-xl font-bold mb-4 ${titleGlow ? 'cyber-glow' : ''}`}>
          {titleGlow ? title : <span className="text-white/90">{title}</span>}
        </h3>
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
        whileHover={hoverable ? { y: -5 } : {}}
      >
        {wrappedContent}
      </motion.div>
    );
  }

  return wrappedContent;
}

// New Card Components for WalletLogin
export function CardHeader({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`px-6 py-4 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h3 className={`text-xl font-bold ${className}`}>
      {children}
    </h3>
  );
}

export function CardDescription({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={`text-sm text-slate-400 mt-1 ${className}`}>
      {children}
    </p>
  );
}

export function CardContent({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`px-6 py-4 ${className}`}>
      {children}
    </div>
  );
}

export function CardFooter({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`px-6 py-4 ${className}`}>
      {children}
    </div>
  );
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
  let gridColsClass = `grid-cols-${columns.default}`;
  
  if (columns.sm) {
    gridColsClass += ` sm:grid-cols-${columns.sm}`;
  }
  
  if (columns.md) {
    gridColsClass += ` md:grid-cols-${columns.md}`;
  }
  
  if (columns.lg) {
    gridColsClass += ` lg:grid-cols-${columns.lg}`;
  }
  
  if (columns.xl) {
    gridColsClass += ` xl:grid-cols-${columns.xl}`;
  }

  return (
    <div className={`grid ${gridColsClass} gap-6 ${className}`}>
      {children}
    </div>
  );
}

export function CardContainer({ 
  children, 
  className = '',
  maxWidth = '4xl',
  centered = true
}: { 
  children: ReactNode; 
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'none';
  centered?: boolean;
}) {
  // Get the correct max-width class
  const maxWidthClass = maxWidth === 'none' ? '' : `max-w-${maxWidth}`;
  
  return (
    <div className={`${centered ? 'mx-auto' : ''} ${maxWidthClass} ${className}`}>
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
          bg-[#0e1015] px-3 py-1 rounded text-sm text-[#16ffb1] font-mono">
          {label}
        </span>
      )}
    </div>
  );
}
