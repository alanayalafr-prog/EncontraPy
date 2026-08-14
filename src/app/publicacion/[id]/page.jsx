import { supabase } from '@/config/supabase';
import BusinessDetailModal from '@/components/BusinessDetailModal';
import { notFound } from 'next/navigation';

export const revalidate = 0; // Dynamic route

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  const { data: business } = await supabase
    .from('businesses')
    .select('*')
    .eq('id', id)
    .single();

  if (!business) return { title: 'No encontrado | DirectorioPY' };

  return {
    title: `${business.name} en ${business.cityName} | DirectorioPY`,
    description: business.description || `Contacta a ${business.name} en ${business.cityName}. ${business.category}.`,
    openGraph: {
      title: `${business.name} | DirectorioPY`,
      description: business.description,
      images: [business.image || '/og-image.jpg'],
    }
  };
}

export default async function Page({ params }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  
  const { data: business, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !business) {
    notFound();
  }

  // Fetch Related Businesses (same category, excluding current)
  const { data: related } = await supabase
    .from('businesses')
    .select('*')
    .eq('categoryId', business.categoryId)
    .neq('id', id)
    .limit(4);

  // Fetch Reviews
  const { data: reviews } = await supabase
    .from('reviews')
    .select('*')
    .eq('business_id', id)
    .order('created_at', { ascending: false });

  // Inject Server-Side Schema.org
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": business.name,
    "image": business.image,
    "telephone": business.whatsappNumber,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": business.cityName,
      "addressRegion": "Paraguay",
      "addressCountry": "PY"
    },
    "description": business.description
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <BusinessDetailModalWrapper 
        business={business} 
        relatedBusinesses={related || []} 
        reviews={reviews || []} 
      />
    </>
  );
}

// Client wrapper to handle the onClose navigation
import BusinessDetailModalWrapper from './BusinessDetailModalWrapper';
