import { supabase } from '@/config/supabase';

export default async function sitemap() {
  const { data: businesses } = await supabase.from('businesses').select('id, updated_at');

  const businessEntries = businesses?.map((b) => ({
    url: "https://www.directoriopy.com/publicacion/",
    lastModified: new Date(b.updated_at || new Date()),
    changeFrequency: 'weekly',
    priority: 0.8,
  })) || [];

  return [
    { url: 'https://www.directoriopy.com', lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: 'https://www.directoriopy.com/privacidad', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: 'https://www.directoriopy.com/terminos', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: 'https://www.directoriopy.com/contacto', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    ...businessEntries
  ];
}
