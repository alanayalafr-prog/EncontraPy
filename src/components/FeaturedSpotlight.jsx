import React, { useRef } from 'react';
import { CrownIcon, StarIcon, WhatsAppIcon, ShieldCheckIcon, MapPinIcon } from './Icons';
import { formatWhatsAppNumber, getBusinessWhatsAppMessage } from '../utils/phoneUtils';

import { getRepresentativeImage } from '../utils/businessUtils';

export default function FeaturedSpotlight({ businesses = [], onSelectDetail }) {
  const carouselRef = useRef(null);
  const premiumBusinesses = businesses.filter(b => b.plan === 'premium' && b.isVerified);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  if (premiumBusinesses.length === 0) return null;

  return (
    <section className="relative overflow-hidden rounded-2xl bg-[#131D2F] border border-amber-400/30 p-4 sm:p-5 shadow-lg">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#27354D]/60 relative z-10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-400/10 text-amber-400 border border-amber-400/20 shrink-0 flex items-center justify-center">
            <CrownIcon className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
                Comercios Destacados
              </h2>
              <span className="bg-amber-400 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">
                VIP
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Empresas verificadas con atención prioritaria en Paraguay
            </p>
          </div>
        </div>

        {/* Carousel Arrow Controls */}
        <div className="flex items-center gap-1.5">
          <button 
            onClick={scrollLeft}
            className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#1E293B] hover:bg-[#27354D] text-slate-300 hover:text-white transition-colors border border-[#27354D]"
            aria-label="Desplazar hacia la izquierda"
          >
            ‹
          </button>
          <button 
            onClick={scrollRight}
            className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#1E293B] hover:bg-[#27354D] text-slate-300 hover:text-white transition-colors border border-[#27354D]"
            aria-label="Desplazar hacia la derecha"
          >
            ›
          </button>
        </div>
      </div>

      {/* Carousel Container */}
      <div ref={carouselRef} className="flex overflow-x-auto gap-3.5 pb-1 relative z-10 snap-x snap-mandatory items-stretch scroll-smooth scrollbar-none">
        {premiumBusinesses.map((business, index) => {
          const defaultMessage = getBusinessWhatsAppMessage(business);
          const waUrl = `https://wa.me/${formatWhatsAppNumber(business.whatsappNumber)}?text=${encodeURIComponent(defaultMessage)}`;
          const photo = getRepresentativeImage(business);

          return (
            <div
              key={`${business.id}-${index}`}
              onClick={() => onSelectDetail(business)}
              className="w-[220px] sm:w-[240px] shrink-0 snap-start bg-[#151F32] border border-[#27354D] hover:border-amber-400/50 rounded-xl p-3 flex flex-col justify-between space-y-2.5 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 shadow-sm"
            >
              <div className="space-y-2">
                
                {/* Image & Badge */}
                <div className="relative aspect-[16/10] rounded-lg overflow-hidden bg-slate-900">
                  <img
                    src={photo}
                    alt={business.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#151F32] via-transparent to-transparent" />
                  
                  <span className="absolute top-1.5 left-1.5 bg-amber-400 text-slate-950 text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">
                    VIP ⭐️
                  </span>

                  <span className="absolute bottom-1.5 left-1.5 text-[9px] font-semibold text-blue-300 bg-black/80 backdrop-blur-sm px-1.5 py-0.5 rounded truncate max-w-[180px]">
                    {business.niche || business.categoryLabel}
                  </span>
                </div>

                {/* Title & Location */}
                <div>
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="font-bold text-xs sm:text-sm text-white hover:text-blue-300 transition-colors line-clamp-1">
                      {business.name}
                    </h3>
                    <ShieldCheckIcon className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  </div>

                  <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5 truncate">
                    <MapPinIcon className="w-3 h-3 text-blue-400 shrink-0" />
                    <span className="font-semibold text-slate-300">{business.cityName}</span>
                    {business.zone && (
                      <>
                        <span>•</span>
                        <span className="truncate">{business.zone}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                  {business.description}
                </p>

              </div>

              {/* Action WhatsApp Button */}
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="btn-whatsapp-official w-full text-[11px] font-bold py-2 px-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all"
              >
                <WhatsAppIcon className="w-3.5 h-3.5 shrink-0" />
                <span>Contactar directo</span>
              </a>

            </div>
          );
        })}
      </div>

    </section>
  );
}
