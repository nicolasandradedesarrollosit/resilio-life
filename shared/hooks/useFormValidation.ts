/**
 * Generic form validation hook
 * Manages validation state for form fields with optimized re-renders
 */

import { useState, useRef, useCallback } from "react";

export interface ValidationRule {
  pattern?: RegExp;
  validate?: (value: string) => boolean;
  errorMessage: string;
}

export type ValidationRules<T extends string> = Record<T, ValidationRule>;

export type ValidationState<T extends string> = Record<T, string | null>;

export interface UseFormValidationOptions<T extends string> {
  fields: readonly T[];
  rules: ValidationRules<T>;
  requiredFieldMessage?: string;
}

export interface UseFormValidationReturn<T extends string> {
  validations: ValidationState<T>;
  validateField: (field: T, value: string) => boolean;
  validateAllFields: (formData: Record<T, string>) => boolean;
  resetValidations: () => void;
  setFieldError: (field: T, error: string | null) => void;
  hasErrors: boolean;
  isFieldValid: (field: T) => boolean;
}

/**
 * Custom hook for managing form validation state
 *
 * @example
 * const { validations, validateField, validateAllFields } = useFormValidation({
 *   fields: ['email', 'password'] as const,
 *   rules: {
 *     email: { pattern: EMAIL_REGEX, errorMessage: EMAIL_ERROR_MESSAGE },
 *     password: { pattern: PASSWORD_REGEX, errorMessage: PASSWORD_ERROR_MESSAGE },
 *   },
 * });
 */
export function useFormValidation<T extends string>({
  fields,
  rules,
  requiredFieldMessage = "Este campo es requerido",
}: UseFormValidationOptions<T>): UseFormValidationReturn<T> {
  // Initialize validation state with null for all fields
  const initialState = fields.reduce((acc, field) => {
    acc[field] = null;

    return acc;
  }, {} as ValidationState<T>);

  const [validations, setValidations] =
    useState<ValidationState<T>>(initialState);
  const prevValidationsRef = useRef<ValidationState<T>>(initialState);

  /**
   * Validates a single field and updates validation state
   */
  const validateField = useCallback(
    (field: T, value: string): boolean => {
      // Check if field is empty
      if (!value || value.trim() === "") {
        const errorMessage = requiredFieldMessage;

        if (prevValidationsRef.current[field] !== errorMessage) {
          prevValidationsRef.current[field] = errorMessage;
          setValidations((prev) => ({ ...prev, [field]: errorMessage }));
        }

        return false;
      }

      const rule = rules[field];

      if (!rule) return true;

      // Validate using pattern or custom validation function
      const isValid = rule.pattern
        ? rule.pattern.test(value)
        : rule.validate
          ? rule.validate(value)
          : true;

      const errorMessage = isValid ? null : rule.errorMessage;

      // Only update state if validation result changed (optimization)
      if (prevValidationsRef.current[field] !== errorMessage) {
        prevValidationsRef.current[field] = errorMessage;
        setValidations((prev) => ({ ...prev, [field]: errorMessage }));
      }

      return isValid;
    },
    [rules, requiredFieldMessage],
  );

  /**
   * Validates all fields at once (useful for form submission)
   */
  const validateAllFields = useCallback(
    (formData: Record<T, string>): boolean => {
      let allValid = true;

      fields.forEach((field) => {
        const value = formData[field] || "";
        const isValid = validateField(field, value);

        if (!isValid) allValid = false;
      });

      return allValid;
    },
    [fields, validateField],
  );

  /**
   * Manually set error for a specific field
   */
  const setFieldError = useCallback((field: T, error: string | null) => {
    prevValidationsRef.current[field] = error;
    setValidations((prev) => ({ ...prev, [field]: error }));
  }, []);

  /**
   * Reset all validations to initial state
   */
  const resetValidations = useCallback(() => {
    prevValidationsRef.current = initialState;
    setValidations(initialState);
  }, [initialState]);

  /**
   * Check if there are any validation errors
   */
  const hasErrors = Object.values(validations).some((error) => error !== null);

  /**
   * Check if a specific field is valid
   */
  const isFieldValid = useCallback(
    (field: T): boolean => {
      return validations[field] === null;
    },
    [validations],
  );

  return {
    validations,
    validateField,
    validateAllFields,
    resetValidations,
    setFieldError,
    hasErrors,
    isFieldValid,
  };
}
