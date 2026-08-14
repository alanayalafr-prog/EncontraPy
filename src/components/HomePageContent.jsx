'use client';

import React, { useState, useMemo } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Hero from './Hero';
import SearchBar from './SearchBar';
import FeaturedSpotlight from './FeaturedSpotlight';
import CategoryTabs from './CategoryTabs';
import BusinessCard from './BusinessCard';
import PricingSection from './PricingSection';
import MapView from './MapView';
import SkeletonCard from './SkeletonCard';
import { CATEGORIES, SERVICES, CITIES } from '@/data/businesses';

const planWeight = {
  'premium': 3,
  'pro': 2,
  'gratuito': 1
};

export default function HomePageContent({ initialBusinesses }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const searchQuery = searchParams.get('q') || '';
  const selectedService = searchParams.get('servicio') || 'todos';
  const selectedCity = searchParams.get('ciudad') || 'todas';
  const selectedCategory = searchParams.get('categoria') || 'todos';
  
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'map'

  const updateURL = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value && value !== 'todos' && value !== 'todas' && value !== '') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const setSearchQuery = (val) => updateURL('q', val);
  const setSelectedService = (val) => updateURL('servicio', val);
  const setSelectedCity = (val) => updateURL('ciudad', val);
  const setSelectedCategory = (val) => updateURL('categoria', val);

  // Filtering Logic
  const filteredBusinesses = useMemo(() => {
    return initialBusinesses.filter(b => {
      if (selectedService !== 'todos' && b.category !== selectedService) return false;
      if (selectedCity !== 'todas' && b.city !== selectedCity) return false;
      if (selectedCategory !== 'todos' && b.niche !== selectedCategory) return false;
      
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesName = b.name?.toLowerCase().includes(query);
        const matchesNiche = b.niche?.toLowerCase().includes(query);
        const matchesDesc = b.description?.toLowerCase().includes(query);
        const matchesCity = b.cityName?.toLowerCase().includes(query);
        
        if (!matchesName && !matchesNiche && !matchesDesc && !matchesCity) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      const weightA = planWeight[a.plan] || 1;
      const weightB = planWeight[b.plan] || 1;
      if (weightB !== weightA) return weightB - weightA;
      return b.rating - a.rating;
    });
  }, [initialBusinesses, searchQuery, selectedService, selectedCity, selectedCategory]);

  const hasActiveFilters = selectedCategory !== 'todos' || selectedService !== 'todos' || selectedCity !== 'todas' || searchQuery !== '';

  const getSeoText = () => {
    let text = "DirectorioPY es la guía comercial líder en Paraguay para encontrar profesionales, servicios y negocios locales.";
    if (selectedCity !== 'todas') {
      const cityName = CITIES.find(c => c.id === selectedCity)?.label || '';
      text += ` Encuentra las mejores opciones en ${cityName}.`;
    }
    if (selectedCategory !== 'todos') {
      const catName = CATEGORIES.find(c => c.id === selectedCategory)?.label || '';
      text += ` Especializados en ${catName.toLowerCase()}.`;
    }
    text += " Apoya el comercio local y contacta directo por WhatsApp sin intermediarios.";
    return text;
  };

  return (
    <>
      <Hero />
      <main className="flex-1 container-clean pt-2 sm:pt-3 pb-10 space-y-8">
        
        <FeaturedSpotlight
          businesses={initialBusinesses}
          onSelectDetail={(b) => router.push(`/publicacion/${b.id}`)}
        />

        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedService={selectedService}
          setSelectedService={setSelectedService}
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
          services={SERVICES}
          cities={CITIES}
        />

        <CategoryTabs
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onSelectCategory={(catId) => setSelectedCategory(catId)}
        />

        {/* SEO Text Block if filter active */}
        {hasActiveFilters && (
          <div className="bg-[#151F32] border border-[#27354D] rounded-xl p-4 text-sm text-slate-300">
            <h2 className="font-bold text-white mb-2">
              Resultados para {selectedCategory !== 'todos' ? CATEGORIES.find(c => c.id === selectedCategory)?.label : 'Todas las categorías'} 
              {selectedCity !== 'todas' ? ` en ${CITIES.find(c => c.id === selectedCity)?.label}` : ''}
            </h2>
            <p>
              Explora nuestra lista verificada de comercios y profesionales. Contacta directamente por WhatsApp sin intermediarios ni comisiones. Mantén tu economía local fuerte apoyando a emprendedores de tu zona.
            </p>
          </div>
        )}

        <div className="flex flex-col gap-4">
          <div className="w-full">
            <div className="flex flex-wrap items-center justify-start gap-1.5 sm:gap-2">
              <span className="text-[11px] font-bold text-slate-400 mr-1 uppercase tracking-wider whitespace-nowrap">Ciudades Rápidas:</span>
              {CITIES.map((city) => (
                <button
                  key={city.id}
                  onClick={() => setSelectedCity(city.id)}
                  style={{ padding: '4px 11px' }}
                  className={`rounded-full text-[11px] font-bold tracking-wide transition-all border whitespace-nowrap shadow-sm hover:scale-105 active:scale-95 ${
                    selectedCity === city.id 
                      ? 'bg-amber-400 text-slate-900 border-transparent shadow-amber-400/20' 
                      : 'bg-[#151F32] text-slate-300 border-[#27354D] hover:bg-[#1E293B] hover:text-white'
                  }`}
                >
                  {city.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Dynamic SEO Content Block */}
          <div className="bg-[#151F32]/50 border border-[#27354D]/50 rounded-xl p-4 sm:p-5 text-slate-300 text-xs sm:text-sm leading-relaxed mb-6">
            <p>{getSeoText()}</p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#27354D] pb-3 gap-3">
            <h2 className="text-sm font-extrabold text-white flex items-center gap-2 tracking-wide uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span>
              Resultados Destacados <span className="text-slate-400 font-medium">({filteredBusinesses.length})</span>
            </h2>
            
            <div className="flex bg-[#0F172A] p-0.5 rounded-lg border border-[#27354D] self-start sm:self-auto shadow-inner">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                  viewMode === 'grid' 
                    ? 'bg-[#1E293B] text-white shadow-sm border border-[#334155]' 
                    : 'text-slate-400 hover:text-slate-200 transparent border border-transparent'
                }`}
              >
                Grilla
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                  viewMode === 'map' 
                    ? 'bg-[#1E293B] text-white shadow-sm border border-[#334155]' 
                    : 'text-slate-400 hover:text-slate-200 transparent border border-transparent'
                }`}
              >
                Mapa
              </button>
            </div>
          </div>
        </div>

        {viewMode === 'map' ? (
          <div className="h-[500px] w-full rounded-2xl overflow-hidden border border-[#27354D] shadow-xl">
            <MapView 
              businesses={filteredBusinesses} 
              onSelectBusiness={(b) => router.push(`/publicacion/${b.id}`)}
            />
          </div>
        ) : filteredBusinesses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredBusinesses.map((business, index) => (
              <div 
                key={business.id}
                className="animate-fadeIn"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <BusinessCard 
                  business={business} 
                  onSelectDetail={(b) => router.push(`/publicacion/${b.id}`)} 
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-[#0F172A] rounded-3xl border border-[#27354D]/50 shadow-inner">
            <div className="w-16 h-16 bg-[#151F32] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#27354D]">
              <span className="text-2xl opacity-50">🔍</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No encontramos comercios</h3>
            <p className="text-slate-400 max-w-sm mx-auto mb-6 text-sm">
              Intenta cambiar los filtros, probar otra ciudad o limpiar tu búsqueda actual.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('todos');
                setSelectedService('todos');
                setSelectedCity('todas');
                setSearchQuery('');
              }}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 text-white font-bold text-sm shadow-lg hover:scale-105 transition-all"
            >
              Limpiar Filtros
            </button>
          </div>
        )}

        <PricingSection onOpenPaymentModal={(planId) => {
          if (planId === 'gratuito') {
            window.dispatchEvent(new CustomEvent('openAddModal', { detail: planId }));
          } else {
            window.dispatchEvent(new CustomEvent('openPaymentModal', { detail: planId }));
          }
        }} />

      </main>
    </>
  );
}
