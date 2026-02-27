import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { startOfWeek, endOfWeek, startOfYear, endOfYear, subWeeks, subYears, format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    weekday: 'short',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });
};

// Cycle logic: Month starts on the 25th of the previous month
// Example: Cycle 3/2026 starts Feb 25, 2026 and ends Mar 24, 2026
export const getCycleForDate = (date: Date) => {
  const d = new Date(date);
  const day = d.getDate();
  const month = d.getMonth(); // 0-11
  const year = d.getFullYear();

  if (day >= 25) {
    // Belongs to next month's cycle
    const nextMonth = new Date(year, month + 1, 1);
    return { month: nextMonth.getMonth() + 1, year: nextMonth.getFullYear() };
  } else {
    // Belongs to current month's cycle
    return { month: month + 1, year };
  }
};

export const getCycleRange = (month: number, year: number) => {
  // Cycle for Month M, Year Y
  // Starts: (M-1)/25/Y (handle year rollover)
  // Ends: M/24/Y
  
  // JS Month is 0-indexed. month input is 1-indexed.
  // Start date: 25th of previous month
  const startDate = new Date(year, month - 2, 25); 
  // End date: 24th of current month
  const endDate = new Date(year, month - 1, 24, 23, 59, 59, 999);

  return { startDate, endDate };
};

export const generateCycles = (count = 12) => {
  const cycles = [];
  const today = new Date();
  let { month, year } = getCycleForDate(today);

  for (let i = 0; i < count; i++) {
    const { startDate, endDate } = getCycleRange(month, year);
    cycles.push({
      month,
      year,
      type: 'cycle',
      label: `Kỳ Lương T${month}/${year}`,
      subLabel: `${format(startDate, 'dd/MM')} - ${format(endDate, 'dd/MM/yyyy')}`,
      value: `cycle-${year}-${month}`,
      startDate,
      endDate
    });

    // Move to previous month
    month--;
    if (month === 0) {
      month = 12;
      year--;
    }
  }
  return cycles;
};

export const generateTimeOptions = () => {
  const today = new Date();
  const options = [];

  // 1. Cycles (Default)
  options.push({
    label: 'Theo Kỳ Lương',
    options: generateCycles(6)
  });

  // 2. Weeks
  const thisWeekStart = startOfWeek(today, { weekStartsOn: 1 });
  const thisWeekEnd = endOfWeek(today, { weekStartsOn: 1 });
  const lastWeekStart = startOfWeek(subWeeks(today, 1), { weekStartsOn: 1 });
  const lastWeekEnd = endOfWeek(subWeeks(today, 1), { weekStartsOn: 1 });

  options.push({
    label: 'Theo Tuần',
    options: [
      {
        label: 'Tuần Này',
        subLabel: `${format(thisWeekStart, 'dd/MM')} - ${format(thisWeekEnd, 'dd/MM/yyyy')}`,
        value: 'week-this',
        startDate: thisWeekStart,
        endDate: thisWeekEnd,
        type: 'week'
      },
      {
        label: 'Tuần Trước',
        subLabel: `${format(lastWeekStart, 'dd/MM')} - ${format(lastWeekEnd, 'dd/MM/yyyy')}`,
        value: 'week-last',
        startDate: lastWeekStart,
        endDate: lastWeekEnd,
        type: 'week'
      }
    ]
  });

  // 3. Years
  const thisYearStart = startOfYear(today);
  const thisYearEnd = endOfYear(today);
  const lastYearStart = startOfYear(subYears(today, 1));
  const lastYearEnd = endOfYear(subYears(today, 1));

  options.push({
    label: 'Theo Năm',
    options: [
      {
        label: `Năm ${today.getFullYear()}`,
        subLabel: `01/01 - 31/12/${today.getFullYear()}`,
        value: 'year-this',
        startDate: thisYearStart,
        endDate: thisYearEnd,
        type: 'year'
      },
      {
        label: `Năm ${today.getFullYear() - 1}`,
        subLabel: `01/01 - 31/12/${today.getFullYear() - 1}`,
        value: 'year-last',
        startDate: lastYearStart,
        endDate: lastYearEnd,
        type: 'year'
      }
    ]
  });

  return options;
};

export const getMissingDates = (dates: string[]) => {
  if (dates.length < 2) return [];

  // Sort dates
  const sortedDates = [...dates].sort();
  const missingDates: string[] = [];

  // Iterate through sorted dates and find gaps
  for (let i = 0; i < sortedDates.length - 1; i++) {
    const current = new Date(sortedDates[i]);
    const next = new Date(sortedDates[i + 1]);

    // Calculate difference in days
    const diffTime = Math.abs(next.getTime() - current.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 1) {
      // There is a gap
      for (let j = 1; j < diffDays; j++) {
        const missingDate = new Date(current);
        missingDate.setDate(current.getDate() + j);
        missingDates.push(missingDate.toLocaleDateString('en-CA'));
      }
    }
  }

  return missingDates;
};
