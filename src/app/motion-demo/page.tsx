'use client';

import { FadeIn, SlideIn, ScaleIn, CyberGlitch } from '@/components/ui/motion-component';
import { TerminalType, CyberGrid, GlitchReveal, DigitalNoise } from '@/components/ui/advanced-motion';
import { motion } from 'framer-motion';

export default function MotionDemoPage() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="min-h-screen p-8">
      <FadeIn className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 cyber-glow">Framer Motion Components</h1>
      </FadeIn>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-12"
      >
        <SlideIn className="cyber-card p-6 h-full" delay={0.1}>
          <h2 className="text-2xl mb-4 cyber-glow">SlideIn Component</h2>
          <p className="text-muted-foreground">
            This component slides in from the left with a spring animation.
          </p>
          <div className="mt-4">
            <button className="cyber-button mt-4">Spring Animation</button>
          </div>
        </SlideIn>

        <ScaleIn className="cyber-card p-6 h-full" delay={0.2}>
          <h2 className="text-2xl mb-4 cyber-glow">ScaleIn Component</h2>
          <p className="text-muted-foreground">
            This component scales in with a smooth fade effect.
          </p>
          <div className="mt-4">
            <button className="cyber-button mt-4">Scale Effect</button>
          </div>
        </ScaleIn>

        <FadeIn className="cyber-card p-6 h-full" delay={0.3}>
          <h2 className="text-2xl mb-4 cyber-glow">FadeIn Component</h2>
          <p className="text-muted-foreground">
            This component fades in with a slight upward movement.
          </p>
          <div className="mt-4">
            <button className="cyber-button mt-4">Fade In</button>
          </div>
        </FadeIn>

        <CyberGlitch className="cyber-card p-6 h-full" delay={0.4} data-text="CyberGlitch Component">
          <h2 className="text-2xl mb-4">CyberGlitch Component</h2>
          <p className="text-muted-foreground">
            This component combines the cyber glitch effect with fade animation.
          </p>
          <div className="mt-4">
            <button className="cyber-button mt-4">Glitch Effect</button>
          </div>
        </CyberGlitch>
      </motion.div>

      <div className="max-w-4xl mx-auto">
        <div className="hacker-divider"></div>
        
        <FadeIn delay={0.6}>
          <h2 className="text-3xl font-bold mb-6 cyber-glow">Advanced Motion Components</h2>
        </FadeIn>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="cyber-card p-6 cyber-scanline">
            <h3 className="text-xl mb-4 cyber-glow">Terminal Type Effect</h3>
            <TerminalType delay={1.0}>
              {'>'}Initializing cyber system...
            </TerminalType>
            <TerminalType delay={1.5}>
              {'>'}Running neural interface protocols...
            </TerminalType>
            <TerminalType delay={2.0}>
              {'>'}Access granted. Welcome to the matrix.
            </TerminalType>
          </div>
          
          <DigitalNoise className="cyber-card p-6 h-full" delay={0.8}>
            <h3 className="text-xl mb-4 cyber-glow">Digital Noise Effect</h3>
            <p className="text-muted-foreground mb-4">
              This component adds a subtle digital noise effect to its contents.
            </p>
            <button className="cyber-button">Glitchy UI</button>
          </DigitalNoise>
          
          <CyberGrid className="cyber-card p-6 h-[250px]" delay={1.2}>
            <div className="flex items-center justify-center h-full">
              <h3 className="text-xl cyber-glow text-center">Cyber Grid Reveal</h3>
            </div>
          </CyberGrid>
          
          <div className="cyber-card p-6">
            <h3 className="text-xl mb-4 cyber-glow">Glitch Reveal Effect</h3>
            <GlitchReveal delay={1.6}>
              <div className="p-4 bg-muted/50 rounded">
                <p className="text-primary font-bold">ACCESS_CLASSIFIED_DATA</p>
                <p className="text-sm opacity-70">Decryption protocol initiated</p>
              </div>
            </GlitchReveal>
          </div>
        </div>
        
        <div className="hacker-divider"></div>
        
        <FadeIn delay={2.0} className="mt-12">
          <div className="cyber-card p-6 cyber-scanline">
            <h2 className="text-2xl font-bold mb-6 cyber-glow">Combined Effects Demo</h2>
            
            <DigitalNoise>
              <div className="grid grid-cols-3 gap-4">
                {Array.from({ length: 9 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="aspect-square bg-muted rounded flex items-center justify-center overflow-hidden"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 2.2 + i * 0.1, duration: 0.3 }}
                  >
                    <GlitchReveal delay={2.5 + i * 0.1}>
                      <p className="text-center text-primary">NODE_{i+1}</p>
                    </GlitchReveal>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-6">
                <TerminalType delay={3.5}>
                  {'>'}Network nodes connected. System operational.
                </TerminalType>
              </div>
            </DigitalNoise>
          </div>
        </FadeIn>
      </div>
    </div>
  );
} 