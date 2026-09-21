import React from 'react';
import Image from 'next/image';
import { SearchIcon, MapPinIcon, FilterIcon, SparklesIcon } from './Icons';

export default function Hero() {
  return (
    <section className="bg-gradient-to-b from-[#0B1120] via-[#0F172A] to-[#0B1120] border-b border-[#27354D]/60 py-4 sm:py-6">
      <div className="container-clean text-center flex flex-col items-center justify-center">
        
        <div className="max-w-3xl mx-auto flex flex-col items-center justify-center text-center w-full space-y-2">
          
          {/* Eyebrow badge */}
          <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/70 border border-blue-800/50 text-blue-300 text-xs font-semibold shadow-sm">
            <SparklesIcon className="w-3.5 h-3.5 text-amber-400" />
            <span>Directorio de Comercios Verificados en Paraguay 🇵🇾</span>
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Encontrá comercios y servicios en <span className="text-amber-400">Paraguay</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Asunción, Luque, San Lorenzo, CDE y Encarnación.
            <span className="text-amber-300/90 font-medium block sm:inline sm:ml-1">
              Contactá directo por WhatsApp sin intermediarios ni comisiones.
            </span>
          </p>
          
          {/* Subtle Social Proof */}
          <div className="pt-1 flex items-center justify-center gap-2.5">
            <div className="flex -space-x-1.5 overflow-hidden">
              <Image width={22} height={22} className="inline-block rounded-full ring-2 ring-[#0F172A]" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64" alt="User" unoptimized />
              <Image width={22} height={22} className="inline-block rounded-full ring-2 ring-[#0F172A]" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=64&h=64" alt="User" unoptimized />
              <Image width={22} height={22} className="inline-block rounded-full ring-2 ring-[#0F172A]" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=64&h=64" alt="User" unoptimized />
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              Más de <span className="text-white font-bold">1,000+</span> consultas directas facilitadas
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
