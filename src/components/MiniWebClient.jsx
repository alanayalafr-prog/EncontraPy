'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/config/supabase';
import {
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
  ShareIcon,
  CheckIcon,
  CrownIcon,
} from './Icons';
import { formatWhatsAppNumber, getBusinessWhatsAppMessage } from '../utils/phoneUtils';
import {
  isOpenNow,
  getRepresentativeImage,
  formatLocalReviewsRating,
  getTrustStatus,
} from '../utils/businessUtils';
import { trackWhatsAppClick, trackProfileView } from '../utils/analyticsUtils';
import { getHumanBusinessName, getMiniWebUrl } from '../utils/slugUtils';

const SUPPORT_WHATSAPP = '595984043197';

export default function MiniWebClient({ business, reviews = [], isSample = false }) {
  const defaultPhoto = getRepresentativeImage(business);
  const [activeImage, setActiveImage] = useState(defaultPhoto);
  const [copiedLink, setCopiedLink] = useState(false);
  const [savedContact, setSavedContact] = useState(false);
  const [showReviewsForm, setShowReviewsForm] = useState(false);
  const [reviewName, setReviewName] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [localReviews, setLocalReviews] = useState(reviews);

  useEffect(() => {
    if (business?.id) {
      trackProfileView(business.id);
    }
  }, [business?.id]);

  if (!business) return null;

  const displayName = getHumanBusinessName(business.name);
  const cleanMiniWebUrl = getMiniWebUrl(business);
  const waNumber = formatWhatsAppNumber(business.whatsappNumber || business.phone);
  const defaultMessage = getBusinessWhatsAppMessage(business);
  const waUrl = waNumber
    ? `https://wa.me/${waNumber}?text=${encodeURIComponent(defaultMessage)}`
    : null;
  const mapsUrl =
    business.googleMapsUrl ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${business.name} ${business.address || ''} ${business.cityName || ''} Paraguay`
    )}`;

  const trust = getTrustStatus(business);
  const ratingInfo = formatLocalReviewsRating(localReviews);
  const { isOpen, label: openStatusLabel } = isOpenNow(business.workingHours);

  const isPremium = trust.type === 'destacado';
  const isVerified = trust.type === 'verificado' || isPremium;

  const galleryImages =
    Array.isArray(business.gallery) && business.gallery.length > 0
      ? business.gallery
      : [defaultPhoto];

  const tags = Array.isArray(business.tags)
    ? business.tags.filter((t) => typeof t === 'string' && t.trim().length > 1).slice(0, 8)
    : [];

  const handleShare = async () => {
    const shareUrl = cleanMiniWebUrl;
    const shareData = {
      title: displayName,
      text: `${displayName} (${business.cityName || 'Paraguay'}) — Horarios, ubicación y WhatsApp:`,
      url: shareUrl,
    };

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        if (err.name === 'AbortError') return;
      }
    }

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // Genera y descarga un archivo .vcf (vCard) para guardar el comercio directo en el celular
  const handleSaveContact = () => {
    const tel = business.phone || (waNumber ? `+${waNumber}` : '');
    const vcardLines = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${displayName}`,
      `ORG:${displayName}`,
      tel ? `TEL;TYPE=CELL,VOICE:${tel}` : '',
      business.address
        ? `ADR;TYPE=WORK:;;${business.address};${business.cityName || ''};;Paraguay`
        : '',
      `URL:${cleanMiniWebUrl}`,
      business.niche ? `NOTE:${business.niche} - ${business.workingHours || ''}` : '',
      'END:VCARD',
    ].filter(Boolean);

    const blob = new Blob([vcardLines.join('\r\n')], { type: 'text/vcard;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${displayName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.vcf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setSavedContact(true);
    setTimeout(() => setSavedContact(false), 2500);
  };

  const handleActivateOwnerPlan = () => {
    const msg = `Hola DirectorioPY! Vi la muestra de la Mini-Web de "${displayName}" (${cleanMiniWebUrl}) y quiero activarla completa con nuestro logo, fotos y link para Instagram/WhatsApp.`;
    window.open(
      `https://wa.me/${SUPPORT_WHATSAPP}?text=${encodeURIComponent(msg)}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim()) return;
    setIsSubmittingReview(true);
    try {
      const payload = {
        business_id: business.id,
        user_name: reviewName.trim(),
        rating: reviewRating,
        comment: reviewComment.trim(),
      };
      const { data } = await supabase.from('reviews').insert([payload]).select();
      const inserted = data?.[0] || { ...payload, id: Date.now() };
      setLocalReviews((prev) => [inserted, ...prev]);
      setReviewSuccess(true);
      setReviewName('');
      setReviewComment('');
    } catch (err) {
      console.error('Error enviando reseña:', err);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060B14] text-slate-100 pb-28 sm:pb-12">
      {/* Banner superior SOLO cuando se abre como enlace de muestra (?muestra=1) */}
      {isSample && (
        <div className="sticky top-0 z-40 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-slate-950 px-4 py-2.5 shadow-lg">
          <div className="max-w-lg mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
            <div className="text-xs font-extrabold leading-tight flex items-center gap-1.5">
              <SparklesIcon className="w-4 h-4 shrink-0" />
              <span>Vista previa de tu Mini-Web lista para tu Instagram y WhatsApp</span>
            </div>
            <button
              onClick={handleActivateOwnerPlan}
              className="px-3.5 py-1.5 rounded-full bg-slate-950 text-amber-300 hover:bg-slate-900 text-[11px] font-black uppercase tracking-wide shrink-0 cursor-pointer transition-transform active:scale-95"
            >
              Personalizar con mis fotos →
            </button>
          </div>
        </div>
      )}

      {/* Contenedor principal centrado estilo Mini-Web / Link-in-Bio */}
      <main className="max-w-lg mx-auto sm:pt-6 sm:px-4">
        <div className="bg-[#0B1120] sm:rounded-3xl sm:border sm:border-[#27354D] sm:shadow-2xl overflow-hidden">
          {/* 1. PORTADA + IDENTIDAD */}
          <div className="relative h-56 sm:h-64 w-full bg-slate-900 overflow-hidden">
            <Image
              src={activeImage}
              alt={displayName}
              fill
              priority
              className="object-cover"
              unoptimized={
                typeof activeImage === 'string' &&
                (activeImage.startsWith('http') || activeImage.startsWith('data:'))
              }
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-[#0B1120]/45 to-black/25" />

            {/* Botón compartir flotante arriba a la derecha */}
            <button
              onClick={handleShare}
              className="absolute top-3.5 right-3.5 z-20 px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white text-xs font-semibold border border-white/15 flex items-center gap-1.5 cursor-pointer transition-colors"
              aria-label="Compartir página"
            >
              {copiedLink ? (
                <>
                  <CheckIcon className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300">¡Link copiado!</span>
                </>
              ) : (
                <>
                  <ShareIcon className="w-3.5 h-3.5" />
                  <span>Compartir</span>
                </>
              )}
            </button>

            {/* Estado Abierto / Cerrado flotante arriba a la izquierda */}
            <div className="absolute top-3.5 left-3.5 z-20">
              {isOpen ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold backdrop-blur-md shadow">
                  <span className="pulse-green-dot" />
                  <span>{openStatusLabel}</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700 text-slate-300 text-[11px] font-semibold backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-slate-400" />
                  <span>{openStatusLabel}</span>
                </span>
              )}
            </div>
          </div>

          {/* Bloque de Identidad */}
          <div className="px-5 -mt-10 relative z-20 text-center space-y-2.5">
            <div className="inline-flex flex-wrap items-center justify-center gap-1.5">
              <span className="px-3 py-0.5 rounded-full bg-blue-600/90 text-white text-[11px] font-bold shadow">
                {business.niche || business.categoryLabel || 'Comercio Local'}
              </span>
              {isVerified && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950/90 border border-emerald-500/40 text-emerald-400 text-[11px] font-bold">
                  <ShieldCheckIcon className="w-3.5 h-3.5" />
                  <span>Verificado</span>
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
              {displayName}
            </h1>

            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-slate-300">
              <span className="inline-flex items-center gap-1">
                <MapPinIcon className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span className="font-semibold">{business.cityName || 'Paraguay'}</span>
                {business.zone && <span className="text-slate-400">• {business.zone}</span>}
              </span>

              {ratingInfo.hasReviews && (
                <span className="inline-flex items-center gap-1 font-bold text-amber-400">
                  <StarIcon className="w-3.5 h-3.5" />
                  <span>{ratingInfo.rating}</span>
                  <span className="text-slate-400 font-normal">({ratingInfo.reviewsCount})</span>
                </span>
              )}
            </div>
          </div>

          {/* 2. BOTONES PRINCIPALES (THUMB-FRIENDLY) */}
          <div className="px-5 pt-6 space-y-3">
            {waUrl && (
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWhatsAppClick(business.id)}
                className="btn-whatsapp-official w-full py-4 px-5 text-base font-extrabold rounded-2xl flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-500/30 hover:scale-[1.01] transition-all"
              >
                <WhatsAppIcon className="w-5 h-5 shrink-0" />
                <span>Escribir por WhatsApp</span>
              </a>
            )}

            {/* Fila de acciones rápidas */}
            <div className="grid grid-cols-3 gap-2.5">
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center gap-1.5 py-3 px-2 rounded-2xl bg-[#151F32] hover:bg-[#1C2942] border border-[#27354D] text-slate-200 transition-colors"
              >
                <MapPinIcon className="w-5 h-5 text-amber-400" />
                <span className="text-[11px] font-bold">Cómo llegar</span>
              </a>

              {business.phone || waNumber ? (
                <a
                  href={`tel:${business.phone || `+${waNumber}`}`}
                  className="flex flex-col items-center justify-center gap-1.5 py-3 px-2 rounded-2xl bg-[#151F32] hover:bg-[#1C2942] border border-[#27354D] text-slate-200 transition-colors"
                >
                  <PhoneIcon className="w-5 h-5 text-blue-400" />
                  <span className="text-[11px] font-bold">Llamar</span>
                </a>
              ) : (
                <button
                  onClick={handleShare}
                  className="flex flex-col items-center justify-center gap-1.5 py-3 px-2 rounded-2xl bg-[#151F32] hover:bg-[#1C2942] border border-[#27354D] text-slate-200 transition-colors cursor-pointer"
                >
                  <ShareIcon className="w-5 h-5 text-blue-400" />
                  <span className="text-[11px] font-bold">Compartir</span>
                </button>
              )}

              <button
                onClick={handleSaveContact}
                className="flex flex-col items-center justify-center gap-1.5 py-3 px-2 rounded-2xl bg-[#151F32] hover:bg-[#1C2942] border border-[#27354D] text-slate-200 transition-colors cursor-pointer"
              >
                {savedContact ? (
                  <>
                    <CheckIcon className="w-5 h-5 text-emerald-400" />
                    <span className="text-[11px] font-bold text-emerald-300">¡Guardado!</span>
                  </>
                ) : (
                  <>
                    <SparklesIcon className="w-5 h-5 text-emerald-400" />
                    <span className="text-[11px] font-bold">Agendar</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 3. BLOQUES DE INFORMACIÓN */}
          <div className="px-5 py-6 space-y-4">
            {/* Horarios */}
            <div className="p-4 rounded-2xl bg-[#151F32] border border-[#27354D] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                  <ClockIcon className="w-4 h-4" />
                  <span>Horarios de Atención</span>
                </span>
                <span
                  className={`text-[11px] font-bold ${
                    isOpen ? 'text-emerald-400' : 'text-slate-400'
                  }`}
                >
                  {openStatusLabel}
                </span>
              </div>
              <p className="text-sm font-semibold text-white leading-snug">
                {business.workingHours || 'Consultar horarios directamente por WhatsApp'}
              </p>
            </div>

            {/* Sobre el comercio & Servicios */}
            <div className="p-4 rounded-2xl bg-[#151F32] border border-[#27354D] space-y-2.5">
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                <SparklesIcon className="w-4 h-4" />
                <span>Servicios e Información</span>
              </h2>
              <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                {business.description ||
                  `${displayName} en ${business.cityName || 'Paraguay'}. Atención directa y personalizada por WhatsApp.`}
              </p>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-full bg-[#0B1120] border border-[#27354D] text-[11px] text-slate-300 font-medium capitalize"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Galería de Fotos */}
            {galleryImages.length > 1 && (
              <div className="p-4 rounded-2xl bg-[#151F32] border border-[#27354D] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4" />
                    <span>Galería ({galleryImages.length})</span>
                  </span>
                  <span className="text-[10px] text-slate-400">Tocá para ampliar</span>
                </div>
                <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                  {galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(img)}
                      className={`relative w-24 h-18 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                        activeImage === img
                          ? 'border-amber-400 scale-[1.03]'
                          : 'border-slate-700 opacity-75 hover:opacity-100'
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`${displayName} foto ${idx + 1}`}
                        fill
                        sizes="96px"
                        className="object-cover"
                        unoptimized={
                          typeof img === 'string' &&
                          (img.startsWith('http') || img.startsWith('data:'))
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Redes Sociales y Web (Estilo Link-in-Bio) */}
            {(business.instagram || business.facebook || business.website) && (
              <div className="space-y-2">
                {business.instagram && (
                  <a
                    href={`https://instagram.com/${business.instagram.replace(/^@/, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-pink-950/70 to-purple-950/70 hover:from-pink-900/80 hover:to-purple-900/80 border border-pink-500/35 text-pink-200 font-bold text-sm flex items-center justify-between transition-all"
                  >
                    <span className="flex items-center gap-2.5">
                      <InstagramIcon className="w-5 h-5 text-pink-400" />
                      <span>Instagram ({business.instagram})</span>
                    </span>
                    <span className="text-xs opacity-75">↗</span>
                  </a>
                )}

                {business.facebook && (
                  <a
                    href={
                      business.facebook.startsWith('http')
                        ? business.facebook
                        : `https://${business.facebook}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 px-4 rounded-2xl bg-blue-950/60 hover:bg-blue-900/70 border border-blue-500/35 text-blue-200 font-bold text-sm flex items-center justify-between transition-all"
                  >
                    <span className="flex items-center gap-2.5">
                      <FacebookIcon className="w-5 h-5 text-blue-400" />
                      <span>Facebook</span>
                    </span>
                    <span className="text-xs opacity-75">↗</span>
                  </a>
                )}

                {business.website && (
                  <a
                    href={
                      business.website.startsWith('http')
                        ? business.website
                        : `https://${business.website}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 px-4 rounded-2xl bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-500/35 text-emerald-200 font-bold text-sm flex items-center justify-between transition-all"
                  >
                    <span className="flex items-center gap-2.5">
                      <GlobeIcon className="w-5 h-5 text-emerald-400" />
                      <span>Sitio Web Oficial</span>
                    </span>
                    <span className="text-xs opacity-75">↗</span>
                  </a>
                )}
              </div>
            )}

            {/* Ubicación y Mapa */}
            <div className="p-4 rounded-2xl bg-[#151F32] border border-[#27354D] space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <MapPinIcon className="w-4 h-4" />
                  <span>Ubicación</span>
                </span>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-400 hover:underline font-semibold"
                >
                  Abrir GPS ↗
                </a>
              </div>
              <p className="text-sm font-semibold text-white">
                {business.address || business.cityName || 'Paraguay'}
              </p>
              <div className="w-full h-48 rounded-xl overflow-hidden border border-[#27354D]">
                <iframe
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(
                    `${business.name} ${business.address || ''} ${business.cityName || 'Paraguay'}`
                  )}&output=embed`}
                  title={`Mapa de ${displayName}`}
                />
              </div>
            </div>

            {/* Opiniones */}
            <div className="p-4 rounded-2xl bg-[#151F32] border border-[#27354D] space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-[11px] font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                  <StarIcon className="w-4 h-4 text-amber-400" />
                  <span>Opiniones ({localReviews.length})</span>
                </h2>
                <button
                  onClick={() => setShowReviewsForm((prev) => !prev)}
                  className="text-xs font-bold text-blue-400 hover:text-blue-300 cursor-pointer"
                >
                  {showReviewsForm ? 'Cerrar' : '+ Dejar opinión'}
                </button>
              </div>

              {showReviewsForm && !reviewSuccess && (
                <form
                  onSubmit={handleSubmitReview}
                  className="p-3.5 rounded-xl bg-[#0B1120] border border-[#27354D] space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-300 font-semibold">Tu calificación:</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className={`text-lg cursor-pointer ${
                            reviewRating >= star ? 'text-amber-400' : 'text-slate-600'
                          }`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Tu nombre"
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#151F32] border border-[#27354D] text-xs text-white focus:border-blue-500 outline-none"
                  />
                  <textarea
                    rows={2}
                    required
                    placeholder="Contá cómo fue tu experiencia..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#151F32] border border-[#27354D] text-xs text-white focus:border-blue-500 outline-none"
                  />
                  <button
                    type="submit"
                    disabled={isSubmittingReview}
                    className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold cursor-pointer disabled:opacity-50"
                  >
                    {isSubmittingReview ? 'Publicando...' : 'Publicar opinión'}
                  </button>
                </form>
              )}

              {reviewSuccess && (
                <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/30 text-emerald-300 text-xs text-center font-semibold">
                  ¡Gracias por compartir tu opinión!
                </div>
              )}

              {localReviews.length > 0 ? (
                <div className="space-y-2">
                  {localReviews.slice(0, 5).map((r) => (
                    <div
                      key={r.id}
                      className="p-3 rounded-xl bg-[#0B1120] border border-[#27354D]/70 space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-200">{r.user_name}</span>
                        <span className="text-xs text-amber-400">
                          {'★'.repeat(r.rating)}
                          {'☆'.repeat(Math.max(0, 5 - r.rating))}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300">{r.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 text-center py-2">
                  Todavía no hay opiniones. ¡Sé el primero en recomendar este comercio!
                </p>
              )}
            </div>

            {/* Tarjeta de cierre SOLO en modo muestra (?muestra=1) */}
            {isSample && (
              <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/15 via-[#151F32] to-blue-950/40 border border-amber-400/50 space-y-3 text-center">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-[11px] font-bold">
                  <CrownIcon className="w-3.5 h-3.5" />
                  <span>¿Sos el dueño de {displayName}?</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  Esta es una muestra gratuita de tu <strong>Mini-Web</strong> para poner en tu
                  bio de Instagram y compartir por WhatsApp. Podemos completarla hoy mismo con tu
                  logo real, fotos, redes y enlace limpio.
                </p>
                <button
                  onClick={handleActivateOwnerPlan}
                  className="w-full py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wide shadow-lg cursor-pointer transition-all"
                >
                  Quiero activar mi Mini-Web por WhatsApp →
                </button>
              </div>
            )}
          </div>

          {/* 4. PIE DISCRETO Y VIRAL */}
          <footer className="px-5 py-5 border-t border-[#27354D]/70 bg-[#080E1B] text-center space-y-2">
            <p className="text-[11px] text-slate-400">
              Mini-Web creada con{' '}
              <Link
                href="/"
                className="text-blue-400 hover:text-blue-300 font-bold hover:underline"
              >
                DirectorioPY 🇵🇾
              </Link>
            </p>
            <Link
              href="/#planes-sipap"
              className="inline-block text-[11px] font-semibold text-slate-300 hover:text-amber-400 transition-colors"
            >
              ¿Tenés un negocio? Creá tu Mini-Web para Instagram y WhatsApp →
            </Link>
          </footer>
        </div>
      </main>

      {/* Barra fija inferior en celular para contacto en 1 toque */}
      {waUrl && (
        <div className="fixed bottom-0 left-0 right-0 sm:hidden z-40 bg-[#0B1120]/95 backdrop-blur-md border-t border-[#27354D] px-4 py-3 flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-white truncate">{displayName}</p>
            <p className="text-[10px] text-emerald-400 font-semibold truncate">
              {isOpen ? `● ${openStatusLabel}` : '● Respuesta por WhatsApp'}
            </p>
          </div>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsAppClick(business.id)}
            className="btn-whatsapp-official py-2.5 px-4 text-xs font-extrabold rounded-xl flex items-center gap-1.5 shrink-0"
          >
            <WhatsAppIcon className="w-4 h-4" />
            <span>WhatsApp</span>
          </a>
        </div>
      )}
    </div>
  );
}
