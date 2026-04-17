export function sanitizeNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function clampMin(value, min, fallback = min) {
  return Math.max(min, sanitizeNumber(value, fallback));
}

export function clampRange(value, min, max, fallback = min) {
  const parsed = sanitizeNumber(value, fallback);
  return Math.min(max, Math.max(min, parsed));
}