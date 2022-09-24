const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

export const formatDateWithMonthString = (
  d: Date | string | number | null,
): string => {
  // eslint-disable-next-line no-param-reassign
  d = new Date(d ?? 0);
  if (Number.isNaN(d.getTime()) || d.getTime() <= 0) return '-';
  const year = d.getFullYear();
  const date = d.getDate() < 10 ? `0${d.getDate()}` : d.getDate();
  const monthIndex = d.getMonth();
  const month = months[monthIndex];
  return `${date} ${month.slice(0, 3)} ${year}`;
};

export const formatDate = (d: Date | string | number | null): string => {
  // eslint-disable-next-line no-param-reassign
  d = new Date(d ?? 0);
  if (Number.isNaN(d.getTime()) || d.getTime() <= 0) return '-';
  const year = d.getFullYear();
  const date = d.getDate() < 10 ? `0${d.getDate()}` : d.getDate();
  const month = d.getMonth() < 10 ? `0${d.getMonth()}` : d.getMonth();
  return `${year}-${month}-${date}`;
};
