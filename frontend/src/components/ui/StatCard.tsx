import type { ReactNode } from 'react';
import { clsx } from 'clsx';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  iconBg?: string;
  trend?: {
    value: number;
    label?: string;
  };
  className?: string;
}

export const StatCard = ({
  label,
  value,
  icon,
  iconBg = 'bg-blue-50 text-primary border border-blue-200 dark:bg-blue-950/40 dark:border-blue-800',
  trend,
  className,
}: StatCardProps) => {
  const trendPositive = trend && trend.value > 0;
  const trendNeutral = trend && trend.value === 0;

  return (
    <div
      className={clsx(
        'card-astrowind p-5 relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-300/90 dark:border-slate-700/80',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0 pr-3">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate">
            {label}
          </p>
          <p className="mt-1.5 text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {value}
          </p>
          {trend && (
            <div className="mt-2 flex items-center gap-1.5">
              {trendNeutral ? (
                <Minus className="w-3.5 h-3.5 text-slate-400" />
              ) : trendPositive ? (
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5 text-rose-600" />
              )}
              <span
                className={clsx(
                  'text-xs font-semibold',
                  trendNeutral
                    ? 'text-slate-500'
                    : trendPositive
                    ? 'text-emerald-700'
                    : 'text-rose-700'
                )}
              >
                {trendPositive ? '+' : ''}
                {trend.value}%
              </span>
              {trend.label && (
                <span className="text-xs text-slate-400 font-normal">{trend.label}</span>
              )}
            </div>
          )}
        </div>
        <div
          className={clsx(
            'flex items-center justify-center w-11 h-11 rounded-2xl flex-shrink-0 shadow-xs',
            iconBg
          )}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};
