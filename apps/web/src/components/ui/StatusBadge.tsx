import { cn } from '@/lib/utils';
import { STATUS_LABELS, STATUS_COLORS, RELEVANCE_COLORS, CONNECTION_STATUS_COLORS } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  type?: 'opportunity' | 'relevance' | 'connection';
}

export function StatusBadge({ status, type = 'opportunity' }: StatusBadgeProps) {
  const colorMap =
    type === 'relevance'
      ? RELEVANCE_COLORS
      : type === 'connection'
      ? CONNECTION_STATUS_COLORS
      : STATUS_COLORS;

  const label = type === 'opportunity' ? STATUS_LABELS[status] || status : status;

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        colorMap[status] || 'bg-gray-100 text-gray-700',
      )}
    >
      {label}
    </span>
  );
}
