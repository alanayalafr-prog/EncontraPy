import React, { useState } from 'react';
import { ShieldCheckIcon, WhatsAppIcon, MapPinIcon, PhoneIcon } from './Icons';

export default function AdminDashboard({ businesses }) {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Filter only free businesses (or 'gratis' if we used that initially)
  const freeBusinesses = businesses.filter(b => b.plan === 'free' || b.plan === 'gratis');

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'ventas2026') {
      setIsAuthenticated(true);
    } else {
      alert('Contraseña incorrecta');
    }
  };

  const getMarketingMessage = (b) => {
    return `Hola ${b.name}, vimos que su perfil en DirectorioPY está activo y recibiendo visitas. Nos gustaría ofrecerle nuestro Plan Premium para destacarlo en la página principal y aumentar sus clientes. ¿Le interesaría conocer los beneficios?`;
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
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors shadow-lg shadow-blue-500/30"
          >
            Ingresar
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 space-y-8 animate-fadeIn max-w-7xl mx-auto pt-24">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <ShieldCheckIcon className="w-8 h-8 text-blue-400" />
            CRM DirectorioPY
          </h1>
          <p className="text-slate-400 mt-2">
            Gestión de leads y upselling a planes Premium. Hay {freeBusinesses.length} negocios en plan gratuito.
          </p>
        </div>
        <button
          onClick={() => setIsAuthenticated(false)}
          className="px-4 py-2 rounded-lg bg-[#151F32] border border-[#27354D] text-slate-300 hover:text-white transition-colors self-start"
        >
          Cerrar Sesión
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {freeBusinesses.map((b) => (
          <div key={b.id} className="glass-panel p-5 rounded-2xl flex flex-col justify-between h-full space-y-4">
            <div>
              <div className="flex items-start gap-4 mb-3">
                <img 
                  src={b.image} 
                  alt={b.name} 
                  className="w-14 h-14 rounded-full object-cover border-2 border-[#27354D]"
                />
                <div>
                  <h3 className="text-lg font-bold text-white leading-tight">{b.name}</h3>
                  <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded uppercase font-semibold">
                    {b.category}
                  </span>
                </div>
              </div>
              <div className="space-y-2 text-sm text-slate-300">
                <p className="flex items-center gap-2">
                  <MapPinIcon className="w-4 h-4 text-slate-500" />
                  <span className="truncate">{b.cityName} - {b.address}</span>
                </p>
                <p className="flex items-center gap-2">
                  <PhoneIcon className="w-4 h-4 text-slate-500" />
                  {b.whatsappNumber}
                </p>
              </div>
            </div>
            
            <a
              href={`https://wa.me/${b.whatsappNumber}?text=${encodeURIComponent(getMarketingMessage(b))}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 hover:from-green-400 hover:to-emerald-400 transition-all shadow-lg shadow-green-500/30"
            >
              <WhatsAppIcon className="w-5 h-5" />
              Contactar para Venta
            </a>
          </div>
        ))}
        {freeBusinesses.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-400">
            No hay comercios gratuitos para contactar. ¡Excelente trabajo de ventas!
          </div>
        )}
      </div>
    </div>
  );
}
