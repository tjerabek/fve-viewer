export function formatNumber(number?: number, digits?: number) {
  if (!number) {
    return number;
  }
  return number.toLocaleString("cs-CZ", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}
