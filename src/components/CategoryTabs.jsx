import React from 'react';
import { LayoutGridIcon, TractorIcon, WrenchIcon, StethoscopeIcon, UtensilsIcon } from './Icons';

export default function CategoryTabs({ categories, selectedCategory, onSelectCategory }) {
  const icons = {
    todos: LayoutGridIcon,
    agro: TractorIcon,
    oficios: WrenchIcon,
    salud: StethoscopeIcon,
    gastronomia: UtensilsIcon
  };

  const categoryCounts = {
    todos: '8',
    agro: '2',
    oficios: '3',
    salud: '2',
    gastronomia: '1'
  };

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-800/80">
      {categories.map((cat) => {
        const IconComp = icons[cat.id] || LayoutGridIcon;
        const isSelected = selectedCategory === cat.id;

        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
              isSelected
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 scale-[1.02]'
                : 'bg-[#0F172A] hover:bg-[#1E293B] text-slate-300 border border-slate-800'
            }`}
          >
            <IconComp className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-blue-400'}`} />
            <span>{cat.label}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'}`}>
              {categoryCounts[cat.id] || '0'}
            </span>
          </button>
        );
      })}
    </div>
  );
}
