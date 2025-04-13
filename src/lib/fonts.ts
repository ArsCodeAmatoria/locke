// This module provides fallback fonts for when Google Fonts fails to load
import localFont from 'next/font/local';

/**
 * Local fallback font for Inter
 */
export const interFallback = localFont({
  src: [
    {
      path: '../../public/fonts/fallback-sans.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/fallback-sans-bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-sans',
  fallback: ['system-ui', 'Arial', 'sans-serif'],
});

/**
 * Local fallback font for JetBrains Mono
 */
export const jetbrainsMonoFallback = localFont({
  src: [
    {
      path: '../../public/fonts/fallback-mono.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/fallback-mono-bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-mono',
  fallback: ['Courier New', 'monospace'],
}); 