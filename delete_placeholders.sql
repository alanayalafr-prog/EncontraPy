-- ==============================================================================
-- SQL para eliminar los 90 comercios ficticios de prueba en Supabase
-- Ejecuta este comando en el SQL Editor de tu panel de Supabase
-- ==============================================================================

DELETE FROM businesses
WHERE (id >= 255 AND id <= 344)
   OR phone LIKE '%000 1%'
   OR "whatsappNumber" LIKE '%0001%'
   OR description LIKE '%Local PyME real y verificado%';
