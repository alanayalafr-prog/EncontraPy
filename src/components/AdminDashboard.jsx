'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { ShieldCheckIcon, WhatsAppIcon, MapPinIcon, PhoneIcon, SearchIcon, FilterIcon, CheckCircleIcon, SparklesIcon } from './Icons';
import { formatWhatsAppNumber } from '../utils/phoneUtils';
import { supabase } from '../config/supabase';

const DEFAULT_MESSAGE = `Hola {nombre}, te encontramos en Google Maps y armamos tu ficha en DirectorioPY (www.directorioPy.com) para que la gente te contacte más fácil. ¿Confirmás que los datos son correctos?`;

const TEMPLATES = [
  {
    id: 'confirmacion',
    title: '✅ Validación de Ficha (Recomendado)',
    text: `Hola {nombre}, te encontramos en Google Maps y armamos tu ficha en DirectorioPY (www.directorioPy.com) para que la gente te contacte más fácil. ¿Confirmás que los datos son correctos?`
  },
  {
    id: 'rubro',
    title: '🔧 Demanda por Rubro / Oficio',
    text: `Hola {nombre}, te escribo de DirectorioPY (www.directorioPy.com). Tenemos muchas consultas de clientes buscando servicios de {rubro} en {ciudad} y queremos confirmar tu número para derivarte clientes directos.`
  },
  {
    id: 'upsell',
    title: '⭐ Ofrecer Plan Destacado / VIP',
    text: `Hola {nombre}, vimos tu perfil activo de {rubro} en DirectorioPY. ¿Te gustaría destacar tu negocio para aparecer primero cuando busquen en {ciudad}? Conocé nuestros planes en www.directorioPy.com`
  }
];

