import { format, addDays, nextDay, parseISO, setHours, setMinutes } from 'date-fns';
import { Category, Priority, RecurrenceType } from '../types';

export interface ParsedVoiceResult {
  type: 'task' | 'goal' | 'routine';
  title: string;
  rawText: string;
  date?: string; // YYYY-MM-DD
  time?: string; // HH:mm
  durationMinutes?: number;
  priority: Priority;
  categoryId: string;
  targetDate?: string; // for goals
  steps?: string[]; // for routines or task subtasks
  recurrenceType?: RecurrenceType; // for routines
}

export function parseVoiceInput(
  rawTranscript: string, 
  categories: Category[], 
  defaultCategoryId: string
): ParsedVoiceResult {
  const text = rawTranscript.trim();
  const lower = text.toLowerCase();

  // 1. Determine entity type
  let type: 'task' | 'goal' | 'routine' = 'task';
  if (
    lower.includes('objetivo') || 
    lower.includes('meta') || 
    lower.startsWith('nuevo objetivo') ||
    lower.includes('quiero lograr') ||
    lower.includes('para fin de año') ||
    lower.includes('para final de año')
  ) {
    type = 'goal';
  } else if (
    lower.includes('rutina') || 
    lower.includes('hábito') || 
    lower.includes('habito') || 
    lower.startsWith('nueva rutina') ||
    lower.includes('todos los días a las') ||
    lower.includes('cada mañana') ||
    lower.includes('cada noche')
  ) {
    type = 'routine';
  }

  // 2. Extract Date
  let date: string | undefined = undefined;
  const now = new Date();
  
  if (lower.includes('hoy') || lower.includes('para hoy')) {
    date = format(now, 'yyyy-MM-dd');
  } else if (lower.includes('pasado mañana') || lower.includes('pasadomañana')) {
    date = format(addDays(now, 2), 'yyyy-MM-dd');
  } else if (lower.includes('mañana')) {
    date = format(addDays(now, 1), 'yyyy-MM-dd');
  } else {
    // Check for days of week: "el lunes", "el martes", etc.
    const dayMap: Record<string, 0 | 1 | 2 | 3 | 4 | 5 | 6> = {
      domingo: 0,
      lunes: 1,
      martes: 2,
      miércoles: 3,
      miercoles: 3,
      jueves: 4,
      viernes: 5,
      sábado: 6,
      sabado: 6,
    };

    for (const [dayName, dayIndex] of Object.entries(dayMap)) {
      const dayRegex = new RegExp(`(?:el|este|próximo|proximo)\\s+${dayName}`, 'i');
      if (dayRegex.test(lower)) {
        date = format(nextDay(now, dayIndex), 'yyyy-MM-dd');
        break;
      }
    }

    // Check for relative days: "en 3 días", "en 5 dias"
    const inDaysMatch = lower.match(/en\s+(\d+)\s+d[ií]as/);
    if (inDaysMatch) {
      const daysToAdd = parseInt(inDaysMatch[1], 10);
      date = format(addDays(now, daysToAdd), 'yyyy-MM-dd');
    }

    // Check for relative weeks/months: "en 2 semanas", "en 1 mes"
    const inWeeksMatch = lower.match(/en\s+(\d+)\s+semanas?/);
    if (inWeeksMatch) {
      date = format(addDays(now, parseInt(inWeeksMatch[1], 10) * 7), 'yyyy-MM-dd');
    }
    const inMonthsMatch = lower.match(/en\s+(\d+)\s+mes(?:es)?/);
    if (inMonthsMatch) {
      date = format(addDays(now, parseInt(inMonthsMatch[1], 10) * 30), 'yyyy-MM-dd');
    }

    // Check for explicit dates: "el 15 de octubre", "el 3 de mayo"
    const monthsSpanish: Record<string, number> = {
      enero: 0, febrero: 1, marzo: 2, abril: 3, mayo: 4, junio: 5,
      julio: 6, agosto: 7, septiembre: 8, setiembre: 8, octubre: 9, noviembre: 10, diciembre: 11
    };
    const exactDateMatch = lower.match(/(?:el\s+)?(\d{1,2})\s+de\s+([a-záéíóú]+)(?:\s+de\s+(\d{4}))?/i);
    if (exactDateMatch) {
      const dayNum = parseInt(exactDateMatch[1], 10);
      const monthName = exactDateMatch[2].toLowerCase();
      const yearNum = exactDateMatch[3] ? parseInt(exactDateMatch[3], 10) : now.getFullYear();
      if (monthsSpanish[monthName] !== undefined && dayNum >= 1 && dayNum <= 31) {
        const monthNum = monthsSpanish[monthName];
        const targetD = new Date(yearNum, monthNum, dayNum);
        // If date already passed this year and no year was specified, assume next year
        if (!exactDateMatch[3] && targetD < now) {
          targetD.setFullYear(now.getFullYear() + 1);
        }
        date = format(targetD, 'yyyy-MM-dd');
      }
    }
  }

  // 3. Extract Time
  let time: string | undefined = undefined;
  
  // "a las 17:00", "a las 5", "a las 5:30", "a las 5 y media", "a las 8 de la tarde"
  const timeMatch = lower.match(/a\s+las?\s+(\d{1,2})(?::(\d{2})|\s+y\s+(media|cuarto))?(?:\s*(de la mañana|de la tarde|de la noche|am|pm))?/i);
  if (timeMatch) {
    let hour = parseInt(timeMatch[1], 10);
    let minutes = 0;

    if (timeMatch[2]) {
      minutes = parseInt(timeMatch[2], 10);
    } else if (timeMatch[3] === 'media') {
      minutes = 30;
    } else if (timeMatch[3] === 'cuarto') {
      minutes = 15;
    }

    const period = (timeMatch[4] || '').toLowerCase();
    if ((period.includes('tarde') || period.includes('noche') || period.includes('pm')) && hour < 12) {
      hour += 12;
    } else if ((period.includes('mañana') || period.includes('am')) && hour === 12) {
      hour = 0;
    }

    if (hour >= 0 && hour <= 23 && minutes >= 0 && minutes <= 59) {
      time = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }
  } else if (lower.includes('al mediodía') || lower.includes('a mediodía')) {
    time = '13:00';
  } else if (lower.includes('por la mañana')) {
    time = '09:00';
  } else if (lower.includes('por la tarde')) {
    time = '17:00';
  } else if (lower.includes('por la noche')) {
    time = '20:30';
  }

  // 4. Extract Duration
  let durationMinutes: number | undefined = undefined;
  const durationMinMatch = lower.match(/(?:durante|por|de)?\s*(\d+)\s*(?:minutos?|mins?)/);
  if (durationMinMatch) {
    durationMinutes = parseInt(durationMinMatch[1], 10);
  } else {
    const durationHourMatch = lower.match(/(?:durante|por|de)?\s*(\d+(?:[.,]\d+)?)\s*horas?/);
    if (durationHourMatch) {
      durationMinutes = Math.round(parseFloat(durationHourMatch[1].replace(',', '.')) * 60);
    } else if (lower.includes('media hora')) {
      durationMinutes = 30;
    } else if (lower.includes('hora y media')) {
      durationMinutes = 90;
    }
  }

  // 5. Extract Priority
  let priority: Priority = 'normal';
  if (lower.includes('muy urgente') || lower.includes('urgente') || lower.includes('altísima prioridad')) {
    priority = 'urgent';
  } else if (lower.includes('importante') || lower.includes('prioridad alta') || lower.includes('prioridad: alta')) {
    priority = 'high';
  } else if (lower.includes('baja prioridad') || lower.includes('cuando pueda') || lower.includes('sin prisa')) {
    priority = 'low';
  }

  // 6. Extract Category
  let categoryId = defaultCategoryId;
  const categoryScores: Record<string, number> = {};

  categories.forEach(cat => {
    categoryScores[cat.id] = 0;
    const catNameLower = cat.name.toLowerCase();
    if (lower.includes(catNameLower)) categoryScores[cat.id] += 5;
  });

  // Keywords heuristics
  const keywordMap: Record<string, string[]> = {
    trabajo: ['reunión', 'reunion', 'informe', 'cliente', 'proyecto', 'oficina', 'jefe', 'email', 'correo', 'factura', 'empresa', 'presentación', 'presentacion'],
    salud: ['gimnasio', 'entrenar', 'ejercicio', 'médico', 'medico', 'cita médica', 'dentista', 'correr', 'pesas', 'dieta', 'pastilla', 'medicina', 'dormir'],
    personal: ['casa', 'comprar', 'supermercado', 'comida', 'limpiar', 'familia', 'mamá', 'papá', 'hijo', 'perro', 'veterinario', 'cena', 'fiesta'],
    finanzas: ['banco', 'pagar', 'transferencia', 'dinero', 'presupuesto', 'cuenta', 'alquiler', 'inversión', 'tarjeta'],
    formación: ['estudiar', 'leer', 'curso', 'libro', 'aprender', 'examen', 'universidad', 'clase', 'inglés', 'idioma'],
  };

  categories.forEach(cat => {
    const catName = cat.name.toLowerCase();
    for (const [key, words] of Object.entries(keywordMap)) {
      if (catName.includes(key)) {
        words.forEach(w => {
          if (lower.includes(w)) {
            categoryScores[cat.id] = (categoryScores[cat.id] || 0) + 3;
          }
        });
      }
    }
  });

  let bestCatId = defaultCategoryId;
  let maxScore = 0;
  for (const [catId, score] of Object.entries(categoryScores)) {
    if (score > maxScore) {
      maxScore = score;
      bestCatId = catId;
    }
  }
  if (maxScore > 0) {
    categoryId = bestCatId;
  }

  // 7. Extract Steps / Subtasks
  let steps: string[] | undefined = undefined;
  if (lower.includes('pasos:') || lower.includes('pasos') || lower.includes('subtareas:') || lower.includes('con los pasos') || lower.includes('con las subtareas')) {
    const stepsPart = text.split(/(?:pasos:|subtareas:|con los pasos:|con los pasos|con las subtareas:)/i)[1];
    if (stepsPart) {
      const rawSteps = stepsPart
        .split(/[,;\n]|(?:\s+y\s+)|(?:\s*-\s*)|(?:\s*\d+\.?\s+)/)
        .map(s => s.trim())
        .filter(s => s.length > 1);
      if (rawSteps.length > 0) {
        steps = rawSteps;
      }
    }
  }

  // 8. Extract Recurrence for routines
  let recurrenceType: RecurrenceType = 'daily';
  if (lower.includes('de lunes a viernes') || lower.includes('días laborables') || lower.includes('entre semana')) {
    recurrenceType = 'weekdays';
  } else if (lower.includes('semanal') || lower.includes('cada semana') || lower.includes('una vez por semana')) {
    recurrenceType = 'weekly';
  } else if (lower.includes('mensual') || lower.includes('cada mes')) {
    recurrenceType = 'monthly';
  }

  // 9. Clean Title
  let cleanTitle = text;

  // Remove command prefixes
  cleanTitle = cleanTitle.replace(/^(?:añadir|crear|apuntar|poner|añade|crea|apunta|pon)\s+(?:una?\s+)?(?:nueva?\s+)?(?:tarea|objetivo|rutina|hábito|habito|recordatorio)?(?:\s+para|\s+de)?/i, '');
  cleanTitle = cleanTitle.replace(/^(?:nuevo\s+objetivo|nueva\s+rutina|nueva\s+tarea)[:\s]*/i, '');
  cleanTitle = cleanTitle.replace(/^(?:recuérdame|recuerdame|tengo que|debo)\s+/i, '');

  // Remove steps section from title
  if (steps && steps.length > 0) {
    cleanTitle = cleanTitle.split(/(?:pasos:|subtareas:|con los pasos|con las subtareas)/i)[0];
  }

  // Remove time phrases from title
  cleanTitle = cleanTitle.replace(/a\s+las?\s+\d{1,2}(?::\d{2}|\s+y\s+(?:media|cuarto))?(?:\s*(?:de la mañana|de la tarde|de la noche|am|pm))?/gi, '');
  cleanTitle = cleanTitle.replace(/(?:al|a)\s+mediodía/gi, '');
  cleanTitle = cleanTitle.replace(/por\s+la\s+(?:mañana|tarde|noche)/gi, '');

  // Remove date phrases from title
  cleanTitle = cleanTitle.replace(/(?:para\s+)?(?:hoy|mañana|pasado\s+mañana)/gi, '');
  cleanTitle = cleanTitle.replace(/(?:para\s+)?(?:el\s+|este\s+|próximo\s+|proximo\s+)?(?:lunes|martes|miércoles|miercoles|jueves|viernes|sábado|sabado|domingo)/gi, '');
  cleanTitle = cleanTitle.replace(/(?:para\s+)?(?:el\s+)?\d{1,2}\s+de\s+[a-záéíóú]+(?:\s+de\s+\d{4})?/gi, '');
  cleanTitle = cleanTitle.replace(/(?:para\s+)?en\s+\d+\s+(?:días|dias|semanas|meses)/gi, '');
  cleanTitle = cleanTitle.replace(/(?:para\s+)?(?:fin|final)\s+de\s+año/gi, '');

  // Remove duration phrases from title
  cleanTitle = cleanTitle.replace(/(?:durante|por|de)\s+\d+(?:[.,]\d+)?\s*(?:minutos?|mins?|horas?)/gi, '');
  cleanTitle = cleanTitle.replace(/(?:durante|por)\s+(?:media\s+hora|hora\s+y\s+media)/gi, '');

  // Remove priority phrases
  cleanTitle = cleanTitle.replace(/(?:urgente|muy\s+urgente|prioridad\s+alta|prioridad\s+baja|importante)/gi, '');

  // Clean extra spaces and punctuation
  cleanTitle = cleanTitle.replace(/^[\s,.:;—-]+|[\s,.:;—-]+$/g, '').trim();

  // Capitalize first letter
  if (cleanTitle.length > 0) {
    cleanTitle = cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1);
  } else {
    cleanTitle = text.charAt(0).toUpperCase() + text.slice(1);
  }

  // Default targetDate for goals if not set
  let targetDate = date;
  if (type === 'goal' && !targetDate) {
    targetDate = format(addDays(now, 90), 'yyyy-MM-dd'); // 3 months default for goal
  }

  return {
    type,
    title: cleanTitle,
    rawText: text,
    date: type === 'task' ? (date || format(now, 'yyyy-MM-dd')) : undefined,
    time: time || (type === 'routine' ? '08:00' : undefined),
    durationMinutes,
    priority,
    categoryId,
    targetDate: type === 'goal' ? targetDate : undefined,
    steps,
    recurrenceType: type === 'routine' ? recurrenceType : undefined,
  };
}
