import React from 'react';

interface ProductCardSkeletonProps {
  className?: string;
}

export const ProductCardSkeleton: React.FC<ProductCardSkeletonProps> = ({ className = '' }) => {
  return (
    <div
      className={`relative bg-white rounded-2xl border border-stone-200/90 p-3 sm:p-4 shadow-xs flex flex-col justify-between overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* Shimmer pulse effect container */}
      <div className="animate-pulse flex flex-col justify-between h-full">
        {/* Top badge skeleton */}
        <div className="absolute top-3 left-3 z-10">
          <div className="h-4 sm:h-5 w-14 bg-stone-200 rounded-md" />
        </div>

        {/* Product Image placeholder */}
        <div className="relative aspect-square w-full rounded-xl bg-stone-100 mb-3 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-stone-100 via-stone-200/60 to-stone-100 animate-[pulse_1.5s_ease-in-out_infinite]" />
        </div>

        {/* Product Details placeholder */}
        <div className="flex-1 flex flex-col space-y-2">
          {/* Brand tag */}
          <div className="h-3 w-16 bg-stone-200/80 rounded-sm" />

          {/* Title line 1 & 2 */}
          <div className="space-y-1.5">
            <div className="h-4 bg-stone-200 rounded-md w-11/12" />
            <div className="h-4 bg-stone-200 rounded-md w-3/4" />
          </div>

          {/* Hindi subtext */}
          <div className="h-3 bg-stone-150 bg-stone-200/60 rounded-md w-1/2" />

          {/* Rating & Stock pill */}
          <div className="flex items-center gap-2 pt-1">
            <div className="h-4 w-12 bg-amber-100/70 rounded-md" />
            <div className="h-3 w-10 bg-stone-200/70 rounded-md" />
          </div>
        </div>

        {/* Pricing & Add to Cart Controls */}
        <div className="mt-2.5 pt-2.5 border-t border-stone-100 flex items-center justify-between gap-2">
          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex items-baseline gap-1.5">
              <div className="h-5 w-14 bg-stone-200 rounded-md" />
              <div className="h-3 w-8 bg-stone-150 bg-stone-200/50 rounded-sm" />
            </div>
            <div className="h-2.5 w-12 bg-stone-200/60 rounded-sm" />
          </div>

          {/* Action button placeholder */}
          <div className="h-7 w-16 sm:w-20 bg-emerald-100/60 rounded-xl shrink-0" />
        </div>
      </div>
    </div>
  );
};

interface ProductGridSkeletonProps {
  count?: number;
  columnsClass?: string;
}

export const ProductGridSkeleton: React.FC<ProductGridSkeletonProps> = ({
  count = 8,
  columnsClass = 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6'
}) => {
  return (
    <div className={columnsClass} role="status" aria-label="Loading products">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
};
