import React from 'react';
import { ProductGridSkeleton } from './ProductCardSkeleton';

export const ProductDetailSkeleton: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 animate-pulse">
      {/* Back button skeleton */}
      <div className="h-6 w-28 bg-stone-200 rounded-lg" />

      {/* Main product showcase grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 shadow-xs">
        {/* Left image column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="aspect-square w-full rounded-2xl bg-stone-200" />
          <div className="flex gap-2">
            <div className="w-16 h-16 rounded-xl bg-stone-200" />
            <div className="w-16 h-16 rounded-xl bg-stone-200" />
            <div className="w-16 h-16 rounded-xl bg-stone-200" />
          </div>
        </div>

        {/* Right content column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <div className="h-3 w-20 bg-stone-200 rounded" />
            <div className="h-7 sm:h-9 bg-stone-200 rounded-lg w-4/5" />
            <div className="h-4 bg-stone-200/70 rounded w-1/2" />
          </div>

          <div className="flex items-center gap-3">
            <div className="h-6 w-16 bg-amber-100/70 rounded-md" />
            <div className="h-4 w-24 bg-stone-200/60 rounded" />
          </div>

          <div className="h-8 sm:h-10 w-36 bg-stone-200 rounded-lg" />

          {/* Quantity & CTA buttons */}
          <div className="space-y-3 pt-4 border-t border-stone-100">
            <div className="h-11 w-full max-w-xs bg-stone-200 rounded-2xl" />
            <div className="flex gap-3 pt-2">
              <div className="h-12 flex-1 bg-emerald-200/70 rounded-2xl" />
              <div className="h-12 flex-1 bg-emerald-700/30 rounded-2xl" />
            </div>
          </div>

          {/* Delivery & Assurance box */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/70 space-y-3">
            <div className="h-4 w-48 bg-stone-200 rounded" />
            <div className="h-3 w-64 bg-stone-200/70 rounded" />
          </div>
        </div>
      </div>

      {/* Related Products Skeleton */}
      <div className="space-y-6 pt-6">
        <div className="h-7 w-48 bg-stone-200 rounded-lg" />
        <ProductGridSkeleton count={4} columnsClass="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6" />
      </div>
    </div>
  );
};
