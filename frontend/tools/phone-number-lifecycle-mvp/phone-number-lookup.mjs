export function normalizePhoneNumber(value) {
  const raw = String(value || '').trim();
  if (!raw) return '';
  const digits = raw.replace(/\D+/g, '');
  if (!digits) return '';
  if (raw.startsWith('+')) return `+${digits}`;
  if (digits.startsWith('00')) return `+${digits.slice(2)}`;
  return digits;
}

export function lookupNumberRange(ranges, value, { marketId = null } = {}) {
  const normalized = normalizePhoneNumber(value);
  if (!normalized) return null;
  const candidates = (ranges || []).filter(range => {
    if (marketId && range.marketId !== marketId) return false;
    const prefix = normalizePhoneNumber(range.e164Prefix || '');
    if (!prefix) return false;
    return normalized.startsWith(prefix);
  }).sort((a, b) => normalizePhoneNumber(b.e164Prefix).length - normalizePhoneNumber(a.e164Prefix).length);
  if (!candidates.length) return null;
  const best = candidates[0];
  return {
    ...best,
    matchedNumber: normalized,
    portabilityNotice: best.portabilityNotice || 'Number-block allocation identifies the original allocation/number range. A ported number may currently be served by another provider.'
  };
}
