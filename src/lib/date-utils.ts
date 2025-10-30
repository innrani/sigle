
 * Formats a date string to Brazilian date format (DD/MM/YYYY)
 * @param date - Date string or Date object
 * @returns Formatted date string
 */
export function formatDateBR(date: string | Date): string {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

/**
 * Formats a date string to Brazilian date and time format (DD/MM/YYYY HH:mm)
 * @param date - Date string or Date object
 * @returns Formatted date and time string
 */
export function formatDateTimeBR(date: string | Date): string {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Checks if a date is valid
 * @param date - Date string or Date object
 * @returns boolean indicating if the date is valid
 */
export function isValidDate(date: string | Date): boolean {
  if (!date) return false;
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return !isNaN(dateObj.getTime());
}