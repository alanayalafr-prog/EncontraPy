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

export default function BusinessDetailModal({ business, onClose }) {
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

  const waUrl = `https://wa.me/${business.whatsappNumber}?text=${encodeURIComponent(business.whatsappDefaultMessage)}`;
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
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/70 text-white hover:bg-black/90 transition-colors shadow-lg border border-white/20"
        >
          <XIcon className="w-5 h-5" />
        </button>

        {/* Hero Photo Viewer */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-slate-900">
          <img
            src={activeImage}
            alt={business.name}
            className="w-full h-full object-cover transition-all duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-[#0B1120]/40 to-transparent" />
          
          <div className="absolute bottom-5 sm:bottom-6 left-8 right-8 sm:left-10 sm:right-10 space-y-1.5" style={{ padding: '0 2.1rem' }}>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-blue-600/90 backdrop-blur-md text-white text-xs font-semibold">
                {business.categoryLabel} • {business.niche}
              </span>
              
              {isPremium && (
                <span className="bg-amber-400 text-black text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow">
                  ⭐️ Destacado Premium VIP
                </span>
              )}

              {business.isVerified && (
                <span className="bg-emerald-950/90 text-emerald-400 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/40 backdrop-blur-md flex items-center gap-1">
                  <ShieldCheckIcon className="w-3.5 h-3.5" />
                  <span>Comercio Verificado</span>
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-md">
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
                href={mapsUrl}
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

        </div>
      </div>
    </div>
  );
}
