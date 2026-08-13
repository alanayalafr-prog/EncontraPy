import React, { useState, useMemo, useEffect } from 'react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import SearchBar from './components/SearchBar';
import FeaturedSpotlight from './components/FeaturedSpotlight';
import CategoryTabs from './components/CategoryTabs';
import BusinessCard from './components/BusinessCard';
import BusinessDetailModal from './components/BusinessDetailModal';
import ClaimModal from './components/ClaimModal';
import SipapPaymentModal from './components/SipapPaymentModal';
import PricingSection from './components/PricingSection';
import Footer from './components/Footer';
import MapView from './components/MapView';
import SkeletonCard from './components/SkeletonCard';
import { CATEGORIES, SERVICES, CITIES } from './data/businesses';
import { supabase } from './config/supabase';
import { SearchIcon } from './components/Icons';

export default function App() {
  const [theme, setTheme] = useState('dark');
  
  // Persistencia de comercios registrados en simulacro vía localStorage
  const [businesses, setBusinesses] = useState([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState('todos');
  const [selectedCity, setSelectedCity] = useState('todas');
  const [selectedCategory, setSelectedCategory] = useState('todos');
  
  // Visual/UX states
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'map'

  // Fetch businesses from Supabase
  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) {
        setBusinesses(data);
      }
    } catch (error) {
      console.error('Error fetching businesses:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Modals
  const navigate = useNavigate();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [selectedPlanForPayment, setSelectedPlanForPayment] = useState('pro');
  const [initialPlanForAdd, setInitialPlanForAdd] = useState('gratuito');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Add Business Handler (Escribe en Supabase)
  const handleAddBusiness = async (newBusiness) => {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .insert([
          {
            name: newBusiness.name,
            category: newBusiness.category,
            niche: newBusiness.niche,
            city: newBusiness.city,
            cityName: newBusiness.cityName,
            zone: newBusiness.zone,
            description: newBusiness.description,
            rating: newBusiness.rating,
            reviews: newBusiness.reviews,
            plan: newBusiness.plan,
            image: newBusiness.image,
            tags: newBusiness.tags,
            whatsappNumber: newBusiness.whatsappNumber,
            whatsappDefaultMessage: newBusiness.whatsappDefaultMessage,
            isVerified: newBusiness.isVerified,
            address: newBusiness.address,
            phone: newBusiness.phone,
            workingHours: newBusiness.workingHours,
            gallery: newBusiness.gallery,
            instagram: newBusiness.instagram,
            facebook: newBusiness.facebook,
            website: newBusiness.website
          }
        ])
        .select();

      if (error) throw error;
      
      if (data && data.length > 0) {
        setBusinesses(prev => [data[0], ...prev]);
        
        // Limpia filtros para garantizar que el nuevo comercio aparezca visible de inmediato
        setSelectedCategory('todos');
        setSelectedService('todos');
        setSelectedCity('todas');
        setSearchQuery('');
      }
    } catch (error) {
      console.error('Error adding business:', error.message);
      alert('Hubo un error al registrar tu negocio. Por favor, intenta de nuevo.');
    }
  };


  // Filter & Sort Businesses (Plan Priority Sorting: Premium > Pro > Free)
  const filteredBusinesses = useMemo(() => {
    const planWeight = { premium: 3, pro: 2, free: 1 };

    return businesses
      .map(b => {
        const isPending = (b.plan === 'premium' || b.plan === 'pro') && !b.isVerified;
        return {
          ...b,
          plan: isPending ? 'free' : (b.plan || 'free'),
          originalPlan: b.plan
        };
      })
      .filter((b) => {
      if (selectedCategory !== 'todos' && b.category !== selectedCategory) {
        return false;
      }
      if (selectedService !== 'todos' && b.niche !== selectedService) {
        return false;
      }
      if (selectedCity !== 'todas' && b.city !== selectedCity) {
        return false;
      }
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesName = b.name.toLowerCase().includes(query);
        const matchesNiche = b.niche.toLowerCase().includes(query);
        const matchesDesc = b.description.toLowerCase().includes(query);
        const matchesCity = b.cityName.toLowerCase().includes(query);
        const matchesZone = b.zone.toLowerCase().includes(query);
        const matchesTags = b.tags.some(tag => tag.toLowerCase().includes(query));

        if (!matchesName && !matchesNiche && !matchesDesc && !matchesCity && !matchesZone && !matchesTags) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      // Priority sorting: Paid plans first (Premium -> Pro -> Free), then higher ratings
      const weightA = planWeight[a.plan] || 1;
      const weightB = planWeight[b.plan] || 1;
      
      if (weightB !== weightA) {
        return weightB - weightA;
      }
      return b.rating - a.rating;
    });
  }, [businesses, searchQuery, selectedService, selectedCity, selectedCategory]);

  const handleOpenPlanPayment = (planId) => {
    setSelectedPlanForPayment(planId);
    setIsPricingModalOpen(true);
  };

  const handleOpenAddModal = (planId = 'gratuito') => {
    setInitialPlanForAdd(planId);
    setIsAddModalOpen(true);
  };

  const hasActiveFilters = selectedCategory !== 'todos' || selectedService !== 'todos' || selectedCity !== 'todas' || searchQuery !== '';

  return (
    <div className={`min-h-screen font-sans flex flex-col ${theme === 'dark' ? 'bg-[#060B14] text-slate-200' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Navigation */}
      <Header
        theme={theme}
        toggleTheme={toggleTheme}
        onOpenAddModal={() => handleOpenAddModal('gratuito')}
        onOpenPricingModal={() => {
          document.getElementById('planes-sipap')?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Hero Section con Desplegable de Servicios y Ciudad */}
      <Hero />

      {/* Main Content Area */}
      <main className="flex-1 container-clean pt-2 sm:pt-3 pb-10 space-y-8">
        
        {/* Plan Premium Feature: Featured Spotlight Carousel Banner */}
        <FeaturedSpotlight
          businesses={businesses}
          onSelectDetail={(b) => navigate(`/publicacion/${b.id}`)}
        />

        {/* Global Search & Filter Bar */}
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

        {/* Category Tabs Filter */}
        <CategoryTabs
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onSelectCategory={(catId) => setSelectedCategory(catId)}
        />

        {/* Results Info Header & Breadcrumbs & View Toggle */}
        <div className="flex flex-col gap-4">
          
          {/* Quick Cities Filter Pills */}
          <div className="w-full">
            <div className="flex flex-wrap items-center justify-start gap-1.5 sm:gap-2">
              <span className="text-[11px] font-bold text-slate-400 mr-1 uppercase tracking-wider whitespace-nowrap">Ciudades Rápidas:</span>
              
              {CITIES.map((city) => {
                const isActive = selectedCity === city.id;
                return (
                  <button
                    key={city.id}
                    onClick={() => setSelectedCity(city.id)}
                    style={{ padding: '4px 11px' }}
                    className={`rounded-full text-[11px] font-bold transition-colors border shadow-sm whitespace-nowrap ${
                      isActive
                        ? 'bg-amber-400 text-slate-950 font-black border-amber-300 ring-2 ring-amber-400/40'
                        : 'bg-[#1E293B] text-slate-300 border-[#27354D] hover:border-slate-400 hover:text-white'
                    }`}
                  >
                    {city.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Breadcrumbs */}
          {hasActiveFilters && (
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <button onClick={() => { setSelectedCategory('todos'); setSelectedService('todos'); setSelectedCity('todas'); setSearchQuery(''); }} className="hover:text-white">Inicio</button>
              <span>›</span>
              {selectedCity !== 'todas' && <span className="text-blue-300">{CITIES.find(c => c.id === selectedCity)?.label || selectedCity}</span>}
              {selectedCity !== 'todas' && (selectedCategory !== 'todos' || selectedService !== 'todos') && <span>›</span>}
              {selectedCategory !== 'todos' && <span className="text-amber-400">{CATEGORIES.find(c => c.id === selectedCategory)?.label || selectedCategory}</span>}
              {selectedCategory !== 'todos' && selectedService !== 'todos' && <span>›</span>}
              {selectedService !== 'todos' && <span className="text-emerald-400">{SERVICES.find(c => c.id === selectedService)?.label || selectedService}</span>}
            </div>
          )}

          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                <span>Catálogo de Comercios</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-950 text-blue-300 font-bold border border-blue-800">
                  {filteredBusinesses.length} {filteredBusinesses.length === 1 ? 'resultado' : 'resultados'}
                </span>
              </h2>
            </div>
            
            <div className="flex items-center gap-4 bg-[#151F32] p-1 rounded-lg border border-[#27354D]">
               <button 
                 onClick={() => setViewMode('grid')}
                 className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${viewMode === 'grid' ? 'bg-amber-400 text-black' : 'text-slate-400 hover:text-white'}`}
               >
                 🔲 Grilla
               </button>
               <button 
                 onClick={() => setViewMode('map')}
                 className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${viewMode === 'map' ? 'bg-blue-500 text-white' : 'text-slate-400 hover:text-white'}`}
               >
                 🗺️ Mapa
               </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {hasActiveFilters && (
              <button
                onClick={() => {
                  setSelectedCategory('todos');
                  setSelectedService('todos');
                  setSelectedCity('todas');
                  setSearchQuery('');
                }}
                className="text-xs text-amber-400 hover:underline font-semibold"
              >
                🔄 Limpiar Filtros
              </button>
            )}
          </div>
        </div>

        {/* Directory Grid / Map / Empty State */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filteredBusinesses.length > 0 ? (
          viewMode === 'map' ? (
             <MapView businesses={filteredBusinesses} onSelectDetail={(b) => navigate(`/publicacion/${b.id}`)} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBusinesses.map((business) => (
                <BusinessCard
                  key={business.id}
                  business={business}
                  onSelectDetail={(b) => navigate(`/publicacion/${b.id}`)}
                />
              ))}
            </div>
          )
        ) : (
          <div className="bg-[#151F32] border border-dashed border-[#27354D] rounded-3xl p-12 text-center space-y-5 max-w-2xl mx-auto my-8">
            <div className="w-32 h-32 mx-auto bg-[#1E293B] rounded-full flex items-center justify-center relative shadow-inner">
               <span className="text-5xl absolute z-10">🕵️‍♂️</span>
               <div className="absolute inset-0 border-4 border-amber-400/20 rounded-full animate-ping"></div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Ups, no encontramos comercios aquí</h3>
              <p className="text-sm text-slate-400 max-w-md mx-auto">
                No hay resultados para esta búsqueda exacta. Intenta seleccionar <strong className="text-white">Todas las Categorías</strong> o cambiar la ubicación.
              </p>
            </div>
            <div className="pt-4 flex justify-center gap-4">
              <button
                onClick={() => {
                  setSelectedCategory('todos');
                  setSelectedService('todos');
                  setSelectedCity('todas');
                  setSearchQuery('');
                }}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold text-sm shadow-lg shadow-blue-500/20 hover:scale-105 transition-all"
              >
                Limpiar Filtros
              </button>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-6 py-3 rounded-xl bg-transparent border border-slate-600 text-slate-300 hover:text-white hover:border-slate-400 font-bold text-sm transition-all"
              >
                Registrar un Negocio
              </button>
            </div>
          </div>
        )}

        {/* Monetization Pricing Section */}
        <PricingSection onOpenPaymentModal={handleOpenAddModal} />

      </main>

      {/* Footer */}
      <Footer
        onSelectCategory={(cat) => setSelectedCategory(cat)}
        onSelectCity={(city) => setSelectedCity(city)}
      />

      {/* Modals */}
      <Routes>
        <Route path="/publicacion/:id" element={
          <BusinessModalRoute businesses={businesses} onClose={() => navigate('/')} />
        } />
      </Routes>

      <ClaimModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSelectPlanForPayment={handleOpenPlanPayment}
        onAddBusiness={handleAddBusiness}
        initialPlan={initialPlanForAdd}
      />

      <SipapPaymentModal
        isOpen={isPricingModalOpen}
        onClose={() => setIsPricingModalOpen(false)}
        selectedPlanId={selectedPlanForPayment}
      />

    </div>
  );
}

// Wrapper Component para el Modal Híbrido usando la URL
function BusinessModalRoute({ businesses, onClose }) {
  const { id } = useParams();
  
  // Buscar el negocio por ID
  const business = businesses.find(b => b.id.toString() === id);
  
  // Si alguien entra a un ID que no existe, cerramos o mostramos nada
  if (!business) {
    onClose();
    return null;
  }
  
  return <BusinessDetailModal business={business} onClose={onClose} />;
}
