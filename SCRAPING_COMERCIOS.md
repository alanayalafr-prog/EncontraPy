# Pipeline de Comercios Reales para DirectorioPY (www.directoriopy.com)

Objetivo: Cargar comercios reales en Supabase evitando negocios inventados o duplicados, garantizando datos auditables y contactos comerciales reales para la venta de planes pagos.

---

## 🛡️ Reglas de Oro

1. **Cero Comercios Falsos**: No se generan comercios ficticios ni datos inventados.
2. **Fuentes Auditables**: Solo se importan candidatos provenientes de fuentes verificables (Google Places API, OpenStreetMap, sitios web oficiales o contacto directo).
3. **Revisión Humana Obligatoria**: Ningún comercio se inserta directamente desde scraping sin pasar por una etapa de revisión y aprobación previa.
4. **Verificación Estricta**:
   - Todo comercio importado automáticamente ingresa con `isVerified = false` y `plan = 'free'`.
   - `isVerified = true` queda reservado **exclusivamente** para cuando el negocio haya sido contactado y validado manualmente.
5. **Deduplicación Doble Capa**: Se previene duplicidad tanto por **Nombre + Ciudad** (normalizados) como por **Teléfono / WhatsApp**.

---

## ⚙️ Configuración del Entorno

Crea o edita tu archivo `.env.local` en la raíz del proyecto:

```env
# Clave para captura de comercios en Google Places API
GOOGLE_PLACES_API_KEY=tu_google_places_api_key

# Conexión a Supabase
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_supabase
```

*(Nota: Si no se configuran las variables de Supabase en `.env.local`, los scripts utilizarán automáticamente las credenciales públicas por defecto configuradas en el proyecto).*

---

## 🔄 Flujo Operativo en 5 Pasos

### Paso 1: Capturar candidatos (Google Places API)

Ejecuta el buscador para la ciudad y rubro deseado:

```bash
node scripts/scrape_google_places.cjs --query "Ferreterías en San Lorenzo, Paraguay" --category oficios --niche "Ferretería y Materiales" --city san_lorenzo --city-name "San Lorenzo" --limit 20
```

Esto generará automáticamente en la carpeta `scratch/`:
- `business-candidates-YYYY-MM-DDTHH-mm-ss.json`: archivo de trabajo con metadatos de validación.
- `business-candidates-YYYY-MM-DDTHH-mm-ss.csv`: planilla para inspección rápida en Excel / Sheets.

---

### Paso 2: Revisar y Aprobar Candidatos

Puedes usar la herramienta CLI `review_candidates.cjs` o abrir el archivo JSON/CSV:

#### Ver la lista de candidatos y sus puntajes:
```bash
node scripts/review_candidates.cjs --file scratch/business-candidates-ARCHIVO.json --list
```

#### Aprobar automáticamente aquellos con puntaje de confianza alto (ej: >= 75):
```bash
node scripts/review_candidates.cjs --file scratch/business-candidates-ARCHIVO.json --approve-min-score 75
```

#### O aprobar candidatos específicos por índice:
```bash
node scripts/review_candidates.cjs --file scratch/business-candidates-ARCHIVO.json --approve-indices 0,2,5
```

---

### Paso 3: Dry-Run de Importación (Simulación)

Antes de escribir en Supabase, ejecuta siempre la simulación para comprobar la deduplicación:

```bash
node scripts/import_approved_businesses.cjs --file scratch/business-candidates-ARCHIVO.json
```

El script verificará:
- Si el comercio ya existe en Supabase por nombre y ciudad.
- Si el teléfono o WhatsApp ya existe en Supabase.
- Si hay duplicados dentro del mismo lote.
- Mostrará la tabla de comercios que calificarían para ser insertados.

---

### Paso 4: Importación Real a Supabase

Una vez confirmado el dry-run, ejecuta:

```bash
node scripts/import_approved_businesses.cjs --file scratch/business-candidates-ARCHIVO.json --dry-run false
```

Los comercios quedarán insertados en Supabase con:
- `isVerified = false`
- `plan = 'free'`
- Rating y número de reseñas reales de la fuente.
- Enlace al perfil y trazabilidad.

---

### Paso 5: Auditar la Base de Datos de Supabase

Para evaluar la calidad de todos los comercios cargados en Supabase y detectar teléfonos placeholder o anomalías:

```bash
node scripts/audit_businesses.cjs
```

Genera un reporte completo en:
- `scratch/business-audit-YYYY-MM-DDTHH-mm-ss.json`
- `scratch/business-audit-YYYY-MM-DDTHH-mm-ss.csv`

---

## 🗄️ Esquema y Trazabilidad en Supabase

Para guardar metadatos de auditoría adicionales (como el origen de los datos, fecha de contacto comercial, etc.), puedes ejecutar la migración SQL disponible en:

📄 [`supabase_migration_audit_fields.sql`](file:///c:/Users/usuario/Documents/Directorio%20Web/supabase_migration_audit_fields.sql)

Campos agregados opcionalmente:
- `source_provider`: `'google_places'`, `'openstreetmap'`, `'manual'`.
- `source_url`: URL al mapa o perfil original.
- `source_place_id`: ID de Google Places o nodo OSM.
- `verification_status`: `'unverified'`, `'pending_review'`, `'verified'`, `'rejected'`.
- `contact_status`: `'not_contacted'`, `'whatsapp_sent'`, `'replied'`, `'converted_paid'`, `'declined'`.
- `verified_at`: Fecha de verificación humana.
- `contacted_at`: Fecha de último contacto comercial.

---

## 📋 Resumen de Comandos NPM

| Comando | Descripción |
|---|---|
| `node scripts/audit_businesses.cjs` | Audita comercios de Supabase y genera JSON + CSV |
| `node scripts/scrape_google_places.cjs ...` | Captura candidatos de Google Places API |
| `node scripts/review_candidates.cjs ...` | Lista y aprueba candidatos en lote |
| `node scripts/import_approved_businesses.cjs ...` | Importa candidatos aprobados (Dry-Run por defecto) |
| `node scripts/import_osm_results.cjs` | Importa comercios desde `osm_results.json` |
