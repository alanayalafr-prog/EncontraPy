'use client';
import React, { useState, useEffect } from 'react';
import { WhatsAppIcon, ShieldCheckIcon, SparklesIcon, MapPinIcon } from './Icons';

export default function LiveTicker() {
  const tickerItems = [
    { id: 1, text: '+34 consultas enviadas por WhatsApp hoy en Gran Asunción', icon: WhatsAppIcon, color: 'text-emerald-400' },
    { id: 2, text: '58 comercios con insignia de Comercio Verificado', icon: ShieldCheckIcon, color: 'text-blue-400' },
    { id: 3, text: 'Nicho líder de búsquedas: Oficios del Hogar & Agro', icon: SparklesIcon, color: 'text-amber-400' },
    { id: 4, text: 'Nuevos comercios registrados en Luque, CDE y San Lorenzo', icon: MapPinIcon, color: 'text-pink-400' }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % tickerItems.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [tickerItems.length]);

  const current = tickerItems[currentIndex];
  const IconComp = current.icon;

  return (
    <div className="bg-gradient-to-r from-blue-950/90 via-indigo-950/80 to-slate-950 border-b border-white/5 py-2 px-4 text-xs overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Ticker Item */}
        <div className="flex items-center gap-2 transition-all duration-500 animate-fadeIn">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <IconComp className={`w-3.5 h-3.5 ${current.color}`} />
          <span className="font-semibold text-slate-200 tracking-wide">
            {current.text}
          </span>
        </div>

        {/* Right Info */}
        <div className="hidden md:flex items-center gap-3 text-[11px] text-slate-400">
          <span className="flex items-center gap-1 font-mono text-emerald-400">
            ⚡ 100% Directo a WhatsApp
          </span>
          <span>•</span>
          <span>Sin Formularios Intermedios</span>
        </div>

      </div>
    </div>
  );
}

