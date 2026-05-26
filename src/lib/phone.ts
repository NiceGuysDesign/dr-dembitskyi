const INTERNATIONAL_DIGIT_COUNT = 12;

/** All digits from masked value (e.g. +38 (063) 888 00 68 → 380638800688) */
export function extractPhoneDigits(value: string): string {
  return value.replace(/\D/g, "");
}

export function isCompleteUkrainianPhone(value: string): boolean {
  const digits = extractPhoneDigits(value);
  return (
    digits.length === INTERNATIONAL_DIGIT_COUNT && /^380\d{9}$/.test(digits)
  );
}

/** +380XXXXXXXXX */
export function toInternationalUkrainianPhone(value: string): string {
  const digits = extractPhoneDigits(value);
  if (!isCompleteUkrainianPhone(value)) {
    return "";
  }
  return `+${digits}`;
}
