/**
 * Contact form business logic hook
 * Handles contact form submission with validation and API calls
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { addToast } from "@heroui/toast";

import { useApi } from "@/shared/hooks";
import {
  NAME_EXTENDED_REGEX,
  EMAIL_REGEX,
  MESSAGE_REGEX,
  LONG_MESSAGE_REGEX,
} from "@/shared/utils/validation";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  origin: string;
}

interface ValidationState {
  name: boolean | null;
  email: boolean | null;
  subject: boolean | null;
  message: boolean | null;
}

type ValidatedFieldName = keyof ValidationState;

const validationRegex = [
  NAME_EXTENDED_REGEX,
  EMAIL_REGEX,
  MESSAGE_REGEX,
  LONG_MESSAGE_REGEX,
];
const fields: readonly ValidatedFieldName[] = ["name", "email", "subject", "message"];

export interface UseContactFormReturn {
  validations: ValidationState;
  formIsInvalid: boolean | null;
  isSubmitting: boolean;
  formRef: React.RefObject<HTMLFormElement>;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

/**
 * Custom hook for contact form
 * Encapsulates all business logic: validation, API calls, toasts
 */
export function useContactForm(): UseContactFormReturn {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [formIsInvalid, setFormIsInvalid] = useState<boolean | null>(null);
  const [formData, setFormData] = useState<ContactFormData | null>(null);

  const [validations, setValidations] = useState<ValidationState>({
    name: null,
    email: null,
    subject: null,
    message: null,
  });

  const prevValidationsRef = useRef<ValidationState>({
    name: null,
    email: null,
    subject: null,
    message: null,
  });

  // API call
  const {
    data: submitResult,
    loading: isSubmitting,
    error: submitError,
  } = useApi({
    endpoint: "/messages",
    method: "POST",
    body: formData,
    includeCredentials: false,
    enabled: !!formData,
  });

  /**
   * Validate field on change
   */
  const handleChange = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      index: number
    ) => {
      const value = e.target.value;
      const isValid = validationRegex[index].test(value);
      const key = fields[index];

      if (prevValidationsRef.current[key] === isValid) return;
      prevValidationsRef.current[key] = isValid;
      setValidations((prev) => ({ ...prev, [key]: isValid }));
    },
    []
  );

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      try {
        e.preventDefault();
        if (!Object.values(validations).every(Boolean)) {
          setFormIsInvalid(true);
          return;
        }
        setFormIsInvalid(false);

        const formDataObj = new FormData(e.currentTarget);
        const data: ContactFormData = {
          name: formDataObj.get("name") as string,
          email: formDataObj.get("email") as string,
          subject: formDataObj.get("subject") as string,
          message: formDataObj.get("message") as string,
          origin: "web",
        };

        setFormData(data);
      } catch (error) {
        console.error("Error al enviar el formulario:", error);

        addToast({
          title: "Error al enviar",
          description:
            "Hubo un problema al procesar tu solicitud. Por favor, intentá nuevamente.",
          color: "danger",
          variant: "flat",
          timeout: 5000,
        });

        return;
      } finally {
        setFormIsInvalid(null);
      }
    },
    [validations]
  );

  /**
   * Handle API success
   */
  useEffect(() => {
    if (submitResult?.data) {
      addToast({
        title: "Mensaje enviado",
        description: "Tu mensaje ha sido enviado correctamente. Te responderemos pronto.",
        color: "success",
        variant: "flat",
        timeout: 5000,
      });

      formRef.current?.reset();
      setValidations({
        name: null,
        email: null,
        subject: null,
        message: null,
      });
      setFormData(null);
    }
  }, [submitResult]);

  /**
   * Handle API error
   */
  useEffect(() => {
    if (submitError) {
      addToast({
        title: "Error al enviar mensaje",
        description:
          "Hubo un problema al enviar tu mensaje. Por favor, intentá nuevamente.",
        color: "danger",
        variant: "flat",
        timeout: 5000,
      });
      setFormData(null);
    }
  }, [submitError]);

  return {
    validations,
    formIsInvalid,
    isSubmitting,
    formRef,
    handleChange,
    handleSubmit,
  };
}
