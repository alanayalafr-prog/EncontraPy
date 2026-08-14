'use client';
import React, { useState } from 'react';
import { MapPinIcon, WhatsAppIcon, StarIcon, ShieldCheckIcon, SparklesIcon } from './Icons';
import { formatWhatsAppNumber } from '../utils/phoneUtils';

export default function MapView({ businesses, onSelectDetail }) {
  const [selectedPin, setSelectedPin] = useState(businesses[0] || null);

  const cityCoordinates = {
    asuncion: { top: '45%', left: '32%', name: 'Asunción' },
    luque: { top: '38%', left: '38%', name: 'Luque' },
    san_lorenzo: { top: '52%', left: '42%', name: 'San Lorenzo' },
    lambare: { top: '58%', left: '30%', name: 'Lambaré' },
    cde: { top: '40%', left: '82%', name: 'Ciudad del Este' },
    encarnacion: { top: '85%', left: '55%', name: 'Encarnación' }
  };

  return (
    <div className="glass-panel p-6 rounded-3xl relative overflow-hidden space-y-6">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-card)]">
        <div>
          <span className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
            <SparklesIcon className="w-3.5 h-3.5 text-amber-400" />
            Exploración Geográfica Interactivas
          </span>
          <h3 className="text-xl font-bold text-[var(--text-primary)]">
            Mapa de Comercios Verificados en Paraguay 🗺️
          </h3>
        </div>
        <div className="text-xs text-[var(--text-secondary)] font-mono">
          📍 Tocá un marcador para ver el comercio
        </div>
      </div>

      {/* Simulated Map Container */}
      <div className="relative w-full h-[420px] rounded-2xl overflow-hidden bg-[#0A1224] border border-blue-900/40 shadow-inner flex items-center justify-center">
        
        {/* Map Grid Background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#1E293B_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#060B17] via-transparent to-transparent pointer-events-none" />

        {/* Map Waterbody / Parana River simulation lines */}
        <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <path d="M 50,400 Q 150,300 250,350 T 450,200 T 650,250 T 900,100" fill="none" stroke="#3B82F6" strokeWidth="4" strokeDasharray="6 6" />
        </svg>

        {/* City Markers on Map */}
        {businesses.map((item, index) => {
          const coords = cityCoordinates[item.city] || { top: `${20 + index * 12}%`, left: `${25 + index * 10}%` };
          const isSelected = selectedPin?.id === item.id;

          return (
            <div
              key={item.id}
              onClick={() => setSelectedPin(item)}
              style={{ top: coords.top, left: coords.left }}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group"
            >
              {/* Pulse animation ring */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                isSelected
                  ? 'bg-amber-500 text-black scale-125 shadow-lg shadow-amber-500/50'
                  : 'bg-blue-600/80 text-white hover:bg-amber-400 hover:text-black hover:scale-110'
              }`}>
                <MapPinIcon className="w-5 h-5" />
              </div>

              {/* Tooltip on hover */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-black/90 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md whitespace-nowrap z-30">
                {item.name} ({item.cityName})
              </div>
            </div>
          );
        })}

        {/* Selected Business Floating Detail Card Overlay */}
        {selectedPin && (
          <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 glass-panel p-4 rounded-2xl bg-slate-900/95 border border-amber-500/40 shadow-2xl z-30 space-y-3 animate-fadeIn">
            
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-400">
                  {selectedPin.categoryLabel}
                </span>
                <h4 className="text-sm font-bold text-white mt-1 line-clamp-1">
                  {selectedPin.name}
                </h4>
                <p className="text-xs text-slate-300">
                  📍 {selectedPin.cityName}, {selectedPin.zone}
                </p>
              </div>
              <div className="flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded text-xs font-bold text-amber-400">
                <StarIcon className="w-3.5 h-3.5" />
                <span>{selectedPin.rating}</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 line-clamp-2">
              {selectedPin.description}
            </p>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => onSelectDetail(selectedPin)}
                className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700"
              >
                Ver Ficha
              </button>
              <a
                href={`https://wa.me/${formatWhatsAppNumber(selectedPin.whatsappNumber)}?text=${encodeURIComponent(selectedPin.whatsappDefaultMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp text-xs py-2 rounded-xl flex items-center justify-center gap-1"
              >
                <WhatsAppIcon className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

