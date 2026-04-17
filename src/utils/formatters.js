export function formatCurrency(value) {
  return `$${Number(value || 0).toFixed(2)}`;
}

export function formatWholeNumber(value) {
  return Number(value || 0).toFixed(0);
}

export function formatOneDecimal(value) {
  return Number(value || 0).toFixed(1);
}

export function formatTwoDecimals(value) {
  return Number(value || 0).toFixed(2);
}