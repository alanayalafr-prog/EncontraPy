'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import BusinessDetailModal from '@/components/BusinessDetailModal';

export default function BusinessDetailModalWrapper({ business }) {
  const router = useRouter();

  return (
    <BusinessDetailModal 
      business={business} 
      onClose={() => router.push('/')} 
      onClaimClick={() => alert('Para reclamar este negocio, contáctanos por WhatsApp indicando el nombre.')} 
    />
  );
}
