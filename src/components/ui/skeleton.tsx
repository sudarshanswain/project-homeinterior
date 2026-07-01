import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
}

function Skeleton({ className, variant = "text", width, height, ...props }: SkeletonProps) {
  const variantClasses = {
    text: "rounded-md",
    circular: "rounded-full",
    rectangular: "rounded-2xl",
  };

  const style: React.CSSProperties = {
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
  };

  return (
    <div
      className={cn("animate-pulse bg-muted", variantClasses[variant], className)}
      style={style}
      {...props}
    />
  );
}

interface SkeletonGroupProps {
  count?: number;
  className?: string;
  children: React.ReactNode;
}

function SkeletonGroup({ count = 1, className, children }: SkeletonGroupProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>{children}</div>
      ))}
    </div>
  );
}

export { Skeleton, SkeletonGroup };

// Pre-built skeleton patterns
export function ServiceCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card p-8">
      <Skeleton variant="circular" width={56} height={56} className="mb-6" />
      <Skeleton variant="text" height={24} className="mb-3 w-3/4" />
      <Skeleton variant="text" height={16} className="w-full" />
      <Skeleton variant="text" height={16} className="w-5/6" />
    </div>
  );
}

export function PortfolioCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl bg-card shadow-sm">
      <Skeleton variant="rectangular" className="aspect-[4/3]" />
      <div className="p-6">
        <Skeleton variant="text" height={20} className="mb-2 w-1/3" />
        <Skeleton variant="text" height={24} className="w-2/3" />
      </div>
    </div>
  );
}

export function TestimonialCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card p-8">
      <Skeleton variant="text" height={20} className="mb-4 w-1/4" />
      <Skeleton variant="text" height={16} className="mb-2" />
      <Skeleton variant="text" height={16} className="mb-2" />
      <Skeleton variant="text" height={16} className="mb-6 w-4/5" />
      <div className="flex items-center gap-4">
        <Skeleton variant="circular" width={48} height={48} />
        <div className="flex-1">
          <Skeleton variant="text" height={18} className="mb-2 w-1/2" />
          <Skeleton variant="text" height={14} className="w-2/3" />
        </div>
      </div>
    </div>
  );
}