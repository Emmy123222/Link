export const formatDate = (date: string | Date): string => {
  if (!date) return "N/A";

  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch (error) {
    return "Invalid date";
  }
};

export const formatCurrency = (amount: number): string => {
  if (typeof amount !== "number" || isNaN(amount)) return "£0.00";

  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatPercentage = (rate: number): string => {
  if (typeof rate !== "number" || isNaN(rate)) return "0%";

  // Convert tax rate to percentage (e.g., 1.2 becomes 20%)
  const percentage = (rate - 1) * 100;
  return `${percentage.toFixed(0)}%`;
};

/**
 * Removes elements with null or undefined values from arrays, objects, or nested structures
 * @param data - The data to clean (array, object, or primitive value)
 * @returns Cleaned data with null/undefined values removed
 */
export const removeNullish = <T>(data: T): T => {
  // Handle null/undefined input
  if (data === null || data === undefined) {
    return data;
  }

  // Handle arrays
  if (Array.isArray(data)) {
    return data
      .filter((item) => item !== null && item !== undefined && item !== "")
      .map((item) => removeNullish(item)) as T;
  }

  // Handle objects
  if (typeof data === "object") {
    const cleaned: any = {};
    for (const [key, value] of Object.entries(data)) {
      if (value !== null && value !== undefined && value !== "") {
        cleaned[key] = removeNullish(value);
      }
    }
    return cleaned as T;
  }

  // Return primitive values as-is
  return data;
};
