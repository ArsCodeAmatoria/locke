'use client';

import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: number;
  color?: string;
  className?: string;
}

export const LoadingSpinner = ({ 
  size = 40, 
  color = 'hsl(var(--primary))', 
  className = '' 
}: LoadingSpinnerProps) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <motion.div
        className="relative"
        style={{ width: size, height: size }}
      >
        {/* Outer ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-2"
          style={{ borderColor: color }}
          animate={{ rotate: 360 }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {/* Middle ring */}
        <motion.div
          className="absolute rounded-full border-2"
          style={{ 
            borderColor: color,
            width: '70%', 
            height: '70%', 
            top: '15%', 
            left: '15%',
            borderTopColor: 'transparent'
          }}
          animate={{ rotate: -360 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {/* Inner dot pulse */}
        <motion.div
          className="absolute rounded-full"
          style={{ 
            backgroundColor: color,
            width: '30%', 
            height: '30%', 
            top: '35%', 
            left: '35%'
          }}
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>
    </div>
  );
};

export const CyberLoadingBar = ({ 
  width = 200,
  height = 6,
  color = 'hsl(var(--primary))',
  backgroundColor = 'hsl(var(--muted))',
  className = ''
}: {
  width?: number;
  height?: number;
  color?: string;
  backgroundColor?: string;
  className?: string;
}) => {
  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      style={{ width, height, backgroundColor }}
    >
      <motion.div
        className="absolute h-full"
        style={{ backgroundColor: color }}
        initial={{ width: 0 }}
        animate={{ 
          width: ['0%', '100%', '0%'],
          left: ['0%', '0%', '100%']
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Glitch effect */}
      <motion.div
        className="absolute h-full"
        style={{ 
          backgroundColor: color,
          mixBlendMode: 'overlay',
          opacity: 0.5
        }}
        initial={{ width: 0 }}
        animate={{ 
          width: ['0%', '5%', '10%', '5%', '0%'],
          left: ['10%', '30%', '50%', '70%', '90%']
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </div>
  );
}; 