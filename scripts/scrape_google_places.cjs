const fs = require('fs');
const path = require('path');

const GOOGLE_PLACES_TEXT_SEARCH_URL = 'https://places.googleapis.com/v1/places:searchText';

const CATEGORY_LABELS = {
  agro: 'Agro e Insumos',
  oficios: 'Oficios y Servicios',
  salud: 'Salud Privada',
  gastronomia: 'Gastronomía y Eventos',
};

const DEFAULT_IMAGES = {
  agro: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=800&q=80',
  oficios: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
  salud: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=800&q=80',
  gastronomia: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
};

// Filtro de grandes corporaciones y shoppings para priorizar PyMEs locales
const BIG_CHAIN_PATTERNS = [
  /\bshopping\b/i,
  /\bmall\b/i,
  /\bpaseo (galer[ií]a|la galer[ií]a|carmelitas|pettirossi|1811)\b/i,
  /\btupi\b/i,
  /\bbristol\b/i,
  /\binverfin\b/i,
  /\bgonzalito\b/i,
  /\balex s\.?a\.?\b/i,
  /\bchacomer\b/i,
  /\bsuperseis\b/i,
  /\bhiperseis\b/i,
  /\bstock\b/i,
  /\bfortis\b/i,
  /\bbox mayorista\b/i,
  /\bbiggie\b/i,
  /\bfarmacenter\b/i,
  /\bpunto farma\b/i,
  /\bfarmathotal\b/i,
  /\bcatedral\b/i,
  /\bvisiv?i[oó]n banco\b/i,
  /\bbanco \w+\b/i,
  /\bbancop\b/i,
  /\bita[uú]\b/i,
  /\bpersonal\b/i,
  /\btigo\b/i,
  /\bclaro\b/i,
];

function isBigChainOrMall(name, types = []) {
  if (types.includes('shopping_mall') || types.includes('department_store') || types.includes('bank')) {
    return true;
  }
  const cleanName = String(name || '');
  return BIG_CHAIN_PATTERNS.some((pattern) => pattern.test(cleanName));
}

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

function required(args, key) {
  if (!args[key]) {
    throw new Error(`Falta el parámetro requerido --${key}`);
  }
  return args[key];
}

function normalizeWhatsApp(phone) {
  const digits = String(phone || '').replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('595')) return digits;
  return `595${digits.replace(/^0+/, '')}`;
}

function scorePlace(place) {
  const reasons = [];
  let score = 0;

  if (place.businessStatus === 'OPERATIONAL') {
    score += 35;
    reasons.push('operational');
  }
  if (place.nationalPhoneNumber || place.internationalPhoneNumber) {
    score += 25;
    reasons.push('phone');
  }
  if (place.formattedAddress) {
    score += 15;
    reasons.push('address');
  }
  if (place.googleMapsUri) {
    score += 10;
    reasons.push('maps_url');
  }
  if (place.websiteUri) {
    score += 10;
    reasons.push('website');
  }
  if ((place.userRatingCount || 0) >= 5) {
    score += 5;
    reasons.push('reviews');
  }

  return { score, reasons };
}

function makeBusiness(place, args) {
  const phone = place.internationalPhoneNumber || place.nationalPhoneNumber || '';
  const category = args.category;
  const name = place.displayName?.text || 'Comercio sin nombre';
  const verification = scorePlace(place);
  const cityName = args['city-name'];

  return {
    id: `google_${place.id}`,
    name,
    category,
    niche: args.niche,
    city: args.city,
    cityName,
    zone: args.zone || cityName,
    address: place.formattedAddress || '',
    description: `${name} es un comercio local (PyME) ubicado en ${cityName}. Perfil capturado desde Google Places pendiente de validación comercial por DirectorioPY.`,
    phone,
    whatsappNumber: normalizeWhatsApp(phone),
    whatsappDefaultMessage: `Hola ${name}, vi su comercio en DirectorioPY y quisiera conversar sobre su perfil.`,
    rating: place.rating || 0,
    reviews: place.userRatingCount || 0,
    isVerified: false,
    plan: 'free',
    workingHours: place.regularOpeningHours?.weekdayDescriptions?.join(' | ') || '',
    image: DEFAULT_IMAGES[category] || DEFAULT_IMAGES.oficios,
    gallery: [],
    tags: [category, args.niche, cityName].filter(Boolean),
    instagram: '',
    facebook: '',
    website: place.websiteUri || '',
    source_provider: 'google_places',
    source_url: place.googleMapsUri || '',
    source_place_id: place.id,
    source: {
      provider: 'google_places',
      placeId: place.id,
      mapsUrl: place.googleMapsUri || '',
      businessStatus: place.businessStatus || '',
      types: place.types || [],
      primaryType: place.primaryTypeDisplayName?.text || '',
      capturedAt: new Date().toISOString(),
    },
    verification: {
      status: verification.score >= 75 ? 'ready_for_manual_review' : 'needs_manual_review',
      score: verification.score,
      reasons: verification.reasons,
      approved: false,
    },
  };
}

