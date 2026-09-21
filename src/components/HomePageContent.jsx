'use client';

import React, { useState, useMemo, useEffect } from 'react';
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
import { isOpenNow } from '@/utils/businessUtils';

const ITEMS_PER_PAGE = 16;

const planWeight = {
  'premium': 3,
  'pro': 2,
  'gratuito': 1,
  'free': 1
};

export default function HomePageContent({ initialBusinesses = [] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const searchQuery = searchParams.get('q') || '';
  const selectedService = searchParams.get('servicio') || 'todos';
  const selectedCity = searchParams.get('ciudad') || 'todas';
  const selectedCategory = searchParams.get('categoria') || 'todos';
  const sortBy = searchParams.get('sort') || 'recomendados';
  
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'map'
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  // Reset pagination when filters change
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [searchQuery, selectedService, selectedCity, selectedCategory, sortBy]);

  const updateURL = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value && value !== 'todos' && value !== 'todas' && value !== '' && value !== 'recomendados') {
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
  const setSortBy = (val) => updateURL('sort', val);

  const handleClearAllFilters = () => {
    router.replace(pathname, { scroll: false });
  };

  // Dynamic Category Counts
  const categoryCounts = useMemo(() => {
    const counts = { todos: initialBusinesses.length };
    for (const cat of CATEGORIES) {
      if (cat.id !== 'todos') {
        counts[cat.id] = initialBusinesses.filter(b => b.category === cat.id).length;
      }
    }
    return counts;
  }, [initialBusinesses]);

  // Filtering & Sorting Logic
  const filteredBusinesses = useMemo(() => {
    const filtered = initialBusinesses.filter(b => {
      if (selectedService !== 'todos' && b.category !== selectedService) return false;
      if (selectedCity !== 'todas' && b.city !== selectedCity) return false;
      if (selectedCategory !== 'todos' && b.category !== selectedCategory && b.niche !== selectedCategory) return false;
      
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = b.name?.toLowerCase().includes(query);
        const matchesNiche = b.niche?.toLowerCase().includes(query);
        const matchesCategory = b.categoryLabel?.toLowerCase().includes(query);
        const matchesDesc = b.description?.toLowerCase().includes(query);
        const matchesCity = b.cityName?.toLowerCase().includes(query);
        const matchesTags = Array.isArray(b.tags) && b.tags.some(t => t?.toLowerCase().includes(query));
        
        if (!matchesName && !matchesNiche && !matchesCategory && !matchesDesc && !matchesCity && !matchesTags) {
          return false;
        }
      }
      return true;
    });

    // Apply Sorting
    return filtered.sort((a, b) => {
      if (sortBy === 'mejor_valorados') {
        const ratingA = Number(a.rating || 0);
        const ratingB = Number(b.rating || 0);
        if (ratingB !== ratingA) return ratingB - ratingA;
        return (Number(b.reviewCount || 0)) - (Number(a.reviewCount || 0));
      }

      if (sortBy === 'abiertos') {
        const openA = isOpenNow(a.workingHours).isOpen ? 1 : 0;
        const openB = isOpenNow(b.workingHours).isOpen ? 1 : 0;
        if (openB !== openA) return openB - openA;
        return (Number(b.rating || 0)) - (Number(a.rating || 0));
      }

      if (sortBy === 'nombre_asc') {
        return (a.name || '').localeCompare(b.name || '');
      }

      // Default: 'recomendados'
      const planA = a.isVerified ? a.plan : 'free';
      const planB = b.isVerified ? b.plan : 'free';
      const weightA = planWeight[planA] || 1;
      const weightB = planWeight[planB] || 1;
      if (weightB !== weightA) return weightB - weightA;
      return (Number(b.rating || 0)) - (Number(a.rating || 0));
    });
  }, [initialBusinesses, searchQuery, selectedService, selectedCity, selectedCategory, sortBy]);

  const visibleBusinesses = useMemo(() => {
    return filteredBusinesses.slice(0, visibleCount);
  }, [filteredBusinesses, visibleCount]);

  const hasActiveFilters = Boolean(
    (selectedCategory && selectedCategory !== 'todos') ||
    (selectedService && selectedService !== 'todos') ||
    (selectedCity && selectedCity !== 'todas') ||
    (searchQuery && searchQuery.trim() !== '') ||
    (sortBy && sortBy !== 'recomendados')
  );

  const activeCategoryLabel = CATEGORIES.find(c => c.id === selectedCategory)?.label;
  const activeCityLabel = CITIES.find(c => c.id === selectedCity)?.label;

  const getSeoText = () => {
    let text = "DirectorioPY es la guía comercial líder en Paraguay para encontrar profesionales, servicios y comercios locales.";
    if (selectedCity !== 'todas') {
      text += ` Explorá las mejores opciones verificadas en ${activeCityLabel}.`;
    }
    if (selectedCategory !== 'todos') {
      text += ` Rubro especializado en ${activeCategoryLabel?.toLowerCase()}.`;
    }
    text += " Apoyá el comercio nacional paraguayo y contactá directamente con los dueños por WhatsApp sin comisiones ni intermediarios.";
    return text;
  };

  return (
    <>
      <Hero />
      <main className="flex-1 container-clean pt-3 pb-12 space-y-6">
        
        {/* Spotlight VIP */}
        <FeaturedSpotlight
          businesses={initialBusinesses}
          onSelectDetail={(b) => router.push(`/publicacion/${b.id}`)}
        />

        {/* Compact Search & Filters Bar */}
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedService={selectedService}
          setSelectedService={setSelectedService}
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
          services={SERVICES}
          cities={CITIES}
          onClearFilters={handleClearAllFilters}
        />

        {/* Dynamic Category Tabs */}
        <CategoryTabs
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onSelectCategory={(catId) => setSelectedCategory(catId)}
          categoryCounts={categoryCounts}
        />

        {/* Quick Cities Pill Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-bold text-slate-400 mr-1 uppercase tracking-wider shrink-0">
            Ciudades:
          </span>
          {CITIES.map((city) => (
            <button
              key={city.id}
              onClick={() => setSelectedCity(city.id)}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide transition-all border whitespace-nowrap cursor-pointer ${
                selectedCity === city.id 
                  ? 'bg-amber-400 text-slate-950 border-transparent font-bold shadow-sm' 
                  : 'bg-[#151F32] text-slate-300 border-[#27354D] hover:bg-[#1E293B] hover:text-white'
              }`}
            >
              {city.label}
            </button>
          ))}
        </div>

        {/* Results Header Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#27354D] pb-3 gap-3 pt-2">
          
          {/* Result Count and Active Filters Badge */}
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-sm font-bold text-white flex items-center gap-2 tracking-wide uppercase">
              <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span>
              <span>Resultados</span>
              <span className="text-slate-400 font-semibold normal-case">
                ({filteredBusinesses.length} {filteredBusinesses.length === 1 ? 'comercio' : 'comercios'})
              </span>
            </h2>

            {selectedCategory !== 'todos' && (
              <span className="text-[11px] font-semibold bg-blue-950 text-blue-300 border border-blue-800 px-2 py-0.5 rounded-md">
                {activeCategoryLabel}
              </span>
            )}

            {selectedCity !== 'todas' && (
              <span className="text-[11px] font-semibold bg-amber-950 text-amber-300 border border-amber-800 px-2 py-0.5 rounded-md">
                {activeCityLabel}
              </span>
            )}

            {hasActiveFilters && (
              <button
                onClick={handleClearAllFilters}
                className="text-[11px] text-slate-400 hover:text-white underline cursor-pointer ml-1"
              >
                Limpiar filtros
              </button>
            )}
          </div>
          
          {/* Sort Selector & Grid/Map View Toggle */}
          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            {/* Sort Selector */}
            <div className="flex items-center gap-1.5 text-xs text-slate-300">
              <label htmlFor="sort-select" className="sr-only">Ordenar resultados</label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Ordenar resultados"
                className="bg-[#0F172A] border border-[#27354D] text-white text-xs font-semibold rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="recomendados">⭐ Recomendados</option>
                <option value="mejor_valorados">🏆 Mejor valorados</option>
                <option value="abiertos">🟢 Abiertos ahora</option>
                <option value="nombre_asc">🔤 Nombre (A-Z)</option>
              </select>
            </div>

            {/* Grid / Map Toggle */}
            <div className="flex bg-[#0F172A] p-0.5 rounded-lg border border-[#27354D] shadow-inner">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
                  viewMode === 'grid' 
                    ? 'bg-[#1E293B] text-white shadow-sm border border-[#334155]' 
                    : 'text-slate-400 hover:text-slate-200 border border-transparent'
                }`}
              >
                Grilla
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
                  viewMode === 'map' 
                    ? 'bg-[#1E293B] text-white shadow-sm border border-[#334155]' 
                    : 'text-slate-400 hover:text-slate-200 border border-transparent'
                }`}
              >
                Mapa
              </button>
            </div>
          </div>
        </div>

        {/* View Mode Display */}
        {viewMode === 'map' ? (
          <div className="w-full">
            <MapView 
              businesses={filteredBusinesses} 
              onSelectDetail={(b) => router.push(`/publicacion/${b.id}`)}
              onBackToGrid={() => setViewMode('grid')}
            />
          </div>
        ) : filteredBusinesses.length > 0 ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {visibleBusinesses.map((business, index) => (
                <div 
                  key={business.id}
                  className="animate-fadeIn"
                  style={{ animationDelay: `${(index % ITEMS_PER_PAGE) * 0.02}s` }}
                >
                  <BusinessCard 
                    business={business} 
                    onSelectDetail={(b) => router.push(`/publicacion/${b.id}`)} 
                  />
                </div>
              ))}
            </div>

            {/* Load More Button */}
            {visibleBusinesses.length < filteredBusinesses.length && (
              <div className="flex flex-col items-center justify-center pt-4 pb-2">
                <p className="text-xs text-slate-400 mb-3 font-medium">
                  Mostrando <span className="font-bold text-white">{visibleBusinesses.length}</span> de <span className="font-bold text-white">{filteredBusinesses.length}</span> comercios
                </p>
                <button
                  onClick={() => setVisibleCount((prev) => prev + ITEMS_PER_PAGE)}
                  className="px-8 py-3 rounded-xl bg-[#151F32] hover:bg-[#1E293B] border border-[#27354D] hover:border-blue-500 text-white font-bold text-xs sm:text-sm transition-all shadow-md flex items-center gap-2 cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
                >
                  <span>Cargar más comercios</span>
                  <span className="text-amber-400 font-extrabold">↓</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Useful & Assistive Empty State */
          <div className="text-center py-16 px-4 bg-[#0F172A] rounded-2xl border border-[#27354D]/60 shadow-inner max-w-2xl mx-auto">
            <div className="w-14 h-14 bg-[#151F32] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#27354D] text-2xl">
              🔍
            </div>
            <h3 className="text-lg font-bold text-white mb-1.5">No encontramos comercios</h3>
            <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto mb-5 leading-relaxed">
              No hay resultados para "{searchQuery || activeCategoryLabel || activeCityLabel}". Probá buscando en otra ciudad o explorá los rubros más consultados:
            </p>

            {/* Suggested Shortcuts */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
              <button
                onClick={() => { setSelectedCity('asuncion'); setSearchQuery(''); }}
                className="px-3 py-1.5 rounded-lg bg-[#151F32] hover:bg-[#1E293B] border border-[#27354D] text-slate-200 text-xs font-medium"
              >
                📍 Asunción
              </button>
              <button
                onClick={() => { setSelectedCity('luque'); setSearchQuery(''); }}
                className="px-3 py-1.5 rounded-lg bg-[#151F32] hover:bg-[#1E293B] border border-[#27354D] text-slate-200 text-xs font-medium"
              >
                📍 Luque
              </button>
              <button
                onClick={() => { setSelectedCategory('oficios'); setSearchQuery(''); }}
                className="px-3 py-1.5 rounded-lg bg-[#151F32] hover:bg-[#1E293B] border border-[#27354D] text-slate-200 text-xs font-medium"
              >
                🛠️ Oficios y Servicios
              </button>
              <button
                onClick={() => { setSelectedCategory('gastronomia'); setSearchQuery(''); }}
                className="px-3 py-1.5 rounded-lg bg-[#151F32] hover:bg-[#1E293B] border border-[#27354D] text-slate-200 text-xs font-medium"
              >
                🍽️ Gastronomía
              </button>
            </div>

            <button
              onClick={handleClearAllFilters}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all shadow-md cursor-pointer hover:scale-105"
            >
              Limpiar todos los filtros
            </button>
          </div>
        )}

        {/* Dynamic SEO Informational Block - Positioned beneath listings for better UX */}
        <section className="bg-[#151F32]/40 border border-[#27354D]/50 rounded-2xl p-5 text-slate-300 text-xs leading-relaxed space-y-2 mt-8">
          <h3 className="font-bold text-slate-200 text-sm">
            Directorio Comercial en Paraguay 🇵🇾
          </h3>
          <p>{getSeoText()}</p>
        </section>

        {/* Pricing Section with FAQ & 4-step flow */}
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
