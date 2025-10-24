// Date and time formatting utilities

export const formatDate = (date: Date): string => {
  const days = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];
  const dayName = days[date.getDay()];
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${dayName}. ${day}/${month}`;
};

export const formatTime = (date: Date): string => {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

// Format date as DD/MM/YYYY
export const formatDateBR = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

// Calculate warranty end date (adds months to a date)
export const addMonthsToDate = (date: Date | string, months: number): Date => {
  const d = typeof date === 'string' ? new Date(date) : new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
};

// Calculate warranty end date string
export const calculateWarrantyEndDate = (startDate: string | Date, months: number = 3): string => {
  const endDate = addMonthsToDate(startDate, months);
  return endDate.toISOString();
};

// Check if warranty is still valid
export const isWarrantyValid = (warrantyEndDate: string | Date): boolean => {
  const endDate = typeof warrantyEndDate === 'string' ? new Date(warrantyEndDate) : warrantyEndDate;
  return new Date() < endDate;
};

// Get days remaining in warranty
export const getDaysRemainingInWarranty = (warrantyEndDate: string | Date): number => {
  const endDate = typeof warrantyEndDate === 'string' ? new Date(warrantyEndDate) : warrantyEndDate;
  const today = new Date();
  const diffTime = endDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
};