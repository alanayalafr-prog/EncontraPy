'use client';
import React, { useState } from 'react';
import { XIcon, CreditCardIcon, WhatsAppIcon, CheckCircleIcon, SparklesIcon, ShieldCheckIcon } from './Icons';
import { formatWhatsAppNumber } from '../utils/phoneUtils';
import { PRICING_PLANS, BANK_TRANSFER_DETAILS } from '../data/businesses';

export default function SipapPaymentModal({ isOpen, onClose, selectedPlanId = 'pro' }) {
  const [copiedField, setCopiedField] = useState(null);
  const [receiptSent, setReceiptSent] = useState(false);

  if (!isOpen) return null;

  const currentPlan = PRICING_PLANS.find(p => p.id === selectedPlanId) || PRICING_PLANS[1];

  const handleCopy = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleConfirmTransfer = () => {
    const message = `Hola DirectorioPY 🇵🇾, acabo de realizar la transferencia bancaria por SIPAP para activar el ${currentPlan.name} (${currentPlan.priceGs}). Adjunto mi comprobante para la verificación.`;
    const waUrl = `https://wa.me/${formatWhatsAppNumber(BANK_TRANSFER_DETAILS.contactWhatsApp)}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
    setReceiptSent(true);
  };

  return (
    <div className="modal-overlay animate-fadeIn" onClick={onClose}>
      <div
        className="glass-panel w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[#060B17] border border-amber-500/30 p-6 sm:p-8 space-y-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <XIcon className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold uppercase tracking-wider border border-amber-500/20">
            <SparklesIcon className="w-4 h-4 text-amber-400" />
            <span>Pago Seguro Local 🇵🇾</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Suscripción & Transferencia SIPAP
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
            Activá tu perfil destacado en DirectorioPY abonando vía transferencia bancaria directa (SIPAP) en Guaraníes sin comisiones de plataforma.
          </p>
        </div>


        {/* Selected Plan Details & Bank Transfer Details */}
        {selectedPlanId !== 'gratuito' ? (
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-6">
            
            {/* Plan Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">Plan Seleccionado:</span>
                <h3 className="text-xl font-bold text-white">{currentPlan.name} — <span className="text-amber-400">{currentPlan.priceGs}</span></h3>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-bold shrink-0">
                <ShieldCheckIcon className="w-3.5 h-3.5" />
                <span>Verificación SIPAP</span>
              </span>
            </div>

            {/* Bank Details */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Datos para Transferencia SIPAP / Alias:</h4>
                <span className="text-[11px] text-slate-400">Banco Atlas • Itaú • Continental • Sudameris • BNF • Basa • GNB</span>
              </div>
              
              <div className="space-y-2.5 text-xs">
                  
                {/* Alias SIPAP Highlight */}
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Alias SIPAP Preferido (CI / RUC)</div>
                    <div className="font-mono font-extrabold text-white text-base sm:text-lg">{BANK_TRANSFER_DETAILS.aliasSIPAP}</div>
                  </div>
                  <button
                    onClick={() => handleCopy(BANK_TRANSFER_DETAILS.aliasSIPAP, 'alias')}
                    className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs shadow transition-colors cursor-pointer shrink-0"
                  >
                    {copiedField === 'alias' ? '¡Copiado! ✓' : 'Copiar Alias'}
                  </button>
                </div>

                {/* Bank & Account Number */}
                <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-slate-400 text-[10px] uppercase font-semibold">Banco & N° de Cuenta</div>
                    <div className="font-mono font-bold text-white text-sm">{BANK_TRANSFER_DETAILS.bankName} — {BANK_TRANSFER_DETAILS.accountNumber}</div>
                  </div>
                  <button
                    onClick={() => handleCopy(`${BANK_TRANSFER_DETAILS.bankName} ${BANK_TRANSFER_DETAILS.accountNumber}`, 'acc')}
                    className="text-xs text-blue-400 font-semibold px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 transition-colors cursor-pointer shrink-0"
                  >
                    {copiedField === 'acc' ? 'Copiado ✓' : 'Copiar'}
                  </button>
                </div>

                {/* Titular & RUC */}
                <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-slate-400 text-[10px] uppercase font-semibold">Titular / RUC</div>
                    <div className="font-bold text-white text-sm">{BANK_TRANSFER_DETAILS.accountHolder} ({BANK_TRANSFER_DETAILS.ruc})</div>
                  </div>
                  <button
                    onClick={() => handleCopy(`${BANK_TRANSFER_DETAILS.accountHolder} RUC ${BANK_TRANSFER_DETAILS.ruc}`, 'holder')}
                    className="text-xs text-blue-400 font-semibold px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 transition-colors cursor-pointer shrink-0"
                  >
                    {copiedField === 'holder' ? 'Copiado ✓' : 'Copiar'}
                  </button>
                </div>

              </div>
            </div>

            {/* WhatsApp Receipt Confirmation */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Paso final — Enviar Comprobante SIPAP:</h4>
              
              <div className="p-4 sm:p-5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-3.5 text-center">
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  Una vez realizada la transferencia, abrí nuestro WhatsApp y <strong className="text-white">adjuntá la captura de tu comprobante</strong> en el chat para activar tu plan:
                </p>

                <button
                  onClick={handleConfirmTransfer}
                  className="btn-whatsapp-official w-full py-3.5 sm:py-4 px-5 text-sm sm:text-base font-extrabold flex items-center justify-center gap-2.5 rounded-xl shadow-lg shadow-emerald-500/35 hover:scale-[1.01] transition-all cursor-pointer"
                >
                  <WhatsAppIcon className="w-5 h-5 shrink-0" />
                  <span>Enviar Comprobante por WhatsApp</span>
                </button>

                <p className="text-[11px] text-emerald-300/80 font-medium">
                  ⚡ Validación y activación rápida el mismo día • Sin comisiones
                </p>
              </div>
            </div>

          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-3">
            <h3 className="text-lg font-bold text-white">Has seleccionado el Plan Gratuito</h3>
            <p className="text-xs text-slate-300">
              Tu comercio figurará en las búsquedas locales sin costo. Podrás solicitar tu insignia de Comercio Verificado en cualquier momento.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs"
            >
              Aceptar
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

