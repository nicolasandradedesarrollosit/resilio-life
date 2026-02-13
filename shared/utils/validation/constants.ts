/**
 * Centralized validation regex patterns and error messages
 * Used across all form components for consistency
 */

// ============================================================
// EMAIL VALIDATION
// ============================================================

export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const EMAIL_ERROR_MESSAGE = "El email debe tener un formato válido";

// ============================================================
// PASSWORD VALIDATION
// ============================================================

/**
 * Password requirements:
 * - At least 8 characters
 * - At least one lowercase letter
 * - At least one uppercase letter
 * - At least one digit
 */
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

export const PASSWORD_ERROR_MESSAGE =
  "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número";

// ============================================================
// NAME VALIDATION (with Spanish accents)
// ============================================================

/**
 * Validates names with Spanish accent support
 * Minimum 2 characters
 */
export const NAME_REGEX = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,}$/;

export const NAME_ERROR_MESSAGE = "El nombre debe tener al menos 2 letras";

/**
 * Extended name validation (allows hyphens and apostrophes)
 * Minimum 3 characters
 */
export const NAME_EXTENDED_REGEX = /^[A-Za-záéíóúÁÉÍÓÚñÑ'\-\s]{3,}$/;

export const NAME_EXTENDED_ERROR_MESSAGE =
  "El nombre debe tener al menos 3 caracteres";

// ============================================================
// TEXT LENGTH VALIDATION
// ============================================================

/**
 * Short text (titles, business names)
 * Between 2-100 characters
 */
export const SHORT_TEXT_REGEX = /^.{2,100}$/;

export const SHORT_TEXT_ERROR_MESSAGE =
  "El texto debe tener entre 2 y 100 caracteres";

/**
 * Medium text (titles in events/benefits)
 * Between 3-100 characters
 */
export const TITLE_REGEX = /^.{3,100}$/;

export const TITLE_ERROR_MESSAGE =
  "El título debe tener entre 3 y 100 caracteres";

/**
 * Long text (descriptions)
 * Between 10-500 characters
 */
export const DESCRIPTION_REGEX = /^.{10,500}$/;

export const DESCRIPTION_ERROR_MESSAGE =
  "La descripción debe tener entre 10 y 500 caracteres";

/**
 * Generic message validation
 * Minimum 5 characters
 */
export const MESSAGE_REGEX = /^[\w\sáéíóúÁÉÍÓÚñÑ.,!?'"-]{5,}$/;

export const MESSAGE_ERROR_MESSAGE =
  "El mensaje debe tener al menos 5 caracteres";

/**
 * Long message validation
 * Minimum 10 characters
 */
export const LONG_MESSAGE_REGEX = /^[\w\sáéíóúÁÉÍÓÚñÑ.,!?'"()\-:\/\n\r]{10,}$/;

export const LONG_MESSAGE_ERROR_MESSAGE =
  "El mensaje debe tener al menos 10 caracteres";

// ============================================================
// URL VALIDATION
// ============================================================

/**
 * Validates HTTP/HTTPS URLs
 */
export const URL_REGEX = /^https?:\/\/.+/;

export const URL_ERROR_MESSAGE = "La URL debe comenzar con http:// o https://";

// ============================================================
// NUMERIC VALIDATION
// ============================================================

/**
 * Positive integers only (no leading zeros)
 * Used for points cost, IDs, etc.
 */
export const POSITIVE_INTEGER_REGEX = /^[1-9]\d*$/;

export const POSITIVE_INTEGER_ERROR_MESSAGE =
  "Debe ser un número entero positivo";

// ============================================================
// LOCATION VALIDATION
// ============================================================

/**
 * Location/address validation
 * Between 3-100 characters
 */
export const LOCATION_REGEX = /^.{3,100}$/;

export const LOCATION_ERROR_MESSAGE =
  "La ubicación debe tener entre 3 y 100 caracteres";

// ============================================================
// GENERIC REQUIRED FIELD
// ============================================================

export const REQUIRED_FIELD_ERROR_MESSAGE = "Este campo es requerido";
