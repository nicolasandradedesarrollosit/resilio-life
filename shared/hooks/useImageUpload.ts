/**
 * Image upload and preview hook
 * Handles image file selection, validation, and preview generation
 */

import { useState, useCallback } from "react";
import { validateAndPreviewImage } from "@/shared/utils/validation";

export interface UseImageUploadOptions {
  onValidationError?: (error: string) => void;
  onSuccess?: (file: File, previewUrl: string) => void;
}

export interface UseImageUploadReturn {
  imageFile: File | null;
  imagePreview: string | null;
  isUploading: boolean;
  error: string | null;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleImageRemove: () => void;
  resetImage: () => void;
  setImagePreview: (url: string | null) => void;
  setImageFile: (file: File | null) => void;
}

/**
 * Custom hook for handling image uploads with validation and preview
 *
 * @example
 * const { imageFile, imagePreview, handleImageChange, error } = useImageUpload({
 *   onValidationError: (error) => console.error(error),
 * });
 */
export function useImageUpload(
  options: UseImageUploadOptions = {}
): UseImageUploadReturn {
  const { onValidationError, onSuccess } = options;

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Handles image file selection with validation and preview generation
   */
  const handleImageChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];

      setIsUploading(true);
      setError(null);

      try {
        const result = await validateAndPreviewImage(file);

        if (!result.isValid) {
          setImageFile(null);
          setImagePreview(null);
          setError(result.errorMessage);

          if (onValidationError) {
            onValidationError(result.errorMessage || "Error de validación");
          }

          return;
        }

        setImageFile(result.file!);
        setImagePreview(result.previewUrl!);
        setError(null);

        if (onSuccess) {
          onSuccess(result.file!, result.previewUrl!);
        }
      } catch (err) {
        const errorMessage = "Error al procesar la imagen";
        setError(errorMessage);
        setImageFile(null);
        setImagePreview(null);

        if (onValidationError) {
          onValidationError(errorMessage);
        }
      } finally {
        setIsUploading(false);
      }
    },
    [onValidationError, onSuccess]
  );

  /**
   * Removes the current image
   */
  const handleImageRemove = useCallback(() => {
    setImageFile(null);
    setImagePreview(null);
    setError(null);
  }, []);

  /**
   * Resets the image upload state
   */
  const resetImage = useCallback(() => {
    setImageFile(null);
    setImagePreview(null);
    setError(null);
    setIsUploading(false);
  }, []);

  return {
    imageFile,
    imagePreview,
    isUploading,
    error,
    handleImageChange,
    handleImageRemove,
    resetImage,
    setImagePreview,
    setImageFile,
  };
}
