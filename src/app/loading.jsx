import React from 'react';
import SkeletonCard from '@/components/SkeletonCard';

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#060B14] flex flex-col">
      <div className="container-clean pt-24 pb-10 space-y-8">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#27354D] pb-3 gap-3">
          <div className="h-6 w-48 bg-[#151F32] rounded animate-pulse"></div>
          <div className="flex gap-2">
            <div className="h-8 w-16 bg-[#151F32] rounded animate-pulse"></div>
            <div className="h-8 w-16 bg-[#151F32] rounded animate-pulse"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[...Array(8)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
