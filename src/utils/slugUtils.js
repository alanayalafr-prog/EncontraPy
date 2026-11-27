/**
 * Utilidades para URLs amigables (Mini-Web / Tarjeta Digital)
 * y limpieza de nombres de comercios para mensajes humanos por WhatsApp.
 */

/**
 * Limpia nombres copiados de Google Maps para que suenen naturales en un mensaje humano.
 * Ej: "Amascotas Centro Veterinario | URGENCIAS 24 Hs." -> "Amascotas Centro Veterinario"
 * Ej: "MiCliVet's, tu clínica veterinaria" -> "MiCliVet's"
 * Ej: "Veterinaria Samper Urgencias 24hs" -> "Veterinaria Samper"
 */
export function getHumanBusinessName(rawName) {
  if (!rawName || typeof rawName !== 'string') return 'su comercio';

  let name = rawName.trim();

  // Cortar después de separadores típicos de títulos SEO de Google Maps: |, -, –, —, •, /
  const separatorMatch = name.split(/\s*[|–—•]\s*|\s+-\s+/);
  if (separatorMatch[0] && separatorMatch[0].trim().length >= 3) {
    name = separatorMatch[0].trim();
  }

  // Cortar eslóganes tras coma si la primera parte ya es un nombre válido
  const commaParts = name.split(',');
  if (commaParts.length > 1 && commaParts[0].trim().length >= 3) {
    name = commaParts[0].trim();
  }

  // Quitar sufijos promocionales comunes ("Urgencias 24hs", "24 horas", "24/7", "S.A.", etc.)
  name = name
    .replace(/\b(urgencias?\s*)?(24\s*\/?\s*7|24\s*hs\.?|24\s*horas)\b/gi, '')
    .replace(/\s*\(\s*\)\s*/g, ' ')
    .replace(/[.,;:\-–—]+$/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();

  return name || rawName.trim();
}

/**
 * Convierte un texto en slug URL-safe en minúsculas.
 */
export function slugifyText(text) {
  if (!text || typeof text !== 'string') return 'comercio';
  const slug = text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48)
    .replace(/-+$/g, '');

  return slug || 'comercio';
}

/**
 * Genera el slug único de la Mini-Web de un comercio: ej. "veterinaria-garpet-42"
 * Funciona con todos los comercios actuales de Supabase sin requerir columna extra.
 */
export function getBusinessSlug(business) {
  if (!business) return '';
  const baseName = getHumanBusinessName(business.name || 'comercio');
  const baseSlug = slugifyText(baseName);
  const idPart = business.id !== undefined && business.id !== null ? String(business.id).trim() : '';

  if (!idPart) return baseSlug;
  return `${baseSlug}-${idPart}`;
}

/**
 * Extrae el posible ID desde un slug tipo "veterinaria-garpet-42" o "serviclimaluque-b2" o "42".
 */
export function extractIdFromSlug(slug) {
  if (!slug || typeof slug !== 'string') return null;
  const trimmed = slug.trim();

  // Si el slug completo es directamente un número o UUID
  if (/^\d+$/.test(trimmed)) return trimmed;
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(trimmed)) {
    return trimmed;
  }

  // UUID al final: "nombre-uuid"
  const uuidMatch = trimmed.match(/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i);
  if (uuidMatch) return uuidMatch[1];

  // Número al final: "veterinaria-garpet-42"
  const numMatch = trimmed.match(/-(\d+)$/);
  if (numMatch) return numMatch[1];

  // ID corto tipo "b2" al final: "serviclimaluque-b2"
  const shortIdMatch = trimmed.match(/-(b\d+)$/i);
  if (shortIdMatch) return shortIdMatch[1];

  return null;
}

/**
 * Retorna la ruta relativa de la Mini-Web de un comercio.
 */
export function getMiniWebPath(business, { isSample = false } = {}) {
  const slug = getBusinessSlug(business);
  if (!slug) return '/';
  return isSample ? `/c/${slug}?muestra=1` : `/c/${slug}`;
}

/**
 * Retorna la URL absoluta de la Mini-Web de un comercio.
 */
export function getMiniWebUrl(business, { isSample = false, baseUrl = 'https://www.directoriopy.com' } = {}) {
  const path = getMiniWebPath(business, { isSample });
  return `${baseUrl.replace(/\/$/, '')}${path}`;
}
