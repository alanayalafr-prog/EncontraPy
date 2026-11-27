import { supabase } from '@/config/supabase';
import { getBusinessSlug } from '@/utils/slugUtils';

export default async function sitemap() {
  const { data: businesses } = await supabase.from('businesses').select('id, name, updated_at');

  const businessEntries = businesses?.flatMap((b) => {
    const lastModified = new Date(b.updated_at || new Date());
    const slug = getBusinessSlug(b);
    return [
      {
        url: `https://www.directoriopy.com/c/${slug}`,
        lastModified,
        changeFrequency: 'weekly',
        priority: 0.9,
      },
      {
        url: `https://www.directoriopy.com/publicacion/${b.id}`,
        lastModified,
        changeFrequency: 'weekly',
        priority: 0.7,
      },
    ];
  }) || [];

  return [
    { url: 'https://www.directoriopy.com', lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: 'https://www.directoriopy.com/privacidad', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: 'https://www.directoriopy.com/terminos', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: 'https://www.directoriopy.com/contacto', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    ...businessEntries
  ];
}
