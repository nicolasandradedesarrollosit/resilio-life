/**
 * Update benefit form business logic hook
 * Handles benefit updates with validation, image upload, API calls
 */

import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useApi, useFormValidation, useImageUpload } from "@/shared/hooks";
import { updateBenefit, selectAllBenefits } from "@/features/benefits/benefitsSlice";
import type { BenefitData } from "@/shared/types";
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

export interface UseUpdateBenefitReturn {
  benefitToUpdate: BenefitData | undefined;
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
 * Custom hook for benefit update form
 */
export function useUpdateBenefit(
  benefitId: string,
  isOpen: boolean,
  onSuccess?: () => void
): UseUpdateBenefitReturn {
  const dispatch = useDispatch();
  const benefits = useSelector(selectAllBenefits);
  const benefitToUpdate = benefits.find((b: BenefitData) => b._id === benefitId);

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
    setImagePreview,
    setImageFile,
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
    endpoint: `/benefits/${benefitId}`,
    method: "PATCH",
    includeCredentials: true,
    body: formData,
    enabled: formData !== null,
  });

  /**
   * Load existing benefit data when modal opens
   */
  useEffect(() => {
    if (isOpen && benefitToUpdate) {
      setIsActive(benefitToUpdate.isActive);
      setImagePreview(benefitToUpdate.url_image);
      resetValidations();
      setImageValidation(null);
    }
  }, [isOpen, benefitToUpdate, resetValidations, setImagePreview]);

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
      const file = e.target.files?.[0];
      if (!file) return;

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
  }, [resetValidations, resetImage]);

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const hasErrors = Object.values(fieldValidations).some(
        (error) => error !== null
      );

      if (hasErrors) return;

      const formDataObj = new FormData(e.currentTarget);
      formDataObj.set("isActive", String(isActive));

      if (imageFile) {
        formDataObj.set("image", imageFile);
      } else {
        formDataObj.delete("image");
      }

      setFormData(formDataObj);
    },
    [fieldValidations, imageFile, isActive]
  );

  /**
   * Handle API success
   */
  useEffect(() => {
    if (data && data.data) {
      dispatch(updateBenefit(data.data));
      setFormData(null);
      setImageFile(null);
      if (onSuccess) {
        onSuccess();
      }
    }
  }, [data, dispatch, onSuccess, setImageFile]);

  return {
    benefitToUpdate,
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
