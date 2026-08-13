import React from 'react';
import { SearchIcon, MapPinIcon, FilterIcon } from './Icons';

export default function SearchBar({
  searchQuery,
  setSearchQuery,
  selectedService,
  setSelectedService,
  selectedCity,
  setSelectedCity,
  services = [],
  cities = []
}) {
  return (
    <div className="max-w-4xl w-full mx-auto p-2.5 rounded-2xl bg-[#151F32] border border-[#27354D] shadow-2xl flex flex-col md:flex-row items-center gap-2.5 relative z-10" style={{ marginTop: '10px', marginBottom: '20px' }}>
      
      {/* Keyword Search Input */}
      <div className="flex-1 flex items-center gap-2.5 px-3.5 py-3 rounded-xl bg-[#1E293B] border border-[#27354D] w-full focus-within:border-blue-500 transition-colors">
        <SearchIcon className="w-4 h-4 text-amber-400 shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="¿Qué comercio buscás por nombre o tag?..."
          className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none"
        />
      </div>

      {/* Service / Niche Dropdown Selector */}
      <div className="flex items-center gap-2 px-3.5 py-3 rounded-xl bg-[#1E293B] border border-[#27354D] w-full md:w-64 shrink-0 focus-within:border-amber-400">
        <FilterIcon className="w-4 h-4 text-amber-400 shrink-0" />
        <select
          value={selectedService}
          onChange={(e) => setSelectedService(e.target.value)}
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
      <div className="flex items-center gap-2 px-3.5 py-3 rounded-xl bg-[#1E293B] border border-[#27354D] w-full md:w-52 shrink-0 focus-within:border-blue-400">
        <MapPinIcon className="w-4 h-4 text-blue-400 shrink-0" />
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="w-full bg-transparent text-xs sm:text-sm text-white font-medium focus:outline-none cursor-pointer"
        >
          {cities.map((city) => (
            <option key={city.id} value={city.id} className="bg-[#0B1120] text-white">
              {city.label}
            </option>
          ))}
        </select>
      </div>

    </div>
  );
}
