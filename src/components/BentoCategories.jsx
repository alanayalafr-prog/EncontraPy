import React from 'react';
import { TractorIcon, WrenchIcon, StethoscopeIcon, UtensilsIcon, SparklesIcon, ChevronRight } from './Icons';

export default function BentoCategories({ selectedCategory, onSelectCategory }) {
  const bentoItems = [
    {
      id: 'agro',
      title: 'Agro e Insumos Ganaderos',
      subtitle: 'Nutrición animal, semillas, veterinarias rurales y maquinaria agrícola.',
      count: '14 comercios activos',
      icon: TractorIcon,
      colSpan: 'col-span-12 md:col-span-7',
      bgGradient: 'from-amber-950/60 via-amber-900/30 to-slate-900',
      borderColor: 'hover:border-amber-500/50',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      image: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'oficios',
      title: 'Oficios y Servicios del Hogar',
      subtitle: 'Electricistas 24hs, plomería, refrigeración y mantenimiento urgente.',
      count: '28 especialistas',
      icon: WrenchIcon,
      colSpan: 'col-span-12 md:col-span-5',
      bgGradient: 'from-blue-950/60 via-blue-900/30 to-slate-900',
      borderColor: 'hover:border-blue-500/50',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'salud',
      title: 'Salud Privada & Especialistas',
      subtitle: 'Médicos, odontología estética, clínicas y sanatorios de atención directa.',
      count: '19 profesionales',
      icon: StethoscopeIcon,
      colSpan: 'col-span-12 md:col-span-5',
      bgGradient: 'from-emerald-950/60 via-emerald-900/30 to-slate-900',
      borderColor: 'hover:border-emerald-500/50',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'gastronomia',
      title: 'Gastronomía por Zonas & Eventos',
      subtitle: 'Asados a domicilio, catering, rotiserías y locales fuera del eje tradicional.',
      count: '22 locales',
      icon: UtensilsIcon,
      colSpan: 'col-span-12 md:col-span-7',
      bgGradient: 'from-purple-950/60 via-purple-900/30 to-slate-900',
      borderColor: 'hover:border-purple-500/50',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80'
    }
  ];

  return (
    <section className="py-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
            <SparklesIcon className="w-3.5 h-3.5" />
            Explorá por Categorías Principales
          </span>
          <h2 className="text-2xl font-extrabold text-[var(--text-primary)]">
            Bento Grid de Nichos en Paraguay 🇵🇾
          </h2>
        </div>

        {selectedCategory !== 'todos' && (
          <button
            onClick={() => onSelectCategory('todos')}
            className="text-xs text-blue-400 hover:underline font-semibold"
          >
            Ver Todas las Categorías →
          </button>
        )}
      </div>

      {/* Bento Grid layout */}
      <div className="grid grid-cols-12 gap-4">
        {bentoItems.map((item) => {
          const IconComponent = item.icon;
          const isSelected = selectedCategory === item.id;

          return (
            <div
              key={item.id}
              onClick={() => onSelectCategory(item.id)}
              className={`${item.colSpan} bento-card cursor-pointer group relative overflow-hidden bg-gradient-to-br ${item.bgGradient} ${item.borderColor} ${
                isSelected ? 'ring-2 ring-amber-400 scale-[1.01]' : ''
              }`}
            >
              {/* Background Image Accent */}
              <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 group-hover:opacity-30 transition-opacity pointer-events-none overflow-hidden">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[var(--bg-main)] to-[var(--bg-main)]" />
              </div>

              <div className="relative z-10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md">
                    <IconComponent className="w-6 h-6 text-amber-400" />
                  </div>
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${item.badgeColor}`}>
                    {item.count}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors flex items-center gap-1.5">
                    <span>{item.title}</span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-2 max-w-lg leading-relaxed">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
