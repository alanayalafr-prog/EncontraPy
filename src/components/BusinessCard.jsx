import React, { useState } from 'react';
import { WhatsAppIcon, MapPinIcon, ShieldCheckIcon, ClockIcon } from './Icons';
import { formatWhatsAppNumber } from '../utils/phoneUtils';

export default function BusinessCard({ business, onSelectDetail }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const waUrl = `https://wa.me/${formatWhatsAppNumber(business.whatsappNumber)}?text=${encodeURIComponent(business.whatsappDefaultMessage)}`;
  
  const isPremium = business.plan === 'premium';
  const isPro = business.plan === 'pro';
  
  // Solo los planes Pro y Premium pueden tener galería en la tarjeta.
  // El plan gratuito solo muestra la imagen principal.
  const images = (isPremium || isPro) && business.gallery && business.gallery.length > 0
    ? business.gallery 
    : [business.image];

  // Visual Star Rating Generator (e.g. 4.9 -> ★★★★★)
  const renderVisualStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<span key={i} className="text-amber-400">★</span>);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<span key={i} className="text-amber-400">★</span>);
      } else {
        stars.push(<span key={i} className="text-slate-600">★</span>);
      }
    }
    return stars;
  };

  return (
    <div
      className={`rounded-2xl flex flex-col justify-between overflow-hidden transition-all duration-200 hover:-translate-y-1 ${
        isPremium
          ? 'bg-gradient-to-b from-[#1C273D] to-[#151F32] border-2 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.22)] hover:border-amber-300 hover:shadow-[0_0_28px_rgba(245,158,11,0.35)]'
          : isPro
          ? 'bg-[#151F32] border border-blue-500/50 shadow-md hover:border-blue-400'
          : 'bg-[#151F32] border border-[#27354D] opacity-90 hover:opacity-100 hover:border-slate-500'
      }`}
    >
      <div>
        {/* Standardized Aspect-Ratio Image Container */}
        <div 
          className="relative aspect-video w-full overflow-hidden bg-slate-900 group cursor-pointer"
          onClick={() => onSelectDetail(business)}
        >
          <img
            src={images[currentImageIndex]}
            alt={business.name}
            className="w-full h-full object-cover transition-opacity duration-300"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#151F32] via-[#151F32]/30 to-transparent" />
          
          {/* Carousel Controls */}
          {images.length > 1 && (
            <div className="absolute inset-0 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
              <button 
                onClick={(e) => { e.stopPropagation(); setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1)); }}
                className="bg-black/50 text-white p-1 rounded-full hover:bg-black/80"
              >
                ◀
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1)); }}
                className="bg-black/50 text-white p-1 rounded-full hover:bg-black/80"
              >
                ▶
              </button>
            </div>
          )}
          {/* Carousel Dots */}
          {images.length > 1 && (
            <div className="absolute bottom-9 left-0 right-0 flex justify-center gap-1 z-20">
              {images.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`h-1.5 rounded-full transition-all ${idx === currentImageIndex ? 'w-4 bg-amber-400' : 'w-1.5 bg-white/50'}`} 
                />
              ))}
            </div>
          )}
          
          {/* Single Dominant Badge on Top Left */}
          <div className="absolute top-3 left-3 z-10">
            {isPremium ? (
              <span className="bg-amber-400 text-black text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded-md shadow-lg flex items-center gap-1">
                ⭐️ DESTACADO
              </span>
            ) : isPro || business.isVerified ? (
              <span className="bg-emerald-950/90 text-emerald-400 text-[10px] font-bold uppercase px-2 py-0.5 rounded border border-emerald-500/40 shadow backdrop-blur-sm flex items-center gap-1">
                <ShieldCheckIcon className="w-3 h-3" />
                <span>VERIFICADO</span>
              </span>
            ) : null}
          </div>

          {/* Category Chip over Image Bottom */}
          <div className="absolute bottom-2.5 left-3">
            <span className="bg-black/75 backdrop-blur-sm text-blue-300 text-[11px] font-bold px-2.5 py-0.5 rounded border border-blue-900/50">
              {business.niche}
            </span>
          </div>
        </div>

        {/* Card Content Body */}
        <div className="p-4 space-y-3">
          
          {/* Business Title & Verification Check */}
          <div>
            <div className="flex items-center justify-between gap-2">
              <h3
                onClick={() => onSelectDetail(business)}
                className={`text-lg font-bold hover:text-amber-400 transition-colors cursor-pointer line-clamp-1 tracking-tight ${
                  isPremium ? 'text-white' : 'text-slate-100'
                }`}
              >
                {business.name}
              </h3>
              {(isPremium || isPro) && business.isVerified && (
                <span title="Comercio Verificado" className="shrink-0">
                  <ShieldCheckIcon className="w-4 h-4 text-emerald-400" />
                </span>
              )}
            </div>

            {/* Fixed Star Rating Row */}
            <div className="flex items-center gap-1.5 mt-1">
              <div className="flex items-center text-xs space-x-0.5">
                {renderVisualStars(business.rating)}
              </div>
              <span className="text-xs font-bold text-amber-400">{business.rating}</span>
              <span className="text-[11px] text-slate-400">({business.reviewCount} reseñas)</span>
            </div>
          </div>

          {/* Location & Abierto Ahora Row */}
          <div className="flex items-center justify-between text-xs text-slate-300 pt-1">
            <div className="flex items-center gap-1.5 truncate">
              <MapPinIcon className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="font-bold text-white">{business.cityName}</span>
              <span>•</span>
              <span className="truncate text-slate-300">{business.zone}</span>
            </div>
            
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 shrink-0">
              <span className="pulse-green-dot"></span>
              <span>Abierto</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
            {business.description}
          </p>

          {/* Hours with Clock Icon */}
          <div className="flex items-center gap-1.5 text-[11px] text-slate-300 pt-2 border-t border-[#27354D]">
            <ClockIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{business.workingHours}</span>
          </div>

        </div>
      </div>

      {/* Footer Action Buttons with Explicit CTA Hierarchy */}
      <div className="p-4 pt-0 space-y-2">
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`w-full flex items-center justify-center gap-2 transition-all ${
            isPremium
              ? 'bg-gradient-to-r from-[#25D366] to-[#10B981] hover:from-[#1DA851] hover:to-[#059669] text-white text-xs font-black py-3 px-4 rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 border border-emerald-300/40 tracking-wide uppercase hover:scale-[1.02]'
              : isPro
              ? 'bg-[#25D366] hover:bg-[#1DA851] text-white text-xs font-bold py-2.5 px-3 rounded-xl shadow-md'
              : 'bg-[#132A24] hover:bg-[#1A3830] text-emerald-400 hover:text-emerald-300 border border-emerald-500/40 text-xs font-semibold py-2 px-3 rounded-xl'
          }`}
          title="Contactar por WhatsApp"
        >
          <WhatsAppIcon className="w-4 h-4 shrink-0" />
          <span>{isPremium ? '💬 Contactar por WhatsApp' : isPro ? 'Contactar por WhatsApp' : 'Enviar WhatsApp'}</span>
        </a>

        <div className="text-center">
          <button
            onClick={() => onSelectDetail(business)}
            className="text-[11px] text-slate-400 hover:text-white font-medium transition-colors hover:underline"
          >
            Ver Ficha Completa →
          </button>
        </div>
      </div>

    </div>
  );
}
