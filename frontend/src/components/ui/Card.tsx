import type { ReactNode } from 'react';
import { clsx } from 'clsx';

interface CardProps {
  children: ReactNode;
  title?: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  noPadding?: boolean;
}

export const Card = ({
  children,
  title,
  description,
  action,
  className,
  noPadding = false,
}: CardProps) => {
  return (
    <div
      className={clsx(
        'bg-white dark:bg-slate-900 rounded-2xl border border-slate-300/80 dark:border-slate-800 shadow-[0_4px_20px_-2px_rgba(1,97,239,0.05),0_2px_6px_-1px_rgba(0,0,0,0.02)] transition-all duration-200 overflow-hidden',
        !noPadding && 'p-6',
        className
      )}
    >
      {(title || action) && (
        <div className={clsx('flex items-start justify-between', noPadding ? 'p-6 pb-4 border-b border-slate-200/80 dark:border-slate-800' : 'mb-5')}>
          <div>
            {title && (
              <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">{title}</h3>
            )}
            {description && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{description}</p>
            )}
          </div>
          {action && <div className="ml-4 flex-shrink-0">{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};
