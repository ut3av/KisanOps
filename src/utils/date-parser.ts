/**
 * Natural Language Date Parser for Hindi, Hinglish, and English dates
 * Uses 'Asia/Kolkata' timezone to calculate exact relative dates.
 */

export function parseAgriculturalDate(input: string | null | undefined): string | null {
  if (!input) return null;
  const raw = input.trim().toLowerCase();

  // If already an ISO date (YYYY-MM-DD)
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    return raw;
  }

  // Get current date in Asia/Kolkata
  const now = new Date();
  const kolkataDateStr = now.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' }); // 'YYYY-MM-DD'
  const [currentYear, currentMonth, currentDay] = kolkataDateStr.split('-').map(Number);
  const baseDate = new Date(Date.UTC(currentYear, currentMonth - 1, currentDay));

  const addDays = (days: number): string => {
    const target = new Date(baseDate);
    target.setUTCDate(target.getUTCDate() + days);
    return target.toISOString().slice(0, 10);
  };

  // Today
  if (
    raw.includes('आज') ||
    raw.includes('aaj') ||
    raw.includes('today') ||
    raw.includes('current')
  ) {
    return addDays(0);
  }

  // Tomorrow
  if (
    raw.includes('कल') ||
    raw.includes('kal') ||
    raw.includes('tomorrow')
  ) {
    // If not "kal parso" or "parso"
    if (!raw.includes('परसों') && !raw.includes('parso')) {
      return addDays(1);
    }
  }

  // Day after tomorrow (परसों)
  if (
    raw.includes('परसों') ||
    raw.includes('parso') ||
    raw.includes('parson') ||
    raw.includes('day after tomorrow')
  ) {
    return addDays(2);
  }

  // N days later (e.g., "2 दिन बाद", "दो दिन बाद", "3 din baad")
  const numDaysMatch = raw.match(/(\d+|दो|तीन|चार|पांच|do|teen|char|panch)\s*(दिन|din|days?)\s*(बाद|baad|later)?/);
  if (numDaysMatch) {
    const token = numDaysMatch[1];
    let days = 0;
    if (token === 'दो' || token === 'do') days = 2;
    else if (token === 'तीन' || token === 'teen') days = 3;
    else if (token === 'चार' || token === 'char') days = 4;
    else if (token === 'पांच' || token === 'panch') days = 5;
    else days = parseInt(token, 10) || 0;

    if (days > 0) return addDays(days);
  }

  // Weekdays (सोमवार, मंगलवार, बुधवार, गुरुवार/बृहस्पतिवार, शुक्रवार, शनिवार, रविवार)
  const weekdays: Record<string, number> = {
    'सोमवार': 1, 'somwar': 1, 'monday': 1,
    'मंगलवार': 2, 'mangalwar': 2, 'tuesday': 2,
    'बुधवार': 3, 'budhwar': 3, 'wednesday': 3,
    'गुरुवार': 4, 'g गुरुवार': 4, 'guruwar': 4, 'brihaspatiwar': 4, 'thursday': 4,
    'शुक्रवार': 5, 'shukrawar': 5, 'friday': 5,
    'शनिवार': 6, 'shaniwar': 6, 'saturday': 6,
    'रविवार': 7, 'itwar': 7, 'ravivar': 7, 'sunday': 7,
  };

  for (const [dayName, targetDayNum] of Object.entries(weekdays)) {
    if (raw.includes(dayName)) {
      const currentDayOfWeek = baseDate.getUTCDay() || 7; // 1 (Mon) to 7 (Sun)
      let diff = targetDayNum - currentDayOfWeek;
      if (diff <= 0 || raw.includes('अगले') || raw.includes('next') || raw.includes('agle')) {
        diff += 7;
      }
      return addDays(diff);
    }
  }

  return null;
}
