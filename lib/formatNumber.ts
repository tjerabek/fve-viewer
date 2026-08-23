export function formatNumber(number?: number, digits?: number) {
  if (number == null) {
    return number;
  }
  return number.toLocaleString("cs-CZ", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}
