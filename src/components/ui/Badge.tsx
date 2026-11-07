import React from 'react';
import { cn } from '../../utils';

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'neutral';

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md';
  variant?: BadgeVariant;
}

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  default: 'bg-[#F5F6F2] text-[#20211F] border-[#E7E9E3]',
  success: 'bg-green-50 text-green-700 border-green-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  error: 'bg-red-50 text-red-700 border-red-200',
  info: 'bg-blue-50 text-blue-700 border-blue-200',
  neutral: 'bg-gray-100 text-gray-600 border-gray-200',
};

export function Badge({ children, className, size = 'sm', variant = 'default' }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium border rounded-full',
        size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1',
        VARIANT_CLASSES[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

interface StatusDotProps {
  color?: string;
  className?: string;
  pulse?: boolean;
}

export function StatusDot({ color = '#4CAF72', className, pulse }: StatusDotProps) {
  return (
    <span
      className={cn('inline-block rounded-full flex-shrink-0', pulse && 'animate-pulse-soft', className)}
      style={{ width: 7, height: 7, backgroundColor: color }}
    />
  );
}
