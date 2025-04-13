'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AdvancedMotionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

// Terminal typing effect component
export const TerminalType = ({ 
  children, 
  className = '', 
  delay = 0 
}: AdvancedMotionProps) => {
  const text = typeof children === 'string' ? children : String(children);
  const characters = Array.from(text);
  
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.03, delayChildren: delay }
    })
  };
  
  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200
      }
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200
      }
    }
  };
  
  return (
    <motion.div
      className={`terminal-text ${className}`}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {characters.map((character, index) => (
        <motion.span key={index} variants={child}>
          {character === ' ' ? '\u00A0' : character}
        </motion.span>
      ))}
    </motion.div>
  );
};

// Cyberpunk inspired grid component that reveals content with a grid-like animation
export const CyberGrid = ({ children, className = '', delay = 0 }: AdvancedMotionProps) => {
  return (
    <motion.div
      className={`relative ${className}`}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { delay, duration: 0.5 } }
      }}
    >
      <motion.div
        className="absolute inset-0 grid grid-cols-8 grid-rows-8 z-0"
        initial="hidden"
        animate="visible"
      >
        {Array.from({ length: 64 }).map((_, i) => (
          <motion.div
            key={i}
            className="border border-primary/20 bg-background/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.2,
              delay: delay + (i % 8) * 0.05 + Math.floor(i / 8) * 0.05
            }}
          />
        ))}
      </motion.div>
      <motion.div
        className="relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.8, duration: 0.5 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

// Glitchy text reveal component
export const GlitchReveal = ({ children, className = '', delay = 0 }: AdvancedMotionProps) => {
  return (
    <div className={`overflow-hidden relative ${className}`}>
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{
          type: "spring",
          damping: 12,
          stiffness: 100,
          delay
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0.5, 1, 0, 1, 0.5, 1] }}
          transition={{
            duration: 0.3,
            times: [0, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 1],
            delay: delay + 0.1
          }}
          className="absolute inset-0 bg-primary/20 z-[-1]"
        />
        <motion.div
          initial={{ x: -10 }}
          animate={{ x: [5, -5, 0, -2, 0] }}
          transition={{
            duration: 0.4,
            times: [0, 0.2, 0.4, 0.6, 1],
            delay: delay + 0.2
          }}
        >
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
};

// Digital noise/static effect component
export const DigitalNoise = ({ children, className = '', delay = 0 }: AdvancedMotionProps) => {
  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay }}
    >
      <motion.div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize: 'cover',
          mixBlendMode: 'overlay',
          opacity: 0.1
        }}
        animate={{
          opacity: [0.1, 0.15, 0.1, 0.12, 0.1]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatType: 'mirror'
        }}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}; 