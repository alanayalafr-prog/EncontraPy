import React, { useEffect } from 'react';
import { ShieldCheckIcon } from './Icons';
import { Link } from 'react-router-dom';

export default function TermsConditions() {
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
          <ShieldCheckIcon className="w-10 h-10 text-amber-400" />
          <h1 className="text-3xl md:text-4xl font-black text-white">Términos y Condiciones</h1>
        </div>

        <div className="space-y-6 text-sm md:text-base text-slate-300 leading-relaxed">
          <p>
            Bienvenido a <strong>DirectorioPY</strong>. Al acceder o utilizar nuestro sitio web, aceptas estar sujeto a los siguientes Términos y Condiciones. Si no estás de acuerdo con alguna parte de estos términos, no debes utilizar nuestro servicio.
          </p>

          <h2 className="text-xl font-bold text-white pt-4">1. Descripción del Servicio</h2>
          <p>
            DirectorioPY es una plataforma web que permite a los comercios, empresas y profesionales de Paraguay registrar y publicar información sobre sus servicios para que los usuarios puedan encontrarlos y contactarlos.
          </p>

          <h2 className="text-xl font-bold text-white pt-4">2. Responsabilidad de la Información</h2>
          <p>
            Toda la información publicada en los perfiles de los comercios (incluyendo textos, imágenes, enlaces, y números de teléfono) es proporcionada por los propios negocios. <strong>DirectorioPY no se hace responsable</strong> de la veracidad, calidad, legalidad o seguridad de los servicios y productos ofrecidos por los comercios listados.
          </p>
          <p>
            Cualquier transacción o acuerdo realizado entre un usuario y un comercio encontrado en este directorio se realiza bajo el propio riesgo del usuario.
          </p>

          <h2 className="text-xl font-bold text-white pt-4">3. Registro de Comercios y Planes</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Al registrar un comercio, garantizas que eres el propietario legítimo o un representante autorizado.</li>
            <li><strong>Planes Gratuitos:</strong> Están sujetos a disponibilidad y no garantizan posicionamiento prioritario.</li>
            <li><strong>Planes de Pago (Pro / Premium):</strong> Los pagos se realizan de manera anticipada. Los beneficios de estos planes se mantendrán activos mientras la suscripción esté vigente. No se realizarán reembolsos por períodos ya facturados y utilizados.</li>
            <li>Nos reservamos el derecho de eliminar o suspender perfiles que contengan información falsa, ilegal, o que violen nuestros términos.</li>
          </ul>

          <h2 className="text-xl font-bold text-white pt-4">4. Propiedad Intelectual</h2>
          <p>
            El diseño, código fuente, logotipos y la base de datos del directorio son propiedad exclusiva de DirectorioPY. Los comercios retienen los derechos de autor de las imágenes y textos que suben a sus perfiles.
          </p>

          <h2 className="text-xl font-bold text-white pt-4">5. Modificaciones del Servicio</h2>
          <p>
            DirectorioPY se reserva el derecho de modificar o discontinuar el servicio (o cualquier parte del mismo) en cualquier momento y sin previo aviso. También podemos actualizar estos Términos y Condiciones ocasionalmente.
          </p>

          <h2 className="text-xl font-bold text-white pt-4">6. Contacto Legal</h2>
          <p>
            Para consultas relacionadas con estos términos, puedes comunicarte con nosotros desde la sección de <Link to="/contacto" className="text-blue-400 hover:underline">Contacto</Link>.
          </p>

          <div className="pt-8 text-xs text-slate-500">
            Última actualización: Agosto 2026.
          </div>
        </div>
      </div>
    </div>
  );
}
