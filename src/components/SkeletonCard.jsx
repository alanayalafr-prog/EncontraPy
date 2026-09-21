import React from 'react';

export default function SkeletonCard() {
  return (
    <div className="rounded-2xl flex flex-col justify-between overflow-hidden bg-[#151F32] border border-[#27354D] animate-pulse">
      <div>
        {/* Aspect-[16/10] matching BusinessCard exactly */}
        <div className="relative aspect-[16/10] w-full bg-slate-800/70">
          <div className="absolute top-2.5 left-2.5 w-16 h-5 bg-slate-700/60 rounded"></div>
          <div className="absolute bottom-2.5 left-2.5 w-24 h-4 bg-slate-700/60 rounded"></div>
        </div>

        <div className="p-4 space-y-3">
          {/* Title & Stars */}
          <div>
            <div className="h-4 sm:h-5 bg-slate-700/70 rounded-md w-3/4"></div>
            <div className="flex items-center gap-1.5 mt-2">
              <div className="h-3 bg-slate-700/50 rounded w-20"></div>
              <div className="h-3 bg-slate-700/40 rounded w-12"></div>
            </div>
          </div>
          
          {/* Location & Status */}
          <div className="flex items-center justify-between pt-0.5">
            <div className="h-3.5 bg-slate-700/60 rounded w-1/2"></div>
            <div className="h-3.5 bg-slate-700/50 rounded w-14"></div>
          </div>
          
          {/* Description Lines */}
          <div className="space-y-1.5 pt-1">
            <div className="h-3 bg-slate-700/40 rounded w-full"></div>
            <div className="h-3 bg-slate-700/40 rounded w-4/5"></div>
          </div>
          
          {/* Hours Info */}
          <div className="h-3 bg-slate-700/30 rounded w-3/5 pt-2 border-t border-[#27354D]/60"></div>
        </div>
      </div>
      
      {/* Footer Buttons */}
      <div className="p-4 pt-0 space-y-2">
        <div className="w-full h-10 bg-slate-700/60 rounded-xl"></div>
        <div className="flex justify-between items-center px-1">
          <div className="h-2.5 bg-slate-700/30 rounded w-16"></div>
          <div className="h-2.5 bg-slate-700/40 rounded w-24"></div>
        </div>
      </div>
    </div>
  );
}
