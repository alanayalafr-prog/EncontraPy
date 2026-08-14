import React, { useEffect } from 'react';
import { ShieldCheckIcon } from './Icons';
import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
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
          <ShieldCheckIcon className="w-10 h-10 text-blue-400" />
          <h1 className="text-3xl md:text-4xl font-black text-white">Política de Privacidad</h1>
        </div>

        <div className="space-y-6 text-sm md:text-base text-slate-300 leading-relaxed">
          <p>
            En <strong>DirectorioPY</strong> (en adelante, "nosotros", "nuestro" o "el Sitio"), respetamos tu privacidad y estamos comprometidos a proteger la información personal que puedas compartir con nosotros. Esta Política de Privacidad explica cómo recopilamos, utilizamos y compartimos información sobre ti cuando visitas nuestra plataforma.
          </p>

          <h2 className="text-xl font-bold text-white pt-4">1. Información que recopilamos</h2>
          <p>
            Al registrar un comercio en nuestro directorio, recopilamos información proporcionada voluntariamente, como nombre comercial, dirección, número de teléfono (WhatsApp), imágenes y enlaces de redes sociales. Esta información se publica en nuestro sitio web con el propósito explícito de que el público contacte a los comercios.
          </p>
          <p>
            Para los visitantes generales del sitio, podemos recopilar automáticamente información no identificable personalmente, como el tipo de navegador, dirección IP, tiempo de visita y páginas consultadas, a través de herramientas de analítica y cookies.
          </p>

          <h2 className="text-xl font-bold text-white pt-4">2. Uso de Cookies y Publicidad (Google AdSense)</h2>
          <p>
            Utilizamos <strong>cookies</strong> para mejorar tu experiencia, analizar nuestro tráfico y personalizar el contenido y los anuncios.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Terceros proveedores, incluido <strong>Google</strong>, utilizan cookies para mostrar anuncios relevantes basándose en las visitas anteriores de un usuario a nuestro sitio web o a otros sitios en Internet.
            </li>
            <li>
              El uso de la <strong>cookie de publicidad de Google (DoubleClick)</strong> permite a Google y a sus socios mostrar anuncios basados en tu visita a este sitio y/u otros sitios de Internet.
            </li>
            <li>
              Los usuarios pueden inhabilitar la publicidad personalizada. Para ello, deberán acceder a <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Configuración de anuncios de Google</a> o a <a href="http://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">www.aboutads.info</a>.
            </li>
          </ul>

          <h2 className="text-xl font-bold text-white pt-4">3. Cómo utilizamos tu información</h2>
          <p>
            Utilizamos los datos proporcionados para:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Publicar y mantener el perfil de tu comercio en nuestro directorio local.</li>
            <li>Mejorar el rendimiento del sitio y optimizar la experiencia de usuario.</li>
            <li>Mostrar anuncios personalizados a través de redes publicitarias como Google AdSense.</li>
          </ul>

          <h2 className="text-xl font-bold text-white pt-4">4. Retención y eliminación de datos</h2>
          <p>
            Los comercios pueden solicitar en cualquier momento la modificación, actualización o eliminación completa de su información enviando un mensaje directo a nuestro equipo de soporte vía WhatsApp.
          </p>

          <h2 className="text-xl font-bold text-white pt-4">5. Enlaces a sitios de terceros</h2>
          <p>
            Nuestro directorio contiene enlaces a sitios externos, como redes sociales de comercios o sitios web oficiales. No nos hacemos responsables de las prácticas de privacidad ni del contenido de esos sitios externos. Recomendamos leer sus respectivas políticas.
          </p>

          <h2 className="text-xl font-bold text-white pt-4">6. Contacto</h2>
          <p>
            Si tienes alguna pregunta sobre esta Política de Privacidad, puedes ponerte en contacto con nosotros a través de nuestro <Link to="/contacto" className="text-blue-400 hover:underline">formulario de contacto o WhatsApp</Link>.
          </p>

          <div className="pt-8 text-xs text-slate-500">
            Última actualización: Agosto 2026.
          </div>
        </div>
      </div>
    </div>
  );
}
