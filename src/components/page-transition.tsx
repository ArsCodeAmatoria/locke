'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

const variants = {
  hidden: { opacity: 0 },
  enter: { opacity: 1 },
  exit: { opacity: 0 },
};

export default function PageTransition({ children, className = '' }: PageTransitionProps) {
  return (
    <motion.main
      variants={variants}
      initial="hidden"
      animate="enter"
      exit="exit"
      transition={{ type: 'linear', duration: 0.3 }}
      className={className}
    >
      {children}
    </motion.main>
  );
}

// Cyberpunk style page transitions with glitch effect
export function CyberTransition({ children, className = '' }: PageTransitionProps) {
  return (
    <div className="relative">
      {/* Glitch overlay */}
      <motion.div
        className="fixed inset-0 z-50 bg-background pointer-events-none"
        initial={{ opacity: 1 }}
        animate={{ 
          opacity: 0,
          transition: { 
            duration: 0.3,
            ease: [0.33, 1, 0.68, 1],
            delay: 0.1
          }
        }}
        exit={{ 
          opacity: 1,
          transition: { 
            duration: 0.2,
            ease: [0.33, 1, 0.68, 1] 
          }
        }}
      >
        <motion.div
          className="absolute inset-0 grid grid-cols-10"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0, 1, 0],
            transition: { 
              duration: 0.4,
              times: [0, 0.5, 1],
              ease: "easeInOut"
            }
          }}
        >
          {Array.from({ length: 10 }).map((_, i) => (
            <motion.div
              key={i}
              className="h-full bg-primary/20"
              initial={{ scaleY: 0 }}
              animate={{ 
                scaleY: [0, 1, 0],
                transition: { 
                  duration: 0.4,
                  delay: i * 0.04,
                  ease: "easeInOut"
                }
              }}
              style={{ 
                transformOrigin: i % 2 === 0 ? "top" : "bottom",
                opacity: 0.5 - (i * 0.03)
              }}
            />
          ))}
        </motion.div>
      </motion.div>

      {/* Main content */}
      <motion.main
        variants={{
          hidden: { opacity: 0, y: 20 },
          enter: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -20 },
        }}
        initial="hidden"
        animate="enter"
        exit="exit"
        transition={{ duration: 0.4, delay: 0.2 }}
        className={className}
      >
        {children}
      </motion.main>
    </div>
  );
} 