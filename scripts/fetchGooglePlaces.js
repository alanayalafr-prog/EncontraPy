require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Configuración de Google Places
const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

if (!GOOGLE_API_KEY) {
  console.error("❌ ERROR: No encontré la variable GOOGLE_PLACES_API_KEY en tu archivo .env.local");
  process.exit(1);
}

// ==========================================
// ⚙️ CONFIGURA TU BÚSQUEDA AQUÍ
// ==========================================
const SEARCH_QUERY = 'Ferretería en San Lorenzo, Paraguay'; // Qué buscar
const CATEGORY_ID = 'oficios'; // 'agro', 'oficios', 'salud', 'gastronomia'
const NICHE_ID = 'Ferretería y Materiales'; 
const CITY_ID = 'san_lorenzo'; // 'asuncion', 'luque', 'san_lorenzo', etc.
const CITY_NAME = 'San Lorenzo';
// ==========================================

async function fetchAndSavePlaces() {
  console.log(`🔍 Buscando: "${SEARCH_QUERY}" en Google Maps...`);

  try {
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(SEARCH_QUERY)}&key=${GOOGLE_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK') {
      console.error("❌ Error de Google API:", data.status, data.error_message);
      return;
    }

    const results = data.results;
    console.log(`✅ ¡Google encontró ${results.length} resultados! Preparando para guardar en Supabase...\n`);

    for (const place of results) {
      // 1. OBTENER DETALLES EXTRA (Para sacar el teléfono y sitio web si lo tiene)
      let phone = '+595 000 0000'; // Default
      let whatsappFormatted = '5950000000';
      let website = '';
      let workingHours = 'Lun a Vie: 08:00 - 18:00'; // Default
      
      try {
        const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=formatted_phone_number,website,opening_hours&key=${GOOGLE_API_KEY}`;
        const detailsRes = await fetch(detailsUrl);
        const detailsData = await detailsRes.json();
        
        if (detailsData.result) {
          if (detailsData.result.formatted_phone_number) {
            phone = detailsData.result.formatted_phone_number;
            whatsappFormatted = phone.replace(/\D/g, '');
            if (!whatsappFormatted.startsWith('595')) whatsappFormatted = `595${whatsappFormatted.replace(/^0/, '')}`;
          }
          if (detailsData.result.website) {
            website = detailsData.result.website;
          }
        }
      } catch (err) {
        console.log(`No se pudieron obtener detalles extra para ${place.name}`);
      }

      // 2. CREAR EL OBJETO DEL NEGOCIO
      const newBusiness = {
        name: place.name,
        category: CATEGORY_ID,
        niche: NICHE_ID,
        city: CITY_ID,
        cityName: CITY_NAME,
        zone: 'Centro', // Por defecto
        address: place.formatted_address || 'Dirección no disponible',
        description: `Encuentra a ${place.name} en nuestro directorio. Negocio local verificado en Google Maps.`,
        phone: phone,
        whatsappNumber: whatsappFormatted,
        whatsappDefaultMessage: `Hola ${place.name}, los encontré en DirectorioPY y quisiera hacer una consulta.`,
        rating: place.rating || 4.5,
        reviewCount: place.user_ratings_total || 0,
        isVerified: false,
        plan: 'free',
        workingHours: workingHours,
        image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80', // Default Genérico
        gallery: [],
        instagram: '',
        website: website,
        geo: place.geometry && place.geometry.location ? { latitude: place.geometry.location.lat, longitude: place.geometry.location.lng } : null
      };

      // 3. GUARDAR EN SUPABASE
      const { error } = await supabase.from('businesses').insert([newBusiness]);

      if (error) {
        console.error(`❌ Error al guardar "${place.name}":`, error.message);
      } else {
        console.log(`🏪 Guardado exitosamente: ${place.name}`);
      }
    }
    
    console.log(`\n🎉 Proceso finalizado.`);

  } catch (err) {
    console.error("❌ Error de ejecución:", err);
  }
}

fetchAndSavePlaces();
