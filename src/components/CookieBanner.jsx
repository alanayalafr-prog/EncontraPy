'use client';
import React, { useState, useEffect } from 'react';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user already accepted cookies
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      // Delay showing banner slightly for better UX
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 animate-fadeIn" style={{ animationDuration: '0.5s' }}>
      <div className="max-w-4xl mx-auto bg-[#0F172A] border border-[#27354D] rounded-2xl shadow-2xl p-4 md:p-5 flex flex-col sm:flex-row items-center gap-4 justify-between">
        
        <div className="text-sm text-slate-300 leading-relaxed text-center sm:text-left">
          <p>
            🍪 <strong>Usamos cookies</strong> para personalizar contenido, anuncios (incluyendo Google AdSense) y analizar nuestro tráfico. Al continuar navegando, aceptas nuestra <a href="/privacidad" className="text-amber-400 hover:underline font-semibold">Política de Privacidad</a> y el uso de cookies.
          </p>
        </div>

        <button
          onClick={handleAccept}
          className="whitespace-nowrap px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-500/20 transition-all hover:scale-105"
        >
          Aceptar y Cerrar
        </button>

      </div>
    </div>
  );
}

