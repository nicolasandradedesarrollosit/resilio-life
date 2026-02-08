/**
 * Image file validation utilities
 * Provides reusable functions for validating and previewing image uploads
 */

// ============================================================
// CONSTANTS
// ============================================================

/**
 * Maximum file size: 5MB
 */
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

/**
 * Allowed image MIME types
 */
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
] as const;

/**
 * Human-readable list of allowed extensions
 */
export const ALLOWED_IMAGE_EXTENSIONS = "JPG, PNG, WEBP";

// ============================================================
// ERROR MESSAGES
// ============================================================

export const IMAGE_REQUIRED_ERROR = "La imagen es requerida";
export const IMAGE_SIZE_ERROR = "La imagen no debe superar los 5MB";
export const IMAGE_TYPE_ERROR = `Solo se permiten imágenes (${ALLOWED_IMAGE_EXTENSIONS})`;

// ============================================================
// VALIDATION RESULT TYPE
// ============================================================

export interface ImageValidationResult {
  isValid: boolean;
  errorMessage: string | null;
  file?: File;
}

// ============================================================
// VALIDATION FUNCTIONS
// ============================================================

/**
 * Validates an image file for size and type
 *
 * @param file - The File object to validate (or null/undefined)
 * @returns ImageValidationResult with validation status and error message
 *
 * @example
 * const result = validateImageFile(file);
 * if (!result.isValid) {
 *   setError(result.errorMessage);
 * }
 */
export function validateImageFile(
  file: File | null | undefined
): ImageValidationResult {
  // Check if file exists
  if (!file) {
    return {
      isValid: false,
      errorMessage: IMAGE_REQUIRED_ERROR,
    };
  }

  // Check file size
  if (file.size > MAX_IMAGE_SIZE) {
    return {
      isValid: false,
      errorMessage: IMAGE_SIZE_ERROR,
    };
  }

  // Check file type
  if (!ALLOWED_IMAGE_TYPES.includes(file.type as any)) {
    return {
      isValid: false,
      errorMessage: IMAGE_TYPE_ERROR,
    };
  }

  // Valid file
  return {
    isValid: true,
    errorMessage: null,
    file,
  };
}

/**
 * Creates a base64 preview URL from an image file using FileReader
 *
 * @param file - The File object to preview
 * @returns Promise that resolves with the base64 data URL
 *
 * @example
 * const preview = await createImagePreview(file);
 * setImagePreview(preview);
 */
export function createImagePreview(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      resolve(reader.result as string);
    };

    reader.onerror = () => {
      reject(new Error("Error al leer el archivo"));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Validates an image file and creates a preview if valid
 * Convenience function that combines validation and preview generation
 *
 * @param file - The File object to validate and preview
 * @returns Promise with validation result and preview URL (if valid)
 *
 * @example
 * const result = await validateAndPreviewImage(file);
 * if (result.isValid) {
 *   setImagePreview(result.previewUrl);
 * } else {
 *   setError(result.errorMessage);
 * }
 */
export async function validateAndPreviewImage(
  file: File | null | undefined
): Promise<ImageValidationResult & { previewUrl?: string }> {
  const validationResult = validateImageFile(file);

  if (!validationResult.isValid || !validationResult.file) {
    return validationResult;
  }

  try {
    const previewUrl = await createImagePreview(validationResult.file);
    return {
      ...validationResult,
      previewUrl,
    };
  } catch (error) {
    return {
      isValid: false,
      errorMessage: "Error al crear la vista previa de la imagen",
    };
  }
}
