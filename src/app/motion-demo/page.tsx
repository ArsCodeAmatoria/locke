'use client';

import { FadeIn, SlideIn, ScaleIn, CyberGlitch } from '@/components/ui/motion-component';
import { TerminalType, CyberGrid, GlitchReveal, DigitalNoise } from '@/components/ui/advanced-motion';
import { LoadingSpinner, CyberLoadingBar } from '@/components/ui/loading-spinner';
import { motion } from 'framer-motion';
import LayoutWrapper, { Section, Container } from '@/components/layout-wrapper';
import { Card, CardGrid, SectionDivider } from '@/components/ui/card';

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
    <LayoutWrapper>
      <Section title="Framer Motion Components" centered>
        <Container>
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
          >
            <CardGrid columns={{ default: 1, md: 2 }}>
              <Card 
                title="SlideIn Component" 
                scanlineEffect
                animated
                delay={0.1}
              >
                <p className="text-muted-foreground mb-4">
                  This component slides in from the left with a spring animation.
                </p>
                <button className="cyber-button">Spring Animation</button>
              </Card>

              <Card 
                title="ScaleIn Component" 
                scanlineEffect
                animated
                delay={0.2}
              >
                <p className="text-muted-foreground mb-4">
                  This component scales in with a smooth fade effect.
                </p>
                <button className="cyber-button">Scale Effect</button>
              </Card>

              <Card 
                title="FadeIn Component"
                scanlineEffect 
                animated
                delay={0.3}
              >
                <p className="text-muted-foreground mb-4">
                  This component fades in with a slight upward movement.
                </p>
                <button className="cyber-button">Fade In</button>
              </Card>

              <Card 
                title="CyberGlitch Component"
                glitchEffect
                animated
                delay={0.4}
              >
                <p className="text-muted-foreground mb-4">
                  This component combines the cyber glitch effect with fade animation.
                </p>
                <button className="cyber-button">Glitch Effect</button>
              </Card>
            </CardGrid>
          </motion.div>
        </Container>
      </Section>

      <SectionDivider />
        
      <Section title="Advanced Motion Components" centered>
        <Container>
          <CardGrid columns={{ default: 1, md: 2 }}>
            <Card 
              title="Terminal Type Effect" 
              scanlineEffect
              animated
              delay={0.6}
            >
              <TerminalType delay={1.0}>
                {'>'}Initializing cyber system...
              </TerminalType>
              <TerminalType delay={1.5}>
                {'>'}Running neural interface protocols...
              </TerminalType>
              <TerminalType delay={2.0}>
                {'>'}Access granted. Welcome to the matrix.
              </TerminalType>
            </Card>
            
            <Card 
              title="Digital Noise Effect" 
              noiseEffect
              animated
              delay={0.8}
            >
              <p className="text-muted-foreground mb-4">
                This component adds a subtle digital noise effect to its contents.
              </p>
              <button className="cyber-button">Glitchy UI</button>
            </Card>
            
            <Card 
              title="Cyber Grid Reveal" 
              animated
              delay={1.2}
              className="h-[250px] flex items-center justify-center"
            >
              <CyberGrid className="w-full h-full flex items-center justify-center">
                <h3 className="text-xl cyber-glow text-center">Grid Animation</h3>
              </CyberGrid>
            </Card>
            
            <Card 
              title="Glitch Reveal Effect"
              animated
              delay={1.4}
            >
              <GlitchReveal delay={1.6}>
                <div className="p-4 bg-muted/50 rounded">
                  <p className="text-primary font-bold">ACCESS_CLASSIFIED_DATA</p>
                  <p className="text-sm opacity-70">Decryption protocol initiated</p>
                </div>
              </GlitchReveal>
            </Card>
          </CardGrid>
        </Container>
      </Section>
        
      <SectionDivider />
        
      <Section title="Loading Components" centered>
        <Container>
          <CardGrid columns={{ default: 1, md: 2 }}>
            <Card 
              title="Cyber Loading Spinner"
              scanlineEffect
              animated
              delay={1.6}
              className="flex flex-col items-center"
            >
              <LoadingSpinner size={80} className="my-8" />
              <p className="text-center text-sm text-muted-foreground">
                Fully customizable spinner with size and color props
              </p>
            </Card>
            
            <Card 
              title="Cyber Loading Bar"
              scanlineEffect
              animated
              delay={1.8}
              className="flex flex-col items-center"
            >
              <div className="my-8 w-full flex justify-center">
                <CyberLoadingBar width={250} />
              </div>
              <p className="text-center text-sm text-muted-foreground">
                Progress bar with cyberpunk glitch effect
              </p>
            </Card>
          </CardGrid>
        </Container>
      </Section>
        
      <SectionDivider />
        
      <Section title="Combined Effects Demo" centered>
        <Container>
          <Card 
            scanlineEffect
            noiseEffect
            animated
            delay={2.0}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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
          </Card>
        </Container>
      </Section>
    </LayoutWrapper>
  );
} 