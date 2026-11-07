import React from 'react';
import { cn } from '../../utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading,
  leftIcon,
  rightIcon,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center gap-2 font-medium rounded-lg transition-all duration-150 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8F169] focus-visible:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants: Record<string, string> = {
    primary: 'bg-[#252622] text-white hover:bg-[#383930] active:scale-[0.98]',
    secondary: 'bg-white text-[#20211F] border border-[#E7E9E3] hover:bg-[#F5F6F2] active:scale-[0.98]',
    outline: 'bg-white text-[#20211F] border border-[#E7E9E3] hover:bg-[#F5F6F2] active:scale-[0.98]',
    ghost: 'text-[#777A73] hover:text-[#20211F] hover:bg-[#F5F6F2] active:scale-[0.98]',
    danger: 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 active:scale-[0.98]',
    accent: 'bg-[#C8F169] text-[#20211F] hover:bg-[#B5E64F] active:scale-[0.98]',
  };

  const sizes: Record<string, string> = {
    sm: 'text-xs px-3 py-1.5 h-7',
    md: 'text-sm px-4 py-2 h-9',
    lg: 'text-sm px-5 py-2.5 h-10',
  };

  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : leftIcon}
      {children}
      {!loading && rightIcon}
    </button>
  );
}

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'ghost' | 'secondary';
}

export function IconButton({ size = 'md', variant = 'ghost', className, children, ...props }: IconButtonProps) {
  const sizes: Record<string, string> = {
    sm: 'w-7 h-7',
    md: 'w-8 h-8',
    lg: 'w-9 h-9',
  };
  const variants: Record<string, string> = {
    ghost: 'text-[#777A73] hover:text-[#20211F] hover:bg-[#F5F6F2]',
    secondary: 'bg-white border border-[#E7E9E3] text-[#777A73] hover:bg-[#F5F6F2] hover:text-[#20211F]',
  };
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-lg transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8F169]',
        sizes[size],
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
