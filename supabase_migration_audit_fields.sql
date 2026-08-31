-- ==============================================================================
-- Migración opcional de Supabase para DirectorioPY
-- Agrega columnas de auditoría, trazabilidad y estado de contacto en 'businesses'
-- ==============================================================================

-- 1. Origen del dato y enlace auditable
ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS source_provider text,      -- 'google_places', 'openstreetmap', 'manual', etc.
  ADD COLUMN IF NOT EXISTS source_url text,           -- URL de Google Maps, OSM o web oficial
  ADD COLUMN IF NOT EXISTS source_place_id text;      -- ID de Google Places u OSM node id

-- 2. Estado de verificación y contacto comercial
ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS verification_status text DEFAULT 'unverified', -- 'unverified', 'pending_review', 'verified', 'rejected'
  ADD COLUMN IF NOT EXISTS verified_at timestamptz,                       -- Fecha en que un humano validó el comercio
  ADD COLUMN IF NOT EXISTS contacted_at timestamptz,                      -- Fecha del último contacto (WhatsApp/llamada)
  ADD COLUMN IF NOT EXISTS contact_status text DEFAULT 'not_contacted';   -- 'not_contacted', 'whatsapp_sent', 'replied', 'converted_paid', 'declined'

-- 3. Índices útiles para deduplicación y búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_businesses_phone ON businesses (phone);
CREATE INDEX IF NOT EXISTS idx_businesses_whatsapp ON businesses ("whatsappNumber");
CREATE INDEX IF NOT EXISTS idx_businesses_city ON businesses (city);
CREATE INDEX IF NOT EXISTS idx_businesses_category ON businesses (category);
