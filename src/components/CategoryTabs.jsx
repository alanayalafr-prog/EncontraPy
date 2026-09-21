import React from 'react';
import { LayoutGridIcon, TractorIcon, WrenchIcon, StethoscopeIcon, UtensilsIcon } from './Icons';

export default function CategoryTabs({ categories, selectedCategory, onSelectCategory, categoryCounts = {} }) {
  const icons = {
    todos: LayoutGridIcon,
    agro: TractorIcon,
    oficios: WrenchIcon,
    salud: StethoscopeIcon,
    gastronomia: UtensilsIcon
  };

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-[#27354D]/60">
      {categories.map((cat) => {
        const IconComp = icons[cat.id] || LayoutGridIcon;
        const isSelected = selectedCategory === cat.id;
        const count = categoryCounts[cat.id] !== undefined ? categoryCounts[cat.id] : 0;

        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
              isSelected
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'bg-[#151F32] hover:bg-[#1E293B] text-slate-300 hover:text-white border border-[#27354D]'
            }`}
          >
            <IconComp className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-400' : 'text-blue-400'}`} />
            <span>{cat.label}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'}`}>
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
