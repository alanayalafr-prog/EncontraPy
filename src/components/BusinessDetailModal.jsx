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
  CrownIcon,
  ShareIcon,
  FlagIcon,
  InfoIcon,
  CheckIcon,
  CopyIcon
} from './Icons';
import { formatWhatsAppNumber, getBusinessWhatsAppMessage } from '../utils/phoneUtils';
import { isOpenNow, getRepresentativeImage, formatLocalReviewsRating, getTrustStatus, canUseWhatsApp } from '../utils/businessUtils';
import { trackWhatsAppClick, trackProfileView } from '../utils/analyticsUtils';

export default function BusinessDetailModal({ business, relatedBusinesses = [], reviews = [], onClose, onClaimClick }) {
  if (!business) return null;

  const defaultPhoto = getRepresentativeImage(business);
  const [activeImage, setActiveImage] = useState(defaultPhoto);
  const [reviewName, setReviewName] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showTrustExplanation, setShowTrustExplanation] = useState(false);

  useEffect(() => {
    if (business) {
      setActiveImage(getRepresentativeImage(business));
      trackProfileView(business.id);
      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [business]);

  const defaultMessage = getBusinessWhatsAppMessage(business);
  const waUrl = `https://wa.me/${formatWhatsAppNumber(business.whatsappNumber)}?text=${encodeURIComponent(defaultMessage)}`;
  const mapsUrl = business.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${business.name} ${business.address || ''} ${business.cityName || ''} Paraguay`)}`;
  
  const trust = getTrustStatus(business);
  const ratingInfo = formatLocalReviewsRating(reviews);
  const { isOpen, label: openStatusLabel } = isOpenNow(business.workingHours);

  const isProOrPremium = (business.plan === 'pro' || business.plan === 'premium') && business.isVerified;
  const isPremium = trust.type === 'destacado';
  const isVerified = trust.type === 'verificado' || isPremium;

  const galleryImages = (business.gallery && business.gallery.length > 0)
    ? business.gallery
    : [defaultPhoto];

  // Función para compartir ficha
  const handleShare = async () => {
    const shareData = {
      title: `${business.name} | DirectorioPY`,
      text: `Mirá la ficha de ${business.name} en ${business.cityName || 'Paraguay'} en DirectorioPY:`,
      url: typeof window !== 'undefined' ? window.location.href : 'https://directoriopy.com'
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.log('Error sharing:', err);
        }
      }
    }

    // Fallback: Copiar enlace
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // Función para reportar datos desactualizados a soporte de DirectorioPY
  const handleReportData = () => {
    const reportMsg = `Hola DirectorioPY, quiero reportar datos incorrectos o desactualizados sobre el comercio "${business.name}" (ID #${business.id}) en ${business.cityName || 'Paraguay'}. Los datos correctos son:`;
    const reportUrl = `https://wa.me/595984043197?text=${encodeURIComponent(reportMsg)}`;
    window.open(reportUrl, '_blank');
  };

  return (
    <div className="modal-overlay animate-fadeIn" onClick={onClose}>
      <div
        className="w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[#0B1120] border border-[#27354D] shadow-2xl relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-slate-950/80 text-white hover:bg-slate-900 transition-colors shadow-lg border border-white/20 cursor-pointer"
          aria-label="Cerrar ficha"
        >
          <XIcon className="w-5 h-5" />
        </button>

        {/* 1. PORTADA Y CABECERA */}
        <div className="relative w-full h-[40vh] min-h-[22rem] sm:h-[45vh] flex flex-col justify-end overflow-hidden bg-slate-900 pb-5 px-5 sm:px-8">
          <Image
            src={activeImage}
            alt={business.name}
            fill
            className="absolute inset-0 w-full h-full object-cover z-0"
            priority
            unoptimized={typeof activeImage === 'string' && activeImage.startsWith('http')}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] from-15% via-[#0B1120]/75 via-50% to-transparent z-10" />
          
          <div className="relative z-20 space-y-2">
            {/* Badges Bar */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-600/90 text-white text-[11px] font-semibold">
                {business.categoryLabel || 'Comercio'} • {business.niche || 'General'}
              </span>
              
              {isPremium && (
                <span className="bg-amber-400 text-slate-950 text-[11px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow">
                  ⭐️ Destacado VIP
                </span>
              )}

              {isVerified ? (
                <button
                  onClick={() => setShowTrustExplanation(!showTrustExplanation)}
                  className="bg-emerald-950/90 text-emerald-400 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/40 backdrop-blur-md flex items-center gap-1 cursor-pointer hover:bg-emerald-900/90 transition-colors"
                  title="Haz clic para ver qué significa Comercio Verificado"
                >
                  <ShieldCheckIcon className="w-3.5 h-3.5" />
                  <span>Comercio Verificado</span>
                  <InfoIcon className="w-3 h-3 text-emerald-400 ml-0.5" />
                </button>
              ) : (
                <button
                  onClick={() => setShowTrustExplanation(!showTrustExplanation)}
                  className="bg-slate-900/90 text-slate-300 text-[11px] font-medium px-2.5 py-0.5 rounded-full border border-slate-700 backdrop-blur-md flex items-center gap-1 cursor-pointer hover:bg-slate-800 transition-colors"
                  title="Haz clic para ver qué significa Ficha Local"
                >
                  <MapPinIcon className="w-3 h-3 text-blue-400" />
                  <span>Ficha Local Comunitaria</span>
                  <InfoIcon className="w-3 h-3 text-slate-400 ml-0.5" />
                </button>
              )}
            </div>

            {/* Business Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
              {business.name}
            </h1>

            {/* Quick subtitle rating & city */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 pt-0.5">
              <div className="flex items-center gap-1 text-slate-200">
                <MapPinIcon className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span className="font-semibold">{business.cityName || 'Paraguay'}</span>
                {business.zone && <span>• {business.zone}</span>}
              </div>

              {ratingInfo.hasReviews ? (
                <div className="flex items-center gap-1 font-bold text-amber-400">
                  <StarIcon className="w-3.5 h-3.5" />
                  <span>{ratingInfo.rating}</span>
                  <span className="text-slate-400 font-normal">({ratingInfo.reviewsCount} reseñas)</span>
                </div>
              ) : (
                <span className="text-[11px] text-slate-400 italic">Nuevo sin reseñas</span>
              )}
            </div>
          </div>
        </div>

        {/* Modal Explanatory Trust Card if toggled */}
        {showTrustExplanation && (
          <div className="mx-5 sm:mx-8 mt-4 p-4 rounded-2xl bg-[#151F32] border border-blue-500/40 text-xs text-slate-300 space-y-2 animate-fadeIn">
            <div className="flex items-center justify-between font-bold text-white">
              <span className="flex items-center gap-1.5 text-blue-400">
                <ShieldCheckIcon className="w-4 h-4 text-emerald-400" />
                <span>¿Qué significan las insignias de DirectorioPY?</span>
              </span>
              <button onClick={() => setShowTrustExplanation(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <p className="leading-relaxed">
              <strong className="text-emerald-400">✓ Comercio Verificado:</strong> Nuestro equipo ha comprobado directamente la identidad del propietario, el número oficial de WhatsApp y la dirección física del negocio.
            </p>
            <p className="leading-relaxed text-slate-400">
              <strong className="text-slate-300">📍 Ficha Local:</strong> Datos públicos del comercio. Si sos el titular, podés reclamarla gratis para actualizar tu información y obtener la insignia verificada.
            </p>
          </div>
        )}

        {/* 2. BARRA DE ACCIONES RÁPIDAS */}
        <div className="p-4 sm:px-8 border-b border-[#27354D] bg-[#151F32] flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Share Button */}
            <button
              onClick={handleShare}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Compartir esta ficha con un amigo o cliente"
            >
              {copiedLink ? <CheckIcon className="w-3.5 h-3.5 text-emerald-400" /> : <ShareIcon className="w-3.5 h-3.5 text-blue-400" />}
              <span>{copiedLink ? '¡Enlace copiado!' : 'Compartir'}</span>
            </button>

            {/* Call Direct */}
            {business.phone && (
              <a
                href={`tel:${business.phone}`}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1.5"
                title="Llamar directamente por teléfono"
              >
                <PhoneIcon className="w-3.5 h-3.5 text-blue-400" />
                <span>Llamar</span>
              </a>
            )}

            {/* How to get there */}
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1.5"
              title="Abrir ubicación en Google Maps o Waze"
            >
              <MapPinIcon className="w-3.5 h-3.5 text-amber-400" />
              <span>Cómo llegar</span>
            </a>
          </div>

          {/* Primary WhatsApp CTA in Top Bar (Vibrant for Paid, Dimmed for Free) */}
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsAppClick(business.id)}
            className={`${
              canUseWhatsApp(business)
                ? 'btn-whatsapp-official shadow-md shadow-emerald-500/25'
                : 'btn-whatsapp-dimmed opacity-85 hover:opacity-100'
            } py-2 px-4 text-xs font-bold rounded-xl flex items-center gap-2`}
            title={canUseWhatsApp(business) ? "WhatsApp Oficial • Respuesta Rápida" : "Contactar por WhatsApp (Ficha Básica)"}
          >
            <WhatsAppIcon className={`w-4 h-4 shrink-0 ${canUseWhatsApp(business) ? '' : 'text-emerald-400/60'}`} />
            <span>Chatear por WhatsApp</span>
          </a>
        </div>

        {/* 3. CONTENIDO MODULAR CON BUEN AIRE VISUAL */}
        <div className="p-5 sm:p-8 space-y-6 pb-20 sm:pb-8">
          
          {/* Key Info Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Address */}
            <div className="p-4 rounded-2xl bg-[#151F32] border border-[#27354D] space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-400 uppercase tracking-wider">
                <MapPinIcon className="w-4 h-4" />
                <span>Dirección Física</span>
              </div>
              <p className="text-sm font-semibold text-white leading-snug">
                {business.address || `${business.cityName || 'Paraguay'}`}
              </p>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-amber-400 font-bold hover:underline pt-0.5"
              >
                <span>Abrir en Google Maps / Waze</span>
                <span>→</span>
              </a>
            </div>

            {/* Working Hours & Real-time Status */}
            <div className="p-4 rounded-2xl bg-[#151F32] border border-[#27354D] space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-blue-400 uppercase tracking-wider">
                  <ClockIcon className="w-4 h-4" />
                  <span>Horarios de Atención</span>
                </div>
                {isOpen ? (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/40">
                    <span className="pulse-green-dot"></span>
                    <span>Abierto ahora</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[11px] font-medium text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                    <span>Cerrado</span>
                  </span>
                )}
              </div>
              <p className="text-sm font-semibold text-white leading-snug">
                {business.workingHours || 'Consultar horarios directamente por WhatsApp'}
              </p>
            </div>

            {/* Phone & Calls */}
            <div className="p-4 rounded-2xl bg-[#151F32] border border-[#27354D] space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-400 uppercase tracking-wider">
                <PhoneIcon className="w-4 h-4" />
                <span>Teléfono / Contacto</span>
              </div>
              <p className="text-sm font-semibold text-white">{business.phone || 'Contacto disponible por WhatsApp'}</p>
              <span className="text-[11px] text-slate-400">Atención en Guaraní y Español</span>
            </div>

            {/* Official Social Media */}
            <div className="p-4 rounded-2xl bg-[#151F32] border border-[#27354D] space-y-2">
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
                  <span className="text-xs text-slate-400 italic">Sin redes sociales vinculadas</span>
                )}
              </div>
            </div>

          </div>

          {/* Interactive Photo Gallery (if multiple photos) */}
          {galleryImages.length > 1 && (
            <div className="space-y-3 p-4 sm:p-5 rounded-2xl bg-[#151F32] border border-[#27354D]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4" />
                  <span>Galería de Fotos del Local ({galleryImages.length})</span>
                </span>
                <span className="text-[10px] text-slate-400">Clic para ampliar en portada</span>
              </div>
              <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`relative w-20 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                      activeImage === img ? 'border-amber-400 scale-105 shadow-md' : 'border-slate-700 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt={`${business.name} ${idx + 1}`} fill className="object-cover" sizes="80px" unoptimized={typeof img === 'string' && img.startsWith('http')} />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* About Section */}
          <div className="p-5 rounded-2xl bg-[#151F32] border border-[#27354D] space-y-2.5">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <SparklesIcon className="w-4 h-4 text-blue-400" />
              <span>Sobre el Comercio y Servicios</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {business.description || 'Comercio local verificado en Paraguay. Ofrece atención directa vía WhatsApp y servicios profesionales para clientes de la zona.'}
            </p>
          </div>

          {/* Embedded Google Maps View */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#151F32] border border-[#27354D] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <MapPinIcon className="w-4 h-4" />
                <span>Ubicación en el Mapa</span>
              </span>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-blue-400 hover:underline font-semibold"
              >
                Abrir en pantalla completa ↗
              </a>
            </div>
            <div className="w-full h-52 sm:h-64 rounded-xl overflow-hidden border border-[#27354D]">
              <iframe 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                loading="lazy"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(`${business.name} ${business.address || ''} ${business.cityName || 'Paraguay'}`)}&output=embed`}
                title={`Ubicación de ${business.name}`}
              ></iframe>
            </div>
          </div>

          {/* WhatsApp Contact Box (Vibrant for Pro/Premium, Dimmed for Free) */}
          {canUseWhatsApp(business) ? (
            <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/70 via-emerald-900/50 to-emerald-950/70 border border-emerald-500/40 space-y-3 shadow-xl">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <SparklesIcon className="w-4 h-4 text-amber-400" />
                <span>Contacto Directo por WhatsApp • Canal Oficial Verificado</span>
              </div>
              
              <div className="space-y-1.5">
                <h4 className="text-base sm:text-lg font-bold text-white">
                  {business.category === 'gastronomia'
                    ? '¿Querés consultar la carta o hacer un pedido?'
                    : business.category === 'salud'
                    ? '¿Querés consultar turnos o agendar una cita?'
                    : '¿Querés hacer una consulta o solicitar presupuesto?'}
                </h4>
                <p className="text-xs text-emerald-200/90 font-medium">
                  Mensaje personalizado listo para enviar:
                </p>
                <div className="p-3 rounded-xl bg-black/60 text-emerald-300 font-mono text-xs italic border border-emerald-500/30">
                  "{defaultMessage}"
                </div>
              </div>

              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWhatsAppClick(business.id)}
                className="btn-whatsapp-official w-full py-3.5 text-sm sm:text-base font-extrabold flex items-center justify-center gap-2 rounded-xl shadow-lg shadow-emerald-500/30 hover:scale-[1.01] transition-all"
              >
                <WhatsAppIcon className="w-5 h-5" />
                <span>Contactar por WhatsApp Ahora</span>
              </a>

              <p className="text-[11px] text-center text-emerald-300/80 pt-1">
                🔒 Contactás directo con el comercio. Cero comisiones.
              </p>
            </div>
          ) : (
            <div className="p-5 sm:p-6 rounded-2xl bg-[#151F32] border border-[#27354D] space-y-3 shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                  <WhatsAppIcon className="w-4 h-4 text-slate-500" />
                  <span>Contacto por WhatsApp (Ficha Básica)</span>
                </div>
                <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                  Plan Free
                </span>
              </div>
              
              <div className="space-y-1.5">
                <h4 className="text-sm sm:text-base font-semibold text-slate-200">
                  {business.category === 'gastronomia'
                    ? '¿Querés consultar la carta o hacer un pedido?'
                    : business.category === 'salud'
                    ? '¿Querés consultar turnos o agendar una cita?'
                    : '¿Querés hacer una consulta o solicitar presupuesto?'}
                </h4>
                <div className="p-3 rounded-xl bg-slate-900/80 text-slate-400 font-mono text-xs italic border border-slate-800">
                  "{defaultMessage}"
                </div>
              </div>

              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWhatsAppClick(business.id)}
                className="btn-whatsapp-dimmed w-full py-3 text-sm font-semibold flex items-center justify-center gap-2 rounded-xl opacity-90 hover:opacity-100 transition-all"
              >
                <WhatsAppIcon className="w-4 h-4 text-emerald-400/60" />
                <span>Contactar por WhatsApp</span>
              </a>

              {onClaimClick && (
                <div className="pt-2 text-center border-t border-[#27354D]/60">
                  <button
                    onClick={onClaimClick}
                    className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold inline-flex items-center gap-1 transition-colors hover:underline cursor-pointer"
                  >
                    <CrownIcon className="w-3.5 h-3.5" />
                    <span>¿Sos el dueño? Activá tu botón destacado e iluminado con Plan Pro</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Reseñas Section */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#151F32] border border-[#27354D] space-y-4">
            <div className="flex items-center justify-between border-b border-[#27354D] pb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wide flex items-center gap-2">
                <StarIcon className="w-4 h-4 text-amber-400" />
                <span>Reseñas y Opiniones ({reviews.length})</span>
              </h3>
              {ratingInfo.hasReviews && (
                <span className="text-xs font-bold text-amber-400">
                  Promedio: {ratingInfo.rating} ★
                </span>
              )}
            </div>
            
            {/* Formulario de Reseña */}
            {!reviewSuccess ? (
              <form 
                className="bg-[#0F172A] p-4 rounded-xl border border-[#27354D] space-y-3"
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
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-300 font-semibold">Calificar este comercio:</p>
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map(star => (
                      <button 
                        key={star} 
                        type="button" 
                        onClick={() => setReviewRating(star)}
                        className={`text-base transition-colors cursor-pointer ${reviewRating >= star ? 'text-amber-400' : 'text-slate-600'}`}
                        aria-label={`Calificar con ${star} estrellas`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <input 
                  type="text" 
                  placeholder="Tu nombre completo" 
                  required
                  value={reviewName} 
                  onChange={e => setReviewName(e.target.value)}
                  className="w-full bg-[#151F32] border border-[#27354D] rounded-lg px-3 py-2 text-xs sm:text-sm text-white focus:border-blue-500 outline-none"
                />
                <textarea 
                  placeholder="Contá tu experiencia sobre la atención, puntualidad o producto..." 
                  required 
                  rows={2}
                  value={reviewComment} 
                  onChange={e => setReviewComment(e.target.value)}
                  className="w-full bg-[#151F32] border border-[#27354D] rounded-lg px-3 py-2 text-xs sm:text-sm text-white focus:border-blue-500 outline-none"
                />
                <button 
                  type="submit" 
                  disabled={isSubmittingReview}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-2.5 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isSubmittingReview ? 'Enviando...' : 'Publicar mi Reseña'}
                </button>
              </form>
            ) : (
              <div className="bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 p-3.5 rounded-xl text-xs sm:text-sm text-center">
                ¡Gracias por tu reseña! Ha sido enviada y verificada exitosamente.
              </div>
            )}

            {/* Lista de Reseñas */}
            <div className="space-y-2.5 pt-2">
              {reviews.length > 0 ? reviews.map(review => (
                <div key={review.id} className="bg-[#0F172A] p-3.5 rounded-xl border border-[#27354D]/70 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-200 text-xs sm:text-sm">{review.user_name}</span>
                    <div className="flex text-amber-400 text-xs">
                      {'★'.repeat(review.rating)}{'☆'.repeat(Math.max(0, 5 - review.rating))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-300">{review.comment}</p>
                </div>
              )) : (
                <p className="text-xs text-slate-500 italic text-center py-4">
                  Todavía no hay reseñas para este comercio. ¡Sé el primero en opinar!
                </p>
              )}
            </div>
          </div>

          {/* Footer de Confianza y Auditoría */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0B1120] border border-[#27354D] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheckIcon className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                {isVerified 
                  ? 'Ficha auditada y verificada por el equipo de DirectorioPY.' 
                  : 'Ficha recopilada de fuentes públicas. ¿Sos el titular? Reclamala gratis.'}
              </span>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={handleReportData}
                className="text-slate-400 hover:text-amber-400 flex items-center gap-1 transition-colors cursor-pointer"
                title="Avisanos si el número o dirección cambiaron"
              >
                <FlagIcon className="w-3.5 h-3.5 text-amber-400" />
                <span>Reportar error</span>
              </button>

              {!isPremium && onClaimClick && (
                <button
                  onClick={onClaimClick}
                  className="text-amber-400 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                >
                  <CrownIcon className="w-3.5 h-3.5" />
                  <span>Reclamar negocio</span>
                </button>
              )}
            </div>
          </div>

        </div>

        {/* 4. STICKY MOBILE WHATSAPP CTA BAR */}
        <div className="fixed bottom-0 left-0 right-0 sm:hidden z-50 bg-[#0B1120]/95 backdrop-blur-md border-t border-[#27354D] p-3 px-4 flex items-center justify-between gap-3 shadow-2xl">
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-bold text-white truncate">{business.name}</h4>
            <div className="flex items-center gap-1 text-[10px] text-slate-400">
              {canUseWhatsApp(business) ? (
                <>
                  <span className="pulse-green-dot"></span>
                  <span className="text-emerald-400 font-semibold">{isOpen ? 'Abierto' : 'Disponible'}</span>
                  <span>• WhatsApp Oficial</span>
                </>
              ) : (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                  <span className="text-slate-400">{isOpen ? 'Abierto' : 'Disponible'}</span>
                  <span>• Ficha Free</span>
                </>
              )}
            </div>
          </div>

          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsAppClick(business.id)}
            className={`${
              canUseWhatsApp(business)
                ? 'btn-whatsapp-official shadow-lg shadow-emerald-500/30'
                : 'btn-whatsapp-dimmed opacity-85 hover:opacity-100'
            } py-2.5 px-4 text-xs font-bold rounded-xl flex items-center gap-1.5 shrink-0`}
          >
            <WhatsAppIcon className={`w-4 h-4 ${canUseWhatsApp(business) ? '' : 'text-emerald-400/60'}`} />
            <span>Contactar</span>
          </a>
        </div>

      </div>
    </div>
  );
}
