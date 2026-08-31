import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hgsizqxouqpnoqcqlcuk.supabase.co';
const supabaseKey = 'sb_publishable_oSCfxyQI9fB5eeUuqOHB_Q_vcHQzoUm';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
  const newBusinessObj = {
      name: 'Comercio Nuevo',
      category: 'oficios',
      niche: 'Servicios Generales',
      city: 'asuncion',
      cityName: 'Asunción',
      zone: 'Zona Centro',
      address: 'Av. Principal del Comercio',
      description: 'Comercio registrado en DirectorioPY.',
      phone: '+595 981 100 200',
      whatsappNumber: '595981747679',
      whatsappDefaultMessage: `Hola, los encontré en DirectorioPY.`,
      rating: 5.0,
      reviews: 1,
      isVerified: false,
      plan: 'free',
      workingHours: 'Lun a Vie: 08:00 - 18:00',
      image: 'img',
      gallery: [],
      tags: ['oficios', 'asuncion', 'nuevo'],
      instagram: '',
      website: ''
    };

  const { error } = await supabase.from('businesses').insert([newBusinessObj]);
  if (error) {
    console.error('Supabase Error:', error);
  } else {
    console.log('Success!');
  }
}

testInsert();
