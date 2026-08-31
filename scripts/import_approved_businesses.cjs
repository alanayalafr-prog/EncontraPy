const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const FALLBACK_SUPABASE_URL = 'https://hgsizqxouqpnoqcqlcuk.supabase.co';
const FALLBACK_SUPABASE_KEY = 'sb_publishable_oSCfxyQI9fB5eeUuqOHB_Q_vcHQzoUm';

const BASE_BUSINESS_COLUMNS = [
  'name',
  'category',
  'niche',
  'city',
  'cityName',
  'zone',
  'address',
  'description',
  'phone',
  'whatsappNumber',
  'whatsappDefaultMessage',
  'rating',
  'reviews',
  'isVerified',
  'plan',
  'workingHours',
  'image',
  'gallery',
  'tags',
  'instagram',
  'facebook',
  'website',
];

const OPTIONAL_AUDIT_COLUMNS = [
  'source_provider',
  'source_url',
  'source_place_id',
  'verification_status',
  'verified_at',
  'contacted_at',
  'contact_status',
];

function loadDotEnv(filePath) {
  if (!fs.existsSync(filePath)) return;

  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match) continue;

    const [, key, rawValue] = match;
    if (process.env[key]) continue;

    process.env[key] = rawValue.replace(/^['"]|['"]$/g, '');
  }
}

function parseArgs(argv) {
  const args = {};

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith('--')) continue;

    const key = token.slice(2);
    const next = argv[index + 1];
    if (!next || next.startsWith('--')) {
      args[key] = true;
      continue;
    }

    args[key] = next;
    index += 1;
  }

  return args;
}

function normalizeKey(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function normalizeWhatsApp(phone) {
  const digits = String(phone || '').replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('595')) return digits;
  return `595${digits.replace(/^0+/, '')}`;
}

