import React, { useEffect } from 'react';
import { WhatsAppIcon, SparklesIcon } from './Icons';
import { Link } from 'react-router-dom';

export default function ContactAbout() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 md:px-8 container-clean max-w-4xl mx-auto">
      <Link to="/" className="text-amber-400 text-sm font-bold hover:underline mb-6 inline-block">
        ← Volver al Inicio
      </Link>
      
      <div className="glass-panel p-8 md:p-12 rounded-3xl space-y-8">
        <div className="flex items-center gap-3 border-b border-[#27354D] pb-6">
          <SparklesIcon className="w-10 h-10 text-emerald-400" />
          <h1 className="text-3xl md:text-4xl font-black text-white">Quiénes Somos & Contacto</h1>
        </div>

        <div className="space-y-6 text-sm md:text-base text-slate-300 leading-relaxed">
          <h2 className="text-xl font-bold text-white">Nuestra Misión en DirectorioPY</h2>
          <p>
            Somos un equipo paraguayo comprometido con la digitalización de los comercios locales. Nuestra misión es conectar a profesionales, pymes y grandes empresas con miles de clientes potenciales a través de una plataforma moderna, rápida y optimizada.
          </p>
          <p>
            Creemos que encontrar un servicio de calidad en tu ciudad, ya sea en Asunción, Ciudad del Este o en el Chaco, no debería ser complicado. Por eso diseñamos un directorio donde la prioridad es la conexión directa y sin intermediarios vía WhatsApp.
          </p>

          <h2 className="text-xl font-bold text-white pt-4">¿Por qué elegirnos?</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Contacto Directo:</strong> Los clientes te escriben directamente a tu celular. Cero comisiones por ventas.</li>
            <li><strong>Visibilidad SEO:</strong> Trabajamos diariamente para que las páginas de los comercios posicionen en los primeros resultados de Google.</li>
            <li><strong>Crecimiento Local:</strong> Apoyamos a la economía de Paraguay, dándole una vitrina digital a emprendedores y negocios de todas las escalas.</li>
          </ul>

          <div className="mt-8 p-6 rounded-2xl bg-[#151F32] border border-[#27354D]">
            <h2 className="text-2xl font-bold text-white mb-4">¿Necesitas ayuda o quieres registrar tu negocio?</h2>
            <p className="mb-6 text-slate-300">
              Nuestro equipo de soporte humano está disponible para ayudarte a subir tus fotos, optimizar tu perfil o procesar tu pago de planes Premium vía transferencia SIPAP.
            </p>
            
            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Escríbenos directamente</p>
                <a
                  href="https://wa.me/595981747679?text=Hola%20equipo%20de%20DirectorioPY.%20Necesito%20ayuda%20con%20la%20plataforma."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white font-bold text-sm shadow-lg shadow-green-500/20 transition-all hover:scale-[1.02]"
                >
                  <WhatsAppIcon className="w-5 h-5" />
                  <span>Contactar Soporte (+595 981 747679)</span>
                </a>
              </div>

              <div className="pt-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Horario de Atención</p>
                <p className="text-slate-200 font-medium">Lunes a Sábados: 08:00 hs - 18:00 hs</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
