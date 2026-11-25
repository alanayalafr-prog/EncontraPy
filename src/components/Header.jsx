import React from 'react';
import { PlusCircleIcon, CreditCardIcon, ParaguayFlagIcon } from './Icons';

export default function Header({ onOpenAddModal, onOpenPricingModal }) {
  return (
    <header className="bg-[#0B1120] border-b border-[#27354D] sticky top-0 z-50 shadow-md">
      <div className="container-clean h-16 sm:h-20 flex flex-row items-center justify-between gap-2 sm:gap-4">
        
        {/* Brand Logo */}
        <a 
          href="/"
          className="flex items-center gap-2 sm:gap-2.5 cursor-pointer shrink-0 min-w-0 no-underline" 
          title="DirectorioPY - Inicio"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white text-base sm:text-xl shadow-md shrink-0">
            D<span className="text-amber-400">PY</span>
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 font-bold text-base sm:text-xl text-white leading-none">
              <span>Directorio<span className="text-amber-400 font-extrabold">PY</span></span>
              <ParaguayFlagIcon className="w-5 h-3.5 rounded-[2px] shadow-sm shrink-0" />
            </div>
            <span className="text-[11px] text-slate-400 font-normal hidden md:inline truncate">
              Directorio de Comercios en Paraguay
            </span>
          </div>
        </a>

        {/* Horizontal Action Buttons */}
        <div className="flex flex-row items-center gap-1.5 sm:gap-3 shrink-0">
          
          {/* Pricing Button */}
          <button
            onClick={onOpenPricingModal}
            className="hidden sm:flex flex-row items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#151F32] hover:bg-[#1C2942] border border-[#27354D] text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
          >
            <CreditCardIcon className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Planes SIPAP</span>
          </button>

          {/* Register Business CTA - Optimized for mobile without cutting text */}
          <button
            onClick={onOpenAddModal}
            className="flex flex-row items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shrink-0 active:scale-95 cursor-pointer"
            title="Publicar Negocio en DirectorioPY"
          >
            <PlusCircleIcon className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline whitespace-nowrap">Publicar Negocio</span>
            <span className="sm:hidden font-bold whitespace-nowrap">+ Publicar</span>
          </button>

        </div>

      </div>
    </header>
  );
}
