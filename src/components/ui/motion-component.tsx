import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface MotionContainerProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export const FadeIn = ({ children, className = '', delay = 0 }: MotionContainerProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const SlideIn = ({ children, className = '', delay = 0 }: MotionContainerProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ 
        type: "spring", 
        stiffness: 100, 
        damping: 15,
        delay: delay 
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const ScaleIn = ({ children, className = '', delay = 0 }: MotionContainerProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ 
        duration: 0.5,
        delay: delay 
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const CyberGlitch = ({ children, className = '', delay = 0 }: MotionContainerProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, delay }}
      className={`cyber-glitch ${className}`}
      data-text={typeof children === 'string' ? children : undefined}
    >
      {children}
    </motion.div>
  );
}; 