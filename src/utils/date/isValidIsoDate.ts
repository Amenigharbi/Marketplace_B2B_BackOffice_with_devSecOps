export function isValidISODate(dateString: string) {
  // Regular expression to match both "YYYY-MM-DD" and full ISO 8601 format
  const isoDatePattern =
    /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}\.\d{3}(Z|[+-]\d{2}:\d{2}))?$/;

  // Check if the dateString matches the pattern
  if (!isoDatePattern.test(dateString)) {
    return false;
  }

  // Parse the date string to a Date object
  const date = new Date(dateString);

  // Check if the date is valid
  return date instanceof Date && !isNaN(Number(date));
}
