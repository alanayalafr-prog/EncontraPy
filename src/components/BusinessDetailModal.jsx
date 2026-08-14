'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/config/supabase';
import { 
  XIcon, 
  WhatsAppIcon, 
  MapPinIcon, 
  PhoneIcon, 
  ClockIcon, 
  StarIcon, 
  ShieldCheckIcon, 
  InstagramIcon, 
  FacebookIcon, 
  GlobeIcon, 
  ImageIcon, 
  SparklesIcon,
  CrownIcon
} from './Icons';
import { formatWhatsAppNumber } from '../utils/phoneUtils';

export default function BusinessDetailModal({ business, relatedBusinesses = [], reviews = [], onClose, onClaimClick }) {
  if (!business) return null;

  const [activeImage, setActiveImage] = useState(business.image);
  const [reviewName, setReviewName] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    if (business) {
      setActiveImage(business.image);
      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [business]);

  const waUrl = `https://wa.me/${formatWhatsAppNumber(business.whatsappNumber)}?text=${encodeURIComponent(business.whatsappDefaultMessage)}`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${business.name} ${business.address} ${business.cityName} Paraguay`)}`;
  
  const isProOrPremium = (business.plan === 'pro' || business.plan === 'premium') && business.isVerified;
  const isPremium = business.plan === 'premium' && business.isVerified;
  const galleryImages = (business.gallery && business.gallery.length > 0) ? business.gallery : [business.image];

  return (
    <div className="modal-overlay animate-fadeIn" onClick={onClose}>
      <div
        className="glass-panel w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[#0B1120] border border-[#27354D] shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-black/70 text-white hover:bg-black/90 transition-colors shadow-lg border border-white/20"
        >
          <XIcon className="w-5 h-5" />
        </button>

        {/* Hero Photo Viewer */}
        <div className="relative w-full h-[45vh] min-h-[24rem] sm:h-[50vh] sm:min-h-[28rem] flex flex-col justify-end overflow-hidden bg-slate-900 pt-24 pb-5 px-5 sm:px-10">
          <Image
            src={activeImage}
            alt={business.name}
            fill
            className="absolute inset-0 w-full h-full object-cover transition-all duration-300 z-0"
            priority
            unoptimized={activeImage?.startsWith('http')}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] from-10% via-[#0B1120]/70 via-45% to-transparent z-10" />
          
          <div className="relative z-20 space-y-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-600/90 backdrop-blur-md text-white text-[11px] font-semibold">
                {business.categoryLabel} • {business.niche}
              </span>
              
              {isPremium && (
                <span className="bg-amber-400 text-black text-[11px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow">
                  ⭐️ Destacado Premium VIP
                </span>
              )}

              {business.isVerified && (
                <span className="bg-emerald-950/90 text-emerald-400 text-[11px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/40 backdrop-blur-md flex items-center gap-1">
                  <ShieldCheckIcon className="w-3.5 h-3.5" />
                  <span>Comercio Verificado</span>
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-md leading-tight">
              {business.name}
            </h2>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-8 sm:p-10 space-y-8" style={{ padding: '1.7rem 2.1rem' }}>
          
          {/* Interactive Photo Gallery (Pro & Premium Plan Feature) */}
          {isProOrPremium && galleryImages.length > 1 && (
            <div className="space-y-2 p-4 rounded-2xl bg-[#151F32] border border-[#27354D]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4" />
                  <span>Galería de Fotos del Comercio ({galleryImages.length})</span>
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">Haz clic para ampliar</span>
              </div>
              <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`relative w-20 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                      activeImage === img ? 'border-amber-400 scale-105 shadow-md' : 'border-slate-700 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt={`Galería ${idx + 1}`} fill className="object-cover" sizes="80px" unoptimized={img?.startsWith('http')} />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Rating & Location Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#151F32] border border-[#27354D]">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <StarIcon className="w-5 h-5" />
              <span className="text-lg">{business.rating}</span>
              <span className="text-xs text-slate-300 font-normal">({business.reviewCount} valoraciones de clientes)</span>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <MapPinIcon className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{business.cityName}, {business.zone}</span>
            </div>
          </div>

          {/* Mapa Interactivo (Premium & Pro Only) */}
          {(business.plan === 'premium' || business.plan === 'pro') && (
            <div className="mt-4 p-4 rounded-xl bg-[#151F32] border border-amber-500/30 space-y-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-amber-500 text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded-bl-lg z-10">
                BENEFICIO {business.plan.toUpperCase()}
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                <MapPinIcon className="w-4 h-4" />
                <span>Ubicación Interactiva</span>
              </div>
              <div className="w-full h-48 rounded-lg overflow-hidden border border-[#27354D]">
                <iframe 
                  width="100%" 
                  height="100%" 
                  frameBorder="0" 
                  scrolling="no" 
                  marginHeight="0" 
                  marginWidth="0" 
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(`${business.name} ${business.address} ${business.cityName} Paraguay`)}&output=embed`}
                  title="Mapa de Ubicación"
                ></iframe>
              </div>
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-base font-bold text-white">Sobre el Comercio / Servicio</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {business.description}
            </p>
          </div>

          {/* Key Info Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Address */}
            <div className="p-4 rounded-xl bg-[#151F32] border border-[#27354D] space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider">
                <MapPinIcon className="w-4 h-4" />
                <span>Dirección Exacta</span>
              </div>
              <p className="text-sm font-medium text-white">{business.address}</p>
              <a
                href={business.googleMapsUrl || mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-xs text-amber-400 font-bold hover:underline pt-1"
              >
                📍 Abrir en Google Maps / Waze →
              </a>
            </div>

            {/* Working Hours */}
            <div className="p-4 rounded-xl bg-[#151F32] border border-[#27354D] space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider">
                <ClockIcon className="w-4 h-4" />
                <span>Horario de Atención</span>
              </div>
              <p className="text-sm font-medium text-white">{business.workingHours}</p>
            </div>

            {/* Direct Phone */}
            <div className="p-4 rounded-xl bg-[#151F32] border border-[#27354D] space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider">
                <PhoneIcon className="w-4 h-4" />
                <span>Llamadas Directas</span>
              </div>
              <p className="text-sm font-medium text-white">{business.phone}</p>
            </div>

            {/* Official Social Media & Web Links (Pro & Premium Feature) */}
            <div className="p-4 rounded-xl bg-[#151F32] border border-[#27354D] space-y-2">
              <div className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                <span>Canales & Redes Oficiales</span>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-0.5">
                {business.instagram && (
                  <a
                    href={`https://instagram.com/${business.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-950/80 border border-pink-500/40 text-pink-300 text-xs font-bold hover:bg-pink-900 transition-colors"
                  >
                    <InstagramIcon className="w-3.5 h-3.5" />
                    <span>{business.instagram}</span>
                  </a>
                )}

                {business.facebook && (
                  <a
                    href={`https://${business.facebook}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-950/80 border border-blue-500/40 text-blue-300 text-xs font-bold hover:bg-blue-900 transition-colors"
                  >
                    <FacebookIcon className="w-3.5 h-3.5" />
                    <span>Facebook</span>
                  </a>
                )}

                {business.website && (
                  <a
                    href={business.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold hover:bg-emerald-900 transition-colors"
                  >
                    <GlobeIcon className="w-3.5 h-3.5" />
                    <span>Sitio Web</span>
                  </a>
                )}

                {!business.instagram && !business.facebook && !business.website && (
                  <span className="text-xs text-slate-400">Sin redes configuradas</span>
                )}
              </div>
            </div>

          </div>

          {/* High Conversion WhatsApp CTA Box */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/70 via-emerald-900/50 to-emerald-950/70 border border-emerald-500/40 space-y-3 shadow-xl">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <SparklesIcon className="w-4 h-4 text-amber-400" />
              <span>Lead Directo por WhatsApp sin intermediarios</span>
            </div>
            
            <div className="space-y-1.5">
              <h4 className="text-lg font-bold text-white">¿Querés hacer una consulta o solicitar presupuesto?</h4>
              <p className="text-xs text-emerald-200/90">
                Mensaje personalizado listo para enviar:
              </p>
              <div className="p-3 rounded-xl bg-black/60 text-emerald-300 font-mono text-xs italic border border-emerald-500/30">
                "{business.whatsappDefaultMessage}"
              </div>
            </div>

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={async () => {
                if (business.id) {
                  // Increment click count without awaiting to not block user
                  supabase.rpc('increment_whatsapp_clicks', { business_id: business.id });
                }
              }}
              className="btn-whatsapp-official w-full py-3.5 text-sm sm:text-base font-extrabold flex items-center justify-center gap-2 rounded-xl shadow-lg shadow-emerald-950/50 hover:scale-[1.01] transition-all"
            >
              <WhatsAppIcon className="w-6 h-6" />
              <span>Contactar por WhatsApp Ahora</span>
            </a>
          </div>

          {/* Reclamar / Destacar Comercio */}
          {!isPremium && (
            <div className="mt-8 pt-6 border-t border-[#27354D] text-center space-y-3">
              <p className="text-xs text-slate-400">¿Sos el dueño de este local y querés destacar tu negocio, subir más fotos o aparecer primero?</p>
              <button
                onClick={() => {
                  if (onClaimClick) onClaimClick();
                }}
                className="inline-flex items-center justify-center gap-2 text-xs font-bold text-amber-400 border border-amber-400/40 hover:bg-amber-400/10 px-5 py-2.5 rounded-xl transition-all hover:scale-105"
              >
                <CrownIcon className="w-4 h-4" />
                <span>Reclamar y Destacar este Comercio</span>
              </button>
            </div>
          )}

          {/* Reseñas Section */}
          <div className="mt-8 pt-6 border-t border-[#27354D]">
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wide flex items-center gap-2">
              <StarIcon className="w-5 h-5 text-amber-400" />
              Reseñas y Opiniones
            </h3>
            
            {/* Formulario de Reseña */}
            {!reviewSuccess ? (
              <form 
                className="bg-[#0F172A] p-4 rounded-xl border border-[#27354D] mb-6 space-y-3"
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!reviewName || !reviewComment) return;
                  setIsSubmittingReview(true);
                  try {
                    await supabase.from('reviews').insert([{
                      business_id: business.id,
                      user_name: reviewName,
                      rating: reviewRating,
                      comment: reviewComment
                    }]);
                    setReviewSuccess(true);
                  } catch(err) {
                    console.error('Error enviando reseña', err);
                  } finally {
                    setIsSubmittingReview(false);
                  }
                }}
              >
                <p className="text-xs text-slate-300 font-medium">Dejá tu opinión sobre este comercio:</p>
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(star => (
                    <button 
                      key={star} type="button" onClick={() => setReviewRating(star)}
                      className={`transition-colors ${reviewRating >= star ? 'text-amber-400' : 'text-slate-600'}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <input 
                  type="text" placeholder="Tu nombre" required
                  value={reviewName} onChange={e => setReviewName(e.target.value)}
                  className="w-full bg-[#151F32] border border-[#27354D] rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 outline-none"
                />
                <textarea 
                  placeholder="Escribe tu experiencia..." required rows={2}
                  value={reviewComment} onChange={e => setReviewComment(e.target.value)}
                  className="w-full bg-[#151F32] border border-[#27354D] rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 outline-none"
                />
                <button 
                  type="submit" disabled={isSubmittingReview}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  {isSubmittingReview ? 'Enviando...' : 'Publicar Reseña'}
                </button>
              </form>
            ) : (
              <div className="bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 p-4 rounded-xl mb-6 text-sm text-center">
                ¡Gracias por tu reseña! Ha sido enviada exitosamente.
              </div>
            )}

            {/* Lista de Reseñas */}
            <div className="space-y-3">
              {reviews.length > 0 ? reviews.map(review => (
                <div key={review.id} className="bg-[#151F32] p-4 rounded-xl border border-[#27354D]">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-slate-200 text-sm">{review.user_name}</span>
                    <div className="flex text-amber-400 text-xs">
                      {'★'.repeat(review.rating)}{'☆'.repeat(5-review.rating)}
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{review.comment}</p>
                </div>
              )) : (
                <p className="text-xs text-slate-500 italic text-center py-4">Todavía no hay reseñas. ¡Sé el primero en opinar!</p>
              )}
            </div>
          </div>

          {/* Related Businesses */}
          {relatedBusinesses.length > 0 && (
            <div className="mt-8 pt-6 border-t border-[#27354D]">
              <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wide">Otros comercios en tu ciudad</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedBusinesses.map((related) => (
                  <Link 
                    href={`/publicacion/${related.id}`} 
                    key={related.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-[#0F172A] border border-[#27354D] hover:border-slate-500 transition-all group"
                  >
                    <div className="w-12 h-12 rounded-lg bg-slate-800 overflow-hidden shrink-0 relative">
                      <Image 
                        src={related.image} 
                        alt={related.name} 
                        fill 
                        className="object-cover group-hover:scale-110 transition-transform" 
                        sizes="48px"
                        unoptimized={related.image?.startsWith('http')}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-slate-200 truncate">{related.name}</h4>
                      <div className="flex items-center gap-1 mt-0.5 text-xs text-slate-400">
                        <StarIcon className="w-3 h-3 text-amber-400" />
                        <span>{related.rating}</span>
                        <span className="mx-1">•</span>
                        <span className="truncate">{related.niche}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

