'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ClaimModal from '@/components/ClaimModal';
import SipapPaymentModal from '@/components/SipapPaymentModal';
import CookieBanner from '@/components/CookieBanner';
import { supabase } from '@/config/supabase';
import { usePathname } from 'next/navigation';
import { Analytics } from '@vercel/analytics/react';

export default function ClientLayout({ children }) {
  const [theme, setTheme] = useState('dark');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [initialPlanForAdd, setInitialPlanForAdd] = useState('gratuito');
  const [selectedPlanForPayment, setSelectedPlanForPayment] = useState(null);

  const pathname = usePathname();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else {
      document.documentElement.classList.add('dark');
    }

    const handleOpenPayment = (e) => {
      const planId = e.detail || 'pro';
      setSelectedPlanForPayment(planId);
      setIsPricingModalOpen(true);
    };

    const handleOpenAdd = (e) => {
      const planId = e.detail || 'gratuito';
      setInitialPlanForAdd(planId);
      setIsAddModalOpen(true);
    };

    window.addEventListener('openPaymentModal', handleOpenPayment);
    window.addEventListener('openAddModal', handleOpenAdd);

    return () => {
      window.removeEventListener('openPaymentModal', handleOpenPayment);
      window.removeEventListener('openAddModal', handleOpenAdd);
    };
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const handleOpenAddModal = (planId = 'gratuito') => {
    setInitialPlanForAdd(planId);
    setIsAddModalOpen(true);
  };

  const handleOpenPlanPayment = (planId) => {
    setSelectedPlanForPayment(planId);
    setIsPricingModalOpen(true);
  };

  const handleAddBusiness = async (newBusinessObj) => {
    try {
      const cleanWa = (newBusinessObj.whatsappNumber || '').replace(/\D/g, '');
      const normalizedName = (newBusinessObj.name || '').trim();
      const city = newBusinessObj.city || 'asuncion';

      let existingMatch = null;

      // 1. Verificar si ya existe por número de WhatsApp o Teléfono
      if (cleanWa && cleanWa.length >= 8) {
        const { data: byPhone } = await supabase
          .from('businesses')
          .select('id, name, city, plan, isVerified, reviews, rating, gallery, image')
          .or(`whatsappNumber.eq.${cleanWa},phone.ilike.%${cleanWa.slice(-8)}%`)
          .limit(1);

        if (byPhone && byPhone.length > 0) {
          existingMatch = byPhone[0];
        }
      }

      // 2. Verificar si ya existe por Nombre + Ciudad
      if (!existingMatch && normalizedName) {
        const { data: byName } = await supabase
          .from('businesses')
          .select('id, name, city, plan, isVerified, reviews, rating, gallery, image')
          .eq('city', city)
          .ilike('name', `%${normalizedName}%`)
          .limit(1);

        if (byName && byName.length > 0) {
          existingMatch = byName[0];
        }
      }

      if (existingMatch) {
        // ACTUALIZAR el registro existente sin duplicarlo
        const updatedPayload = {
          ...newBusinessObj,
          reviews: Math.max(existingMatch.reviews || 0, newBusinessObj.reviews || 1),
          rating: existingMatch.rating && existingMatch.rating > 0 ? existingMatch.rating : newBusinessObj.rating,
          isVerified: true, // Al ser reclamado o registrado por el dueño, queda verificado
        };

        const { error: updateError } = await supabase
          .from('businesses')
          .update(updatedPayload)
          .eq('id', existingMatch.id);

        if (updateError) {
          console.error('Error actualizando negocio existente en Supabase:', updateError);
          alert('Hubo un error al actualizar los datos del negocio.');
        } else {
          alert(`¡Perfil de "${newBusinessObj.name}" actualizado y verificado con éxito! Se sincronizaron los datos con tu ficha existente.`);
          setIsAddModalOpen(false);
          window.location.reload();
        }
      } else {
        // INSERTAR como nuevo comercio
        const { error: insertError } = await supabase.from('businesses').insert([newBusinessObj]);
        if (insertError) {
          console.error('Error insertando negocio en Supabase:', insertError);
          alert('Hubo un error al registrar el negocio. Revisa la consola.');
        } else {
          alert('¡Negocio registrado exitosamente! Ya está en vivo en el directorio.');
          setIsAddModalOpen(false);
          window.location.reload();
        }
      }
    } catch (err) {
      console.error('Error inesperado al guardar negocio:', err);
    }
  };

  const isAdminRoute = pathname === '/admin';
  const isLegalRoute = ['/privacidad', '/terminos', '/contacto'].includes(pathname);
  const showHeaderFooter = !isAdminRoute;

  return (
    <div className={`min-h-screen font-sans flex flex-col ${theme === 'dark' ? 'bg-[#060B14] text-slate-200' : 'bg-slate-50 text-slate-900'}`}>
      {showHeaderFooter && (
        <Header
          theme={theme}
          toggleTheme={toggleTheme}
          onOpenAddModal={() => handleOpenAddModal('gratuito')}
          onOpenPricingModal={() => {
            document.getElementById('planes-sipap')?.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      )}

      {children}

      {showHeaderFooter && (
        <Footer
          onSelectCategory={() => {}} // Will be handled on the index page via state or query params later
          onSelectCity={() => {}}
        />
      )}

      <CookieBanner />
      <Analytics />

      <ClaimModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSelectPlanForPayment={handleOpenPlanPayment}
        onAddBusiness={handleAddBusiness}
        initialPlan={initialPlanForAdd}
      />

      <SipapPaymentModal
        isOpen={isPricingModalOpen}
        onClose={() => setIsPricingModalOpen(false)}
        selectedPlanId={selectedPlanForPayment}
      />
    </div>
  );
}
