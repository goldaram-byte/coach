export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getDayName = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { weekday: 'long' });
};

export const getWeekDates = (startDate: string, endDate: string) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const dates = [];

  let current = new Date(start);
  while (current <= end) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return dates;
};

export const calculateAge = (birthDate: string): number => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
};

export const formatDuration = (minutes?: number): string => {
  if (!minutes) return '—';
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

export const createYearPlan = (
  startDate: string,
  endDate: string,
  stages: { name: string; goals: string[] }[]
) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const months = [];
  let current = new Date(start);

  while (current <= end) {
    const monthNum = current.getMonth();
    const monthName = current.toLocaleDateString('en-US', { month: 'long' });

    months.push({
      number: monthNum + 1,
      name: monthName,
      start: new Date(current),
      end: new Date(current.getFullYear(), monthNum + 1, 0),
    });

    current.setMonth(current.getMonth() + 1);
  }

  return months;
};

export const getMonthsForYear = (year: number) => {
  const months = [];
  for (let i = 0; i < 12; i++) {
    const monthStart = new Date(year, i, 1);
    const monthEnd = new Date(year, i + 1, 0);
    months.push({
      number: i + 1,
      name: monthStart.toLocaleDateString('en-US', { month: 'long' }),
      start: monthStart,
      end: monthEnd,
    });
  }
  return months;
};

export const getWeeksForMonth = (year: number, month: number) => {
  const weeks = [];
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);

  let weekStart = new Date(firstDay);
  let weekNumber = 1;

  while (weekStart <= lastDay) {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    weeks.push({
      number: weekNumber,
      start: new Date(weekStart),
      end: new Date(Math.min(weekEnd.getTime(), lastDay.getTime())),
    });

    weekStart.setDate(weekStart.getDate() + 7);
    weekNumber++;
  }

  return weeks;
};

export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getInitials = (firstName: string, lastName: string): string => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

export const parseTimeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + (minutes || 0);
};

export const minutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
};

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};
