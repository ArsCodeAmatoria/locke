import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface UserIdentity {
  name: string;
  did: string;
  address: string;
  isAuthenticated: boolean;
}
