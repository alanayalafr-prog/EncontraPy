const supabaseUrl = 'https://hgsizqxouqpnoqcqlcuk.supabase.co';
const supabaseKey = 'sb_publishable_oSCfxyQI9fB5eeUuqOHB_Q_vcHQzoUm';

const headers = {
  'apikey': supabaseKey,
  'Authorization': `Bearer ${supabaseKey}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=minimal'
};

async function run() {
  console.log('Fetching businesses...');
  const getRes = await fetch(`${supabaseUrl}/rest/v1/businesses?select=id,name,whatsappDefaultMessage`, { headers });
  const data = await getRes.json();
  
  if (data.error || !Array.isArray(data)) {
    console.error('Fetch error:', data);
    return;
  }

  console.log(`Found ${data.length} businesses. Starting update...`);
  
  for (const b of data) {
    if (b.whatsappDefaultMessage && b.whatsappDefaultMessage.includes('Plan Premium')) {
      const newMessage = `Hola ${b.name}, los encontré en DirectorioPY. Me gustaría hacerles una consulta sobre sus servicios, por favor.`;
      const patchRes = await fetch(`${supabaseUrl}/rest/v1/businesses?id=eq.${b.id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ whatsappDefaultMessage: newMessage })
      });
        
      if (!patchRes.ok) {
        console.error(`Error updating ${b.name}:`, await patchRes.text());
      } else {
        console.log(`Successfully updated: ${b.name}`);
      }
    } else {
      console.log(`Skipped (already fine): ${b.name}`);
    }
  }
  console.log('Done.');
}

run();
