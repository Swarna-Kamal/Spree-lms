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
  iconBg = 'bg-blue-100',
  trend,
  className,
}: StatCardProps) => {
  const trendPositive = trend && trend.value > 0;
  const trendNeutral = trend && trend.value === 0;

  return (
    <div
      className={clsx(
        'bg-white rounded-xl shadow-sm border border-gray-200 p-6',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
          {trend && (
            <div className="mt-2 flex items-center gap-1">
              {trendNeutral ? (
                <Minus className="w-4 h-4 text-gray-400" />
              ) : trendPositive ? (
                <TrendingUp className="w-4 h-4 text-green-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
              <span
                className={clsx(
                  'text-xs font-medium',
                  trendNeutral
                    ? 'text-gray-500'
                    : trendPositive
                    ? 'text-green-600'
                    : 'text-red-600'
                )}
              >
                {trend.value > 0 ? '+' : ''}
                {trend.value}%{' '}
                <span className="font-normal text-gray-400">
                  {trend.label || 'vs last month'}
                </span>
              </span>
            </div>
          )}
        </div>
        <div
          className={clsx(
            'flex items-center justify-center w-12 h-12 rounded-xl flex-shrink-0 ml-4',
            iconBg
          )}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};
