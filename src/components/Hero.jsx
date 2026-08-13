import React from 'react';
import { SearchIcon, MapPinIcon, FilterIcon, SparklesIcon } from './Icons';

export default function Hero({
  searchQuery,
  setSearchQuery,
  selectedService,
  setSelectedService,
  selectedCity,
  setSelectedCity,
  services = [],
  cities = []
}) {
  return (
    <section className="bg-gradient-to-b from-[#0B1120] via-[#0F172A] to-[#0B1120] border-b border-[#27354D]" style={{ paddingTop: '24px', paddingBottom: '12px', marginBottom: '0px' }}>
      <div className="container-clean text-center flex flex-col items-center justify-center">
        
        {/* Centered Subtitle Badge, Title & Paragraph */}
        <div className="max-w-3xl mx-auto flex flex-col items-center justify-center text-center w-full" style={{ marginBottom: '16px' }}>
          <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-800/60 text-blue-400 text-xs font-semibold shadow-sm" style={{ marginBottom: '8px' }}>
            <SparklesIcon className="w-3.5 h-3.5 text-amber-400" />
            <span>Directorio de Negocios en Paraguay 🇵🇾</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-snug text-center w-full" style={{ marginBottom: '8px' }}>
            Encontrá comercios y servicios en <span className="text-amber-400 block sm:inline mt-1 sm:mt-0">Paraguay</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto text-center leading-relaxed font-normal">
            Buscá empresas verificadas en Asunción, Luque, San Lorenzo, CDE y Encarnación.
            <span className="block font-semibold text-amber-300/90" style={{ marginTop: '2px' }}>Contactá directo por WhatsApp sin intermediarios.</span>
          </p>
          
          {/* Social Proof */}
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <div className="flex -space-x-2 overflow-hidden">
              <img className="inline-block h-6 w-6 rounded-full ring-2 ring-[#0F172A]" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64" alt="User" />
              <img className="inline-block h-6 w-6 rounded-full ring-2 ring-[#0F172A]" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=64&h=64" alt="User" />
              <img className="inline-block h-6 w-6 rounded-full ring-2 ring-[#0F172A]" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=64&h=64" alt="User" />
              <img className="inline-block h-6 w-6 rounded-full ring-2 ring-[#0F172A]" src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=64&h=64" alt="User" />
            </div>
            <p className="text-[11px] font-semibold text-slate-400">
              Más de <span className="text-white font-bold">1,000</span> personas ya conectaron con negocios locales hoy.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
