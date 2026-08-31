const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const FALLBACK_SUPABASE_URL = 'https://hgsizqxouqpnoqcqlcuk.supabase.co';
const FALLBACK_SUPABASE_KEY = 'sb_publishable_oSCfxyQI9fB5eeUuqOHB_Q_vcHQzoUm';

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

function hasPlaceholderPhone(business) {
  const digits = String(business.phone || business.whatsappNumber || '').replace(/\D/g, '');
  if (!digits || digits.length < 6) return true;
  if (/^(595)?0+$/.test(digits)) return true;
  if (/000\d{3}$/.test(digits)) return true;
  if (/^(595)?123456/.test(digits)) return true;
  return false;
}

function auditBusiness(business, allBusinesses) {
  const flags = [];

  if (hasPlaceholderPhone(business)) flags.push('telefono_placeholder');
  if (!business.name || business.name.trim().length < 2) flags.push('sin_nombre_valido');
  if (!business.address || /direcci[oó]n no disponible|av\. principal c\/ ruta/i.test(business.address)) {
    flags.push('sin_direccion_confiable');
  }
  if (!business.website && !business.instagram && !business.facebook) {
    flags.push('sin_presencia_web');
  }
  const reviewCount = Number(business.reviews || business.reviewCount || 0);
  if (reviewCount === 42) flags.push('review_count_repetido_42');
  if (/local pyme real y verificado/i.test(business.description || '')) flags.push('descripcion_generada');
  if (/unsplash\.com/i.test(business.image || '') && !business.website) flags.push('imagen_generica_sin_web');

  // Verificar duplicados dentro del dataset
  const nameCityKey = `${normalizeKey(business.name)}|${normalizeKey(business.city || business.cityName)}`;
  const sameNameCity = allBusinesses.filter(
    (b) => b.id !== business.id && `${normalizeKey(b.name)}|${normalizeKey(b.city || b.cityName)}` === nameCityKey,
  );
  if (sameNameCity.length > 0) flags.push(`duplicado_nombre_ciudad(${sameNameCity.map((b) => b.id).join(',')})`);

  const phoneKey = normalizeWhatsApp(business.phone || business.whatsappNumber);
  if (phoneKey && !hasPlaceholderPhone(business)) {
    const samePhone = allBusinesses.filter(
      (b) => b.id !== business.id && normalizeWhatsApp(b.phone || b.whatsappNumber) === phoneKey,
    );
    if (samePhone.length > 0) flags.push(`duplicado_telefono(${samePhone.map((b) => b.id).join(',')})`);
  }

  return {
    id: business.id,
    score: Math.max(0, 100 - flags.length * 15),
    name: business.name || '',
    category: business.category || '',
    niche: business.niche || '',
    city: business.city || '',
    cityName: business.cityName || business.city || '',
    phone: business.phone || '',
    whatsappNumber: business.whatsappNumber || '',
    isVerified: Boolean(business.isVerified),
    plan: business.plan || 'free',
    reviews: reviewCount,
    address: business.address || '',
    website: business.website || '',
    created_at: business.created_at || '',
    flags,
  };
}

function toCsvValue(value) {
  if (value === null || value === undefined) return '';
  const text = Array.isArray(value) ? value.join('; ') : typeof value === 'object' ? JSON.stringify(value) : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

function writeCsv(records, outputPath) {
  const columns = [
    'id',
    'score',
    'name',
    'category',
    'niche',
    'city',
    'cityName',
    'phone',
    'whatsappNumber',
    'isVerified',
    'plan',
    'reviews',
    'flags',
    'address',
    'website',
    'created_at',
  ];

  const rows = records.map((record) => columns.map((col) => toCsvValue(record[col])));

  fs.writeFileSync(
    outputPath,
    [columns.join(','), ...rows.map((row) => row.join(','))].join('\n'),
    'utf8',
  );
}

async function main() {
  loadDotEnv(path.resolve(process.cwd(), '.env.local'));

  const args = parseArgs(process.argv.slice(2));
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_SUPABASE_KEY;

  const supabase = createClient(supabaseUrl, supabaseKey);
  const { data, error } = await supabase.from('businesses').select('*').order('id', { ascending: true });
  if (error) {
    throw new Error(`No pude leer businesses de Supabase: ${error.message}`);
  }

  const rawBusinesses = data || [];
  const audited = rawBusinesses
    .map((business) => auditBusiness(business, rawBusinesses))
    .sort((left, right) => left.score - right.score);

  const suspicious = audited.filter((business) => business.flags.length > 0);
  const exportAll = Boolean(args.all);
  const recordsToExport = exportAll ? audited : suspicious;

  const outputDir = path.resolve(process.cwd(), args.output || 'scratch');
  fs.mkdirSync(outputDir, { recursive: true });

  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const baseName = `business-audit-${stamp}`;
  const jsonPath = path.join(outputDir, `${baseName}.json`);
  const csvPath = path.join(outputDir, `${baseName}.csv`);

  fs.writeFileSync(jsonPath, `${JSON.stringify(recordsToExport, null, 2)}\n`, 'utf8');
  writeCsv(recordsToExport, csvPath);

  // Conteo de flags
  const flagCounts = {};
  for (const b of audited) {
    for (const f of b.flags) {
      const baseFlag = f.split('(')[0];
      flagCounts[baseFlag] = (flagCounts[baseFlag] || 0) + 1;
    }
  }

  console.log('====================================================');
  console.log('📊 REPORTE DE AUDITORÍA DE COMERCIOS - SUPABASE');
  console.log('====================================================');
  console.log(`Total registros en Supabase:      ${audited.length}`);
  console.log(`Comercios con señales de alerta: ${suspicious.length}`);
  console.log(`Comercios 100% limpios:           ${audited.length - suspicious.length}`);
  console.log('----------------------------------------------------');
  console.log('Desglose de alertas detectadas:');
  for (const [flag, count] of Object.entries(flagCounts)) {
    console.log(` - ${flag.padEnd(30)}: ${count}`);
  }
  console.log('----------------------------------------------------');
  console.log(`📄 Reporte JSON: ${jsonPath}`);
  console.log(`📊 Reporte CSV:  ${csvPath}`);
  console.log('====================================================\n');

  if (suspicious.length > 0) {
    console.log('Top 20 comercios con menor puntaje de confianza:');
    console.table(
      suspicious.slice(0, 20).map((b) => ({
        id: b.id,
        score: b.score,
        name: b.name.slice(0, 25),
        city: b.cityName || b.city,
        phone: b.phone,
        flags: b.flags.join(', ').slice(0, 45),
      })),
    );
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
