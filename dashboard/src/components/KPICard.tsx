import type { ReactNode } from 'react';
import LoadingSkeleton from './LoadingSkeleton';

interface KPICardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  color: string;
  loading?: boolean;
}

export default function KPICard({ title, value, icon, color, loading }: KPICardProps) {
  if (loading) {
    return <LoadingSkeleton variant="card" />;
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-1 text-3xl font-bold text-slate-900">{value}</p>
        </div>
        <div
          className="flex h-12 w-12 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${color}15`, color }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
