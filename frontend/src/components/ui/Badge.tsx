import { clsx } from 'clsx';

type BadgeVariant =
  | 'default'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'purple';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-slate-100 text-slate-700 border border-slate-200/80',
  success: 'bg-emerald-50 text-emerald-700 border border-emerald-200/80',
  warning: 'bg-amber-50 text-amber-700 border border-amber-200/80',
  danger: 'bg-rose-50 text-rose-700 border border-rose-200/80',
  info: 'bg-blue-50 text-blue-700 border border-blue-200/80',
  purple: 'bg-purple-50 text-purple-700 border border-purple-200/80',
};

export const Badge = ({
  children,
  variant = 'default',
  className,
}: BadgeProps) => {
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide',
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
};
