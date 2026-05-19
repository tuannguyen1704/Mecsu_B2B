/**
 * Validation utilities for forms
 */

// Email validation
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Phone validation (Vietnamese format)
export function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  // Vietnamese phones are 10 digits, starting with 0, 84, +84
  return /^(0|84|\+84)?[1-9]\d{8,9}$/.test(cleaned);
}

// Required field validation
export function isRequired(value: string): boolean {
  return value.trim().length > 0;
}

// Min length validation
export function hasMinLength(value: string, min: number): boolean {
  return value.trim().length >= min;
}

// Max length validation
export function hasMaxLength(value: string, max: number): boolean {
  return value.trim().length <= max;
}

// URL validation
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Tax code validation (Vietnamese format - 10 or 14 digits)
export function isValidTaxCode(taxCode: string): boolean {
  const cleaned = taxCode.replace(/\D/g, '');
  return /^\d{10}$|^\d{13}$/.test(cleaned);
}

// Province/District/Ward validation
export function isValidAddressSelection(
  province: string,
  district: string,
  ward: string
): boolean {
  return Boolean(province && district && ward);
}

// Validation result type
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

// Generic validation rule
export interface ValidationRule {
  validate: (value: any) => boolean;
  message: string;
}

// Create a validation rule
export function createRule(
  validate: (value: any) => boolean,
  message: string
): ValidationRule {
  return { validate, message };
}

// Validate a value against rules
export function validate(
  value: any,
  rules: ValidationRule[]
): ValidationResult {
  for (const rule of rules) {
    if (!rule.validate(value)) {
      return { isValid: false, error: rule.message };
    }
  }
  return { isValid: true };
}

// Common validation rules
export const ValidationRules = {
  required: (fieldName = 'Trường này') =>
    createRule(isRequired, `${fieldName} không được để trống`),

  email: createRule(
    (value) => !value || isValidEmail(value),
    'Email không hợp lệ'
  ),

  phone: createRule(
    (value) => !value || isValidPhone(value),
    'Số điện thoại không hợp lệ'
  ),

  minLength: (min: number, fieldName = 'Trường này') =>
    createRule(
      (value) => !value || hasMinLength(value, min),
      `${fieldName} phải có ít nhất ${min} ký tự`
    ),

  maxLength: (max: number, fieldName = 'Trường này') =>
    createRule(
      (value) => !value || hasMaxLength(value, max),
      `${fieldName} không được quá ${max} ký tự`
    ),

  taxCode: createRule(
    (value) => !value || isValidTaxCode(value),
    'Mã số thuế không hợp lệ (10 hoặc 13 chữ số)'
  ),

  url: createRule(
    (value) => !value || isValidUrl(value),
    'URL không hợp lệ'
  ),
};

// Form validation helper for multiple fields
export function validateForm<T extends Record<string, any>>(
  data: T,
  validationSchema: Record<keyof T, ValidationRule[]>
): Record<keyof T, string | undefined> {
  const errors: Partial<Record<keyof T, string>> = {};

  for (const field in validationSchema) {
    const rules = validationSchema[field];
    const result = validate(data[field], rules);
    if (!result.isValid) {
      errors[field] = result.error;
    }
  }

  return errors as Record<keyof T, string | undefined>;
}
