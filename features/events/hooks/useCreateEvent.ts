/**
 * Create event form business logic hook
 * Handles event creation with validation, image upload, API calls
 */

import { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";

import { useApi, useFormValidation, useImageUpload } from "@/shared/hooks";
import { addEvent } from "@/features/events/eventsSlice";
import {
  TITLE_REGEX,
  DESCRIPTION_REGEX,
  LOCATION_REGEX,
  URL_REGEX,
  TITLE_ERROR_MESSAGE,
  DESCRIPTION_ERROR_MESSAGE,
  LOCATION_ERROR_MESSAGE,
  URL_ERROR_MESSAGE,
  REQUIRED_FIELD_ERROR_MESSAGE,
} from "@/shared/utils/validation";

interface EventFormFields {
  title: string;
  description: string;
  location: string;
  url_provider: string;
}

type EventFieldName = keyof EventFormFields;

export interface UseCreateEventReturn {
  validations: Record<EventFieldName | "date" | "image", string | null>;
  isLoading: boolean;
  selectedDate: any;
  imageFile: File | null;
  imagePreview: string | null;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleDateChange: (date: any) => void;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  resetForm: () => void;
}

/**
 * Custom hook for event creation form
 */
export function useCreateEvent(
  onSuccess?: () => void
): UseCreateEventReturn {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<any>(null);

  // Form validation
  const {
    validations: fieldValidations,
    validateField,
    setFieldError,
    resetValidations,
  } = useFormValidation<EventFieldName>({
    fields: ["title", "description", "location", "url_provider"] as const,
    rules: {
      title: { pattern: TITLE_REGEX, errorMessage: TITLE_ERROR_MESSAGE },
      description: {
        pattern: DESCRIPTION_REGEX,
        errorMessage: DESCRIPTION_ERROR_MESSAGE,
      },
      location: {
        pattern: LOCATION_REGEX,
        errorMessage: LOCATION_ERROR_MESSAGE,
      },
      url_provider: { pattern: URL_REGEX, errorMessage: URL_ERROR_MESSAGE },
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
      setDateImageValidations((prev) => ({ ...prev, image: error }));
    },
    onSuccess: () => {
      setDateImageValidations((prev) => ({ ...prev, image: null }));
    },
  });

  // Separate state for date and image validations
  const [dateImageValidations, setDateImageValidations] = useState<{
    date: string | null;
    image: string | null;
  }>({
    date: null,
    image: null,
  });

  // API call
  const { loading: isLoading, data } = useApi({
    endpoint: "/events",
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
        setFieldError(
          name as EventFieldName,
          REQUIRED_FIELD_ERROR_MESSAGE
        );
        return;
      }

      validateField(name as EventFieldName, value);
    },
    [validateField, setFieldError]
  );

  /**
   * Handle date change
   */
  const handleDateChange = useCallback((date: any) => {
    setSelectedDate(date);
    setDateImageValidations((prev) => ({
      ...prev,
      date: !date ? "La fecha es requerida" : null,
    }));
  }, []);

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
    setSelectedDate(null);
    setDateImageValidations({ date: null, image: null });
    setFormData(null);
  }, [resetValidations, resetImage]);

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const hasErrors = [
        ...Object.values(fieldValidations),
        ...Object.values(dateImageValidations),
      ].some((error) => error !== null);

      if (hasErrors) return;

      if (!selectedDate) {
        setDateImageValidations((prev) => ({
          ...prev,
          date: "La fecha es requerida",
        }));
        return;
      }

      if (!imageFile) {
        return;
      }

      const formDataObj = new FormData(e.currentTarget);
      formDataObj.append("image", imageFile);

      const isoDate = new Date(
        selectedDate.year,
        selectedDate.month - 1,
        selectedDate.day
      ).toISOString();
      formDataObj.set("date", isoDate);

      setFormData(formDataObj);
    },
    [fieldValidations, dateImageValidations, selectedDate, imageFile]
  );

  /**
   * Handle API success
   */
  useEffect(() => {
    if (data && data.data) {
      dispatch(addEvent(data.data));
      resetForm();
      setImageFile(null);
      setImagePreview(null);
      if (onSuccess) {
        onSuccess();
      }
    }
  }, [data, dispatch, onSuccess, resetForm, setImageFile, setImagePreview]);

  return {
    validations: { ...fieldValidations, ...dateImageValidations },
    isLoading,
    selectedDate,
    imageFile,
    imagePreview,
    handleChange,
    handleDateChange,
    handleImageChange,
    handleSubmit,
    resetForm,
  };
}