function toBusinessRecord(candidate, availableColumns) {
  const record = {
    name: candidate.name || 'Comercio',
    category: candidate.category || 'oficios',
    niche: candidate.niche || 'Servicios Generales',
    city: candidate.city || 'asuncion',
    cityName: candidate.cityName || candidate.city || 'Asunción',
    zone: candidate.zone || candidate.cityName || 'Centro',
    address: candidate.address || 'Dirección comercial',
    description:
      candidate.description ||
      `${candidate.name} es un comercio de ${candidate.cityName || 'Paraguay'}. Perfil pendiente de validación comercial por DirectorioPY.`,
    phone: candidate.phone || '',
    whatsappNumber: normalizeWhatsApp(candidate.whatsappNumber || candidate.phone),
    whatsappDefaultMessage:
      candidate.whatsappDefaultMessage ||
      `Hola ${candidate.name}, vi su comercio en DirectorioPY y quisiera hacer una consulta.`,
    rating: Number(candidate.rating || 0),
    reviews: Number(candidate.reviews ?? candidate.reviewCount ?? 0),
    isVerified: false, // REGLA: Nunca marcar verificado en ingesta automatizada
    plan: 'free', // REGLA: Todo comercio nuevo entra como plan free
    workingHours: candidate.workingHours || '',
    image: candidate.image || '',
    gallery: Array.isArray(candidate.gallery) ? candidate.gallery : [],
    tags: Array.isArray(candidate.tags) ? candidate.tags : [candidate.category, candidate.city].filter(Boolean),
    instagram: candidate.instagram || '',
    facebook: candidate.facebook || '',
    website: candidate.website || '',
  };

  // Si existen columnas de auditoría en la tabla, agregarlas
  if (availableColumns.has('source_provider')) {
    record.source_provider = candidate.source_provider || candidate.source?.provider || 'google_places';
  }
  if (availableColumns.has('source_url')) {
    record.source_url = candidate.source_url || candidate.source?.mapsUrl || '';
  }
  if (availableColumns.has('source_place_id')) {
    record.source_place_id = candidate.source_place_id || candidate.source?.placeId || '';
  }
  if (availableColumns.has('verification_status')) {
    record.verification_status = 'unverified';
  }
  if (availableColumns.has('contact_status')) {
    record.contact_status = 'not_contacted';
  }

  // Filtrar para que solo contenga columnas existentes en la tabla
  const sanitized = {};
  for (const [key, value] of Object.entries(record)) {
    if (availableColumns.has(key)) {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

async function main() {
  loadDotEnv(path.resolve(process.cwd(), '.env.local'));

  const args = parseArgs(process.argv.slice(2));
  if (!args.file) {
    console.log('Uso: node scripts/import_approved_businesses.cjs --file scratch/business-candidates-XXXX.json [--dry-run false]');
    process.exit(1);
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_SUPABASE_KEY;

  const inputPath = path.resolve(process.cwd(), args.file);
  if (!fs.existsSync(inputPath)) {
    throw new Error(`Archivo no encontrado: ${inputPath}`);
  }

  const candidates = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  if (!Array.isArray(candidates)) {
    throw new Error('El archivo no contiene un arreglo válido de candidatos.');
  }

  const approved = candidates.filter((candidate) => candidate.verification?.approved === true);

  console.log('====================================================');
  console.log('📦 IMPORTACIÓN DE COMERCIOS APROBADOS');
  console.log('====================================================');
  console.log(`Archivo:             ${path.basename(inputPath)}`);
  console.log(`Total candidatos:    ${candidates.length}`);
  console.log(`Candidatos aprobados:${approved.length}`);
  console.log('----------------------------------------------------');

  if (approved.length === 0) {
    console.log('⚠️  No hay candidatos con verification.approved=true para importar.');
    console.log('💡 Tip: Usa `node scripts/review_candidates.cjs --file ... --approve-min-score 75`');
    console.log('====================================================\n');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  // 1. Obtener columnas reales de la tabla businesses
  const { data: sampleData, error: sampleError } = await supabase.from('businesses').select('*').limit(1);
  if (sampleError) {
    throw new Error(`Error conectando con Supabase: ${sampleError.message}`);
  }
  const availableColumns = new Set(sampleData && sampleData[0] ? Object.keys(sampleData[0]) : BASE_BUSINESS_COLUMNS);

  // 2. Obtener registros existentes para deduplicación
  const { data: existing, error: existingError } = await supabase
    .from('businesses')
    .select('id,name,city,cityName,phone,whatsappNumber');

  if (existingError) {
    throw new Error(`No pude leer negocios existentes de Supabase: ${existingError.message}`);
  }

  const existingNameCity = new Set(
    (existing || []).map((business) => `${normalizeKey(business.name)}|${normalizeKey(business.city || business.cityName)}`),
  );

  const existingPhones = new Set(
    (existing || [])
      .flatMap((business) => [business.phone, business.whatsappNumber])
      .map((phone) => normalizeWhatsApp(phone))
      .filter((phone) => phone.length >= 6),
  );

  const seenInBatch = new Set();
  const duplicateReasons = [];
  const validRecords = [];

  for (const candidate of approved) {
    const nameCityKey = `${normalizeKey(candidate.name)}|${normalizeKey(candidate.city || candidate.cityName)}`;
    const phoneKey = normalizeWhatsApp(candidate.phone || candidate.whatsappNumber);

    let isDuplicate = false;
    let reason = '';

    if (existingNameCity.has(nameCityKey)) {
      isDuplicate = true;
      reason = 'Ya existe en Supabase por Nombre y Ciudad';
    } else if (phoneKey && existingPhones.has(phoneKey)) {
      isDuplicate = true;
      reason = `Teléfono ya existe en Supabase (${phoneKey})`;
    } else if (seenInBatch.has(nameCityKey)) {
      isDuplicate = true;
      reason = 'Duplicado dentro del mismo lote (Nombre y Ciudad)';
    } else if (phoneKey && seenInBatch.has(phoneKey)) {
      isDuplicate = true;
      reason = 'Duplicado dentro del mismo lote (Teléfono)';
    }

    if (isDuplicate) {
      duplicateReasons.push({ name: candidate.name, city: candidate.cityName || candidate.city, reason });
    } else {
      seenInBatch.add(nameCityKey);
      if (phoneKey) seenInBatch.add(phoneKey);
      validRecords.push(toBusinessRecord(candidate, availableColumns));
    }
  }

  console.log(`Comercios aprobados listos:   ${approved.length}`);
  console.log(`Descartados por duplicidad:   ${duplicateReasons.length}`);
  console.log(`Nuevos listos para insertar:  ${validRecords.length}`);
  console.log('----------------------------------------------------');

  if (duplicateReasons.length > 0) {
    console.log('Comercios descartados (duplicados detectados):');
    console.table(duplicateReasons);
    console.log('----------------------------------------------------');
  }

  if (validRecords.length === 0) {
    console.log('⚠️  Ningún candidato aprobado pasó los filtros de deduplicación.');
    console.log('====================================================\n');
    return;
  }

  const dryRun = args['dry-run'] !== false && args['dry-run'] !== 'false';
  if (dryRun) {
    console.log(`🔍 MODO DRY-RUN: Se insertarían ${validRecords.length} comercios reales.`);
    console.table(
      validRecords.map((record) => ({
        name: record.name.slice(0, 25),
        city: record.cityName,
        category: record.category,
        phone: record.phone || 'Sin tel',
        website: record.website ? 'Sí' : 'No',
        plan: record.plan,
        verificado: record.isVerified,
      })),
    );
    console.log('\n⚠️  NO se escribió nada en Supabase (Dry-run activo).');
    console.log('Para insertar definitivamente en Supabase, ejecuta:');
    console.log(`node scripts/import_approved_businesses.cjs --file "${inputPath}" --dry-run false`);
    console.log('====================================================\n');
    return;
  }

  console.log(`🚀 Insertando ${validRecords.length} comercios en Supabase...`);
  const { data: insertedData, error: insertError } = await supabase.from('businesses').insert(validRecords).select('id,name');

  if (insertError) {
    throw new Error(`Error insertando en Supabase: ${insertError.message}`);
  }

  console.log('====================================================');
  console.log(`✅ ¡ÉXITO! Se insertaron ${validRecords.length} comercios reales en Supabase.`);
  console.log('====================================================');
  console.table(insertedData || validRecords.map((r) => ({ name: r.name, city: r.cityName })));
}

main().catch((error) => {
  console.error(`\n❌ ERROR: ${error.message}\n`);
  process.exit(1);
});
