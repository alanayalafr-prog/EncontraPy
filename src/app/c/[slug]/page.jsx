import { supabase } from '@/config/supabase';
import { notFound } from 'next/navigation';
import MiniWebClient from '@/components/MiniWebClient';
import { extractIdFromSlug, getHumanBusinessName, getMiniWebUrl } from '@/utils/slugUtils';
import { getRepresentativeImage } from '@/utils/businessUtils';

export const revalidate = 0;

async function findBusinessBySlug(slug) {
  const extractedId = extractIdFromSlug(slug);

  // 1. Búsqueda directa por ID extraído del slug (caso principal, ultra rápido)
  if (extractedId) {
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('id', extractedId)
      .maybeSingle();

    if (!error && data) {
      return data;
    }
  }

  // 2. Respaldo: buscar por coincidencia aproximada de nombre si pasaron un slug sin ID
  const searchTerms = decodeURIComponent(slug || '')
    .replace(/-/g, ' ')
    .trim();

  if (searchTerms.length >= 3) {
    const { data: candidates } = await supabase
      .from('businesses')
      .select('*')
      .ilike('name', `%${searchTerms}%`)
      .limit(1);

    if (candidates && candidates.length > 0) {
      return candidates[0];
    }
  }

  return null;
}

function applyPlanExpiration(rawBusiness) {
  let business = { ...rawBusiness };
  if ((business.plan === 'pro' || business.plan === 'premium') && business.expires_at) {
    const expirationDate = new Date(business.expires_at);
    if (new Date() > expirationDate) {
      business = {
        ...business,
        plan: 'free',
        isVerified: false,
        instagram: '',
        website: '',
        gallery: [],
      };
    }
  }
  return business;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const rawBusiness = await findBusinessBySlug(slug);

  if (!rawBusiness) {
    return {
      title: 'Comercio no encontrado | DirectorioPY',
      description: 'La página de este comercio no se encuentra disponible.',
    };
  }

  const business = applyPlanExpiration(rawBusiness);
  const displayName = getHumanBusinessName(business.name);
  const city = business.cityName || 'Paraguay';
  const category = business.niche || business.categoryLabel || 'Servicios Locales';
  const coverImage = getRepresentativeImage(business);
  const canonicalUrl = getMiniWebUrl(business);

  return {
    title: `${displayName} | ${city} — Contacto, Horarios y Ubicación`,
    description:
      business.description ||
      `${displayName} en ${city} (${category}). Consultá horarios, ubicación en mapa y escribinos directo por WhatsApp.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${displayName} — ${city}`,
      description:
        business.description ||
        `Horarios, mapa y contacto directo por WhatsApp de ${displayName} en ${city}.`,
      url: canonicalUrl,
      images: [coverImage],
      locale: 'es_PY',
      type: 'website',
    },
  };
}

export default async function MiniWebPage({ params, searchParams }) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const isSample =
    resolvedSearchParams?.muestra === '1' ||
    resolvedSearchParams?.muestra === 'true' ||
    resolvedSearchParams?.preview === '1';

  const rawBusiness = await findBusinessBySlug(slug);
  if (!rawBusiness) {
    notFound();
  }

  const business = applyPlanExpiration(rawBusiness);

  const { data: reviews } = await supabase
    .from('reviews')
    .select('*')
    .eq('business_id', business.id)
    .order('created_at', { ascending: false });

  const localReviews = Array.isArray(reviews) ? reviews : [];
  const reviewCount = localReviews.length;
  const ratingValue =
    reviewCount > 0
      ? Number(
          (
            localReviews.reduce((acc, r) => acc + Number(r.rating || 0), 0) /
            reviewCount
          ).toFixed(1)
        )
      : 0;

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: business.name,
    image: getRepresentativeImage(business),
    telephone: business.phone || business.whatsappNumber,
    url: getMiniWebUrl(business),
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.address || '',
      addressLocality: business.cityName || 'Asunción',
      addressRegion: 'Paraguay',
      addressCountry: 'PY',
    },
    description: business.description,
    currenciesAccepted: 'PYG',
  };

  if (ratingValue > 0 && reviewCount > 0) {
    schemaData.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue,
      reviewCount,
    };
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <MiniWebClient
        business={business}
        reviews={localReviews}
        isSample={isSample}
      />
    </>
  );
}
