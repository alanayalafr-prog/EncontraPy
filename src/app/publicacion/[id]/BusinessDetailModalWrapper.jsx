'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import BusinessDetailModal from '@/components/BusinessDetailModal';

export default function BusinessDetailModalWrapper({ business, relatedBusinesses, reviews }) {
  const router = useRouter();

  return (
    <BusinessDetailModal 
      business={business} 
      relatedBusinesses={relatedBusinesses}
      reviews={reviews}
      onClose={() => router.push('/')} 
      onClaimClick={() => alert('Para reclamar este negocio, contáctanos por WhatsApp indicando el nombre.')} 
    />
  );
}
