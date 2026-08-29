import React from 'react';

interface CategoryGridSkeletonProps {
  count?: number;
  variant?: 'compact' | 'full' | 'sidebar';
}

export const CategoryCompactSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 p-3 flex flex-col items-center text-center shadow-2xs animate-pulse">
      {/* Category Image */}
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-stone-200 mb-2.5" />
      {/* Title */}
      <div className="h-3.5 bg-stone-200 rounded w-16 mb-1.5" />
      {/* Hindi subtitle */}
      <div className="h-2.5 bg-stone-200/60 rounded w-12" />
    </div>
  );
};

export const CategoryFullSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl border border-stone-200/90 p-5 shadow-2xs flex flex-col justify-between animate-pulse">
      <div className="space-y-4">
        {/* Banner image */}
        <div className="aspect-video w-full rounded-2xl bg-stone-200 relative overflow-hidden">
          <div className="absolute top-3 right-3 h-5 w-16 bg-white/80 rounded-full" />
        </div>

        {/* Text info */}
        <div className="space-y-2">
          <div className="h-5 bg-stone-200 rounded-md w-3/5" />
          <div className="h-3.5 bg-stone-200/70 rounded-md w-2/5" />
          <div className="space-y-1 pt-1">
            <div className="h-3 bg-stone-200/50 rounded w-full" />
            <div className="h-3 bg-stone-200/50 rounded w-4/5" />
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
        <div className="h-3.5 w-28 bg-emerald-100/80 rounded" />
        <div className="h-3.5 w-4 bg-emerald-100/80 rounded" />
      </div>
    </div>
  );
};

export const CategorySidebarSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => {
  return (
    <div className="space-y-1 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-8 bg-stone-100 rounded-lg w-full" />
      ))}
    </div>
  );
};

export const CategoryGridSkeleton: React.FC<CategoryGridSkeletonProps> = ({
  count = 6,
  variant = 'compact'
}) => {
  if (variant === 'full') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" role="status" aria-label="Loading categories">
        {Array.from({ length: count }).map((_, i) => (
          <CategoryFullSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (variant === 'sidebar') {
    return <CategorySidebarSkeleton count={count} />;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4" role="status" aria-label="Loading categories">
      {Array.from({ length: count }).map((_, i) => (
        <CategoryCompactSkeleton key={i} />
      ))}
    </div>
  );
};
