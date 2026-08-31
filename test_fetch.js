import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hgsizqxouqpnoqcqlcuk.supabase.co';
const supabaseKey = 'sb_publishable_oSCfxyQI9fB5eeUuqOHB_Q_vcHQzoUm';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testFetch() {
  const { data, error } = await supabase.from('businesses').select('*').limit(5);
  if (error) {
    console.error('Supabase Error:', error);
  } else {
    console.log(data);
  }
}

testFetch();
