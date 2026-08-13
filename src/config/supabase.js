import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hgsizqxouqpnoqcqlcuk.supabase.co';
const supabaseKey = 'sb_publishable_oSCfxyQI9fB5eeUuqOHB_Q_vcHQzoUm';

export const supabase = createClient(supabaseUrl, supabaseKey);
