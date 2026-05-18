interface LoadingSkeletonProps {
  variant?: 'card' | 'table-row' | 'chart';
  rows?: number;
}

export default function LoadingSkeleton({ variant = 'card', rows = 5 }: LoadingSkeletonProps) {
  if (variant === 'table-row') {
    return (
      <div className="animate-pulse">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 border-b border-slate-100 py-3">
            <div className="h-10 w-10 rounded bg-slate-200" />
            <div className="h-4 flex-1 rounded bg-slate-200" />
            <div className="h-4 w-20 rounded bg-slate-200" />
            <div className="h-4 w-24 rounded bg-slate-200" />
            <div className="h-8 w-20 rounded bg-slate-200" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'chart') {
    return (
      <div className="animate-pulse">
        <div className="mb-4 h-6 w-32 rounded bg-slate-200" />
        <div className="flex items-end gap-2" style={{ height: 200 }}>
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="flex-1 rounded-t bg-slate-200"
              style={{ height: `${40 + Math.random() * 60}%` }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-pulse rounded-lg border border-slate-200 bg-white p-6">
      <div className="mb-3 h-10 w-10 rounded bg-slate-200" />
      <div className="mb-2 h-4 w-24 rounded bg-slate-200" />
      <div className="h-8 w-16 rounded bg-slate-200" />
    </div>
  );
}
