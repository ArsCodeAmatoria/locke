import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines multiple class values into a single string, merging Tailwind classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface UserIdentity {
  name: string;
  did: string;
  address: string;
  isAuthenticated: boolean;
}
