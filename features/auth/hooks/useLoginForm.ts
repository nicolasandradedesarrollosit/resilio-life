/**
 * Login form business logic hook
 * Handles user login with validation, API calls, Google auth, and navigation
 */

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { addToast } from "@heroui/toast";

import { useUserData } from "@/features/auth";
import { authService } from "@/features/auth/services/authService";
import { getRedirectPath } from "@/shared/utils";
import { EMAIL_REGEX, PASSWORD_REGEX } from "@/shared/utils/validation";
import { signInWithGoogle } from "@/lib";

interface LogInFormData {
  email: string;
  password: string;
}

type FieldName = keyof LogInFormData;

interface ValidationState {
  email: boolean | null;
  password: boolean | null;
}

const validationRegex = [EMAIL_REGEX, PASSWORD_REGEX];
const fields: readonly FieldName[] = ["email", "password"];

export interface UseLoginFormReturn {
  validations: ValidationState;
  formIsInvalid: boolean | null;
  isSubmitting: boolean;
  googleLoading: boolean;
  formRef: React.RefObject<HTMLFormElement>;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  handleGoogleLogin: () => Promise<void>;
}

/**
 * Custom hook for user login form
 * Encapsulates all business logic: validation, API calls, Google auth, toasts, navigation
 */
export function useLoginForm(): UseLoginFormReturn {
  const router = useRouter();
  const { setUserDataState } = useUserData();
  const formRef = useRef<HTMLFormElement | null>(null);

  const [formIsInvalid, setFormIsInvalid] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const [validations, setValidations] = useState<ValidationState>({
    email: null,
    password: null,
  });

  const prevValidationsRef = useRef<ValidationState>({
    email: null,
    password: null,
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
      e.preventDefault();

      try {
        if (!Object.values(validations).every(Boolean)) {
          setFormIsInvalid(true);
          return;
        }
        setFormIsInvalid(false);

        const formData = new FormData(e.currentTarget);
        const credentials: LogInFormData = Object.fromEntries(
          Array.from(formData.entries()).map(([k, v]) => [
            k,
            typeof v === "string" ? v : "",
          ])
        ) as unknown as LogInFormData;

        setIsSubmitting(true);

        const result = await authService.login(credentials);

        if (result?.data) {
          addToast({
            title: "Procesando la solicitud",
            description: "Iniciando sesión...",
            color: "success",
            variant: "flat",
            timeout: 5000,
          });

          setUserDataState(result.data);
          formRef.current?.reset();
          setValidations({
            email: null,
            password: null,
          });
          router.push(getRedirectPath(result.data));
        }
      } catch {
        addToast({
          title: "Error de autenticación",
          description:
            "No se encontró una cuenta con ese email o la contraseña es incorrecta.",
          color: "danger",
          variant: "flat",
          timeout: 5000,
        });
      } finally {
        setIsSubmitting(false);
        setFormIsInvalid(null);
      }
    },
    [validations, setUserDataState, router]
  );

  /**
   * Handle Google login
   */
  const handleGoogleLogin = useCallback(async () => {
    try {
      setGoogleLoading(true);

      const googleUser = await signInWithGoogle();

      const result = await authService.loginWithGoogle({
        idToken: googleUser.idToken,
        email: googleUser.email,
        name: googleUser.name,
      });

      if (result?.data) {
        setUserDataState(result.data);
        router.push(getRedirectPath(result.data));
      }
    } catch (error) {
      addToast({
        title: "Error en login con Google",
        description:
          error instanceof Error ? error.message : "Hubo un problema al iniciar sesión con Google.",
        color: "danger",
        variant: "flat",
        timeout: 5000,
      });
    } finally {
      setGoogleLoading(false);
    }
  }, [setUserDataState, router]);

  return {
    validations,
    formIsInvalid,
    isSubmitting,
    googleLoading,
    formRef,
    handleChange,
    handleSubmit,
    handleGoogleLogin,
  };
}
