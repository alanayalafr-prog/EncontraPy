const fs = require('fs');
const path = require('path');

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

function toCsvValue(value) {
  if (value === null || value === undefined) return '';
  const text = typeof value === 'object' ? JSON.stringify(value) : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

function updateSiblingCsv(records, jsonFilePath) {
  const csvFilePath = jsonFilePath.replace(/\.json$/, '.csv');
  if (!fs.existsSync(csvFilePath) && !jsonFilePath.endsWith('.json')) return;

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
    record.verification?.approved || false,
    record.verification?.score || 0,
    record.name || '',
    record.category || '',
    record.niche || '',
    record.cityName || record.city || '',
    record.phone || '',
    record.whatsappNumber || '',
    record.address || '',
    record.website || '',
    record.source?.mapsUrl || '',
    record.source?.businessStatus || '',
    record.reviews || record.reviewCount || 0,
  ]);

  fs.writeFileSync(
    csvFilePath,
    [columns.join(','), ...rows.map((row) => row.map(toCsvValue).join(','))].join('\n'),
    'utf8',
  );
}

function main() {
  const args = parseArgs(process.argv.slice(2));

  if (!args.file) {
    console.log('Uso: node scripts/review_candidates.cjs --file scratch/business-candidates-XXXX.json [opciones]');
    console.log('\nOpciones:');
    console.log('  --list                     Muestra todos los candidatos y su estado de aprobación');
    console.log('  --approve-all              Aprueba todos los candidatos del archivo');
    console.log('  --reject-all               Desaprueba / resetea todos los candidatos');
    console.log('  --approve-min-score <num>  Aprueba candidatos con score >= num (ej: --approve-min-score 75)');
    console.log('  --approve-indices <0,1,3>  Aprueba candidatos en índices específicos');
    console.log('  --reject-indices <0,1,3>   Desaprueba candidatos en índices específicos');
    console.log('\nEjemplo:');
    console.log('  node scripts/review_candidates.cjs --file scratch/business-candidates-2026-08-28.json --list');
    console.log('  node scripts/review_candidates.cjs --file scratch/business-candidates-2026-08-28.json --approve-min-score 75');
    process.exit(0);
  }

  const filePath = path.resolve(process.cwd(), args.file);
  if (!fs.existsSync(filePath)) {
    throw new Error(`No se encontró el archivo: ${filePath}`);
  }

  const candidates = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  if (!Array.isArray(candidates)) {
    throw new Error('El archivo JSON debe contener un arreglo de comercios candidatos.');
  }

  let modified = false;

  if (args['approve-all']) {
    candidates.forEach((c) => {
      if (!c.verification) c.verification = {};
      c.verification.approved = true;
    });
    modified = true;
    console.log(`✅ Marcados todos los ${candidates.length} candidatos como APROBADOS.`);
  }

  if (args['reject-all']) {
    candidates.forEach((c) => {
      if (!c.verification) c.verification = {};
      c.verification.approved = false;
    });
    modified = true;
    console.log(`🔄 Marcados todos los ${candidates.length} candidatos como NO APROBADOS.`);
  }

  if (args['approve-min-score']) {
    const minScore = Number(args['approve-min-score']);
    let count = 0;
    candidates.forEach((c) => {
      if (!c.verification) c.verification = {};
      if ((c.verification.score || 0) >= minScore) {
        c.verification.approved = true;
        count += 1;
      }
    });
    modified = true;
    console.log(`✅ Aprobados ${count} candidatos con score >= ${minScore}.`);
  }

  if (args['approve-indices']) {
    const indices = String(args['approve-indices'])
      .split(',')
      .map((n) => Number(n.trim()))
      .filter((n) => !Number.isNaN(n));

    indices.forEach((idx) => {
      if (candidates[idx]) {
        if (!candidates[idx].verification) candidates[idx].verification = {};
        candidates[idx].verification.approved = true;
      }
    });
    modified = true;
    console.log(`✅ Aprobados índices [${indices.join(', ')}].`);
  }

  if (args['reject-indices']) {
    const indices = String(args['reject-indices'])
      .split(',')
      .map((n) => Number(n.trim()))
      .filter((n) => !Number.isNaN(n));

    indices.forEach((idx) => {
      if (candidates[idx]) {
        if (!candidates[idx].verification) candidates[idx].verification = {};
        candidates[idx].verification.approved = false;
      }
    });
    modified = true;
    console.log(`🔄 Desaprobados índices [${indices.join(', ')}].`);
  }

  if (modified) {
    fs.writeFileSync(filePath, `${JSON.stringify(candidates, null, 2)}\n`, 'utf8');
    updateSiblingCsv(candidates, filePath);
    console.log(`💾 Archivo JSON y CSV actualizados.`);
  }

  const approvedCount = candidates.filter((c) => c.verification?.approved === true).length;
  const pendingCount = candidates.length - approvedCount;

  console.log('\n====================================================');
  console.log(`📋 ESTADO DE REVISIÓN: ${path.basename(filePath)}`);
  console.log('====================================================');
  console.log(`Total candidatos:  ${candidates.length}`);
  console.log(`Aprobados (listos): ${approvedCount}`);
  console.log(`Pendientes:        ${pendingCount}`);
  console.log('----------------------------------------------------');

  if (args.list || !modified) {
    console.table(
      candidates.map((c, index) => ({
        idx: index,
        aprobado: c.verification?.approved ? '✅ SÍ' : '❌ NO',
        score: c.verification?.score || 0,
        nombre: (c.name || '').slice(0, 25),
        ciudad: c.cityName || c.city,
        telefono: c.phone || 'Sin tel',
        web: c.website ? 'Sí' : 'No',
        direccion: (c.address || '').slice(0, 30),
      })),
    );
  }

  if (approvedCount > 0) {
    console.log('\n🚀 Para importar los aprobados (Dry-Run):');
    console.log(`node scripts/import_approved_businesses.cjs --file "${filePath}"`);
    console.log('\n🚀 Para importar definitivamente a Supabase:');
    console.log(`node scripts/import_approved_businesses.cjs --file "${filePath}" --dry-run false`);
  } else {
    console.log('\n💡 Aún no hay candidatos aprobados. Usa --approve-min-score 75 o edita el archivo.');
  }
  console.log('====================================================\n');
}

try {
  main();
} catch (error) {
  console.error(`❌ Error: ${error.message}`);
  process.exit(1);
}
