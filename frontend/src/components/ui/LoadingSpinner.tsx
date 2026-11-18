import { Loader2 } from 'lucide-react';
import { clsx } from 'clsx';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  fullPage?: boolean;
}

const sizeMap = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-10 h-10',
};

export const LoadingSpinner = ({
  message,
  size = 'md',
  fullPage = false,
}: LoadingSpinnerProps) => {
  return (
    <div
      className={clsx(
        'flex flex-col items-center justify-center gap-3',
        fullPage && 'min-h-screen'
      )}
    >
      <Loader2
        className={clsx(sizeMap[size], 'animate-spin text-blue-600')}
      />
      {message && (
        <p className="text-sm text-gray-500">{message}</p>
      )}
    </div>
  );
};
