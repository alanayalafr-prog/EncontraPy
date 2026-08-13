import React, { useRef } from 'react';
import { CrownIcon, StarIcon, WhatsAppIcon, ShieldCheckIcon, MapPinIcon } from './Icons';

export default function FeaturedSpotlight({ businesses = [], onSelectDetail }) {
  const carouselRef = useRef(null);
  const premiumBusinesses = businesses.filter(b => b.plan === 'premium');

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -350, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 350, behavior: 'smooth' });
    }
  };

  if (premiumBusinesses.length === 0) return null;

  return (
    <section style={{ marginTop: '8px', marginBottom: '20px' }} className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1E1B4B] via-[#0F172A] to-[#1E1B4B] border-2 border-amber-400/60 p-4 sm:p-5 shadow-2xl shadow-amber-500/10">
      
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Centrado */}
      <div className="flex flex-col items-center justify-center text-center space-y-2 pb-6 border-b border-slate-800 relative z-10">
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          <div className="p-2 rounded-2xl bg-amber-400/20 text-amber-400 border border-amber-400/30 shrink-0 flex items-center justify-center">
            <CrownIcon className="w-4 h-4" />
          </div>
          <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
            Comercios Destacados
          </h2>
          <span className="bg-amber-400 text-black text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
            VIP ⭐️
          </span>
        </div>
        <p className="text-[10px] sm:text-xs text-slate-300 max-w-xl mx-auto leading-relaxed">
          Empresas verificadas con máxima recomendación y prioridad de respuesta en Paraguay.
        </p>
      </div>

      {/* Carousel Container with Navigation */}
      <div className="relative group/carousel">
        
        {/* Navigation Arrows (visible on desktop hover) */}
        <button 
          onClick={scrollLeft}
          className="hidden md:flex opacity-0 group-hover/carousel:opacity-100 absolute -left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 items-center justify-center rounded-full bg-[#0F172A]/90 backdrop-blur border border-amber-500/50 text-amber-400 hover:bg-amber-400 hover:text-black transition-all shadow-[0_0_15px_rgba(245,158,11,0.2)]"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        </button>
        
        <button 
          onClick={scrollRight}
          className="hidden md:flex opacity-0 group-hover/carousel:opacity-100 absolute -right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 items-center justify-center rounded-full bg-[#0F172A]/90 backdrop-blur border border-amber-500/50 text-amber-400 hover:bg-amber-400 hover:text-black transition-all shadow-[0_0_15px_rgba(245,158,11,0.2)]"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
        </button>

        {/* Showcase Horizontal Carousel */}
        <div ref={carouselRef} className="flex overflow-x-auto gap-4 pt-4 pb-4 relative z-10 snap-x snap-mandatory items-stretch scroll-smooth">
        {premiumBusinesses.map((business, index) => {
          const waUrl = `https://wa.me/${business.whatsappNumber}?text=${encodeURIComponent(business.whatsappDefaultMessage)}`;

          return (
            <div
              key={`${business.id}-${index}`}
              onClick={() => onSelectDetail(business)}
              className="w-[75vw] sm:w-[240px] shrink-0 snap-center group bg-[#0F172A]/90 border border-amber-400/40 hover:border-amber-300 rounded-2xl p-3 flex flex-col justify-between space-y-3 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/15"
            >
              <div className="space-y-3">
                
                {/* Image & Badge */}
                <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-slate-900">
                  <img
                    src={business.image}
                    alt={business.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent" />
                  
                  <span className="absolute top-2 left-2 bg-amber-400 text-black text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider shadow">
                    VIP 👑
                  </span>

                  <span className="absolute bottom-1.5 left-1.5 text-[9px] font-bold text-amber-300 bg-black/80 backdrop-blur-sm px-1.5 py-0.5 rounded">
                    {business.niche}
                  </span>
                </div>

                {/* Title & Location */}
                <div>
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="font-extrabold text-sm text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                      {business.name}
                    </h3>
                    <ShieldCheckIcon className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  </div>

                  <div className="flex items-center gap-1 text-[10px] text-slate-300 mt-1">
                    <MapPinIcon className="w-3 h-3 text-amber-400 shrink-0" />
                    <span className="font-bold text-white">{business.cityName}</span>
                    <span>•</span>
                    <span className="truncate text-slate-400">{business.zone}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-[10px] text-slate-300 line-clamp-2 leading-relaxed">
                  {business.description}
                </p>

              </div>

              {/* Action WhatsApp Button */}
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="w-full bg-gradient-to-r from-[#25D366] to-[#10B981] hover:from-[#1DA851] hover:to-[#059669] text-white text-[10px] font-black py-2 px-2 rounded-lg shadow-md flex items-center justify-center gap-1.5 uppercase tracking-wide transition-all hover:scale-[1.02]"
              >
                <WhatsAppIcon className="w-3.5 h-3.5 shrink-0" />
                <span>Contactar en 1-Clic</span>
              </a>

            </div>
          );
        })}
        </div>
      </div>

    </section>
  );
}
