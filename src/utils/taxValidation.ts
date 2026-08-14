/**
 * Tax Validation Utilities for GSTIN and PAN Cards
 * Based on Government Specifications:
 * - GSTIN: 15 Chars -> 2 Digits (State Code) + 10 Chars (PAN) + 1 Char (Entity) + 'Z' + 1 Char (Checksum)
 * - PAN: 10 Chars -> 3 Letters (Series) + 1 Letter (Status) + 1 Letter (Surname/Name) + 4 Digits + 1 Letter (Check Digit)
 */

export const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
export const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

export function validatePan(pan: string): ValidationResult {
  const cleanPan = pan.trim().toUpperCase();
  if (!cleanPan) {
    return { isValid: false, message: 'PAN Number is required' };
  }
  if (cleanPan.length !== 10) {
    return { isValid: false, message: 'PAN must be exactly 10 characters (e.g. AFZPK7190K)' };
  }
  if (!PAN_REGEX.test(cleanPan)) {
    return { isValid: false, message: 'Invalid PAN format. Must be 5 letters + 4 numbers + 1 letter' };
  }
  return { isValid: true };
}

export function validateGst(gst: string, pan?: string): ValidationResult {
  const cleanGst = gst.trim().toUpperCase();
  if (!cleanGst) {
    return { isValid: false, message: 'GST Number is required' };
  }
  if (cleanGst.length !== 15) {
    return { isValid: false, message: 'GSTIN must be exactly 15 characters (e.g. 22AAAAA0000A1Z5)' };
  }
  if (!GSTIN_REGEX.test(cleanGst)) {
    // Breakdown error message for user guidance
    if (!/^[0-9]{2}/.test(cleanGst)) {
      return { isValid: false, message: 'First 2 characters must be State Code digits (e.g. 22)' };
    }
    if (cleanGst.charAt(13) !== 'Z') {
      return { isValid: false, message: '14th character must be "Z" by default' };
    }
    return { isValid: false, message: 'Invalid GSTIN format (e.g. 22AAAAA0000A1Z5)' };
  }

  // Cross validate PAN embedded in GST (Chars 3 to 12)
  const panInGst = cleanGst.substring(2, 12);
  if (pan && pan.trim().length === 10 && pan.trim().toUpperCase() !== panInGst) {
    return { isValid: false, message: `GSTIN PAN portion (${panInGst}) does not match entered PAN (${pan.toUpperCase()})` };
  }

  return { isValid: true };
}
