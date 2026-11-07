import React from 'react';
import { cn } from '../../utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
  hover?: boolean;
  onClick?: () => void;
}

export function Card({ children, className, padding = true, hover, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'card',
        padding && 'p-5',
        hover && 'transition-shadow duration-150 hover:shadow-[0_4px_16px_0_rgba(0,0,0,0.08)] cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between mb-4', className)}>
      {children}
    </div>
  );
}

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
  subtitle?: string;
}

export function CardTitle({ children, className, subtitle }: CardTitleProps) {
  return (
    <div>
      <h3 className={cn('font-display text-sm font-semibold text-[#20211F]', className)}>
        {children}
      </h3>
      {subtitle && (
        <p className="text-xs text-[#777A73] mt-0.5">{subtitle}</p>
      )}
    </div>
  );
}
