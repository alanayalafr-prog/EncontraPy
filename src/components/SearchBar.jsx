import React from 'react';
import { SearchIcon, MapPinIcon, FilterIcon, XIcon } from './Icons';

export default function SearchBar({
  searchQuery,
  setSearchQuery,
  selectedService,
  setSelectedService,
  selectedCity,
  setSelectedCity,
  services = [],
  cities = [],
  onClearFilters
}) {
  const hasActiveFilters = Boolean(
    (searchQuery && searchQuery.trim() !== '') ||
    (selectedService && selectedService !== 'todos') ||
    (selectedCity && selectedCity !== 'todas')
  );

  return (
    <div className="w-full max-w-4xl mx-auto space-y-2">
      <div className="p-2 sm:p-2.5 rounded-2xl bg-[#151F32] border border-[#27354D] shadow-xl flex flex-col md:flex-row items-center gap-2 sm:gap-2.5 relative z-10">
        
        {/* Keyword Search Input */}
        <div className="flex-1 flex items-center gap-2.5 px-3.5 py-2.5 sm:py-3 rounded-xl bg-[#1E293B] border border-[#27354D] w-full focus-within:border-blue-500 transition-colors">
          <SearchIcon className="w-4 h-4 text-blue-400 shrink-0" />
          <label htmlFor="search-input" className="sr-only">Buscar comercio, servicio o profesional</label>
          <input
            id="search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar ej: plomero, odontólogo, taller, hamburguesa..."
            aria-label="Buscar comercio por nombre, servicio o palabra clave"
            className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-700/60 transition-colors"
              title="Borrar texto de búsqueda"
              aria-label="Borrar texto de búsqueda"
            >
              <XIcon className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Service / Niche Dropdown Selector */}
        <div className="flex items-center gap-2 px-3.5 py-2.5 sm:py-3 rounded-xl bg-[#1E293B] border border-[#27354D] w-full md:w-60 shrink-0 focus-within:border-blue-500 transition-colors">
          <FilterIcon className="w-4 h-4 text-amber-400 shrink-0" />
          <label htmlFor="service-select" className="sr-only">Filtrar por tipo de servicio</label>
          <select
            id="service-select"
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            aria-label="Filtrar por tipo de servicio"
            className="w-full bg-transparent text-xs sm:text-sm text-white font-medium focus:outline-none cursor-pointer"
          >
            {services.map((service) => (
              <option key={service.id} value={service.id} className="bg-[#0B1120] text-white">
                {service.label}
              </option>
            ))}
          </select>
        </div>

        {/* City Selector Dropdown */}
        <div className="flex items-center gap-2 px-3.5 py-2.5 sm:py-3 rounded-xl bg-[#1E293B] border border-[#27354D] w-full md:w-48 shrink-0 focus-within:border-blue-500 transition-colors">
          <MapPinIcon className="w-4 h-4 text-blue-400 shrink-0" />
          <label htmlFor="city-select" className="sr-only">Filtrar por ciudad</label>
          <select
            id="city-select"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            aria-label="Filtrar por ciudad de Paraguay"
            className="w-full bg-transparent text-xs sm:text-sm text-white font-medium focus:outline-none cursor-pointer"
          >
            {cities.map((city) => (
              <option key={city.id} value={city.id} className="bg-[#0B1120] text-white">
                {city.label}
              </option>
            ))}
          </select>
        </div>

        {/* Clear Filters Button (Desktop & Mobile) */}
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 shrink-0 self-stretch md:self-auto justify-center"
            title="Restablecer todos los filtros"
          >
            <XIcon className="w-3.5 h-3.5 text-slate-400" />
            <span>Limpiar</span>
          </button>
        )}

      </div>
    </div>
  );
}
