/**
 * Password validation utility
 * Enforces strong password requirements:
 * - Minimum 8 characters
 * - At least 1 lowercase letter
 * - At least 1 uppercase letter
 * - At least 1 digit
 * - At least 1 special character
 */

export function validatePassword(password) {
  const errors = [];
  
  if (!password) {
    return { isValid: false, errors: ['Password is required'] };
  }
  
  if (password.length < 8) {
    errors.push('At least 8 characters');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('At least 1 lowercase letter');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('At least 1 uppercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('At least 1 digit');
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('At least 1 special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

export function getPasswordStrength(password) {
  if (!password) return 0;
  
  let strength = 0;
  
  if (password.length >= 8) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength++;
  
  return strength;
}
