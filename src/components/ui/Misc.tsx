import { cn } from '../../utils';

interface SkeletonProps {
  className?: string;
  lines?: number;
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'animate-pulse bg-[#E9ECE6] rounded-lg',
        className
      )}
    />
  );
}

export function SkeletonCard({ lines = 3 }: SkeletonProps) {
  return (
    <div className="card p-5 space-y-3">
      <Skeleton className="h-4 w-3/4" />
      {Array.from({ length: lines - 1 }).map((_, i) => (
        <Skeleton key={i} className="h-3" style={{ width: `${60 + Math.random() * 30}%` } as React.CSSProperties} />
      ))}
    </div>
  );
}

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 text-center', className)}>
      {icon && (
        <div className="w-12 h-12 rounded-2xl bg-[#F0F1ED] flex items-center justify-center text-[#A8ABA3] mb-4">
          {icon}
        </div>
      )}
      <p className="text-sm font-semibold text-[#20211F]">{title}</p>
      {description && <p className="text-xs text-[#777A73] mt-1.5 max-w-xs">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function DemoBadge() {
  return (
    <span className="demo-badge">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
      DEMO DATA
    </span>
  );
}

export function PageHeader({
  title,
  subtitle,
  actions,
  breadcrumb,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  breadcrumb?: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      {breadcrumb && <div className="mb-2">{breadcrumb}</div>}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-xl font-bold text-[#20211F]">{title}</h1>
          {subtitle && <p className="text-sm text-[#777A73] mt-1">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
      </div>
    </div>
  );
}
