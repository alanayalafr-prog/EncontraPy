/**
 * Utilidades de negocio para DirectorioPY
 * Cálculo de horarios en Paraguay, imágenes representativas y lógica de confianza
 */

/**
 * Evalúa si un comercio está abierto en este momento según la hora de Paraguay (America/Asuncion)
 */
export function isOpenNow(workingHours) {
  if (!workingHours || typeof workingHours !== 'string') {
    return { isOpen: true, label: 'Consultar horario', isExplicit: false };
  }

  const normalized = workingHours.toLowerCase();

  // Casos especiales 24/7 o 24hs
  if (normalized.includes('24/7') || normalized.includes('24hs') || normalized.includes('24 horas')) {
    return { isOpen: true, label: 'Abierto 24hs', isExplicit: true };
  }

  try {
    const pyTimeStr = new Intl.DateTimeFormat('es-PY', {
      timeZone: 'America/Asuncion',
      weekday: 'short',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false
    }).format(new Date());

    // pyTimeStr ejemplo: "lun, 14:30" o "mié, 09:15"
    const [dayStrRaw, timeStrRaw] = pyTimeStr.split(', ');
    const dayStr = (dayStrRaw || '').toLowerCase().replace('.', '');
    const [currH, currM] = (timeStrRaw || '12:00').split(':').map(Number);
    const currentMinutes = currH * 60 + (currM || 0);

    // Mapeo días semana
    const dayMap = {
      dom: 0,
      lun: 1,
      mar: 2,
      mié: 3,
      mie: 3,
      jue: 4,
      vie: 5,
      sáb: 6,
      sab: 6
    };
    const currentDay = dayMap[dayStr] !== undefined ? dayMap[dayStr] : new Date().getDay();

    // Si es domingo y el horario no menciona "dom", generalmente está cerrado
    if (currentDay === 0 && !normalized.includes('dom')) {
      return { isOpen: false, label: 'Cerrado ahora (Abre mañana)', isExplicit: true };
    }

    // Extraer rangos horarios tipo "07:30 - 17:30" o "08:00 a 18:00"
    const timeMatches = normalized.match(/(\d{1,2}):(\d{2})\s*(?:-|a|hasta)\s*(\d{1,2}):(\d{2})/g);
    if (timeMatches && timeMatches.length > 0) {
      for (const match of timeMatches) {
        const parts = match.match(/(\d{1,2}):(\d{2})\s*(?:-|a|hasta)\s*(\d{1,2}):(\d{2})/);
        if (parts) {
          const openMin = parseInt(parts[1], 10) * 60 + parseInt(parts[2], 10);
          const closeMin = parseInt(parts[3], 10) * 60 + parseInt(parts[4], 10);

          if (currentMinutes >= openMin && currentMinutes <= closeMin) {
            return { isOpen: true, label: 'Abierto ahora', isExplicit: true };
          }
        }
      }
      return { isOpen: false, label: 'Cerrado ahora', isExplicit: true };
    }
  } catch (e) {
    console.error('Error calculando horario en Paraguay:', e);
  }

  return { isOpen: true, label: 'Abierto hoy', isExplicit: false };
}

/**
 * Retorna una imagen de alta calidad contextual según categoría y nicho
 * para evitar imágenes genéricas o rotas en DirectorioPY
 */
