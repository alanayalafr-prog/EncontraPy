import { supabase } from '@/config/supabase';
import HomePageContent from '@/components/HomePageContent';
import { Suspense } from 'react';

export const revalidate = 0; // Disable static caching for now, ensure fresh data

export default async function Page() {
  // SSR: Fetch businesses directly from Supabase on the server
  const { data: businesses, error } = await supabase
    .from('businesses')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching businesses on server:', error.message);
  }

  // Lógica de Vencimiento Automático
  const processedBusinesses = (businesses || []).map(business => {
    // Si el local es de pago y tiene una fecha de vencimiento configurada...
    if ((business.plan === 'pro' || business.plan === 'premium') && business.expires_at) {
      const expirationDate = new Date(business.expires_at);
      const now = new Date();
      
      // Si el día de hoy es MAYOR a la fecha de vencimiento, hacer downgrade automático
      if (now > expirationDate) {
        return {
          ...business,
          plan: 'free', // Bajar al plan gratuito
          isVerified: false, // Quitar la palomita
          instagram: '', // Ocultar redes
          website: '',
          gallery: [] // Ocultar fotos adicionales
        };
      }
    }
    return business;
  });

  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0B1120] flex items-center justify-center text-amber-400 font-bold">Cargando DirectorioPY...</div>}>
      <HomePageContent initialBusinesses={processedBusinesses} />
    </Suspense>
  );
}

