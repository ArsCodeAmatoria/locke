/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)"],
        mono: ["var(--font-geist-mono)"]
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: 'hsl(var(--card))',
        'card-foreground': 'hsl(var(--card-foreground))',
        popover: 'hsl(var(--popover))',
        'popover-foreground': 'hsl(var(--popover-foreground))',
        primary: 'hsl(var(--primary))',
        'primary-foreground': 'hsl(var(--primary-foreground))',
        secondary: 'hsl(var(--secondary))',
        'secondary-foreground': 'hsl(var(--secondary-foreground))',
        muted: 'hsl(var(--muted))',
        'muted-foreground': 'hsl(var(--muted-foreground))',
        accent: 'hsl(var(--accent))',
        'accent-foreground': 'hsl(var(--accent-foreground))',
        destructive: 'hsl(var(--destructive))',
        'destructive-foreground': 'hsl(var(--destructive-foreground))',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      animation: {
        'glow': 'glow 3s ease-in-out infinite',
        'glitch': 'glitch 4s infinite linear alternate-reverse',
        'scanline': 'scanline 8s linear infinite',
        'cyber-border': 'cyber-border 6s linear infinite',
      },
      keyframes: {
        'glow': {
          '0%, 100%': { textShadow: '0 0 10px rgba(22, 255, 177, 0.7), 0 0 20px rgba(22, 255, 177, 0.5)' },
          '50%': { textShadow: '0 0 15px rgba(22, 255, 177, 0.9), 0 0 30px rgba(22, 255, 177, 0.7)' },
        },
        'glitch': {
          '0%': { clipPath: 'inset(40% 0 61% 0)', transform: 'translate(-2px, 2px)' },
          '20%': { clipPath: 'inset(92% 0 1% 0)', transform: 'translate(1px, 1px)' },
          '40%': { clipPath: 'inset(43% 0 1% 0)', transform: 'translate(3px, 1px)' },
          '60%': { clipPath: 'inset(25% 0 58% 0)', transform: 'translate(-5px, 1px)' },
          '80%': { clipPath: 'inset(54% 0 7% 0)', transform: 'translate(2px, -3px)' },
          '100%': { clipPath: 'inset(58% 0 43% 0)', transform: 'translate(-2px, 2px)' },
        },
        'scanline': {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(1000px)' },
        },
        'cyber-border': {
          '0%': { filter: 'hue-rotate(0deg)' },
          '100%': { filter: 'hue-rotate(360deg)' },
        },
      },
    },
  },
  plugins: [],
} 