# CSS and Framer Motion Updates

## Changes Made

1. **Fixed CSS Issues**
   - Properly configured Tailwind CSS v4 imports in `globals.css`
   - Removed duplicate styles from `globals.css` that were already in `cyberstyles.css`
   - Added `cyberstyles.css` import in `globals.css`
   - Added font variables
   - Added animation keyframes to Tailwind config

2. **Added Framer Motion**
   - Installed Framer Motion library
   - Added `AnimatePresence` to the root layout for page transitions
   - Created reusable motion components in `src/components/ui/motion-component.tsx`
   - Added advanced motion components in `src/components/ui/advanced-motion.tsx`
   - Added loading and page transition components
   - Created a demo page at `/motion-demo` showcasing all components

## How to Use the Motion Components

### Basic Components

- **FadeIn**: Fades in elements with a slight upward movement
- **SlideIn**: Slides elements in from the left with a spring animation
- **ScaleIn**: Scales elements in with a fade effect
- **CyberGlitch**: Combines the cyber glitch effect with a fade animation

### Advanced Components

- **TerminalType**: Creates a typewriter effect for terminal-like text
- **CyberGrid**: Reveals content with a cyberpunk-inspired grid animation
- **GlitchReveal**: Reveals content with a glitchy animation effect
- **DigitalNoise**: Adds a subtle digital noise effect to its contents

### Loading Components

- **LoadingSpinner**: Customizable cyberpunk spinner with multiple animated rings
- **CyberLoadingBar**: Progress bar with a cyber glitch effect

### Page Transitions

- **PageTransition**: Simple fade transition between pages
- **CyberTransition**: Advanced cyberpunk-style glitch transition with grid animations

### Example Usage

```tsx
import { FadeIn, SlideIn, ScaleIn, CyberGlitch } from '@/components/ui/motion-component';
import { TerminalType, CyberGrid, GlitchReveal, DigitalNoise } from '@/components/ui/advanced-motion';
import { LoadingSpinner, CyberLoadingBar } from '@/components/ui/loading-spinner';
import { CyberTransition } from '@/components/page-transition';

export default function MyComponent() {
  return (
    <CyberTransition>
      <div className="space-y-4">
        {/* Basic components */}
        <FadeIn>
          <h1>This will fade in</h1>
        </FadeIn>
        
        <SlideIn delay={0.2}>
          <p>This will slide in after a 0.2s delay</p>
        </SlideIn>
        
        <ScaleIn className="bg-card p-4 rounded">
          <div>This will scale in with custom classes</div>
        </ScaleIn>
        
        <CyberGlitch>
          Cyberpunk glitch effect with animation
        </CyberGlitch>
        
        {/* Advanced components */}
        <TerminalType>
          {'>'}Typing effect like a terminal
        </TerminalType>
        
        <CyberGrid delay={0.5}>
          <div>Content revealed with a grid animation</div>
        </CyberGrid>
        
        <GlitchReveal>
          <div>Content with a glitchy reveal</div>
        </GlitchReveal>
        
        <DigitalNoise>
          <div>Content with digital noise overlay</div>
        </DigitalNoise>
        
        {/* Loading components */}
        <LoadingSpinner size={40} color="hsl(var(--primary))" />
        <CyberLoadingBar width={200} height={4} />
      </div>
    </CyberTransition>
  );
}
```

## Demo Page

Visit `/motion-demo` to see all components in action and get inspiration for combining them.

## Notes

- All components support custom classNames and delay props
- The motion components are optimized for the existing cyber/hacker theme
- Animations work with the existing CSS effects in `cyberstyles.css`
- Use the `CyberTransition` component to wrap your pages for a consistent transition effect 