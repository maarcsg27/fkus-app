import { format, isToday, isTomorrow, isYesterday, differenceInDays, parseISO, startOfWeek, endOfWeek, eachDayOfInterval, addDays, subDays } from 'date-fns';
import { es } from 'date-fns/locale';

export const formatDateSpanish = (dateStr: string): string => {
  try {
    const d = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
    return format(d, "EEEE, d 'de' MMMM", { locale: es });
  } catch {
    return dateStr;
  }
};

export const formatShortDateSpanish = (dateStr: string): string => {
  try {
    const d = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
    return format(d, "d MMM", { locale: es });
  } catch {
    return dateStr;
  }
};

export const getRelativeDateLabel = (dateStr?: string): string => {
  if (!dateStr) return 'Sin fecha (Inbox)';
  try {
    const d = parseISO(dateStr);
    if (isToday(d)) return 'Hoy';
    if (isTomorrow(d)) return 'Mañana';
    if (isYesterday(d)) return 'Ayer';
    return format(d, "d 'de' MMMM", { locale: es });
  } catch {
    return dateStr;
  }
};

export const getDaysRemaining = (targetDateStr: string): { days: number; label: string; isPast: boolean } => {
  try {
    const target = parseISO(targetDateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);
    
    const diff = differenceInDays(target, today);
    if (diff < 0) {
      return { days: Math.abs(diff), label: `Venció hace ${Math.abs(diff)} días`, isPast: true };
    }
    if (diff === 0) {
      return { days: 0, label: 'Hoy es la fecha objetivo', isPast: false };
    }
    if (diff === 1) {
      return { days: 1, label: 'Queda 1 día', isPast: false };
    }
    return { days: diff, label: `Quedan ${diff} días`, isPast: false };
  } catch {
    return { days: 0, label: 'Fecha objetivo', isPast: false };
  }
};

export const checkIsOverdue = (dateStr?: string, status?: string): boolean => {
  if (!dateStr || status === 'completed') return false;
  try {
    const target = parseISO(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);
    return target < today;
  } catch {
    return false;
  }
};

export const getWeekDays = (referenceDate: Date = new Date()) => {
  const start = startOfWeek(referenceDate, { weekStartsOn: 1 }); // Monday
  const end = endOfWeek(referenceDate, { weekStartsOn: 1 });
  return eachDayOfInterval({ start, end });
};

export const getTodayString = () => format(new Date(), 'yyyy-MM-dd');
export const getTomorrowString = () => format(addDays(new Date(), 1), 'yyyy-MM-dd');
export const getYesterdayString = () => format(subDays(new Date(), 1), 'yyyy-MM-dd');
