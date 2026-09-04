const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

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

loadDotEnv(path.resolve(process.cwd(), '.env.local'));
loadDotEnv(path.resolve(process.cwd(), '.env'));

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hgsizqxouqpnoqcqlcuk.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Faltan credenciales de Supabase.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

function getCustomerWhatsAppMessage(name, category) {
  const cleanName = (name || '').trim().replace(/[.,;:\-]+$/, '').trim() || 'su comercio';
  const cat = (category || '').toLowerCase();
  switch (cat) {
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

async function run() {
  console.log('Buscando comercios con mensaje heredado ("conversar sobre su perfil")...');
  
  const { data: businesses, error } = await supabase
    .from('businesses')
    .select('id, name, category, whatsappDefaultMessage')
    .ilike('whatsappDefaultMessage', '%conversar sobre su perfil%');

  if (error) {
    console.error('Error al consultar comercios:', error);
    process.exit(1);
  }

  console.log(`Se encontraron ${businesses.length} comercios para actualizar.`);

  let updatedCount = 0;
  for (const b of businesses) {
    const newMessage = getCustomerWhatsAppMessage(b.name, b.category);
    const { error: updateError } = await supabase
      .from('businesses')
      .update({ whatsappDefaultMessage: newMessage })
      .eq('id', b.id);

    if (updateError) {
      console.error(`Error actualizando negocio ID ${b.id} (${b.name}):`, updateError);
    } else {
      updatedCount++;
    }
  }

  console.log(`¡Completado! Se actualizaron con éxito ${updatedCount} de ${businesses.length} comercios.`);
}

run();
