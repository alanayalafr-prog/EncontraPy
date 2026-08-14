import React, { useState, useEffect } from 'react';
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

export default function BusinessDetailModal({ business, onClose, onClaimClick }) {
  if (!business) return null;

  const [activeImage, setActiveImage] = useState(business.image);

  useEffect(() => {
    if (business) {
      setActiveImage(business.image);

      // Dynamic Google SEO Schema.org LocalBusiness JSON-LD Injection
      const schemaData = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": business.name,
        "image": business.image,
        "telephone": business.phone,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": business.address,
          "addressLocality": business.cityName,
          "addressCountry": "PY"
        },
        "geo": business.geo ? {
          "@type": "GeoCoordinates",
          "latitude": business.geo.latitude,
          "longitude": business.geo.longitude
        } : undefined,
        "openingHours": business.workingHours,
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": business.rating,
          "reviewCount": business.reviewCount
        },
        "sameAs": [
          business.website,
          business.facebook ? `https://${business.facebook}` : undefined,
          business.instagram ? `https://instagram.com/${business.instagram.replace('@', '')}` : undefined
        ].filter(Boolean)
      };

      const script = document.createElement('script');
      script.id = 'dynamic-localbusiness-schema';
      script.type = 'application/ld+json';
      script.text = JSON.stringify(schemaData);
      document.head.appendChild(script);

      // Level 1: Google JS SEO (document.title & description)
      const previousTitle = document.title;
      const metaDescription = document.querySelector('meta[name="description"]');
      const previousDescription = metaDescription ? metaDescription.getAttribute('content') : '';

      document.title = `${business.name} - DirectorioPY`;
      if (metaDescription) {
        metaDescription.setAttribute('content', `Encuentra a ${business.name} en DirectorioPY. ${business.description ? business.description.substring(0, 120) + '...' : ''}`);
      }

      return () => {
        const oldScript = document.getElementById('dynamic-localbusiness-schema');
        if (oldScript) oldScript.remove();
        
        document.title = previousTitle;
        if (metaDescription) {
          metaDescription.setAttribute('content', previousDescription);
        }
      };
    }
  }, [business]);

  const waUrl = `https://wa.me/${formatWhatsAppNumber(business.whatsappNumber)}?text=${encodeURIComponent(business.whatsappDefaultMessage)}`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${business.name} ${business.address} ${business.cityName} Paraguay`)}`;
  
  const isProOrPremium = business.plan === 'pro' || business.plan === 'premium';
  const isPremium = business.plan === 'premium';
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
          <img
            src={activeImage}
            alt={business.name}
            className="absolute inset-0 w-full h-full object-cover transition-all duration-300 z-0"
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
                    <img src={img} alt={`Galería ${idx + 1}`} className="w-full h-full object-cover" />
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

        </div>
      </div>
    </div>
  );
}
