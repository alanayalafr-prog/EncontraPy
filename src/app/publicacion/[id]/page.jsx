import { supabase } from '@/config/supabase';
import { notFound } from 'next/navigation';
import BusinessDetailModalWrapper from './BusinessDetailModalWrapper';

export const revalidate = 0; // Dynamic route

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  const { data: business } = await supabase
    .from('businesses')
    .select('*')
    .eq('id', id)
    .single();

  if (!business) return { title: 'Comercio no encontrado | DirectorioPY' };

  const city = business.cityName || 'Paraguay';
  const category = business.niche || business.categoryLabel || 'Comercios y Servicios';

  return {
    title: `${business.name} en ${city} - ${category} | DirectorioPY`,
    description: business.description || `Contactá directo por WhatsApp a ${business.name} en ${city}. Atención sin intermediarios en DirectorioPY.`,
    openGraph: {
      title: `${business.name} | DirectorioPY Paraguay`,
      description: business.description || `Encontrá ${business.name} en ${city}. Contacto directo por WhatsApp.`,
      images: [business.image || '/og-image.jpg'],
      locale: 'es_PY',
      type: 'article'
    }
  };
}

export default async function Page({ params }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  
  const { data: rawBusiness, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !rawBusiness) {
    notFound();
  }

  // Lógica de Vencimiento Automático
  let business = { ...rawBusiness };
  if ((business.plan === 'pro' || business.plan === 'premium') && business.expires_at) {
    const expirationDate = new Date(business.expires_at);
    const now = new Date();
    
    if (now > expirationDate) {
      business = {
        ...business,
        plan: 'free',
        isVerified: false,
        instagram: '',
        website: '',
        gallery: []
      };
    }
  }

  // Fetch Related Businesses (same category, excluding current)
  const categoryFilter = business.category || business.categoryId;
  const { data: related } = await supabase
    .from('businesses')
    .select('*')
    .eq('category', categoryFilter)
    .neq('id', id)
    .limit(4);

  // Fetch Reviews
  const { data: reviews } = await supabase
    .from('reviews')
    .select('*')
    .eq('business_id', id)
    .order('created_at', { ascending: false });

  // Schema.org LocalBusiness enriquecido
  const reviewCount = Number(business.reviewCount || business.reviews || 0);
  const ratingValue = Number(business.rating || 0);

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": business.name,
    "image": business.image,
    "telephone": business.phone || business.whatsappNumber,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": business.address || "",
      "addressLocality": business.cityName || "Asunción",
      "addressRegion": "Paraguay",
      "addressCountry": "PY"
    },
    "description": business.description,
    "priceRange": "$$",
    "currenciesAccepted": "PYG"
  };

  if (ratingValue > 0 && reviewCount > 0) {
    schemaData.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": ratingValue,
      "reviewCount": reviewCount
    };
  }

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