export function getRepresentativeImage(business) {
  if (!business) return 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80';

  const userImage = business.image;
  // Si tiene imagen propia (URL externa, imagen local en /images/ o foto subida en base64) que no sea placeholder
  if (userImage && typeof userImage === 'string' && (userImage.startsWith('http') || userImage.startsWith('/images/') || userImage.startsWith('data:image/')) && !userImage.includes('via.placeholder') && !userImage.includes('default_business')) {
    return userImage;
  }

  const cat = (business.category || '').toLowerCase();
  const niche = (business.niche || business.name || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  // 1. Coincidencia específica por servicio / rubro (prioridad sobre categoría general)
  if (niche.includes('odont') || niche.includes('dent') || niche.includes('diente')) {
    return 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=800&q=80';
  }
  if (niche.includes('farma')) {
    return 'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?auto=format&fit=crop&w=800&q=80';
  }
  if (niche.includes('medic') || niche.includes('consultorio') || niche.includes('clinic') || niche.includes('sanatorio')) {
    return 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80';
  }
  if (niche.includes('refrig') || niche.includes('aire') || niche.includes('split') || niche.includes('clima')) {
    return 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80';
  }
  if (niche.includes('electr') || niche.includes('cable') || niche.includes('luz')) {
    return 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=800&q=80';
  }
  if (niche.includes('plom') || niche.includes('hidr') || niche.includes('cano') || niche.includes('grifo')) {
    return 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=800&q=80';
  }
  if (niche.includes('taller') || niche.includes('mecanic') || niche.includes('auto') || niche.includes('freno')) {
    return 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=800&q=80';
  }
  if (niche.includes('pint') || niche.includes('albanil') || niche.includes('construc')) {
    return 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80';
  }
  if (niche.includes('informatic') || niche.includes('programac') || niche.includes('comput') || niche.includes('software')) {
    return 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80';
  }
  if (niche.includes('asado') || niche.includes('parrill') || niche.includes('cater') || niche.includes('carne')) {
    return 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80';
  }
  if (niche.includes('burger') || niche.includes('hamburg') || niche.includes('lomit')) {
    return 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80';
  }
  if (niche.includes('pizza') || niche.includes('pasta')) {
    return 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80';
  }
  if (niche.includes('cafe') || niche.includes('panad') || niche.includes('confiter')) {
    return 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80';
  }
  if (niche.includes('sanidad animal') || niche.includes('veterin') || niche.includes('granja')) {
    return 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=800&q=80';
  }
  if (niche.includes('insumos') || niche.includes('nutricion animal') || niche.includes('semill') || niche.includes('pastur')) {
    return '/images/insumos-nutricion-animal.jpg';
  }
  if (niche.includes('maquin') || niche.includes('tractor')) {
    return 'https://images.unsplash.com/photo-1530267981375-f0de937f5f13?auto=format&fit=crop&w=800&q=80';
  }

  // 2. Respaldo por categoría general
  if (cat.includes('salud') || cat.includes('medic')) {
    return 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80';
  }
  if (cat.includes('gastro') || cat.includes('comida') || cat.includes('restaurante')) {
    return 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80';
  }
  if (cat.includes('agro') || cat.includes('ganad') || cat.includes('campo')) {
    return 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=800&q=80';
  }
  if (cat.includes('oficio') || cat.includes('servicio')) {
    return 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80';
  }

  return 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80';
}

/**
 * Retorna datos formateados de reputación real
 * Si tiene 0 reseñas, no muestra 5 estrellas artificiales
 */
export function formatRating(business) {
  const reviewsCount = Number(business?.reviewCount || business?.reviews || 0);
  const rawRating = Number(business?.rating || 0);

  if (reviewsCount <= 0 || rawRating <= 0) {
    return {
      hasReviews: false,
      rating: null,
      reviewsCount: 0,
      label: 'Sin calificaciones aún',
      badgeText: 'Nuevo en DirectorioPY'
    };
  }

  return {
    hasReviews: true,
    rating: rawRating.toFixed(1),
    reviewsCount,
    label: `${rawRating.toFixed(1)} (${reviewsCount} ${reviewsCount === 1 ? 'reseña' : 'reseñas'})`,
    badgeText: `${rawRating.toFixed(1)} ★`
  };
}

/**
 * Calcula calificación únicamente a partir de reseñas reales registradas en DirectorioPY
 * (sin utilizar calificaciones importadas de Google Places).
 */
export function formatLocalReviewsRating(reviews = []) {
  if (!Array.isArray(reviews) || reviews.length === 0) {
    return {
      hasReviews: false,
      rating: null,
      reviewsCount: 0,
      label: 'Sin reseñas aún',
      badgeText: 'Nuevo en DirectorioPY'
    };
  }

  const validRatings = reviews
    .map((r) => Number(r?.rating || 0))
    .filter((r) => r > 0);

  if (validRatings.length === 0) {
    return {
      hasReviews: false,
      rating: null,
      reviewsCount: 0,
      label: 'Sin reseñas aún',
      badgeText: 'Nuevo en DirectorioPY'
    };
  }

  const avg = validRatings.reduce((acc, val) => acc + val, 0) / validRatings.length;

  return {
    hasReviews: true,
    rating: avg.toFixed(1),
    reviewsCount: validRatings.length,
    label: `${avg.toFixed(1)} (${validRatings.length} ${validRatings.length === 1 ? 'reseña' : 'reseñas'})`,
    badgeText: `${avg.toFixed(1)} ★`
  };
}

/**
 * Retorna información y badges de confianza para el comercio
 */
export function getTrustStatus(business) {
  const isPremium = (business?.plan === 'premium') && Boolean(business?.isVerified);
  const isPro = (business?.plan === 'pro') && Boolean(business?.isVerified);
  const isVerified = Boolean(business?.isVerified) || isPremium || isPro;

  if (isPremium) {
    return {
      type: 'destacado',
      badgeLabel: 'DESTACADO VIP',
      shortLabel: 'Destacado',
      badgeClass: 'bg-amber-400 text-slate-950 font-black',
      borderClass: 'border-amber-400/40 hover:border-amber-300',
      description: 'Comercio con máxima recomendación y atención prioritaria'
    };
  }

  if (isVerified) {
    return {
      type: 'verificado',
      badgeLabel: 'COMERCIO VERIFICADO',
      shortLabel: 'Verificado',
      badgeClass: 'bg-emerald-950/90 text-emerald-400 border border-emerald-500/40 font-bold',
      borderClass: 'border-emerald-500/30 hover:border-emerald-400/60',
      description: 'Datos, identidad y WhatsApp confirmados oficialmente por DirectorioPY'
    };
  }

  return {
    type: 'comunitario',
    badgeLabel: 'FICHA LOCAL PENDIENTE DE VALIDACIÓN',
    shortLabel: 'Ficha Local',
    badgeClass: 'bg-slate-800/90 text-slate-300 border border-slate-700 font-medium',
    borderClass: 'border-[#27354D] hover:border-slate-500',
    description: 'Información pública del comercio. ¿Sos el dueño? Reclamala gratis para actualizar tus datos.'
  };
}

/**
 * Determina si el comercio tiene un plan de pago (Pro o Premium).
 * Los comercios con plan de pago tienen el botón de WhatsApp "prendido" (destacado/vibrante),
 * mientras que los de plan gratuito lo tienen "apagado" (atenuado/discreto pero funcional).
 */
export function isPaidPlan(business) {
  if (!business) return false;
  const plan = (business.plan || '').toLowerCase();
  return plan === 'pro' || plan === 'premium' || plan === 'pro_trimestral';
}

export const canUseWhatsApp = isPaidPlan;