function toCsvValue(value) {
  if (value === null || value === undefined) return '';
  const text = typeof value === 'object' ? JSON.stringify(value) : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

function writeCsv(records, outputPath) {
  const columns = [
    'approved',
    'score',
    'name',
    'category',
    'niche',
    'cityName',
    'phone',
    'whatsappNumber',
    'address',
    'website',
    'mapsUrl',
    'businessStatus',
    'reviews',
  ];

  const rows = records.map((record) => [
    record.verification.approved,
    record.verification.score,
    record.name,
    record.category,
    record.niche,
    record.cityName,
    record.phone,
    record.whatsappNumber,
    record.address,
    record.website,
    record.source.mapsUrl,
    record.source.businessStatus,
    record.reviews,
  ]);

  fs.writeFileSync(
    outputPath,
    [columns.join(','), ...rows.map((row) => row.map(toCsvValue).join(','))].join('\n'),
    'utf8',
  );
}

async function main() {
  loadDotEnv(path.resolve(process.cwd(), '.env.local'));

  const args = parseArgs(process.argv.slice(2));
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  if (!apiKey) {
    console.error('\n❌ ERROR: Falta GOOGLE_PLACES_API_KEY en .env.local.\n');
    process.exit(1);
  }

  const query = required(args, 'query');
  required(args, 'category');
  required(args, 'niche');
  required(args, 'city');
  required(args, 'city-name');

  const limit = Math.min(Number(args.limit || 20), 20);
  const outputDir = path.resolve(process.cwd(), args.output || 'scratch');
  fs.mkdirSync(outputDir, { recursive: true });

  console.log(`🔍 Buscando PyMEs en Google Places para: "${query}"...`);

  const response = await fetch(GOOGLE_PLACES_TEXT_SEARCH_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': [
        'places.id',
        'places.displayName',
        'places.formattedAddress',
        'places.location',
        'places.nationalPhoneNumber',
        'places.internationalPhoneNumber',
        'places.websiteUri',
        'places.businessStatus',
        'places.rating',
        'places.userRatingCount',
        'places.regularOpeningHours',
        'places.googleMapsUri',
        'places.types',
        'places.primaryTypeDisplayName',
      ].join(','),
    },
    body: JSON.stringify({
      textQuery: query,
      languageCode: 'es',
      regionCode: 'PY',
      pageSize: limit,
    }),
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(`Google Places API respondió ${response.status}: ${JSON.stringify(payload)}`);
  }

  const places = Array.isArray(payload.places) ? payload.places : [];
  const includeClosed = Boolean(args['include-closed']);
  const includeChains = Boolean(args['include-chains']);

  let filteredChainsCount = 0;

  const records = places
    .filter((place) => includeClosed || place.businessStatus === 'OPERATIONAL')
    .filter((place) => {
      if (includeChains) return true;
      const isChain = isBigChainOrMall(place.displayName?.text, place.types || []);
      if (isChain) {
        filteredChainsCount += 1;
        return false;
      }
      return true;
    })
    .map((place) => makeBusiness(place, args))
    .sort((left, right) => right.verification.score - left.verification.score);

  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const baseName = `business-candidates-${stamp}`;
  const jsonPath = path.join(outputDir, `${baseName}.json`);
  const csvPath = path.join(outputDir, `${baseName}.csv`);

  fs.writeFileSync(jsonPath, `${JSON.stringify(records, null, 2)}\n`, 'utf8');
  writeCsv(records, csvPath);

  console.log('====================================================');
  console.log('✅ CANDIDATOS PYMES CAPTURADOS EXITOSAMENTE');
  console.log('====================================================');
  console.log(`Candidatos totales recibidos:        ${places.length}`);
  if (filteredChainsCount > 0) {
    console.log(`Grandes cadenas/shoppings filtrados: ${filteredChainsCount} (excluidos)`);
  }
  console.log(`PyMEs operativas y listas:           ${records.length}`);
  console.log(`📄 Archivo JSON de trabajo:          ${jsonPath}`);
  console.log(`📊 Archivo CSV de revisión:          ${csvPath}`);
  console.log('----------------------------------------------------');
  console.log('Próximo paso:');
  console.log(`1. Revisa los candidatos:  node scripts/review_candidates.cjs --file "${jsonPath}" --list`);
  console.log(`2. Aprueba los válidos:    node scripts/review_candidates.cjs --file "${jsonPath}" --approve-min-score 75`);
  console.log(`3. Dry-run de importación: node scripts/import_approved_businesses.cjs --file "${jsonPath}"`);
  console.log('====================================================\n');
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
