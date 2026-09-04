const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const FALLBACK_SUPABASE_URL = 'https://hgsizqxouqpnoqcqlcuk.supabase.co';
const FALLBACK_SUPABASE_KEY = 'sb_publishable_oSCfxyQI9fB5eeUuqOHB_Q_vcHQzoUm';

const CATEGORY_BY_OSM_TYPE = {
  bakery: ['gastronomia', 'Gastronomía y Eventos', 'Panadería y Café'],
  cafe: ['gastronomia', 'Gastronomía y Eventos', 'Cafetería'],
  dentist: ['salud', 'Salud Privada', 'Odontología & Estética Dental'],
  hairdresser: ['oficios', 'Oficios y Servicios', 'Peluquería y Belleza'],
  hardware: ['oficios', 'Oficios y Servicios', 'Ferretería y Materiales'],
  pharmacy: ['salud', 'Salud Privada', 'Farmacia'],
  veterinary: ['agro', 'Agro e Insumos', 'Veterinaria y Sanidad Animal'],
};

const IMAGE_BY_CATEGORY = {
  agro: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=800&q=80',
  oficios: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
  salud: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=800&q=80',
  gastronomia: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
};

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

function normalizeWhatsApp(phone) {
  const firstPhone = String(phone || '').split(';')[0];
  const digits = firstPhone.replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('595')) return digits;
  return `595${digits.replace(/^0+/, '')}`;
}

function getCustomerWhatsAppMessage(name, category) {
  const cleanName = (name || '').trim().replace(/[.,;:\-]+$/, '').trim();
  switch (category) {
    case 'gastronomia':
      return `Hola ${cleanName}, los encontré en DirectorioPY y quisiera consultar su menú o hacer un pedido.`;
    case 'salud':
      return `Hola ${cleanName}, los encontré en DirectorioPY y quisiera consultar sobre turnos y atención.`;
    case 'oficios':
      return `Hola ${cleanName}, los encontré en DirectorioPY y quisiera consultar por un presupuesto o servicio.`;
    case 'agro':
      return `Hola ${cleanName}, los encontré en DirectorioPY y quisiera consultar sobre disponibilidad y cotizaciones.`;
    default:
      return `Hola ${cleanName}, los encontré en DirectorioPY y me gustaría hacerles una consulta.`;
  }
}

function normalizeKey(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function toBusiness(osmRecord) {
  const [category, , niche] = CATEGORY_BY_OSM_TYPE[osmRecord.cat] || [
    'oficios',
    'Oficios y Servicios',
    'Oficios y Servicios Generales',
  ];

  const address = osmRecord.street || 'Asunción, Paraguay';

  return {
    name: osmRecord.name,
    category,
    niche,
    city: 'asuncion',
    cityName: 'Asunción',
    zone: address,
    address,
    description: `${osmRecord.name} figura en registros públicos de OpenStreetMap con teléfono de contacto. Perfil pendiente de validación comercial por DirectorioPY.`,
    phone: osmRecord.phone,
    whatsappNumber: normalizeWhatsApp(osmRecord.phone),
    whatsappDefaultMessage: getCustomerWhatsAppMessage(osmRecord.name, category),
    rating: 0,
    reviews: 0,
    isVerified: false,
    plan: 'free',
    workingHours: '',
    image: IMAGE_BY_CATEGORY[category],
    gallery: [],
    tags: [category, niche, 'asuncion', 'openstreetmap'],
    instagram: '',
    facebook: '',
    website: '',
  };
}

async function main() {
  loadDotEnv(path.resolve(process.cwd(), '.env.local'));

  const args = parseArgs(process.argv.slice(2));
  const inputPath = path.resolve(process.cwd(), args.file || 'osm_results.json');
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_SUPABASE_KEY;
  const dryRun = args['dry-run'] !== 'false';

  const raw = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  const sourceRecords = raw.filter((record) => record.name && record.phone);
  const candidates = sourceRecords.map(toBusiness);

  const supabase = createClient(supabaseUrl, supabaseKey);
  const { data: existing, error: readError } = await supabase
    .from('businesses')
    .select('name,city,phone,whatsappNumber');

  if (readError) {
    throw new Error(`No pude leer comercios existentes: ${readError.message}`);
  }

  const existingNameCity = new Set(
    (existing || []).map((business) => `${normalizeKey(business.name)}|${normalizeKey(business.city)}`),
  );
  const existingPhones = new Set(
    (existing || [])
      .flatMap((business) => [business.phone, business.whatsappNumber])
      .map((phone) => normalizeWhatsApp(phone))
      .filter(Boolean),
  );

  const seen = new Set();
  const records = candidates.filter((business) => {
    const nameCityKey = `${normalizeKey(business.name)}|${normalizeKey(business.city)}`;
    const phoneKey = normalizeWhatsApp(business.phone);
    const ownKey = `${nameCityKey}|${phoneKey}`;

    if (seen.has(ownKey)) return false;
    seen.add(ownKey);

    return !existingNameCity.has(nameCityKey) && (!phoneKey || !existingPhones.has(phoneKey));
  });

  console.log(`Registros OSM con nombre y teléfono: ${sourceRecords.length}`);
  console.log(`Nuevos luego de deduplicar: ${records.length}`);
  console.table(records.map((record) => ({
    name: record.name,
    category: record.category,
    city: record.cityName,
    phone: record.phone,
  })));

  if (dryRun) {
    console.log('Dry-run activo. Para insertar usa: --dry-run false');
    return;
  }

  if (records.length === 0) {
    console.log('No hay registros nuevos para insertar.');
    return;
  }

  const { error } = await supabase.from('businesses').insert(records);
  if (error) {
    throw new Error(`Error insertando comercios: ${error.message}`);
  }

  console.log(`Insertados ${records.length} comercios desde OpenStreetMap.`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
