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
      const { error } = await supabase.from('businesses').insert([newBusinessObj]);
      if (error) {
        console.error('Error insertando negocio en Supabase:', error);
        alert('Hubo un error al registrar el negocio. Revisa la consola.');
      } else {
        alert('¡Negocio registrado exitosamente! Ya está en vivo en el directorio.');
        setIsAddModalOpen(false);
      }
    } catch (err) {
      console.error('Error inesperado:', err);
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
