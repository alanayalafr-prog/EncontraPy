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

async function main() {
  loadDotEnv(path.resolve(process.cwd(), '.env.local'));

  const args = parseArgs(process.argv.slice(2));
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_SUPABASE_URL;
  // Priorizar service_role key si existe para eludir RLS en operaciones administrativas
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    FALLBACK_SUPABASE_KEY;

  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log('🔍 Buscando los 90 comercios con teléfonos placeholder en Supabase...');

  // Buscar comercios con IDs en el rango 255 a 344 y patrones de teléfono 000 1xx
  const { data: candidates, error: fetchError } = await supabase
    .from('businesses')
    .select('*')
    .gte('id', 255)
    .lte('id', 344)
    .order('id');

  if (fetchError) {
    throw new Error(`Error consultando Supabase: ${fetchError.message}`);
  }

  const targets = (candidates || []).filter((b) => {
    const d = String(b.phone || b.whatsappNumber || '').replace(/\D/g, '');
    return /000\d{3}$/.test(d) || /^(595)?0+$/.test(d) || /local pyme real y verificado/i.test(b.description || '');
  });

  console.log('====================================================');
  console.log('🧹 LIMPIEZA DE COMERCIOS PLACEHOLDER (SEED FICTICIO)');
  console.log('====================================================');
  console.log(`Registros encontrados para eliminar: ${targets.length}`);
  console.log(`Rango de IDs:                         ${targets[0]?.id || 0} - ${targets[targets.length - 1]?.id || 0}`);
  console.log('----------------------------------------------------');

  if (targets.length === 0) {
    console.log('✨ No se encontraron registros placeholder para eliminar. La base ya está limpia.');
    console.log('====================================================\n');
    return;
  }

  // Guardar backup de seguridad antes de cualquier acción
  const outputDir = path.resolve(process.cwd(), 'scratch');
  fs.mkdirSync(outputDir, { recursive: true });

  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(outputDir, `deleted-placeholders-backup-${stamp}.json`);
  fs.writeFileSync(backupPath, `${JSON.stringify(targets, null, 2)}\n`, 'utf8');
  console.log(`💾 Backup de seguridad guardado en: ${backupPath}`);
  console.log('----------------------------------------------------');

  const dryRun = args['dry-run'] !== false && args['dry-run'] !== 'false';

  if (dryRun) {
    console.log(`🔍 MODO DRY-RUN: Se eliminarían ${targets.length} registros ficticios.`);
    console.table(
      targets.slice(0, 15).map((b) => ({
        id: b.id,
        nombre: b.name.slice(0, 25),
        ciudad: b.cityName || b.city,
        telefono: b.phone,
        descripcion: b.description.slice(0, 35),
      })),
    );
    console.log(`... y ${targets.length - 15} registros adicionales similares.`);
    console.log('\n⚠️  NO se eliminó ningún registro (Dry-run activo).');
    console.log('Para ejecutar la eliminación definitiva vía script, ejecuta:');
    console.log('node scripts/cleanup_placeholder_businesses.cjs --dry-run false');
    console.log('====================================================\n');
    return;
  }

  const idsToDelete = targets.map((t) => t.id);
  console.log(`🗑️ Intentando eliminar ${idsToDelete.length} registros de Supabase...`);

  const { data: deletedData, error: deleteError } = await supabase
    .from('businesses')
    .delete()
    .in('id', idsToDelete)
    .select('id');

  if (deleteError) {
    throw new Error(`Error eliminando registros de Supabase: ${deleteError.message}`);
  }

  if (!deletedData || deletedData.length === 0) {
    console.log('⚠️  AVISO DE SEGURIDAD (Supabase Row Level Security activo):');
    console.log('La clave anónima pública de Supabase no tiene permisos para ejecutar DELETE directo.');
    console.log('\nTienes 2 opciones sencillas para completar el borrado:');
    console.log('1. (Recomendada) Ejecuta este comando en el SQL Editor de tu panel de Supabase:');
    console.log('   DELETE FROM businesses WHERE id >= 255 AND id <= 344;');
    console.log('   (También guardado en el archivo: delete_placeholders.sql)');
    console.log('\n2. O agrega SUPABASE_SERVICE_ROLE_KEY en tu archivo .env.local y vuelve a ejecutar este script.');
    console.log('====================================================\n');
    return;
  }

  console.log('====================================================');
  console.log(`✅ ¡ÉXITO! Se eliminaron ${deletedData.length} registros ficticios de Supabase.`);
  console.log(`💾 Puedes restaurarlos en cualquier momento desde el backup en caso necesario.`);
  console.log('====================================================\n');
}

main().catch((error) => {
  console.error(`\n❌ ERROR: ${error.message}\n`);
  process.exit(1);
});
