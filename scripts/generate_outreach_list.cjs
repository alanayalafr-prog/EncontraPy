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

function normalizeWhatsApp(phone) {
  const digits = String(phone || '').replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('595')) return digits;
  return `595${digits.replace(/^0+/, '')}`;
}

function getHumanBusinessName(rawName) {
  if (!rawName || typeof rawName !== 'string') return 'su comercio';
  let name = rawName.trim();
  const separatorMatch = name.split(/\s*[|–—•]\s*|\s+-\s+/);
  if (separatorMatch[0] && separatorMatch[0].trim().length >= 3) {
    name = separatorMatch[0].trim();
  }
  const commaParts = name.split(',');
  if (commaParts.length > 1 && commaParts[0].trim().length >= 3) {
    name = commaParts[0].trim();
  }
  name = name
    .replace(/\b(urgencias?\s*)?(24\s*\/?\s*7|24\s*hs\.?|24\s*horas)\b/gi, '')
    .replace(/\s*\(\s*\)\s*/g, ' ')
    .replace(/[.,;:\-–—]+$/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
  return name || rawName.trim();
}

function getBusinessSlug(business) {
  const base = getHumanBusinessName(business.name || 'comercio')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48)
    .replace(/-+$/g, '') || 'comercio';
  return `${base}-${business.id}`;
}

function getOutreachMessage(business) {
  const shortName = getHumanBusinessName(business.name);
  const slug = getBusinessSlug(business);
  const sampleUrl = `https://www.directoriopy.com/c/${slug}?muestra=1`;

  return `Buen día equipo de ${shortName}! Les armé gratis una muestra de cómo quedaría su propia mini-web para poner en su Instagram y compartir por WhatsApp (con horarios, mapa y botón directo a este WhatsApp):
${sampleUrl}

Si les gusta, me avisan y la dejamos lista con su logo y fotos.`;
}

async function main() {
  loadDotEnv(path.resolve(process.cwd(), '.env.local'));

  const args = parseArgs(process.argv.slice(2));
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_SUPABASE_KEY;

  const supabase = createClient(supabaseUrl, supabaseKey);

  let query = supabase
    .from('businesses')
    .select('id, name, city, cityName, category, niche, phone, whatsappNumber, isVerified, plan')
    .order('id', { ascending: false });

  if (args.city) query = query.eq('city', args.city);
  if (args.category) query = query.eq('category', args.category);

  const { data: businesses, error } = await query;
  if (error) throw new Error(`Error leyendo Supabase: ${error.message}`);

  const targets = (businesses || []).filter((b) => {
    const wa = normalizeWhatsApp(b.whatsappNumber || b.phone);
    return wa && wa.length >= 8;
  });

  const outputDir = path.resolve(process.cwd(), 'scratch');
  fs.mkdirSync(outputDir, { recursive: true });

  const outreachList = targets.map((b) => {
    const wa = normalizeWhatsApp(b.whatsappNumber || b.phone);
    const message = getOutreachMessage(b);
    const waLink = `https://wa.me/${wa}?text=${encodeURIComponent(message)}`;

    const slug = getBusinessSlug(b);
    return {
      id: b.id,
      name: getHumanBusinessName(b.name),
      ciudad: b.cityName || b.city,
      rubro: b.niche || b.category,
      whatsapp: `+${wa}`,
      miniWeb: `https://www.directoriopy.com/c/${slug}`,
      muestra: `https://www.directoriopy.com/c/${slug}?muestra=1`,
      clickToChat: waLink,
    };
  });

  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const outputPath = path.join(outputDir, `outreach-whatsapp-${stamp}.json`);
  const htmlPath = path.join(outputDir, `outreach-whatsapp-${stamp}.html`);

  fs.writeFileSync(outputPath, `${JSON.stringify(outreachList, null, 2)}\n`, 'utf8');

  // Generar un HTML interactivo con botones de WhatsApp directos para hacer clic desde el navegador
  const htmlRows = outreachList
    .map(
      (item) => `
    <tr style="border-bottom: 1px solid #334155;">
      <td style="padding: 12px; font-weight: bold; color: #f8fafc;">#${item.id} - ${item.name}</td>
      <td style="padding: 12px; color: #94a3b8;">${item.ciudad}</td>
      <td style="padding: 12px; color: #94a3b8;">${item.rubro}</td>
      <td style="padding: 12px; color: #38bdf8;">${item.whatsapp}</td>
      <td style="padding: 12px; display: flex; gap: 8px; flex-wrap: wrap;">
        <a href="${item.muestra}" target="_blank" style="display: inline-block; background-color: #1e3a8a; color: #bfdbfe; padding: 8px 12px; border-radius: 8px; text-decoration: none; font-weight: bold;">
          🌐 Ver Muestra
        </a>
        <a href="${item.clickToChat}" target="_blank" style="display: inline-block; background-color: #22c55e; color: white; padding: 8px 16px; border-radius: 8px; text-decoration: none; font-weight: bold;">
          💬 Enviar WhatsApp
        </a>
      </td>
    </tr>
  `,
    )
    .join('');

  const htmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>DirectorioPY - Lista de Contacto WhatsApp</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background-color: #0b1120; color: #f8fafc; padding: 24px; }
    h1 { color: #f59e0b; margin-bottom: 8px; }
    p { color: #94a3b8; margin-bottom: 24px; }
    table { width: 100%; border-collapse: collapse; background: #1e293b; border-radius: 12px; overflow: hidden; }
    th { background: #0f172a; padding: 14px; text-align: left; color: #cbd5e1; font-size: 14px; }
  </style>
</head>
<body>
  <h1>🚀 DirectorioPY: Enlaces Directos de Contacto WhatsApp</h1>
  <p>Total de comercios listos: <strong>${outreachList.length}</strong>. Haz clic en el botón verde para abrir el chat con el mensaje pre-cargado.</p>
  <table>
    <thead>
      <tr>
        <th>Comercio</th>
        <th>Ciudad</th>
        <th>Rubro</th>
        <th>WhatsApp</th>
        <th>Acción</th>
      </tr>
    </thead>
    <tbody>
      ${htmlRows}
    </tbody>
  </table>
</body>
</html>`;

  fs.writeFileSync(htmlPath, htmlContent, 'utf8');

  console.log('====================================================');
  console.log('🚀 GENERADOR DE MENSAJES WHATSAPP (CLICK-TO-CHAT)');
  console.log('====================================================');
  console.log(`Comercios con WhatsApp listos: ${outreachList.length}`);
  console.log(`📄 Archivo JSON:               ${outputPath}`);
  console.log(`🌐 Panel HTML Interactivo:     ${htmlPath}`);
  console.log('====================================================\n');
  console.log('💡 Tip: Puedes abrir el archivo HTML en tu navegador y hacer clic directamente en "Enviar WhatsApp" para cada comercio.');
}

main().catch((error) => {
  console.error(`\n❌ Error: ${error.message}\n`);
  process.exit(1);
});
