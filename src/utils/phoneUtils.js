export const formatWhatsAppNumber = (number) => {
  if (!number) return '';
  // Remove all non-numeric characters
  let cleaned = number.toString().replace(/\D/g, '');
  
  // If it starts with 0 (e.g. 0981123456), replace 0 with 595
  if (cleaned.startsWith('0')) {
    cleaned = '595' + cleaned.substring(1);
  } else if (!cleaned.startsWith('595')) {
    // If it doesn't start with 595 or 0, prepend 595
    cleaned = '595' + cleaned;
  }
  
  return cleaned;
};

export const getCleanBusinessName = (name) => {
  if (!name) return 'su negocio';
  return name.trim().replace(/[.,;:\-]+$/, '').trim();
};

export const getBusinessWhatsAppMessage = (business) => {
  if (!business) return '';

  const rawMsg = (business.whatsappDefaultMessage || '').trim();
  // Si tiene un mensaje personalizado que NO sea el texto legado de prospección/auditoría
  if (
    rawMsg &&
    !rawMsg.toLowerCase().includes('conversar sobre su perfil') &&
    !rawMsg.toLowerCase().includes('sobre su perfil')
  ) {
    return rawMsg;
  }

  const cleanName = getCleanBusinessName(business.name);
  const cat = (business.category || business.categoryId || '').toLowerCase();

  switch (cat) {
    case 'gastronomia':
      return `Hola ${cleanName}, los encontré en DirectorioPY y quisiera consultar su menú o hacer un pedido.`;
    case 'salud':
      return `Hola ${cleanName}, los encontré en DirectorioPY y quisiera consultar sobre turnos y atención.`;
    case 'oficios':
      return `Hola ${cleanName}, los encontré en DirectorioPY y quisiera consultar por un presupuesto o servicio.`;
    case 'agro':
      return `Hola ${cleanName}, los encontré en DirectorioPY y quisiera consultar sobre disponibilidad y cotizaciones.`;
    default:
      return `Hola ${cleanName}, los encontré en DirectorioPY y me gustaría hacerles una consulta.`;
  }
};
