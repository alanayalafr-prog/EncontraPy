import React from 'react';
import { SparklesIcon, ParaguayFlagIcon } from './Icons';

export default function Hero() {
  return (
    <section className="bg-gradient-to-b from-[#0B1120] via-[#0F172A] to-[#0B1120] border-b border-[#27354D]/60 py-4 sm:py-6">
      <div className="container-clean text-center flex flex-col items-center justify-center">
        
        <div className="max-w-3xl mx-auto flex flex-col items-center justify-center text-center w-full space-y-2">
          
          {/* Eyebrow badge */}
          <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/70 border border-blue-800/50 text-blue-300 text-xs font-semibold shadow-sm">
            <SparklesIcon className="w-3.5 h-3.5 text-amber-400" />
            <span>Directorio de Comercios de Paraguay</span>
            <ParaguayFlagIcon className="w-4 h-3 rounded-[2px] shrink-0" />
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Encontrá comercios y servicios en <span className="text-amber-400">Paraguay</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            En todo Paraguay: Asunción, Gran Asunción, CDE, Encarnación y más.
            <span className="text-amber-300/90 font-medium block sm:inline sm:ml-1">
              Contactá directo por WhatsApp sin intermediarios ni comisiones.
            </span>
          </p>

        </div>

      </div>
    </section>
  );
}
