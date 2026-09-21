'use client';
import React, { useState } from 'react';
import { 
  CheckCircleIcon, 
  CreditCardIcon, 
  SparklesIcon, 
  ShieldCheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CopyIcon,
  CheckIcon
} from './Icons';
import { PRICING_PLANS, BANK_TRANSFER_DETAILS } from '../data/businesses';

export default function PricingSection({ onOpenPaymentModal }) {
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [copiedField, setCopiedField] = useState(null);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const handleCopy = (text, fieldName) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const steps = [
    {
      step: '1',
      title: 'Publicá o Reclamá',
      desc: 'Completá los datos básicos de tu comercio en 2 minutos.'
    },
    {
      step: '2',
      title: 'Elegí tu Plan SIPAP',
      desc: 'Optá por el plan que mejor se adapte a tu meta de crecimiento.'
    },
    {
      step: '3',
      title: 'Enviá Comprobante',
      desc: 'Mandanos la captura de tu transferencia directa por WhatsApp.'
    },
    {
      step: '4',
      title: 'Activación en 2h',
      desc: 'Tu ficha queda verificada y en los primeros lugares de búsqueda.'
    }
  ];

  const faqs = [
    {
      q: '¿Tiene costo publicar mi negocio en DirectorioPY?',
      a: 'No. El Plan Gratuito es 100% gratis para siempre y permite que tu comercio aparezca en las búsquedas locales. Los planes Pro y Premium son opcionales para negocios que desean aparecer primeros, obtener la insignia de Comercio Verificado, cargar galería de fotos y recibir clientes directos a su WhatsApp.'
    },
    {
      q: '¿Qué significa la insignia de Comercio Verificado?',
      a: 'Indica a los usuarios que el equipo de DirectorioPY ha validado que el número de WhatsApp, la dirección física y el titular del negocio son reales y activos, brindando máxima confianza al cliente que busca servicios en internet.'
    },
    {
      q: '¿Qué bancos o billeteras aceptan para el pago SIPAP?',
      a: 'Aceptamos transferencias desde cualquier entidad bancaria o financiera de Paraguay conectada a la red SIPAP (Ueno Bank, Itaú, Banco Continental, Sudameris, BNF, Basa, GNB, etc.) utilizando número de cuenta o nuestro Alias SIPAP directo.'
    },
    {
      q: '¿Cuánto tiempo tarda en activarse mi plan destacado?',
      a: 'Una vez enviado tu comprobante de pago a nuestro WhatsApp de soporte, la validación y activación se realiza en menos de 2 horas hábiles.'
    },
    {
      q: '¿Puedo actualizar mis datos o fotos en cualquier momento?',
      a: '¡Por supuesto! Podés actualizar tu número de teléfono, horarios, fotos o promociones escribiéndonos en cualquier momento a nuestro canal oficial de soporte.'
    }
  ];

  return (
    <section id="planes-sipap" className="pt-8 pb-10 border-t border-[#27354D] mt-8">
      <div className="container-clean flex flex-col items-center justify-center space-y-10">
        
        {/* Section Header */}
        <div className="text-center flex flex-col items-center justify-center w-full max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-800/60 text-blue-300 text-xs font-bold uppercase tracking-wider">
            <SparklesIcon className="w-3.5 h-3.5 text-amber-400" />
            <span>Publicación Local en Paraguay 🇵🇾</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
            Planes de Publicación para Comercios
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl mx-auto font-normal">
            Aparecé en las primeras búsquedas de Google y recibí clientes calificados en tu WhatsApp sin pagar comisiones por venta.
          </p>
        </div>

        {/* 4-Step Onboarding Workflow */}
        <div className="w-full max-w-4xl p-5 sm:p-6 rounded-2xl bg-[#131D2F] border border-[#27354D]">
          <h3 className="text-center font-bold text-xs sm:text-sm uppercase tracking-wider text-slate-300 mb-5">
            ¿Cómo activar tu comercio en 4 simples pasos?
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {steps.map((st) => (
              <div key={st.step} className="flex flex-col items-center text-center p-3 rounded-xl bg-[#0F172A] border border-[#27354D]/70 space-y-1.5">
                <span className="w-7 h-7 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center shadow">
                  {st.step}
                </span>
                <h4 className="font-bold text-white text-xs sm:text-sm">{st.title}</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Cards Grid - Only ONE single recommended plan */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch w-full max-w-6xl">
          {PRICING_PLANS.map((plan) => {
            const isFeatured = plan.id === 'pro_trimestral'; // ONLY this one is highlighted

            return (
              <div
                key={plan.id}
                className={`rounded-2xl flex flex-col justify-between p-5 sm:p-6 relative transition-all duration-200 ${
                  isFeatured
                    ? 'bg-[#15233D] border-2 border-amber-400 shadow-xl shadow-amber-500/10 -translate-y-1 sm:-translate-y-2'
                    : 'bg-[#151F32] border border-[#27354D] hover:border-slate-500 shadow-sm'
                }`}
              >
                {/* Badge Overlay: ONLY for the recommended plan */}
                {isFeatured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-950 text-[10px] font-black px-3 py-0.5 rounded-full uppercase tracking-wider shadow whitespace-nowrap">
                    🔥 MÁS ELEGIDO (AHORRO GS. 98.000)
                  </span>
                )}

                <div className="space-y-4">
                  {/* Plan Name & Tag */}
                  <div>
                    <span className={`text-[10px] font-bold tracking-wider uppercase block ${isFeatured ? 'text-amber-400' : 'text-slate-400'}`}>
                      {plan.badge}
                    </span>
                    <h3 className="text-lg font-black text-white leading-snug mt-0.5">{plan.name}</h3>
                    <p className="text-xs text-slate-300 pt-1 leading-relaxed">{plan.description}</p>
                  </div>

                  {/* Pricing Display */}
                  <div className="py-3 border-y border-[#27354D] flex flex-col">
                    <span className={`text-2xl font-black tracking-tight ${isFeatured ? 'text-amber-400' : 'text-white'}`}>
                      {plan.priceGs}
                    </span>
                    <span className="text-[11px] font-medium text-slate-400">{plan.period}</span>
                  </div>

                  {/* Feature Checklist */}
                  <ul className="space-y-2 text-xs text-slate-200">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircleIcon className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-snug text-[11px] text-slate-300">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Plan Action CTA */}
                <button
                  onClick={() => onOpenPaymentModal(plan.id)}
                  className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs transition-all shadow-md mt-5 cursor-pointer text-center ${
                    isFeatured
                      ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 font-black hover:scale-[1.02]'
                      : plan.id === 'gratuito'
                      ? 'bg-blue-600 hover:bg-blue-500 text-white'
                      : 'bg-[#1E293B] hover:bg-[#27354D] text-white border border-[#27354D]'
                  }`}
                >
                  {plan.ctaText}
                </button>
              </div>
            );
          })}
        </div>

        {/* Separated Collapsible SIPAP Bank Transfer Box */}
        <div className="w-full max-w-4xl rounded-2xl bg-[#0F172A] border border-[#27354D] overflow-hidden shadow-lg">
          <div 
            onClick={() => setShowBankDetails(!showBankDetails)}
            className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-slate-800/40 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 shrink-0">
                <CreditCardIcon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm sm:text-base flex items-center gap-2">
                  <span>Información Bancaria para Transferencia SIPAP</span>
                  <span className="hidden sm:inline text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded font-bold">
                    PAGO SEGURO
                  </span>
                </h4>
                <p className="text-xs text-slate-400">
                  {showBankDetails ? 'Haz clic para ocultar datos bancarios' : 'Haz clic para desplegar los datos y alias SIPAP en Guaraníes'}
                </p>
              </div>
            </div>

            <button 
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
              aria-label="Desplegar datos bancarios"
            >
              {showBankDetails ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
            </button>
          </div>

          {showBankDetails && (
            <div className="p-5 sm:p-6 border-t border-[#27354D] bg-[#0A101D] space-y-4 animate-fadeIn">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                
                {/* Bank Name */}
                <div className="p-3 rounded-xl bg-[#151F32] border border-[#27354D] space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Banco</span>
                  <div className="font-bold text-white text-sm">{BANK_TRANSFER_DETAILS.bankName}</div>
                </div>

                {/* Titular */}
                <div className="p-3 rounded-xl bg-[#151F32] border border-[#27354D] space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Titular</span>
                  <div className="font-bold text-white text-sm truncate">{BANK_TRANSFER_DETAILS.accountHolder}</div>
                </div>

                {/* Account Number */}
                <div className="p-3 rounded-xl bg-[#151F32] border border-[#27354D] space-y-1 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">N° Cuenta</span>
                    <div className="font-mono font-bold text-amber-400 text-sm">{BANK_TRANSFER_DETAILS.accountNumber}</div>
                  </div>
                  <button 
                    onClick={() => handleCopy(BANK_TRANSFER_DETAILS.accountNumber, 'acc')}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                    title="Copiar número de cuenta"
                  >
                    {copiedField === 'acc' ? <CheckIcon className="w-3.5 h-3.5 text-emerald-400" /> : <CopyIcon className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Alias SIPAP */}
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/40 space-y-1 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-amber-400 uppercase font-bold">Alias SIPAP</span>
                    <div className="font-mono font-black text-emerald-400 text-sm">{BANK_TRANSFER_DETAILS.aliasSIPAP}</div>
                  </div>
                  <button 
                    onClick={() => handleCopy(BANK_TRANSFER_DETAILS.aliasSIPAP, 'alias')}
                    className="p-1.5 rounded-lg bg-amber-400 text-slate-950 font-bold hover:bg-amber-300"
                    title="Copiar Alias SIPAP"
                  >
                    {copiedField === 'alias' ? <CheckIcon className="w-3.5 h-3.5 text-slate-950" /> : <CopyIcon className="w-3.5 h-3.5" />}
                  </button>
                </div>

              </div>

              <p className="text-[11px] text-slate-400 text-center pt-1">
                💡 Una vez realizada la transferencia, envianos el comprobante a nuestro WhatsApp de soporte para activar tu comercio de inmediato.
              </p>
            </div>
          )}
        </div>

        {/* FAQ Accordion Section for Business Owners */}
        <div className="w-full max-w-4xl space-y-3">
          <div className="text-center mb-4">
            <h3 className="text-lg font-black text-white">Preguntas Frecuentes para Comercios</h3>
            <p className="text-xs text-slate-400">Todo lo que necesitás saber sobre la publicación en DirectorioPY</p>
          </div>

          <div className="space-y-2">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;

              return (
                <div 
                  key={idx} 
                  className="rounded-xl bg-[#151F32] border border-[#27354D] overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-4 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-white hover:text-blue-300 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <span className="shrink-0 text-slate-400">
                      {isOpen ? <ChevronUpIcon className="w-4 h-4 text-amber-400" /> : <ChevronDownIcon className="w-4 h-4" />}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs text-slate-300 leading-relaxed border-t border-[#27354D]/60 bg-[#0F172A]/50 animate-fadeIn">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
