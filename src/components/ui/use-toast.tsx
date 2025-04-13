'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { toast as sonnerToast } from 'sonner';
import { cn } from '@/lib/utils';

const ToastVariants = cva(
  'group relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-4 pr-6 shadow-lg transition-all',
  {
    variants: {
      variant: {
        default: 'border bg-background',
        destructive: 'destructive border-destructive bg-destructive text-destructive-foreground',
        success: 'border-green-500 bg-green-500/10 text-green-500',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

// Define the action type that Sonner expects
type ToastAction = {
  label: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

export interface ToastProps extends VariantProps<typeof ToastVariants> {
  title?: string;
  description?: string;
  action?: ToastAction;
  variant?: 'default' | 'destructive' | 'success';
}

function toast(props: ToastProps) {
  const { title, description, variant = 'default', action } = props;
  
  // Handle different variants
  if (variant === 'destructive') {
    return sonnerToast.error(title || '', {
      description,
      action
    });
  } else if (variant === 'success') {
    return sonnerToast.success(title || '', {
      description,
      action
    });
  } else {
    // Default case
    return sonnerToast(title || '', {
      description,
      action
    });
  }
}

function useToast() {
  return {
    toast,
    dismiss: sonnerToast.dismiss
  };
}

export { toast, useToast }; 