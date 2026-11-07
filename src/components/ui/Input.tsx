import React, { forwardRef } from 'react';
import { cn } from '../../utils';
import { Search } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, rightIcon, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-xs font-medium text-[#20211F]">{label}</label>
        )}
        <div className="relative">
          {leftIcon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#777A73]">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full h-9 text-sm bg-white border border-[#E7E9E3] rounded-lg text-[#20211F] placeholder-[#A8ABA3]',
              'focus:outline-none focus:ring-2 focus:ring-[#C8F169] focus:ring-offset-0 focus:border-[#C8F169]',
              'transition-colors duration-150',
              leftIcon && 'pl-9',
              rightIcon && 'pr-9',
              !leftIcon && 'px-3',
              error && 'border-red-300 focus:ring-red-200',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#777A73]">
              {rightIcon}
            </span>
          )}
        </div>
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export function SearchInput({ className, ...props }: SearchInputProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A8ABA3]" size={14} />
      <input
        className={cn(
          'w-full h-9 text-sm bg-[#F5F6F2] border border-[#E7E9E3] rounded-lg text-[#20211F] placeholder-[#A8ABA3]',
          'focus:outline-none focus:ring-2 focus:ring-[#C8F169] focus:bg-white',
          'transition-colors duration-150 pl-9 pr-3',
          className
        )}
        {...props}
      />
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, className, children, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-xs font-medium text-[#20211F]">{label}</label>
        )}
        <select
          ref={ref}
          className={cn(
            'w-full h-9 text-sm bg-white border border-[#E7E9E3] rounded-lg text-[#20211F]',
            'focus:outline-none focus:ring-2 focus:ring-[#C8F169] focus:border-[#C8F169]',
            'transition-colors duration-150 px-3 cursor-pointer',
            error && 'border-red-300',
            className
          )}
          {...props}
        >
          {children}
        </select>
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-xs font-medium text-[#20211F]">{label}</label>
        )}
        <textarea
          ref={ref}
          className={cn(
            'w-full text-sm bg-white border border-[#E7E9E3] rounded-lg text-[#20211F] placeholder-[#A8ABA3]',
            'focus:outline-none focus:ring-2 focus:ring-[#C8F169] focus:border-[#C8F169]',
            'transition-colors duration-150 px-3 py-2 resize-none',
            error && 'border-red-300',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
