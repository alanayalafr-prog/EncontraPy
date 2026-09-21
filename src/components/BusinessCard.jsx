'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { WhatsAppIcon, MapPinIcon, ShieldCheckIcon, ClockIcon, StarIcon } from './Icons';
import { formatWhatsAppNumber, getBusinessWhatsAppMessage } from '../utils/phoneUtils';
import { isOpenNow, getRepresentativeImage, formatRating, getTrustStatus, canUseWhatsApp } from '../utils/businessUtils';

export default function BusinessCard({ business, onSelectDetail }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!business) return null;

  const defaultMessage = getBusinessWhatsAppMessage(business);
  const waUrl = `https://wa.me/${formatWhatsAppNumber(business.whatsappNumber)}?text=${encodeURIComponent(defaultMessage)}`;

  const trust = getTrustStatus(business);
  const { isOpen, label: openStatusLabel } = isOpenNow(business.workingHours);
  const ratingInfo = formatRating(business);
  const representativeImg = getRepresentativeImage(business);

  const isPremium = trust.type === 'destacado';
  const isVerified = trust.type === 'verificado' || isPremium;

  // Solo los planes Pro y Premium pueden tener galería interactiva en la tarjeta si tiene fotos válidas
  const images = (isPremium || business.plan === 'pro') && business.gallery && business.gallery.length > 0
    ? business.gallery
    : [representativeImg];

  const currentImage = images[currentImageIndex] || representativeImg;

  // Generador de estrellas reales
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
      className={`rounded-2xl flex flex-col justify-between overflow-hidden transition-all duration-200 hover:-translate-y-0.5 bg-[#151F32] border ${
        isPremium
          ? 'border-amber-400/40 hover:border-amber-300 shadow-lg shadow-amber-500/5'
          : isVerified
          ? 'border-emerald-500/30 hover:border-emerald-500/60 shadow-md'
          : 'border-[#27354D] hover:border-slate-500'
      }`}
    >
      <div>
        {/* Aspect-Ratio Image Container */}
        <div 
          className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900 group cursor-pointer"
          onClick={() => onSelectDetail(business)}
        >
          <Image
            src={currentImage}
            alt={business.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            unoptimized={typeof currentImage === 'string' && currentImage.startsWith('http')}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#151F32] via-[#151F32]/25 to-transparent z-10" />
          
          {/* Carousel Controls if multiple photos */}
          {images.length > 1 && (
            <div className="absolute inset-0 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
              <button 
                onClick={(e) => { e.stopPropagation(); setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1)); }}
                className="bg-black/60 text-white p-1 rounded-full hover:bg-black/90 text-xs"
                aria-label="Foto anterior"
              >
                ◀
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1)); }}
                className="bg-black/60 text-white p-1 rounded-full hover:bg-black/90 text-xs"
                aria-label="Siguiente foto"
              >
                ▶
              </button>
            </div>
          )}

          {/* Carousel Dots */}
          {images.length > 1 && (
            <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-1 z-20">
              {images.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`h-1.5 rounded-full transition-all ${idx === currentImageIndex ? 'w-3.5 bg-amber-400' : 'w-1.5 bg-white/60'}`} 
                />
              ))}
            </div>
          )}
          
          {/* Badge Top Left */}
          <div className="absolute top-2.5 left-2.5 z-20">
            {isPremium ? (
              <span className="bg-amber-400 text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded shadow flex items-center gap-1 tracking-wider">
                ⭐️ DESTACADO
              </span>
            ) : isVerified ? (
              <span className="bg-emerald-950/90 text-emerald-400 text-[10px] font-bold uppercase px-2 py-0.5 rounded border border-emerald-500/40 shadow backdrop-blur-sm flex items-center gap-1">
                <ShieldCheckIcon className="w-3 h-3" />
                <span>VERIFICADO</span>
              </span>
            ) : (
              <span className="bg-slate-900/85 text-slate-300 text-[10px] font-medium px-2 py-0.5 rounded border border-slate-700/60 backdrop-blur-sm">
                Ficha Local
              </span>
            )}
          </div>

          {/* Category Chip Bottom Left */}
          <div className="absolute bottom-2.5 left-2.5 z-20">
            <span className="bg-black/75 backdrop-blur-sm text-blue-300 text-[11px] font-semibold px-2 py-0.5 rounded border border-blue-900/40 max-w-[200px] truncate inline-block">
              {business.niche || business.categoryLabel || 'Comercio'}
            </span>
          </div>
        </div>

        {/* Card Content Body */}
        <div className="p-4 space-y-2.5">
          
          {/* Business Title & Verification */}
          <div>
            <div className="flex items-start justify-between gap-1.5">
              <h3
                onClick={() => onSelectDetail(business)}
                className="text-base font-bold text-white hover:text-blue-400 transition-colors cursor-pointer line-clamp-1 leading-snug"
                title={business.name}
              >
                {business.name}
              </h3>
              {isVerified && (
                <span title="Comercio Verificado" className="shrink-0 mt-0.5">
                  <ShieldCheckIcon className="w-4 h-4 text-emerald-400" />
                </span>
              )}
            </div>

            {/* Real Rating Display */}
            <div className="flex items-center gap-1.5 mt-1">
              {ratingInfo.hasReviews ? (
                <>
                  <div className="flex items-center text-xs space-x-0.5">
                    {renderVisualStars(Number(ratingInfo.rating))}
                  </div>
                  <span className="text-xs font-bold text-amber-400">{ratingInfo.rating}</span>
                  <span className="text-[11px] text-slate-400">({ratingInfo.reviewsCount})</span>
                </>
              ) : (
                <div className="flex items-center gap-1 text-[11px] text-slate-400">
                  <span className="text-slate-500">★</span>
                  <span>Sin reseñas aún</span>
                </div>
              )}
            </div>
          </div>

          {/* Location & Status Row */}
          <div className="flex items-center justify-between text-xs text-slate-300 pt-0.5">
            <div className="flex items-center gap-1 truncate text-slate-300">
              <MapPinIcon className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span className="font-semibold text-white truncate">{business.cityName || 'Paraguay'}</span>
              {business.zone && (
                <>
                  <span className="text-slate-500">•</span>
                  <span className="truncate text-slate-400">{business.zone}</span>
                </>
              )}
            </div>
            
            {isOpen ? (
              <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 shrink-0">
                <span className="pulse-green-dot"></span>
                <span>Abierto</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-[11px] font-medium text-slate-400 shrink-0">
                <span className="w-2 h-2 rounded-full bg-slate-500"></span>
                <span>Cerrado</span>
              </div>
            )}
          </div>

          {/* Description Clamped */}
          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
            {business.description || 'Comercio local en Paraguay disponible para consultas directas por WhatsApp.'}
          </p>

          {/* Hours Info */}
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 pt-2 border-t border-[#27354D]/70">
            <ClockIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{business.workingHours || 'Horario a confirmar por WhatsApp'}</span>
          </div>

        </div>
      </div>

      {/* Footer Action Buttons */}
      <div className="p-4 pt-0 space-y-2">
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`${
            canUseWhatsApp(business)
              ? 'btn-whatsapp-official shadow-lg shadow-emerald-500/25'
              : 'btn-whatsapp-dimmed opacity-85 hover:opacity-100'
          } w-full py-2.5 px-3 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.01]`}
          title={canUseWhatsApp(business) ? "WhatsApp Oficial • Respuesta Rápida" : "Contactar por WhatsApp (Ficha Básica)"}
        >
          <WhatsAppIcon className={`w-4 h-4 shrink-0 ${canUseWhatsApp(business) ? '' : 'text-emerald-400/60'}`} />
          <span>Contactar por WhatsApp</span>
        </a>

        <div className="flex items-center justify-between pt-0.5 px-1">
          <span className="text-[10px] text-slate-400">
            {canUseWhatsApp(business) ? (
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <span className="pulse-green-dot"></span>
                <span>WhatsApp Activo</span>
              </span>
            ) : (
              <span>Sin comisiones</span>
            )}
          </span>
          <button
            onClick={() => onSelectDetail(business)}
            className="text-[11px] text-blue-400 hover:text-blue-300 font-semibold transition-colors hover:underline"
          >
            Ver Ficha Completa →
          </button>
        </div>
      </div>

    </div>
  );
}
