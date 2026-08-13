import React from 'react';

export default function SkeletonCard() {
  return (
    <div className="rounded-2xl flex flex-col justify-between overflow-hidden bg-[#151F32] border border-[#27354D] animate-pulse">
      <div>
        <div className="relative aspect-video w-full bg-slate-800"></div>
        <div className="p-4 space-y-4">
          <div>
            <div className="h-5 bg-slate-700 rounded w-3/4"></div>
            <div className="flex items-center gap-1.5 mt-2">
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-3 h-3 bg-slate-700 rounded-full"></div>
                ))}
              </div>
              <div className="h-3 bg-slate-700 rounded w-16"></div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="h-4 bg-slate-700 rounded w-1/2"></div>
            <div className="h-4 bg-slate-700 rounded w-12"></div>
          </div>
          
          <div className="space-y-2">
            <div className="h-3 bg-slate-700 rounded w-full"></div>
            <div className="h-3 bg-slate-700 rounded w-5/6"></div>
          </div>
          
          <div className="h-4 bg-slate-700 rounded w-1/3 mt-2"></div>
        </div>
      </div>
      
      <div className="p-4 pt-0 space-y-2">
        <div className="w-full h-10 bg-slate-700 rounded-xl"></div>
        <div className="h-3 bg-slate-700 rounded w-1/4 mx-auto mt-2"></div>
      </div>
    </div>
  );
}
