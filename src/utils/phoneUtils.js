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
