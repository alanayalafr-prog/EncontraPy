import React, { useState, useEffect } from 'react';
import { 
  XIcon, 
  BuildingIcon, 
  PhoneIcon, 
  MapPinIcon, 
  CheckCircleIcon, 
  SparklesIcon, 
  WrenchIcon, 
  ClockIcon, 
  InstagramIcon, 
  GlobeIcon,
  CrownIcon,
  ShieldCheckIcon,
  FilterIcon
} from './Icons';
import { SERVICES } from '../data/businesses';

export default function ClaimModal({ isOpen, onClose, onSelectPlanForPayment, onAddBusiness, initialPlan = 'gratuito' }) {
  const availableServices = SERVICES.filter(s => s.id !== 'todos');

  const [formData, setFormData] = useState({
    name: '',
    category: 'oficios',
    nicheSelect: availableServices[0]?.id || 'Refrigeración & Climatización',
    customNiche: '',
    city: 'asuncion',
    zone: '',
    phone: '',
    whatsapp: '',
    workingHours: 'Lun a Vie: 08:00 - 18:00',
    instagram: '',
    website: '',
    plan: initialPlan,
    description: '',
    imageUrl: '',
    galleryUrls: ['', '']
  });

  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({ ...prev, plan: initialPlan }));
    }
  }, [isOpen, initialPlan]);

  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const categoryLabelMap = {
    agro: 'Agro e Insumos',
    salud: 'Salud Privada',
    gastronomia: 'Gastronomía y Eventos',
    oficios: 'Oficios y Servicios'
  };

  const defaultImageMap = {
    agro: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=800&q=80',
    salud: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=800&q=80',
    gastronomia: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
    oficios: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80'
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalNiche = formData.nicheSelect === 'otro' ? formData.customNiche : formData.nicheSelect;
    
    // Normalizar sitio web
    let formattedWebsite = formData.website ? formData.website.trim() : '';
    if (formattedWebsite && !/^https?:\/\//i.test(formattedWebsite)) {
      formattedWebsite = `https://${formattedWebsite}`;
    }

    // Normalizar instagram
    let formattedInstagram = formData.instagram ? formData.instagram.trim() : '';
    if (formattedInstagram && !formattedInstagram.startsWith('@') && !formattedInstagram.includes('/')) {
      formattedInstagram = `@${formattedInstagram}`;
    }

    const cityNameMap = {
      asuncion: 'Asunción',
      luque: 'Luque',
      san_lorenzo: 'San Lorenzo',
      lambare: 'Lambaré',
      cde: 'Ciudad del Este',
      encarnacion: 'Encarnación'
    };

    const cleanWhatsapp = formData.whatsapp ? formData.whatsapp.replace(/\D/g, '') : '595981747679';
    const formattedWa = cleanWhatsapp.startsWith('595') ? cleanWhatsapp : `595${cleanWhatsapp.replace(/^0/, '')}`;

    // Si es Plan Gratuito, se asigna obligatoriamente la imagen genérica del rubro
    const mainImage = formData.plan === 'gratuito'
      ? (defaultImageMap[formData.category] || defaultImageMap.oficios)
      : (formData.imageUrl.trim() !== '' ? formData.imageUrl : (defaultImageMap[formData.category] || defaultImageMap.oficios));

    const validGallery = formData.galleryUrls.filter(url => url.trim() !== '');
    const finalGallery = formData.plan !== 'gratuito' 
      ? (validGallery.length > 0 ? validGallery : [mainImage, 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&w=800&q=80'])
      : [];

    const newBusinessObj = {
      id: 'emp_' + Date.now(),
      name: formData.name || 'Comercio Nuevo',
      category: formData.category,
      categoryLabel: categoryLabelMap[formData.category] || 'Oficios y Servicios',
      niche: finalNiche || 'Servicios Generales',
      city: formData.city,
      cityName: cityNameMap[formData.city] || 'Asunción',
      zone: formData.zone || 'Zona Centro',
      address: formData.zone || 'Av. Principal del Comercio',
      description: formData.description || 'Comercio registrado en DirectorioPY.',
      phone: formData.phone || '+595 981 100 200',
      whatsappNumber: formattedWa,
      whatsappDefaultMessage: `Hola ${formData.name || 'Comercio'}, los encontré en el directorio DirectorioPY y quisiera información.`,
      rating: 5.0,
      reviewCount: 1,
      isVerified: false,
      plan: formData.plan === 'gratuito' ? 'free' : formData.plan,
      workingHours: formData.workingHours || 'Lun a Vie: 08:00 - 18:00',
      image: mainImage,
      gallery: finalGallery,
      tags: [formData.category, formData.city, 'nuevo'],
      instagram: formData.plan !== 'gratuito' ? formattedInstagram : '',
      website: formData.plan !== 'gratuito' ? formattedWebsite : ''
    };

    if (onAddBusiness) {
      onAddBusiness(newBusinessObj);
    }

    setSubmitted(true);
  };

  const handleProceedToPayment = () => {
    onClose();
    setSubmitted(false);
    const finalNiche = formData.nicheSelect === 'otro' ? formData.customNiche : formData.nicheSelect;
    onSelectPlanForPayment(formData.plan, { ...formData, niche: finalNiche });
  };

  const planFeatures = {
    gratuito: {
      name: 'Plan Gratuito (Gs. 0)',
      color: 'border-slate-700 bg-slate-900/60',
      badge: 'Inicial',
      items: [
        { text: 'Perfil básico con nombre y dirección', included: true },
        { text: 'Enlace estándar a WhatsApp', included: true },
        { text: 'Imagen genérica destacada según el rubro', included: true },
        { text: 'Insignia de Comercio Verificado ✔️', included: false },
        { text: 'Foto real de fachada/logo personalizada', included: false },
        { text: 'Galería de fotos & Redes Sociales', included: false },
        { text: 'Destacado en Portada Principal', included: false }
      ]
    },
    pro: {
      name: 'Plan Pro Destacado (Gs. 99.000/mes)',
      color: 'border-blue-500/80 bg-blue-950/40',
      badge: 'Más Popular 🚀',
      items: [
        { text: 'Todo lo del Plan Gratuito', included: true },
        { text: 'Foto real de fachada/logo personalizada', included: true },
        { text: 'Insignia de Comercio Verificado ✔️', included: true },
        { text: 'Posicionamiento prioritario en búsquedas', included: true },
        { text: 'Galería de fotos (hasta 3 imágenes)', included: true },
        { text: 'Enlaces directos a Instagram, Facebook y Web', included: true },
        { text: 'Destacado en Portada Principal', included: false }
      ]
    },
    premium: {
      name: 'Plan Premium Anual (Gs. 790.000/año)',
      color: 'border-amber-400/80 bg-amber-950/30',
      badge: 'Máximo Alcance 👑',
      items: [
        { text: 'Todo lo del Plan Pro Destacado', included: true },
        { text: 'Foto real de fachada/logo personalizada', included: true },
        { text: 'Destacado en Portada Principal (Spotlight VIP ⭐️)', included: true },
        { text: 'Optimización SEO para Google (Schema.org)', included: true },
        { text: 'Soporte técnico prioritario y actualización 24/7', included: true },
        { text: 'Ahorro del 30% respecto al pago mensual', included: true }
      ]
    }
  };

  const selectedPlanInfo = planFeatures[formData.plan];

  return (
    <div className="modal-overlay animate-fadeIn" onClick={onClose}>
      <div
        className="glass-panel w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[#0B1120] border border-[#27354D] p-6 sm:p-8 space-y-6 relative text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <XIcon className="w-5 h-5" />
        </button>

        {!submitted ? (
          <>
            {/* Header */}
            <div className="space-y-2.5 text-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-800/60 text-blue-400 text-xs font-semibold">
                <SparklesIcon className="w-3.5 h-3.5 text-amber-400" />
                Registrá tu comercio en DirectorioPY
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
                Recibí clientes directo a tu WhatsApp 🇵🇾
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                Completa los datos de tu negocio para aparecer en las búsquedas locales de Google y en el catálogo nacional.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Sección 1: Datos Principales del Negocio */}
              <div className="space-y-4 p-5 rounded-2xl bg-[#151F32] border border-[#27354D]">
                <h3 className="text-xs font-extrabold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                  <BuildingIcon className="w-4 h-4" />
                  <span>1. Información General del Comercio</span>
                </h3>

                {/* Business Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Nombre del Comercio o Profesional *</label>
                  <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#1E293B] border border-[#27354D] focus-within:border-blue-500">
                    <BuildingIcon className="w-4 h-4 text-amber-400 shrink-0" />
                    <input
                      type="text"
                      required
                      placeholder="Ej: ServiClima Luque - Refrigeración"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Category & Specific Service Dropdown */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Categoría General */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Categoría Principal *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1E293B] border border-[#27354D] text-xs sm:text-sm text-white focus:outline-none cursor-pointer"
                    >
                      <option value="oficios">🛠️ Oficios y Servicios del Hogar</option>
                      <option value="agro">🌾 Agro e Insumos</option>
                      <option value="salud">⚕️ Salud Privada & Especialistas</option>
                      <option value="gastronomia">🍽️ Gastronomía y Eventos</option>
                    </select>
                  </div>

                  {/* Servicio / Rubro Específico */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Servicio / Rubro Específico *</label>
                    <select
                      value={formData.nicheSelect}
                      onChange={(e) => setFormData({ ...formData, nicheSelect: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1E293B] border border-[#27354D] text-xs sm:text-sm text-white focus:outline-none cursor-pointer"
                    >
                      {availableServices.map((s) => (
                        <option key={s.id} value={s.id} className="bg-[#0B1120] text-white">
                          {s.label}
                        </option>
                      ))}
                      <option value="otro" className="bg-[#0B1120] text-amber-400 font-bold">
                        ➕ Otro servicio / rubro personalizado...
                      </option>
                    </select>
                  </div>

                </div>

                {/* Campo adicional si eligió "Otro servicio..." */}
                {formData.nicheSelect === 'otro' && (
                  <div className="space-y-1.5 pt-1 animate-fadeIn">
                    <label className="text-xs font-semibold text-amber-400">Escribí tu servicio o rubro personalizado *</label>
                    <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#1E293B] border border-amber-400/60">
                      <FilterIcon className="w-4 h-4 text-amber-400 shrink-0" />
                      <input
                        type="text"
                        required
                        placeholder="Ej: Carpintería Fina, Estética Canina, Carpintería Metálica..."
                        value={formData.customNiche}
                        onChange={(e) => setFormData({ ...formData, customNiche: e.target.value })}
                        className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* Location: City & Zone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Ciudad Principal *</label>
                    <select
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1E293B] border border-[#27354D] text-xs sm:text-sm text-white focus:outline-none cursor-pointer"
                    >
                      <option value="asuncion">Asunción</option>
                      <option value="luque">Luque</option>
                      <option value="san_lorenzo">San Lorenzo</option>
                      <option value="lambare">Lambaré</option>
                      <option value="cde">Ciudad del Este</option>
                      <option value="encarnacion">Encarnación</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Barrio / Zona / Dirección</label>
                    <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#1E293B] border border-[#27354D] focus-within:border-blue-500">
                      <MapPinIcon className="w-4 h-4 text-amber-400 shrink-0" />
                      <input
                        type="text"
                        placeholder="Ej: Barrio Carmelitas / Ruta 6"
                        value={formData.zone}
                        onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                        className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none"
                      />
                    </div>
                  </div>

                </div>

                {/* Contact & Hours */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">WhatsApp de Consultas (+595) *</label>
                    <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#1E293B] border border-[#27354D] focus-within:border-emerald-500">
                      <PhoneIcon className="w-4 h-4 text-emerald-400 shrink-0" />
                      <input
                        type="tel"
                        required
                        placeholder="Ej: 0981 123456"
                        value={formData.whatsapp}
                        onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                        className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Horarios de Atención</label>
                    <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#1E293B] border border-[#27354D]">
                      <ClockIcon className="w-4 h-4 text-blue-400 shrink-0" />
                      <input
                        type="text"
                        placeholder="Ej: Lun a Sáb 08:00 a 18:00"
                        value={formData.workingHours}
                        onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })}
                        className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none"
                      />
                    </div>
                  </div>

                </div>

                {/* Social Media (Solo para Pro / Premium) */}
                {formData.plan !== 'gratuito' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">Usuario de Instagram</label>
                      <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#1E293B] border border-[#27354D]">
                        <InstagramIcon className="w-4 h-4 text-pink-400 shrink-0" />
                        <input
                          type="text"
                          placeholder="Ej: @minegocio_py o minegocio_py"
                          value={formData.instagram}
                          onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                          className="w-full bg-transparent text-xs text-white placeholder-slate-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">Sitio Web Oficial</label>
                      <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#1E293B] border border-[#27354D]">
                        <GlobeIcon className="w-4 h-4 text-emerald-400 shrink-0" />
                        <input
                          type="text"
                          placeholder="Ej: minegocio.com.py o https://minegocio.com.py"
                          value={formData.website}
                          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                          className="w-full bg-transparent text-xs text-white placeholder-slate-400 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Brief Description */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Descripción Breve de tus Servicios</label>
                  <textarea
                    rows={2}
                    placeholder="Contale a tus futuros clientes qué servicios ofrecés, experiencia, marcas o facilidades de pago..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-3 rounded-xl bg-[#1E293B] border border-[#27354D] text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none leading-relaxed"
                  />
                </div>

              </div>

              {/* Sección 2: Fotos del Comercio (Diferenciadas por Plan) */}
              <div className="space-y-4 p-5 rounded-2xl bg-[#151F32] border border-[#27354D]">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <span>📷 2. Foto del Comercio</span>
                  </h3>
                  <span className="text-[10px] text-slate-400 font-semibold">
                    {formData.plan === 'gratuito' ? 'Imagen Genérica de Rubro' : 'Personalizada (Subir Foto)'}
                  </span>
                </div>

                {formData.plan === 'gratuito' ? (
                  /* Modo Imagen Genérica para Plan Gratuito */
                  <div className="p-4 rounded-xl bg-blue-950/60 border border-blue-800/60 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                      <SparklesIcon className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>Foto Estándar de Rubro Incluida (Plan Gratuito)</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Tu publicación gratuita incluirá automáticamente la imagen representativa del rubro <strong className="text-white">"{categoryLabelMap[formData.category] || 'Servicios'}"</strong>.
                    </p>
                    <div className="relative aspect-video w-48 rounded-xl overflow-hidden border border-blue-500/40 mt-1 shadow-md">
                      <img 
                        src={defaultImageMap[formData.category] || defaultImageMap.oficios} 
                        alt="Muestra de foto genérica" 
                        className="w-full h-full object-cover" 
                      />
                      <span className="absolute bottom-1.5 left-1.5 bg-black/80 text-blue-300 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-700/60">
                        Imagen Genérica del Rubro
                      </span>
                    </div>
                    <p className="text-[11px] text-amber-300 font-semibold pt-1">
                      💡 ¿Querés publicar la foto real de tu fachada o productos? Seleccioná el{' '}
                      <button type="button" onClick={() => setFormData({...formData, plan: 'pro'})} className="underline font-bold text-amber-400 hover:text-white">Plan Pro</button>
                      {' '}o{' '}
                      <button type="button" onClick={() => setFormData({...formData, plan: 'premium'})} className="underline font-bold text-amber-400 hover:text-white">Plan Premium</button>.
                    </p>
                  </div>
                ) : (
                  /* Modo Personalizado de Subida de Fotos para Plan Pro / Premium */
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-300">Foto Principal del Comercio / Fachada / Logo *</label>
                      <div className="flex flex-col sm:flex-row items-stretch gap-3">
                        <div className="flex-1 flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#1E293B] border border-[#27354D]">
                          <input
                            type="text"
                            placeholder="Pegá URL de imagen o elegí archivo a la derecha →"
                            value={formData.imageUrl}
                            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                            className="w-full bg-transparent text-xs text-white placeholder-slate-400 focus:outline-none"
                          />
                        </div>
                        
                        <label className="cursor-pointer px-4 py-2.5 rounded-xl bg-blue-900/80 hover:bg-blue-800 text-blue-200 font-bold text-xs border border-blue-700/60 transition-colors flex items-center justify-center gap-1.5 shrink-0 shadow">
                          <span>📁 Subir Foto</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setFormData(prev => ({ ...prev, imageUrl: reader.result }));
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>
                      </div>

                      {/* Vista Previa de Foto Principal */}
                      {formData.imageUrl && (
                        <div className="relative aspect-video w-44 rounded-xl overflow-hidden border-2 border-emerald-500/60 mt-2 shadow-lg">
                          <img src={formData.imageUrl} alt="Vista previa principal" className="w-full h-full object-cover" />
                          <span className="absolute bottom-1 right-1 bg-emerald-950 text-emerald-300 text-[9px] font-bold px-1.5 py-0.5 rounded border border-emerald-500/50">
                            ✓ Foto Principal
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Galería Adicional */}
                    <div className="space-y-3 pt-3 border-t border-[#27354D]">
                      <label className="text-xs font-semibold text-amber-300 block">
                        🖼️ Galería de Fotos Adicionales (Incluido en Plan {formData.plan === 'premium' ? 'Premium' : 'Pro'})
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[0, 1].map((index) => (
                          <div key={index} className="space-y-1.5">
                            <span className="text-[11px] text-slate-400 font-medium">Foto Secundaria #{index + 1}:</span>
                            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#1E293B] border border-[#27354D]">
                              <input
                                type="text"
                                placeholder="URL o subir archivo..."
                                value={formData.galleryUrls[index] || ''}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setFormData(prev => {
                                    const newGallery = [...prev.galleryUrls];
                                    newGallery[index] = val;
                                    return { ...prev, galleryUrls: newGallery };
                                  });
                                }}
                                className="w-full bg-transparent text-xs text-white placeholder-slate-400 focus:outline-none"
                              />
                              <label className="cursor-pointer text-[10px] px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold border border-slate-700 shrink-0">
                                <span>📁 Subir</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const reader = new FileReader();
                                      reader.onloadend = () => {
                                        setFormData(prev => {
                                          const newGallery = [...prev.galleryUrls];
                                          newGallery[index] = reader.result;
                                          return { ...prev, galleryUrls: newGallery };
                                        });
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                  }}
                                />
                              </label>
                            </div>

                            {formData.galleryUrls[index] && (
                              <div className="relative aspect-video w-32 rounded-lg overflow-hidden border border-blue-500/40 mt-1">
                                <img src={formData.galleryUrls[index]} alt={`Galería #${index + 1}`} className="w-full h-full object-cover" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Sección 3: Selección de Plan */}
              <div className="space-y-5 p-5 rounded-2xl bg-[#151F32] border border-[#27354D]">
                
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <CrownIcon className="w-4 h-4" />
                    <span>3. Seleccioná tu Plan de Publicación</span>
                  </h3>
                  <span className="text-[10px] text-slate-400 font-semibold">Precios en Guaraníes (PYG)</span>
                </div>

                {/* Grid 3 Planes Selector */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3">
                  
                  {/* Plan Gratis */}
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, plan: 'gratuito' })}
                    className={`p-4 rounded-2xl border text-center transition-all flex flex-col justify-between ${
                      formData.plan === 'gratuito'
                        ? 'bg-blue-950/80 border-blue-500 text-white font-bold ring-2 ring-blue-500/40 shadow-lg'
                        : 'bg-[#1E293B] border-[#27354D] text-slate-400 hover:text-white'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-200">Plan Gratuito</div>
                      <div className="text-lg font-black text-white mt-1">Gs. 0</div>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-3 font-medium">Inicial Para Siempre</div>
                  </button>

                  {/* Plan Pro Mensual */}
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, plan: 'pro' })}
                    className={`p-4 pt-5 rounded-2xl border text-center transition-all relative flex flex-col justify-between ${
                      formData.plan === 'pro'
                        ? 'bg-blue-900/90 border-blue-400 text-white font-bold ring-2 ring-blue-400/60 shadow-xl shadow-blue-500/20'
                        : 'bg-[#1E293B] border-[#27354D] text-slate-300 hover:text-white'
                    }`}
                  >
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[9px] bg-blue-600 text-white px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider shadow z-10 whitespace-nowrap border border-blue-400">
                      MÁS POPULAR
                    </span>
                    <div>
                      <div className="text-xs font-bold text-blue-300 mt-1">Pro Mensual</div>
                      <div className="text-lg font-black text-amber-400 mt-1">Gs. 99.000</div>
                    </div>
                    <div className="text-[10px] text-blue-200 mt-3 font-medium">/ mes (Sin permanencia)</div>
                  </button>

                  {/* Plan Premium Anual */}
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, plan: 'premium' })}
                    className={`p-4 pt-5 rounded-2xl border text-center transition-all relative flex flex-col justify-between ${
                      formData.plan === 'premium'
                        ? 'bg-amber-950/80 border-amber-400 text-white font-bold ring-2 ring-amber-400/60 shadow-xl shadow-amber-500/20'
                        : 'bg-[#1E293B] border-[#27354D] text-slate-300 hover:text-white'
                    }`}
                  >
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[9px] bg-amber-500 text-black px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider shadow z-10 whitespace-nowrap border border-amber-400">
                      🔥 RECOMENDADO
                    </span>
                    <div>
                      <div className="text-xs font-bold text-amber-400 mt-1">Premium Anual</div>
                      <div className="text-lg font-black text-amber-300 mt-1">Gs. 790.000</div>
                    </div>
                    <div className="text-[10px] text-amber-200/90 mt-3 font-medium">/ año (Portada VIP)</div>
                  </button>

                </div>

                {/* Breakdown de Beneficios */}
                <div className={`p-4 rounded-xl border transition-all ${selectedPlanInfo.color}`}>
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-700/60 mb-2.5">
                    <span className="text-xs font-extrabold text-white leading-snug">
                      ¿Qué incluye el {selectedPlanInfo.name}?
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-black/60 text-amber-400 shrink-0">
                      {selectedPlanInfo.badge}
                    </span>
                  </div>

                  <ul className="space-y-2.5">
                    {selectedPlanInfo.items.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2.5 text-xs">
                        {item.included ? (
                          <CheckCircleIcon className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <span className="w-4 h-4 text-slate-500 text-center font-mono shrink-0">✕</span>
                        )}
                        <span className={`leading-snug ${item.included ? 'text-slate-200 font-medium' : 'text-slate-500 line-through'}`}>
                          {item.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

              {/* Submit CTA Button */}
              <button
                type="submit"
                className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-sm sm:text-base shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2 uppercase tracking-wide cursor-pointer"
              >
                <span>Registrar y Ver en el Directorio ({selectedPlanInfo.name}) →</span>
              </button>

            </form>
          </>
        ) : (
          /* Confirmation State */
          <div className="text-center py-6 space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
              <CheckCircleIcon className="w-10 h-10" />
            </div>

            <div className="space-y-2.5">
              <h3 className="text-2xl sm:text-3xl font-black text-white leading-snug">¡Registro Exitoso!</h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                {formData.plan === 'gratuito'
                  ? `Publicamos a "${formData.name}" en el Plan Gratuito con imagen genérica de rubro. Ya podés buscarlo en el catálogo.`
                  : `Publicamos a "${formData.name}" con el ${selectedPlanInfo.name}. El comercio ya aparece activado en vivo con sus imágenes.`}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#151F32] border border-[#27354D] text-left space-y-2">
              <div className="text-xs font-bold text-amber-400">Resumen del Comercio Registrado:</div>
              <div className="text-xs text-slate-200 font-semibold">📍 {formData.name} ({formData.city.toUpperCase()})</div>
              <div className="text-[11px] text-slate-400">Plan: <span className="text-emerald-400 font-bold uppercase">{formData.plan}</span></div>
            </div>

            {formData.plan !== 'gratuito' ? (
              <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-400/60 space-y-3">
                <div className="text-xs text-amber-300 font-bold">
                  Siguiente paso para activar tu plan:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={handleProceedToPayment}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-black font-extrabold text-xs shadow-xl hover:scale-[1.01] transition-all uppercase tracking-wide"
                  >
                    PROCEDER AL PAGO SIPAP →
                  </button>
                  <button
                    onClick={() => {
                      onClose();
                      setSubmitted(false);
                    }}
                    className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow transition-colors uppercase"
                  >
                    Ver mi Local en Vivo →
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => {
                  onClose();
                  setSubmitted(false);
                }}
                className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-colors"
              >
                Cerrar y Ver mi Local en el Catálogo →
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
