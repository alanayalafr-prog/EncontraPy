const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient('https://hgsizqxouqpnoqcqlcuk.supabase.co', 'sb_publishable_oSCfxyQI9fB5eeUuqOHB_Q_vcHQzoUm');

async function run() {
  const { data, error } = await supabase.from('businesses').select('*').order('id', { ascending: true });
  if (error) {
    console.error('Error:', error);
    return;
  }

  const odonto = (data || []).filter(b => {
    const name = (b.name || '').toLowerCase();
    const niche = (b.niche || '').toLowerCase();
    const tags = (b.tags || []).join(' ').toLowerCase();
    const desc = (b.description || '').toLowerCase();

    return (
      niche.includes('odontolog') ||
      niche.includes('dental') ||
      name.includes('odontolog') ||
      name.includes('dental') ||
      name.includes('diente') ||
      name.includes('ortodoncia') ||
      name.includes('odonto') ||
      tags.includes('odontolog') ||
      tags.includes('dental') ||
      desc.includes('odontolog') ||
      desc.includes('dental')
    );
  });

  console.log(`Total encontrados en Odontología: ${odonto.length}`);

  // Headers
  const headers = ['ID', 'Nombre', 'Ciudad', 'Dirección', 'Teléfono', 'WhatsApp', 'Rating', 'Reseñas', 'Plan', 'Enlace Web'];

  // Generate CSV
  const csvRows = [
    headers.join(';')
  ];

  odonto.forEach(b => {
    const row = [
      b.id,
      `"${(b.name || '').replace(/"/g, '""')}"`,
      `"${(b.cityName || b.city || '').replace(/"/g, '""')}"`,
      `"${(b.address || '').replace(/"/g, '""')}"`,
      `"${(b.phone || '').replace(/"/g, '""')}"`,
      `"${(b.whatsappNumber || '').replace(/"/g, '""')}"`,
      b.rating || 0,
      b.reviews || 0,
      b.plan || 'free',
      `https://www.directoriopy.com/publicacion/${b.id}`
    ];
    csvRows.push(row.join(';'));
  });

  if (!fs.existsSync('scratch')) {
    fs.mkdirSync('scratch', { recursive: true });
  }

  fs.writeFileSync('scratch/odontologia_directoriopy.csv', '\uFEFF' + csvRows.join('\n'), 'utf8');
  console.log('Archivo CSV guardado en scratch/odontologia_directoriopy.csv');

  // Print summary list
  odonto.forEach((b, idx) => {
    console.log(`${idx + 1}. [ID ${b.id}] ${b.name} | ${b.cityName || b.city} | Tel: ${b.phone || b.whatsappNumber} | WA: ${b.whatsappNumber}`);
  });
}

run();
