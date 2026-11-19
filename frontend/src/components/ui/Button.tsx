import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const variantClasses = {
  primary:
    'bg-primary hover:bg-secondary text-white border border-primary shadow-sm hover:shadow-md hover:shadow-blue-500/20 active:scale-[0.98]',
  secondary:
    'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 shadow-sm hover:border-slate-300 hover:text-slate-900 active:scale-[0.98]',
  accent:
    'bg-accent hover:bg-purple-700 text-white border border-accent shadow-sm hover:shadow-purple-500/20 active:scale-[0.98]',
  danger:
    'bg-rose-600 hover:bg-rose-700 text-white border border-transparent shadow-sm active:scale-[0.98]',
  ghost:
    'bg-transparent hover:bg-slate-100 text-slate-600 border border-transparent active:scale-[0.98]',
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-xs rounded-xl font-medium',
  md: 'px-4 py-2 text-sm rounded-xl font-semibold',
  lg: 'px-6 py-3 text-base rounded-2xl font-semibold',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={clsx(
          'inline-flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer',
          'focus:outline-none focus:ring-2 focus:ring-primary/25 focus:ring-offset-1',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
