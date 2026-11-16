import { supabase } from '../config/supabase';

/**
 * Registra un clic en el botón de WhatsApp de un comercio en Supabase.
 * No bloquea la navegación si la llamada falla.
 */
export function trackWhatsAppClick(businessId) {
  if (!businessId) return;
  try {
    Promise.resolve(
      supabase.rpc('increment_whatsapp_clicks', { business_id: businessId })
    ).catch(() => {});
  } catch {
    // Silenciar errores de tracking para no afectar la experiencia del usuario
  }
}

/**
 * Registra una visita a la ficha de detalle de un comercio en Supabase.
 * Usa sessionStorage para evitar contar múltiples veces la misma vista en la sesión.
 */
export function trackProfileView(businessId) {
  if (!businessId) return;
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const storageKey = `viewed_business_${businessId}`;
      if (window.sessionStorage.getItem(storageKey)) {
        return;
      }
      window.sessionStorage.setItem(storageKey, '1');
    }

    Promise.resolve(
      supabase.rpc('increment_profile_views', { business_id: businessId })
    ).catch(() => {});
  } catch {
    // Silenciar errores de tracking
  }
}
