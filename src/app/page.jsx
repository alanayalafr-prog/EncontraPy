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

  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0B1120] flex items-center justify-center text-amber-400 font-bold">Cargando DirectorioPY...</div>}>
      <HomePageContent initialBusinesses={businesses || []} />
    </Suspense>
  );
}
