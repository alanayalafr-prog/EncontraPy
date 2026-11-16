-- ==============================================================================
-- Migración de Supabase para DirectorioPY: Métricas reales por ficha
-- Registra visitas a cada ficha (profile_views) y clics en WhatsApp (whatsapp_clicks)
-- ==============================================================================

ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS whatsapp_clicks integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS profile_views integer DEFAULT 0;

CREATE OR REPLACE FUNCTION increment_whatsapp_clicks(business_id bigint)
RETURNS void AS $$
BEGIN
  UPDATE businesses
  SET whatsapp_clicks = COALESCE(whatsapp_clicks, 0) + 1
  WHERE id = business_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION increment_profile_views(business_id bigint)
RETURNS void AS $$
BEGIN
  UPDATE businesses
  SET profile_views = COALESCE(profile_views, 0) + 1
  WHERE id = business_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
