/**
 * Create benefit form business logic hook
 * Handles benefit creation with validation, image upload, API calls
 */

import { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";

import { useApi, useFormValidation, useImageUpload } from "@/shared/hooks";
import { addBenefit } from "@/features/benefits/benefitsSlice";
import {
  TITLE_REGEX,
  DESCRIPTION_REGEX,
  POSITIVE_INTEGER_REGEX,
  TITLE_ERROR_MESSAGE,
  DESCRIPTION_ERROR_MESSAGE,
  POSITIVE_INTEGER_ERROR_MESSAGE,
  REQUIRED_FIELD_ERROR_MESSAGE,
} from "@/shared/utils/validation";

interface BenefitFormFields {
  title: string;
  description: string;
  pointsCost: string;
}

type BenefitFieldName = keyof BenefitFormFields;

export interface UseCreateBenefitReturn {
  validations: Record<BenefitFieldName | "image", string | null>;
  isLoading: boolean;
  isActive: boolean;
  imageFile: File | null;
  imagePreview: string | null;
  setIsActive: (active: boolean) => void;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  resetForm: () => void;
}

/**
 * Custom hook for benefit creation form
 */
export function useCreateBenefit(onSuccess?: () => void): UseCreateBenefitReturn {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState<any>(null);
  const [isActive, setIsActive] = useState(true);

  // Form validation
  const {
    validations: fieldValidations,
    validateField,
    setFieldError,
    resetValidations,
  } = useFormValidation<BenefitFieldName>({
    fields: ["title", "description", "pointsCost"] as const,
    rules: {
      title: { pattern: TITLE_REGEX, errorMessage: TITLE_ERROR_MESSAGE },
      description: {
        pattern: DESCRIPTION_REGEX,
        errorMessage: DESCRIPTION_ERROR_MESSAGE,
      },
      pointsCost: {
        pattern: POSITIVE_INTEGER_REGEX,
        errorMessage: POSITIVE_INTEGER_ERROR_MESSAGE,
      },
    },
    requiredFieldMessage: REQUIRED_FIELD_ERROR_MESSAGE,
  });

  // Image upload
  const {
    imageFile,
    imagePreview,
    handleImageChange: handleImageUpload,
    resetImage,
  } = useImageUpload({
    onValidationError: (error) => {
      setImageValidation(error);
    },
    onSuccess: () => {
      setImageValidation(null);
    },
  });

  const [imageValidation, setImageValidation] = useState<string | null>(null);

  // API call
  const { loading: isLoading, data } = useApi({
    endpoint: "/benefits",
    method: "POST",
    includeCredentials: true,
    body: formData,
    enabled: formData !== null,
  });

  /**
   * Handle field change
   */
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;

      if (!value || value.trim() === "") {
        setFieldError(name as BenefitFieldName, REQUIRED_FIELD_ERROR_MESSAGE);
        return;
      }

      validateField(name as BenefitFieldName, value);
    },
    [validateField, setFieldError]
  );

  /**
   * Handle image change
   */
  const handleImageChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      await handleImageUpload(e);
    },
    [handleImageUpload]
  );

  /**
   * Reset form
   */
  const resetForm = useCallback(() => {
    resetValidations();
    resetImage();
    setImageValidation(null);
    setFormData(null);
    setIsActive(true);
  }, [resetValidations, resetImage]);

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const hasErrors = [
        ...Object.values(fieldValidations),
        imageValidation,
      ].some((error) => error !== null);

      if (hasErrors) return;

      if (!imageFile) {
        setImageValidation("La imagen es requerida");
        return;
      }

      const formDataObj = new FormData(e.currentTarget);
      formDataObj.append("image", imageFile);
      formDataObj.set("isActive", String(isActive));

      setFormData(formDataObj);
    },
    [fieldValidations, imageValidation, imageFile, isActive]
  );

  /**
   * Handle API success
   */
  useEffect(() => {
    if (data && data.data) {
      dispatch(addBenefit(data.data));
      resetForm();
      if (onSuccess) {
        onSuccess();
      }
    }
  }, [data, dispatch, onSuccess, resetForm]);

  return {
    validations: { ...fieldValidations, image: imageValidation },
    isLoading,
    isActive,
    imageFile,
    imagePreview,
    setIsActive,
    handleChange,
    handleImageChange,
    handleSubmit,
    resetForm,
  };
}
