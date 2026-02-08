/**
 * Register form business logic hook
 * Handles user registration with validation, API calls, and navigation
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { addToast } from "@heroui/toast";

import { setUserData } from "@/features/auth/authSlice";
import { useApi } from "@/shared/hooks";
import { getRedirectPath } from "@/shared/utils";
import {
  NAME_REGEX,
  EMAIL_REGEX,
  PASSWORD_REGEX,
  NAME_ERROR_MESSAGE,
  EMAIL_ERROR_MESSAGE,
  PASSWORD_ERROR_MESSAGE,
} from "@/shared/utils/validation";
import type { UserData } from "@/shared/types";

interface RegisterFormData {
  name: string;
  lastName: string;
  email: string;
  password: string;
}

type FieldName = keyof RegisterFormData;

interface ValidationState {
  name: boolean | null;
  lastName: boolean | null;
  email: boolean | null;
  password: boolean | null;
}

const validationRegex = [NAME_REGEX, NAME_REGEX, EMAIL_REGEX, PASSWORD_REGEX];
const fields: readonly FieldName[] = ["name", "lastName", "email", "password"];

const errorMessages: Record<FieldName, string> = {
  name: NAME_ERROR_MESSAGE,
  lastName: NAME_ERROR_MESSAGE,
  email: EMAIL_ERROR_MESSAGE,
  password: PASSWORD_ERROR_MESSAGE,
};

export interface UseRegisterFormReturn {
  validations: ValidationState;
  isSubmitting: boolean;
  formRef: React.RefObject<HTMLFormElement>;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  getErrorMessage: (field: FieldName) => string;
}

/**
 * Custom hook for user registration form
 * Encapsulates all business logic: validation, API calls, toasts, navigation
 */
export function useRegisterForm(): UseRegisterFormReturn {
  const router = useRouter();
  const dispatch = useDispatch();
  const formRef = useRef<HTMLFormElement | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registerData, setRegisterData] = useState<RegisterFormData | null>(
    null
  );

  const [validations, setValidations] = useState<ValidationState>({
    name: null,
    lastName: null,
    email: null,
    password: null,
  });

  const prevValidationsRef = useRef<ValidationState>({
    name: null,
    lastName: null,
    email: null,
    password: null,
  });

  // API call
  const { data, error, loading } = useApi<{ user: UserData }>({
    endpoint: "/users",
    method: "POST",
    body: registerData,
    enabled: registerData !== null,
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
   * Get error message for a field
   */
  const getErrorMessage = useCallback((field: FieldName): string => {
    return errorMessages[field];
  }, []);

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const formData = new FormData(e.currentTarget);
      const data: RegisterFormData = Object.fromEntries(
        Array.from(formData.entries()).map(([k, v]) => [
          k,
          typeof v === "string" ? v : "",
        ])
      ) as unknown as RegisterFormData;

      const allValid = Object.values(validations).every((val) => val === true);

      if (!allValid) {
        addToast({
          title: "Validación fallida",
          description: "Por favor, completá correctamente todos los campos.",
          color: "warning",
          variant: "flat",
          timeout: 5000,
        });

        return;
      }

      addToast({
        title: "Registro en proceso",
        description: "Estamos procesando tu solicitud.",
        color: "success",
        variant: "flat",
        timeout: 3000,
      });

      setRegisterData(data);
    },
    [validations]
  );

  /**
   * Handle API response
   */
  useEffect(() => {
    if (loading) {
      setIsSubmitting(true);
      return;
    }

    if (error) {
      addToast({
        title: "Error al enviar",
        description:
          "Hubo un problema al procesar tu solicitud. Por favor, intentá nuevamente.",
        color: "danger",
        variant: "flat",
        timeout: 5000,
      });
      setIsSubmitting(false);
      setRegisterData(null);

      return;
    }

    if (data?.user) {
      formRef.current?.reset();
      setValidations({
        name: null,
        lastName: null,
        email: null,
        password: null,
      });
      dispatch(
        setUserData({
          data: data.user,
          loading: false,
          loaded: true,
          loggedIn: true,
        })
      );

      addToast({
        title: "Registro exitoso",
        description: "¡Tu cuenta ha sido creada correctamente!",
        color: "success",
        variant: "flat",
        timeout: 3000,
      });

      setIsSubmitting(false);
      setRegisterData(null);
      router.push(getRedirectPath(data.user));
    }
  }, [data, error, loading, dispatch, router]);

  return {
    validations,
    isSubmitting,
    formRef,
    handleChange,
    handleSubmit,
    getErrorMessage,
  };
}