export default function AdminDashboard() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNiche, setSelectedNiche] = useState('todos');
  const [selectedCity, setSelectedCity] = useState('todas');
  const [selectedPlan, setSelectedPlan] = useState('free'); // 'all' | 'free' | 'premium'

  // Message & Customization
  const [customMessage, setCustomMessage] = useState(DEFAULT_MESSAGE);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      setLoading(true);
      supabase.from('businesses').select('*').order('created_at', { ascending: false }).then(({ data, error }) => {
        setLoading(false);
        if (data) setBusinesses(data);
      });
    }
  }, [isAuthenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'Ventas238899') {
      setIsAuthenticated(true);
    } else {
      alert('Contraseña incorrecta');
    }
  };

  // Extract unique niches/rubros with counts
  const nichesList = useMemo(() => {
    const counts = {};
    businesses.forEach(b => {
      const niche = b.niche || b.category || 'Otros';
      counts[niche] = (counts[niche] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [businesses]);

  // Extract unique cities with counts
  const citiesList = useMemo(() => {
    const counts = {};
    businesses.forEach(b => {
      const city = b.cityName || b.city || 'Otras';
      counts[city] = (counts[city] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [businesses]);

  // Filtered list
  const filteredBusinesses = useMemo(() => {
    return businesses.filter(b => {
      // Plan filter
      if (selectedPlan === 'free' && b.plan !== 'free' && b.plan !== 'gratis') return false;
      if (selectedPlan === 'premium' && b.plan !== 'pro' && b.plan !== 'premium') return false;

      // Niche / Rubro filter
      if (selectedNiche !== 'todos') {
        const bNiche = (b.niche || b.category || '').toLowerCase();
        if (bNiche !== selectedNiche.toLowerCase() && !bNiche.includes(selectedNiche.toLowerCase())) {
          return false;
        }
      }

      // City filter
      if (selectedCity !== 'todas') {
        const bCity = (b.cityName || b.city || '').toLowerCase();
        if (bCity !== selectedCity.toLowerCase()) {
          return false;
        }
      }

      // Search Query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesName = (b.name || '').toLowerCase().includes(q);
        const matchesPhone = (b.whatsappNumber || b.phone || '').toLowerCase().includes(q);
        const matchesCity = (b.cityName || b.city || '').toLowerCase().includes(q);
        const matchesNiche = (b.niche || b.category || '').toLowerCase().includes(q);
        const matchesAddress = (b.address || '').toLowerCase().includes(q);
        if (!matchesName && !matchesPhone && !matchesCity && !matchesNiche && !matchesAddress) {
          return false;
        }
      }

      return true;
    });
  }, [businesses, selectedPlan, selectedNiche, selectedCity, searchQuery]);

  const freeCount = useMemo(() => businesses.filter(b => b.plan === 'free' || b.plan === 'gratis').length, [businesses]);
  const premiumCount = useMemo(() => businesses.filter(b => b.plan === 'pro' || b.plan === 'premium').length, [businesses]);

  const getMarketingMessage = (b) => {
    let msg = customMessage;
    msg = msg.replaceAll('{nombre}', b?.name || '');
    msg = msg.replaceAll('{rubro}', b?.niche || b?.category || 'tu rubro');
    msg = msg.replaceAll('{ciudad}', b?.cityName || b?.city || 'Paraguay');
    return msg;
  };

  const handleCopyAllPhones = () => {
    const phones = filteredBusinesses
      .map(b => formatWhatsAppNumber(b.whatsappNumber || b.phone))
      .filter(Boolean)
      .join('\n');
    
    if (phones) {
      navigator.clipboard.writeText(phones);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2500);
    } else {
      alert('No hay números disponibles en la lista filtrada.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="glass-panel p-8 rounded-3xl max-w-sm w-full space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/50">
              <ShieldCheckIcon className="w-8 h-8 text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Panel de Ventas</h2>
            <p className="text-sm text-slate-400 mt-2">Acceso restringido</p>
          </div>
          <input
            type="password"
            placeholder="Contraseña"
            className="w-full px-4 py-3 rounded-xl bg-black/40 border border-[#27354D] text-white focus:outline-none focus:border-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors shadow-lg shadow-blue-500/30 cursor-pointer"
          >
            Ingresar
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 space-y-8 animate-fadeIn max-w-7xl mx-auto pt-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#27354D] pb-6">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <ShieldCheckIcon className="w-8 h-8 text-blue-400" />
            CRM & Outreach DirectorioPY
          </h1>
          <p className="text-slate-400 mt-1 text-sm">
            Gestión de prospectos, filtrado por rubros y contacto directo por WhatsApp.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleCopyAllPhones}
            className="px-4 py-2.5 rounded-xl bg-[#1E293B] hover:bg-[#27354D] border border-[#334155] text-slate-200 hover:text-white font-bold text-xs transition-all flex items-center gap-2 cursor-pointer shadow-sm"
            title="Copiar lista de números filtrados para Excel o difusión"
          >
            {copiedAll ? (
              <>
                <CheckCircleIcon className="w-4 h-4 text-green-400" />
                <span className="text-green-400">¡Copiados ({filteredBusinesses.length})!</span>
              </>
            ) : (
              <>
                <span>📋 Copiar Teléfonos ({filteredBusinesses.length})</span>
              </>
            )}
          </button>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="px-4 py-2.5 rounded-xl bg-[#151F32] border border-[#27354D] text-slate-300 hover:text-white transition-colors text-xs font-semibold cursor-pointer"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-2xl border border-[#27354D]">
          <p className="text-xs text-slate-400 font-semibold uppercase">Total Comercios</p>
          <p className="text-2xl font-black text-white mt-1">{businesses.length}</p>
        </div>
        <div className="glass-panel p-4 rounded-2xl border border-amber-500/30 bg-amber-500/5">
          <p className="text-xs text-amber-400 font-semibold uppercase">Leads Gratuitos</p>
          <p className="text-2xl font-black text-amber-400 mt-1">{freeCount}</p>
        </div>
        <div className="glass-panel p-4 rounded-2xl border border-blue-500/30 bg-blue-500/5">
          <p className="text-xs text-blue-400 font-semibold uppercase">Clientes VIP / Pro</p>
          <p className="text-2xl font-black text-blue-400 mt-1">{premiumCount}</p>
        </div>
        <div className="glass-panel p-4 rounded-2xl border border-green-500/30 bg-green-500/5">
          <p className="text-xs text-green-400 font-semibold uppercase">Filtrados Listos</p>
          <p className="text-2xl font-black text-green-400 mt-1">{filteredBusinesses.length}</p>
        </div>
      </div>

      {/* Message Customization Box */}
      <div className="glass-panel p-5 rounded-2xl border border-[#27354D] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <SparklesIcon className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">Mensaje de WhatsApp a Enviar</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditorOpen(!isEditorOpen)}
              className="text-xs text-amber-400 hover:text-amber-300 font-bold px-3 py-1.5 rounded-lg bg-amber-400/10 border border-amber-400/20 cursor-pointer"
            >
              {isEditorOpen ? 'Ocultar Editor' : '✏️ Personalizar Mensaje / Plantillas'}
            </button>
          </div>
        </div>

        {/* Current active message preview */}
        <div className="p-3.5 rounded-xl bg-[#0B1120] border border-[#27354D]/80 text-sm text-slate-200">
          <p className="italic text-slate-300">
            "{customMessage}"
          </p>
          <p className="text-[11px] text-slate-500 mt-2">
            * Las etiquetas <code className="text-amber-400">{'{nombre}'}</code>, <code className="text-amber-400">{'{rubro}'}</code> y <code className="text-amber-400">{'{ciudad}'}</code> se reemplazarán automáticamente con los datos de cada comercio al hacer clic en contactar.
          </p>
        </div>

        {/* Expandable editor & template selector */}
        {isEditorOpen && (
          <div className="space-y-4 pt-3 border-t border-[#27354D]/60 animate-fadeIn">
            <div>
              <label className="text-xs font-bold text-slate-300 mb-2 block">Elegir Plantilla Rápida:</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                {TEMPLATES.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    onClick={() => setCustomMessage(tmpl.text)}
                    className={`p-3 rounded-xl text-left text-xs transition-all border cursor-pointer ${
                      customMessage === tmpl.text
                        ? 'bg-blue-600/20 border-blue-500 text-white font-bold'
                        : 'bg-[#151F32] border-[#27354D] text-slate-300 hover:bg-[#1E293B]'
                    }`}
                  >
                    <p className="font-bold text-white mb-1">{tmpl.title}</p>
                    <p className="text-[11px] text-slate-400 line-clamp-2">{tmpl.text}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 mb-1.5 block">O redactar tu propio mensaje:</label>
              <textarea
                rows={3}
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#0F172A] border border-[#27354D] text-white text-sm focus:outline-none focus:border-blue-500 font-sans"
              />
              <button
                onClick={() => setCustomMessage(DEFAULT_MESSAGE)}
                className="text-xs text-slate-400 hover:text-slate-200 mt-1 cursor-pointer underline"
              >
                Restablecer mensaje original
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Filter Toolbar */}
      <div className="glass-panel p-5 rounded-2xl border border-[#27354D] space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-[#27354D]/50">
          <FilterIcon className="w-5 h-5 text-blue-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Filtros de Búsqueda y Segmentación</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search text */}
          <div className="relative">
            <SearchIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar nombre o teléfono..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0F172A] border border-[#27354D] text-white text-xs sm:text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Rubro / Tipo de local / Niche */}
          <div>
            <select
              value={selectedNiche}
              onChange={(e) => setSelectedNiche(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F172A] border border-[#27354D] text-white text-xs sm:text-sm focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="todos">🔧 Todos los Rubros ({businesses.length})</option>
              {nichesList.map(([niche, count]) => (
                <option key={niche} value={niche}>
                  {niche} ({count})
                </option>
              ))}
            </select>
          </div>

          {/* Ciudad */}
          <div>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F172A] border border-[#27354D] text-white text-xs sm:text-sm focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="todas">📍 Todas las Ciudades ({businesses.length})</option>
              {citiesList.map(([city, count]) => (
                <option key={city} value={city}>
                  {city} ({count})
                </option>
              ))}
            </select>
          </div>

          {/* Plan / Tipo de cliente */}
          <div>
            <select
              value={selectedPlan}
              onChange={(e) => setSelectedPlan(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F172A] border border-[#27354D] text-white text-xs sm:text-sm focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="free">🎯 Solo Leads Gratuitos ({freeCount})</option>
              <option value="all">🌐 Todos los Comercios ({businesses.length})</option>
              <option value="premium">⭐ Solo Clientes VIP ({premiumCount})</option>
            </select>
          </div>
        </div>

        {/* Active Filter Chips / Reset */}
        {(selectedNiche !== 'todos' || selectedCity !== 'todas' || selectedPlan !== 'free' || searchQuery) && (
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-slate-400 font-semibold">Filtros activos:</span>
              {selectedNiche !== 'todos' && (
                <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 font-medium border border-blue-500/30">
                  Rubro: {selectedNiche}
                </span>
              )}
              {selectedCity !== 'todas' && (
                <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-medium border border-amber-500/30">
                  Ciudad: {selectedCity}
                </span>
              )}
              {selectedPlan !== 'free' && (
                <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 font-medium border border-purple-500/30">
                  Plan: {selectedPlan}
                </span>
              )}
              {searchQuery && (
                <span className="px-2.5 py-1 rounded-full bg-slate-700 text-slate-200">
                  Texto: "{searchQuery}"
                </span>
              )}
            </div>
            <button
              onClick={() => {
                setSelectedNiche('todos');
                setSelectedCity('todas');
                setSelectedPlan('free');
                setSearchQuery('');
              }}
              className="text-amber-400 hover:text-amber-300 font-bold underline cursor-pointer"
            >
              Limpiar Filtros
            </button>
          </div>
        )}
      </div>

      {/* Businesses Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>Comercios Listados</span>
            <span className="text-sm font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
              {filteredBusinesses.length} resultados
            </span>
          </h2>
        </div>

        {loading ? (
          <div className="py-20 text-center text-amber-400 font-bold animate-pulse">
            Cargando comercios de Supabase...
          </div>
        ) : filteredBusinesses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBusinesses.map((b) => {
              const waNumber = formatWhatsAppNumber(b.whatsappNumber || b.phone);
              const message = getMarketingMessage(b);
              const isPaid = b.plan === 'pro' || b.plan === 'premium';

              return (
                <div 
                  key={b.id} 
                  className={`glass-panel p-5 rounded-2xl flex flex-col justify-between h-full space-y-4 transition-all hover:border-blue-500/50 ${
                    isPaid ? 'border-amber-500/40 bg-amber-500/5' : ''
                  }`}
                >
                  <div>
                    <div className="flex items-start gap-3.5 mb-3">
                      <img 
                        src={b.image || 'https://images.unsplash.com/photo-1570042707223-93ef6bf7a303?auto=format&fit=crop&w=800&q=80'} 
                        alt={b.name} 
                        className="w-13 h-13 rounded-full object-cover border-2 border-[#27354D] flex-shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-white leading-tight truncate">{b.name}</h3>
                          {isPaid && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded font-black bg-amber-400 text-slate-950 uppercase">
                              {b.plan}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                          <span className="text-[11px] bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded font-semibold">
                            {b.niche || b.category}
                          </span>
                          <span className="text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-medium">
                            {b.cityName || b.city}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-300 mt-2">
                      <p className="flex items-center gap-2">
                        <MapPinIcon className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                        <span className="truncate">{b.cityName || b.city} - {b.address || 'Sin dirección'}</span>
                      </p>
                      <p className="flex items-center gap-2 font-mono">
                        <PhoneIcon className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                        <span>{b.whatsappNumber || b.phone || 'Sin teléfono'}</span>
                      </p>
                    </div>
                  </div>
                  
                  {waNumber ? (
                    <a
                      href={`https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 hover:from-green-400 hover:to-emerald-400 transition-all shadow-lg shadow-green-500/20 cursor-pointer active:scale-98"
                    >
                      <WhatsAppIcon className="w-4 h-4" />
                      Contactar por WhatsApp
                    </a>
                  ) : (
                    <div className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-500 font-bold text-xs text-center">
                      Sin número de WhatsApp
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="col-span-full py-16 text-center text-slate-400 bg-[#151F32]/50 rounded-2xl border border-[#27354D]">
            <p className="text-lg font-bold text-white mb-1">No se encontraron comercios con los filtros seleccionados.</p>
            <p className="text-sm text-slate-400">Prueba cambiando el rubro, la ciudad o limpiando la búsqueda.</p>
          </div>
        )}
      </div>

      {/* Historial VIP / Clientes Pagos */}
      {premiumBusinessesList(businesses).length > 0 && (
        <div className="pt-12 border-t border-[#27354D]">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white">Historial de Clientes VIP / Pro</h2>
            <p className="text-slate-400 mt-1 text-sm">
              Comercios que ya tienen un plan pago activo ({premiumBusinessesList(businesses).length} clientes).
            </p>
          </div>

          <div className="bg-[#151F32] rounded-2xl border border-[#27354D] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-[#1E293B] text-slate-400 uppercase text-xs">
                  <tr>
                    <th className="px-6 py-4 font-bold">Comercio</th>
                    <th className="px-6 py-4 font-bold">Rubro</th>
                    <th className="px-6 py-4 font-bold">Plan</th>
                    <th className="px-6 py-4 font-bold">Fecha Registro</th>
                    <th className="px-6 py-4 font-bold">Contacto</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#27354D]">
                  {premiumBusinessesList(businesses).map((b) => (
                    <tr key={b.id} className="hover:bg-[#1E293B]/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={b.image} alt={b.name} className="w-9 h-9 rounded-full object-cover border border-[#27354D]" />
                          <div>
                            <p className="text-white font-bold">{b.name}</p>
                            <p className="text-xs text-slate-500">{b.cityName || b.city}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-slate-300">
                        {b.niche || b.category}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${b.plan === 'premium' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'}`}>
                          {b.plan}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-400 text-xs">
                        {new Date(b.created_at).toLocaleDateString('es-PY', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <a 
                          href={`https://wa.me/${formatWhatsAppNumber(b.whatsappNumber || b.phone)}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-green-400 hover:text-green-300 flex items-center gap-1 font-semibold text-xs"
                        >
                          <WhatsAppIcon className="w-4 h-4" /> WhatsApp
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function premiumBusinessesList(businesses) {
  return (businesses || []).filter(b => b.plan === 'pro' || b.plan === 'premium');
}

