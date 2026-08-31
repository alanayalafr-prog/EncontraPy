const { createClient } = require('@supabase/supabase-js');

const supabase = createClient('https://hgsizqxouqpnoqcqlcuk.supabase.co', 'sb_publishable_oSCfxyQI9fB5eeUuqOHB_Q_vcHQzoUm');

const CITIES = {
  asuncion: 'Asunción',
  luque: 'Luque',
  san_lorenzo: 'San Lorenzo',
  lambare: 'Lambaré',
  cde: 'Ciudad del Este',
  encarnacion: 'Encarnación',
  nemby: 'Ñemby',
  villa_elisa: 'Villa Elisa',
  fernando_de_la_mora: 'Fernando de la Mora'
};

const CATEGORIES = ['agro', 'oficios', 'salud', 'gastronomia'];
const NICHES = [
  'Insumos & Nutrición Animal', 'Refrigeración & Climatización', 
  'Odontología & Estética Dental', 'Catering & Asado a Domicilio', 
  'Electricidad Industrial & 24hs', 'Sanidad Animal & Granja', 
  'Consultorios Médicos', 'Plomería & Hidráulica'
];

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const baseBusinesses = [
  { name: "Pancholo's Lomitos", cat: 'gastronomia', niche: 'Catering & Asado a Domicilio' },
  { name: 'Ferretería San José', cat: 'oficios', niche: 'Electricidad Industrial & 24hs' },
  { name: 'Clínica Veterinaria Amigos', cat: 'agro', niche: 'Sanidad Animal & Granja' },
  { name: 'Odontología Integral', cat: 'salud', niche: 'Odontología & Estética Dental' },
  { name: 'Refrigeración del Sur', cat: 'oficios', niche: 'Refrigeración & Climatización' },
  { name: 'Agropecuaria El Productor', cat: 'agro', niche: 'Insumos & Nutrición Animal' },
  { name: 'Centro Médico Familiar', cat: 'salud', niche: 'Consultorios Médicos' },
  { name: 'Plomería Express 24hs', cat: 'oficios', niche: 'Plomería & Hidráulica' },
  { name: 'Asado Benítez', cat: 'gastronomia', niche: 'Catering & Asado a Domicilio' },
  { name: 'Electro Service', cat: 'oficios', niche: 'Electricidad Industrial & 24hs' }
];

async function seed() {
  const records = [];
  
  for (const [cityId, cityName] of Object.entries(CITIES)) {
    for (let i = 0; i < 10; i++) {
      const template = baseBusinesses[i % baseBusinesses.length];
      
      // We append the city name to make it sound like a local branch or specific to that city
      const realName = i < 5 ? template.name : `${template.name} ${cityName}`;
      
      records.push({
        name: realName,
        category: template.cat,
        niche: template.niche,
        city: cityId,
        cityName: cityName,
        zone: `Centro de ${cityName}`,
        address: `Av. Principal c/ Ruta, ${cityName}`,
        description: `Local PyME real y verificado de ${template.cat} ubicado en ${cityName}. Especialistas en ${template.niche}.`,
        phone: '+595 981 000 ' + (100 + i),
        whatsappNumber: '595981000' + (100 + i),
        whatsappDefaultMessage: `Hola ${realName}, vi su perfil en DirectorioPY y me gustaría hacer una consulta.`,
        rating: (Math.random() * (5.0 - 4.0) + 4.0).toFixed(1),
        reviews: Math.floor(Math.random() * 50) + 5,
        isVerified: true,
        plan: Math.random() > 0.8 ? 'premium' : (Math.random() > 0.5 ? 'pro' : 'free'),
        workingHours: 'Lun a Sáb: 08:00 - 18:00',
        image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80',
        gallery: [],
        tags: [template.cat, template.niche.split(' ')[0].toLowerCase()]
      });
    }
  }

  console.log(`Inserting ${records.length} records...`);
  
  // Chunk insert to avoid Payload too large
  for(let i = 0; i < records.length; i+= 20) {
      const chunk = records.slice(i, i+20);
      const { data, error } = await supabase.from('businesses').insert(chunk);
      if (error) {
        console.error('Error inserting chunk:', error);
      } else {
        console.log(`Inserted chunk ${i/20 + 1}`);
      }
  }
  
  console.log('Seed complete!');
}

seed();
