import React from 'react';
import { WhatsAppIcon, SparklesIcon, MapPinIcon, TractorIcon, ShieldCheckIcon } from './Icons';

export default function Footer({ onSelectCategory, onSelectCity }) {
  return (
    <footer className="border-t border-[#27354D] bg-[#0F172A] pt-12 pb-10" style={{ marginTop: '24px' }}>
      <div className="container-clean space-y-10">
        
        {/* Main Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          
          {/* Column 1: Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 font-bold text-2xl tracking-tight text-white">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white text-lg shadow-md">
                E<span className="text-amber-400">PY</span>
              </div>
              <span>Encontra<span className="text-amber-400 font-extrabold">PY</span></span>
              <span className="text-xs px-2 py-0.5 rounded bg-blue-950 text-blue-300 font-bold border border-blue-800">
                🇵🇾
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              El directorio web de comercios, empresas y servicios de Paraguay optimizado para búsquedas en Google y atención inmediata por WhatsApp.
            </p>
          </div>

          {/* Column 2: Key Niches */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <TractorIcon className="w-4 h-4 text-blue-400 shrink-0" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Nichos Destacados</h4>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li>
                <button onClick={() => onSelectCategory('agro')} className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <span>🌾 Agro e Insumos Ganaderos</span>
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('oficios')} className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <span>🛠️ Oficios y Servicios del Hogar</span>
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('salud')} className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <span>⚕️ Salud Privada & Médicos</span>
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('gastronomia')} className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <span>🍽️ Gastronomía & Eventos</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Main Cities */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MapPinIcon className="w-4 h-4 text-amber-400 shrink-0" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Ciudades Principales</h4>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li>
                <button onClick={() => onSelectCity('asuncion')} className="hover:text-amber-400 transition-colors">
                  📍 Asunción (Las Mercedes, Carmelitas, Sajonia)
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCity('luque')} className="hover:text-amber-400 transition-colors">
                  📍 Luque & Gran Asunción
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCity('san_lorenzo')} className="hover:text-amber-400 transition-colors">
                  📍 San Lorenzo & Lambaré
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCity('cde')} className="hover:text-amber-400 transition-colors">
                  📍 Ciudad del Este & Encarnación
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Support */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheckIcon className="w-4 h-4 text-emerald-400 shrink-0" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Soporte & Registro</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              ¿Querés registrar tu negocio o activar tu plan por transferencia SIPAP? Contactanos:
            </p>
            <a
              href="https://wa.me/595981100200?text=Hola%20EncontraPY,%20quisiera%20consultar%20sobre%20el%20directorio."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp-official w-full py-3 text-xs rounded-xl flex items-center justify-center gap-2 font-bold shadow-md hover:scale-[1.01] transition-transform mt-2"
            >
              <WhatsAppIcon className="w-4 h-4 shrink-0" />
              <span>Contactar Soporte EncontraPY</span>
            </a>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#27354D]/70 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4 mt-8">
          <p>© 2026 EncontraPY — Directorio Web de Paraguay 🇵🇾. Todos los derechos reservados.</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm"></span>
            <span className="text-emerald-400 font-semibold text-xs">Servicio Activo en Paraguay</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
