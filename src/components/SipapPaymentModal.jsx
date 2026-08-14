import React, { useState } from 'react';
import { XIcon, CreditCardIcon, WhatsAppIcon, CheckCircleIcon, UploadIcon, SparklesIcon, ShieldCheckIcon } from './Icons';
import { formatWhatsAppNumber } from '../utils/phoneUtils';
import { PRICING_PLANS, BANK_TRANSFER_DETAILS } from '../data/businesses';

export default function SipapPaymentModal({ isOpen, onClose, selectedPlanId = 'pro' }) {
  const [copiedField, setCopiedField] = useState(null);
  const [receiptFile, setReceiptFile] = useState(null);
  const [receiptSent, setReceiptSent] = useState(false);

  if (!isOpen) return null;

  const currentPlan = PRICING_PLANS.find(p => p.id === selectedPlanId) || PRICING_PLANS[1];

  const handleCopy = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleFileUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setReceiptFile(e.target.files[0]);
    }
  };

  const handleConfirmTransfer = () => {
    const message = `Hola DirectorioPY 🇵🇾, acabo de realizar la transferencia bancaria por SIPAP para activar el ${currentPlan.name} (${currentPlan.priceGs}). Adjunto mi comprobante para la verificación.`;
    const waUrl = `https://wa.me/${formatWhatsAppNumber(BANK_TRANSFER_DETAILS.contactWhatsApp)}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
    setReceiptSent(true);
  };

  // QR Code SVG Representation for Paraguayan SIPAP / Bancard / Alias
  const qrSvgDataUri = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="%23FFFFFF"><rect width="100" height="100" fill="%230F172A"/><rect x="10" y="10" width="25" height="25" fill="%23F59E0B"/><rect x="15" y="15" width="15" height="15" fill="%230F172A"/><rect x="65" y="10" width="25" height="25" fill="%23F59E0B"/><rect x="70" y="15" width="15" height="15" fill="%230F172A"/><rect x="10" y="65" width="25" height="25" fill="%23F59E0B"/><rect x="15" y="70" width="15" height="15" fill="%230F172A"/><rect x="40" y="10" width="15" height="15" fill="%233B82F6"/><rect x="40" y="40" width="20" height="20" fill="%2310B981"/><rect x="65" y="65" width="25" height="25" fill="%23F59E0B"/><path d="M 40 65 h 15 v 15 h -15 Z" fill="%233B82F6"/></svg>`;

  return (
    <div className="modal-overlay animate-fadeIn" onClick={onClose}>
      <div
        className="glass-panel w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[#060B17] border border-amber-500/30 p-6 sm:p-8 space-y-6 relative"
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
            Monetización & Pago Local 🇵🇾
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
                <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">Plan Activo:</span>
                <h3 className="text-xl font-bold text-white">{currentPlan.name} — <span className="text-amber-400">{currentPlan.priceGs}</span></h3>
              </div>
              <span className="badge badge-verified">
                ✔️ Verificación SIPAP
              </span>
            </div>

            {/* Bank Details & QR Code Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              
              {/* QR Code Card */}
              <div className="md:col-span-1 p-4 rounded-2xl bg-slate-950 border border-amber-500/30 text-center space-y-2">
                <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">QR SIPAP Express</div>
                <div className="p-2 bg-slate-900 rounded-xl inline-block border border-slate-800">
                  <img src={qrSvgDataUri} alt="QR SIPAP DirectorioPY" className="w-32 h-32 rounded mx-auto" />
                </div>
                <p className="text-[11px] text-slate-400">
                  Escaneá desde tu App bancaria en Paraguay (Continental, Sudameris, Itaú, Ueno)
                </p>
              </div>

              {/* Bank Details text */}
              <div className="md:col-span-2 space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Datos para Transferencia Manual / Alias:</h4>
                
                <div className="space-y-2 text-xs">
                  
                  {/* Alias SIPAP Highlight */}
                  <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-amber-400 font-bold uppercase">Alias SIPAP Preferido</div>
                      <div className="font-mono font-extrabold text-white text-sm">{BANK_TRANSFER_DETAILS.aliasSIPAP}</div>
                    </div>
                    <button
                      onClick={() => handleCopy(BANK_TRANSFER_DETAILS.aliasSIPAP, 'alias')}
                      className="px-3 py-1.5 rounded-lg bg-amber-500 text-black font-extrabold text-xs shadow hover:bg-amber-400"
                    >
                      {copiedField === 'alias' ? '¡Copiado!' : 'Copiar Alias'}
                    </button>
                  </div>

                  {/* Bank & Account Number */}
                  <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between">
                    <div>
                      <div className="text-slate-400 text-[10px]">Banco & N° de Cuenta</div>
                      <div className="font-mono font-bold text-white">{BANK_TRANSFER_DETAILS.bankName} — {BANK_TRANSFER_DETAILS.accountNumber}</div>
                    </div>
                    <button
                      onClick={() => handleCopy(`${BANK_TRANSFER_DETAILS.bankName} ${BANK_TRANSFER_DETAILS.accountNumber}`, 'acc')}
                      className="text-[10px] text-blue-400 font-semibold px-2 py-1 rounded bg-blue-500/10 hover:bg-blue-500/20"
                    >
                      {copiedField === 'acc' ? 'Copiado ✓' : 'Copiar'}
                    </button>
                  </div>

                  {/* Titular & RUC */}
                  <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between">
                    <div>
                      <div className="text-slate-400 text-[10px]">Titular / RUC</div>
                      <div className="font-bold text-white">{BANK_TRANSFER_DETAILS.accountHolder} ({BANK_TRANSFER_DETAILS.ruc})</div>
                    </div>
                    <button
                      onClick={() => handleCopy(`${BANK_TRANSFER_DETAILS.accountHolder} RUC ${BANK_TRANSFER_DETAILS.ruc}`, 'holder')}
                      className="text-[10px] text-blue-400 font-semibold px-2 py-1 rounded bg-blue-500/10 hover:bg-blue-500/20"
                    >
                      {copiedField === 'holder' ? 'Copiado ✓' : 'Copiar'}
                    </button>
                  </div>

                </div>
              </div>

            </div>

            {/* Receipt Attachment & Confirmation */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Enviar Comprobante SIPAP:</h4>
              
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 space-y-3 text-center">
                <label className="cursor-pointer block border-2 border-dashed border-slate-600 hover:border-blue-500 p-4 rounded-xl transition-colors">
                  <UploadIcon className="w-6 h-6 text-blue-400 mx-auto mb-1" />
                  <span className="text-xs font-semibold text-slate-300">
                    {receiptFile ? `Comprobante adjunto: ${receiptFile.name}` : 'Adjuntar foto o PDF del comprobante SIPAP'}
                  </span>
                  <input type="file" onChange={handleFileUpload} accept="image/*,application/pdf" className="hidden" />
                </label>

                <button
                  onClick={handleConfirmTransfer}
                  className="btn-whatsapp pulse-wa w-full py-3.5 text-sm font-bold flex items-center justify-center gap-2 rounded-xl"
                >
                  <WhatsAppIcon className="w-5 h-5" />
                  <span>Enviar Comprobante por WhatsApp para Activación Inmediata</span>
                </button>
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
