'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import BusinessDetailModal from '@/components/BusinessDetailModal';

export default function BusinessDetailModalWrapper({ business, relatedBusinesses, reviews }) {
  const router = useRouter();

  const handleClaim = () => {
    const message = `¡Hola DirectorioPY! 👋 Soy el propietario/administrador de "${business.name}" (ID #${business.id}) en ${business.cityName || 'Paraguay'}. Quiero verificar mis datos y consultar sobre los planes para destacar mi comercio.`;
    const waUrl = `https://wa.me/595984043197?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <BusinessDetailModal 
      business={business} 
      relatedBusinesses={relatedBusinesses}
      reviews={reviews}
      onClose={() => router.push('/')} 
      onClaimClick={handleClaim} 
    />
  );
}
