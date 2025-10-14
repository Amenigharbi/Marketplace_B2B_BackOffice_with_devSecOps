// utils/dateFormatter.ts
export const formatDate = (date: Date | string | null | undefined): string => {
  if (!date) return "-";

  try {
    const dateObj = new Date(date);
    return isNaN(dateObj.getTime())
      ? "-"
      : dateObj.toLocaleDateString("fr-FR", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
  } catch {
    return "-";
  }
};
