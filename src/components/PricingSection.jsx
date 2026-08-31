import React from 'react';
import { CheckCircleIcon, CreditCardIcon, SparklesIcon, ShieldCheckIcon } from './Icons';
import { PRICING_PLANS, BANK_TRANSFER_DETAILS } from '../data/businesses';

export default function PricingSection({ onOpenPaymentModal }) {
  return (
    <section id="planes-sipap" className="pt-6 pb-8 border-t border-[#27354D] mt-6">
      <div className="container-clean flex flex-col items-center justify-center">
        
        {/* Section Header centrado con margen cercano y equilibrado de 22px abajo */}
        <div className="text-center flex flex-col items-center justify-center w-full max-w-2xl mx-auto space-y-2.5" style={{ marginBottom: '22px' }}>
          <div className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-0.5">
            <SparklesIcon className="w-4 h-4 text-amber-400" />
            <span>Publicación Local 🇵🇾</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-snug text-center w-full">
            Planes de Publicación para Comercios
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl mx-auto text-center font-normal">
            Aparecé en las búsquedas locales de Google y recibí clientes directos en tu WhatsApp.
            <span className="block font-semibold text-amber-300 mt-0.5">Pagos locales convenientes mediante transferencia bancaria SIPAP.</span>
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch w-full" style={{ marginTop: '0px', paddingTop: '10px' }}>
          {PRICING_PLANS.map((plan) => {
            const isFeatured = plan.highlighted;
            const isTrimestral = plan.id === 'pro_trimestral';
            const isPremium = plan.id === 'premium';
            const isPro = plan.id === 'pro';

            let internalBadgeText = 'INICIAL';
            if (isTrimestral) internalBadgeText = 'PROMO LIMITADA 🔥 (AHORRÁ Gs. 98.000)';
            else if (isPremium) internalBadgeText = 'VIP ANUAL 👑 (AHORRÁ 35%)';
            else if (isPro) internalBadgeText = 'PLAN MENSUAL';

            return (
              <div
                key={plan.id}
                style={{ paddingTop: '24px', paddingLeft: '20px', paddingRight: '20px', paddingBottom: '24px' }}
                className={`rounded-2xl flex flex-col justify-between space-y-6 relative transition-all duration-200 ${
                  isFeatured
                    ? 'bg-gradient-to-b from-[#1E2B45] to-[#151F32] border-2 border-amber-500 shadow-2xl shadow-amber-500/20 ring-1 ring-amber-500/50'
                    : isPremium
                    ? 'bg-[#151F32] border-2 border-purple-500/60 shadow-xl'
                    : isPro
                    ? 'bg-[#151F32] border-2 border-blue-500/60 shadow-xl'
                    : 'bg-[#151F32] border-2 border-[#27354D] shadow-md'
                }`}
              >
                {/* Badge Overlay */}
                {isFeatured && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-black text-[10px] font-black px-3.5 py-1 rounded-full uppercase tracking-wider shadow-lg z-10 whitespace-nowrap border border-amber-300">
                    ⚡ TIEMPO LIMITADO
                  </span>
                )}
                {isPremium && !isFeatured && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg z-10 whitespace-nowrap border border-purple-400">
                    👑 MÁS COMPLETO
                  </span>
                )}

                <div className="space-y-5">
                  {/* Plan Name & Subtitle */}
                  <div className="space-y-1.5" style={{ marginTop: '0px' }}>
                    <span className={`text-[10px] font-bold tracking-wider uppercase block ${isFeatured ? 'text-amber-400' : isPremium ? 'text-purple-400' : 'text-blue-400'}`}>
                      {internalBadgeText}
                    </span>
                    <h3 className="text-xl font-extrabold text-white leading-snug">{plan.name}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed pt-1">{plan.description}</p>
                  </div>

                  {/* Pricing Display */}
                  <div className="py-3.5 border-y border-[#27354D] flex flex-col gap-0.5">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl sm:text-3xl font-extrabold text-amber-400 tracking-tight">{plan.priceGs}</span>
                    </div>
                    <span className="text-[11px] font-medium text-slate-400">{plan.period}</span>
                  </div>

                  {/* Feature Checklist */}
                  <ul className="space-y-2.5 text-xs text-slate-200">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircleIcon className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-relaxed text-[11px]">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Plan Action CTA */}
                <button
                  onClick={() => onOpenPaymentModal(plan.id)}
                  className={`w-full py-3 rounded-xl font-bold text-xs transition-all shadow-md mt-4 cursor-pointer ${
                    isFeatured
                      ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-amber-500/20 hover:scale-[1.01]'
                      : isPremium
                      ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-500/20 hover:scale-[1.01]'
                      : 'bg-[#1E293B] hover:bg-[#27354D] text-white border border-[#27354D]'
                  }`}
                >
                  {plan.ctaText}
                </button>
              </div>
            );
          })}
        </div>

        {/* Visually Separated SIPAP Bank Transfer Box con separación de 20px */}
        <div className="w-full rounded-2xl bg-[#0F172A] border-2 border-blue-500/40 p-6 sm:p-8 space-y-6 shadow-2xl" style={{ marginTop: '20px', marginBottom: '12px' }}>
          
          {/* Card Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#27354D]">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 shrink-0">
                <CreditCardIcon className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-lg font-bold text-white leading-snug">Datos Oficiales para Transferencia SIPAP</h4>
                  <span className="hidden sm:inline-flex items-center gap-1 bg-emerald-950/90 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/40">
                    <ShieldCheckIcon className="w-3 h-3" />
                    <span>PAGO SEGURO</span>
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-normal leading-relaxed mt-1">
                  Efectuá tu pago bancario directo en Guaraníes para activación inmediata.
                </p>
              </div>
            </div>

            <span className="bg-blue-950 text-blue-300 font-bold text-xs px-3 py-1.5 rounded-lg border border-blue-800 shrink-0">
              🇵🇾 {BANK_TRANSFER_DETAILS.bankName}
            </span>
          </div>

          {/* Structured Bank Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="p-4 sm:p-5 rounded-xl bg-[#151F32] border border-[#27354D] space-y-1.5">
              <span className="text-slate-400 text-[11px] font-medium uppercase tracking-wider block">Titular de la Cuenta:</span>
              <div className="font-bold text-white text-sm leading-snug">{BANK_TRANSFER_DETAILS.accountHolder}</div>
            </div>

            <div className="p-4 sm:p-5 rounded-xl bg-[#151F32] border border-[#27354D] space-y-1.5">
              <span className="text-slate-400 text-[11px] font-medium uppercase tracking-wider block">C.I. / RUC:</span>
              <div className="font-mono font-bold text-amber-400 text-sm leading-snug">{BANK_TRANSFER_DETAILS.ruc}</div>
            </div>

            <div className="p-4 sm:p-5 rounded-xl bg-[#151F32] border border-[#27354D] space-y-1.5">
              <span className="text-slate-400 text-[11px] font-medium uppercase tracking-wider block">N° de Cuenta (Cta Cte):</span>
              <div className="font-mono font-bold text-amber-400 text-sm leading-snug">{BANK_TRANSFER_DETAILS.accountNumber}</div>
            </div>

            <div className="p-4 sm:p-5 rounded-xl bg-amber-500/10 border border-amber-500/40 space-y-1.5">
              <span className="text-amber-400 text-[11px] font-bold uppercase tracking-wider block">Alias SIPAP Preferido:</span>
              <div className="font-mono font-extrabold text-emerald-400 text-sm leading-snug break-all">{BANK_TRANSFER_DETAILS.aliasSIPAP}</div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
