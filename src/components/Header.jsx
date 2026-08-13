import React from 'react';
import { SunIcon, MoonIcon, PlusCircleIcon, CreditCardIcon } from './Icons';

export default function Header({ theme, toggleTheme, onOpenAddModal, onOpenPricingModal }) {
  return (
    <header className="bg-[#0B1120] border-b border-[#27354D] sticky top-0 z-50 shadow-md">
      <div className="container-clean h-16 sm:h-20 flex flex-row items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div 
          className="flex items-center gap-2.5 cursor-pointer shrink-0" 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white text-xl shadow-md">
            E<span className="text-amber-400">PY</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 font-bold text-lg sm:text-xl text-white leading-none">
              Directorio<span className="text-amber-400 font-extrabold">PY</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 font-bold border border-blue-800">
                🇵🇾
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-normal hidden md:inline">
              Directorio de Comercios en Paraguay
            </span>
          </div>
        </div>

        {/* Horizontal Action Buttons */}
        <div className="flex flex-row items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="p-2 sm:p-2.5 rounded-xl bg-[#151F32] border border-[#27354D] text-slate-300 hover:text-white transition-colors"
            title="Cambiar Modo Oscuro / Claro"
          >
            {theme === 'dark' ? <SunIcon className="w-4 h-4 text-amber-400" /> : <MoonIcon className="w-4 h-4 text-blue-400" />}
          </button>

          {/* Pricing Button */}
          <button
            onClick={onOpenPricingModal}
            className="hidden sm:flex flex-row items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#151F32] hover:bg-[#1C2942] border border-[#27354D] text-slate-200 text-xs font-semibold transition-colors"
          >
            <CreditCardIcon className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Planes SIPAP</span>
          </button>

          {/* Register Business CTA */}
          <button
            onClick={onOpenAddModal}
            className="flex flex-row items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shrink-0"
          >
            <PlusCircleIcon className="w-4 h-4 shrink-0" />
            <span className="whitespace-nowrap">Publicar Negocio</span>
          </button>

        </div>

      </div>
    </header>
  );
}
