'use client';
import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { MapPinIcon, WhatsAppIcon, StarIcon, ShieldCheckIcon, SparklesIcon, XIcon } from './Icons';
import { formatWhatsAppNumber, getBusinessWhatsAppMessage } from '../utils/phoneUtils';
import { getRepresentativeImage, formatRating, isOpenNow, getTrustStatus } from '../utils/businessUtils';

export default function MapView({ businesses = [], onSelectDetail, onBackToGrid }) {
  const [selectedPin, setSelectedPin] = useState(businesses[0] || null);
  const cardListRef = useRef(null);

  useEffect(() => {
    if (businesses.length > 0 && !selectedPin) {
      setSelectedPin(businesses[0]);
    }
  }, [businesses, selectedPin]);

  // Posicionamiento de ciudades en el mapa representativo de Paraguay
  const cityCoordinates = {
    asuncion: { top: '48%', left: '32%', name: 'Asunción' },
    luque: { top: '42%', left: '38%', name: 'Luque' },
    san_lorenzo: { top: '53%', left: '40%', name: 'San Lorenzo' },
    lambare: { top: '56%', left: '30%', name: 'Lambaré' },
    fernando_de_la_mora: { top: '50%', left: '36%', name: 'Fernando de la Mora' },
    nemby: { top: '60%', left: '38%', name: 'Ñemby' },
    villa_elisa: { top: '58%', left: '34%', name: 'Villa Elisa' },
    cde: { top: '44%', left: '80%', name: 'Ciudad del Este' },
    encarnacion: { top: '82%', left: '54%', name: 'Encarnación' }
  };

  const handleSelectBusiness = (business) => {
    setSelectedPin(business);
    // Scroll selected card into view in sidebar
    const el = document.getElementById(`map-card-${business.id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  return (
    <div className="rounded-2xl bg-[#0F172A] border border-[#27354D] overflow-hidden shadow-xl space-y-0">
      
      {/* Map Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5 border-b border-[#27354D] bg-[#151F32]">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-blue-400 uppercase tracking-wider">
            <SparklesIcon className="w-3.5 h-3.5 text-amber-400" />
            <span>Exploración geográfica interactiva</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
            Mapa de Comercios en Paraguay 🗺️
          </h3>
          <p className="text-xs text-slate-400">
            Tocá cualquier marcador para ver detalles y contacto directo
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onBackToGrid && (
            <button
              onClick={onBackToGrid}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <span>← Volver a grilla</span>
            </button>
          )}
        </div>
      </div>

      {/* Split View Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px]">
        
        {/* Left: Scrollable List of Businesses (Desktop 5 cols, Mobile under map) */}
        <div 
          ref={cardListRef}
          className="order-2 lg:order-1 lg:col-span-5 max-h-[380px] lg:max-h-[500px] overflow-y-auto p-3 sm:p-4 space-y-2.5 border-t lg:border-t-0 lg:border-r border-[#27354D] bg-[#0B1120]"
        >
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Comercios en la zona ({businesses.length})</span>
            <span className="text-slate-500 font-normal">Click para ubicar</span>
          </div>

          {businesses.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-xs">
              No hay comercios en este filtro para mostrar en el mapa.
            </div>
          ) : (
            businesses.map((item) => {
              const isSelected = selectedPin?.id === item.id;
              const photo = getRepresentativeImage(item);
              const ratingInfo = formatRating(item);
              const trust = getTrustStatus(item);

              return (
                <div
                  key={item.id}
                  id={`map-card-${item.id}`}
                  onClick={() => handleSelectBusiness(item)}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                    isSelected
                      ? 'bg-[#1C2942] border-blue-500 shadow-md ring-1 ring-blue-500/40'
                      : 'bg-[#151F32] border-[#27354D] hover:bg-[#1E293B] hover:border-slate-600'
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-slate-900 shrink-0">
                    <img src={photo} alt={item.name} className="w-full h-full object-cover" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-xs sm:text-sm text-white truncate">
                        {item.name}
                      </h4>
                      {trust.type === 'verificado' && (
                        <ShieldCheckIcon className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-slate-400 truncate">
                      <MapPinIcon className="w-3 h-3 text-blue-400 shrink-0" />
                      <span>{item.cityName}</span>
                      {item.zone && <span>• {item.zone}</span>}
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-slate-300 font-semibold truncate max-w-[120px]">
                        {item.niche || item.categoryLabel}
                      </span>
                      {ratingInfo.hasReviews && (
                        <span className="text-[10px] text-amber-400 font-bold flex items-center gap-0.5">
                          ★ {ratingInfo.rating}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right: Interactive Simulated Map Canvas (Desktop 7 cols, Mobile order-1) */}
        <div className="order-1 lg:order-2 lg:col-span-7 relative h-[320px] sm:h-[400px] lg:h-[500px] bg-[#070D18] flex items-center justify-center overflow-hidden">
          
          {/* Map Grid Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#1E293B_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none" />
          
          {/* Parana River & Paraguay River representation */}
          <svg className="absolute inset-0 w-full h-full opacity-25 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <path d="M 120,0 Q 140,200 160,350 T 180,500" fill="none" stroke="#2563EB" strokeWidth="4" strokeDasharray="4 4" />
            <path d="M 180,350 Q 280,380 400,320 T 550,260 T 700,350" fill="none" stroke="#3B82F6" strokeWidth="3" opacity="0.6" />
          </svg>

          {/* Region outlines */}
          <div className="absolute top-4 left-4 text-[10px] font-mono font-bold text-slate-600 uppercase tracking-widest pointer-events-none">
            🇵🇾 Territorio Nacional de Paraguay
          </div>

          {/* City Markers on Map */}
          {businesses.map((item, index) => {
            // Offset slight randomness if multiple items in the same city so pins don't overlap completely
            const baseCoords = cityCoordinates[item.city] || { top: '50%', left: '40%' };
            const offsetTop = (index % 4) * 3 - 4;
            const offsetLeft = Math.floor(index / 2) * 3 - 4;

            const isSelected = selectedPin?.id === item.id;
            const isPremium = item.plan === 'premium' && item.isVerified;
            const isVerified = item.isVerified;

            return (
              <div
                key={item.id}
                onClick={() => handleSelectBusiness(item)}
                style={{
                  top: `calc(${baseCoords.top} + ${offsetTop}%)`,
                  left: `calc(${baseCoords.left} + ${offsetLeft}%)`
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group"
              >
                {/* Marker Pin */}
                <div 
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950 scale-125 shadow-lg shadow-amber-500/50 ring-2 ring-white z-30'
                      : isPremium
                      ? 'bg-amber-500 text-slate-950 hover:scale-110 shadow-md ring-1 ring-amber-300'
                      : isVerified
                      ? 'bg-emerald-600 text-white hover:scale-110 shadow-md ring-1 ring-emerald-400'
                      : 'bg-blue-600 text-white hover:scale-110 shadow-md'
                  }`}
                  title={`${item.name} (${item.cityName})`}
                >
                  <MapPinIcon className="w-4 h-4" />
                </div>

                {/* Pin Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block bg-slate-950 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg whitespace-nowrap z-40 border border-slate-700 pointer-events-none">
                  {item.name}
                </div>
              </div>
            );
          })}

          {/* Selected Business Floating Card Overlay */}
          {selectedPin && (
            <div className="absolute bottom-3 left-3 right-3 sm:left-auto sm:right-4 sm:w-80 p-3.5 rounded-xl bg-[#151F32]/95 border border-[#27354D] backdrop-blur-md shadow-2xl z-30 space-y-2.5 animate-fadeIn">
              
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                    {selectedPin.niche || selectedPin.categoryLabel}
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-white mt-1 truncate">
                    {selectedPin.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 truncate">
                    📍 {selectedPin.cityName} {selectedPin.zone ? `• ${selectedPin.zone}` : ''}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedPin(null)}
                  className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  aria-label="Cerrar vista previa"
                >
                  <XIcon className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => onSelectDetail(selectedPin)}
                  className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 transition-colors text-center"
                >
                  Ver Ficha
                </button>
                <a
                  href={`https://wa.me/${formatWhatsAppNumber(selectedPin.whatsappNumber)}?text=${encodeURIComponent(getBusinessWhatsAppMessage(selectedPin))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp-official text-xs py-2 px-2 rounded-lg flex items-center justify-center gap-1 font-bold"
                >
                  <WhatsAppIcon className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
