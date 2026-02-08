/**
 * Login form business logic hook
 * Handles user login with validation, API calls, Google auth, and navigation
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { addToast } from "@heroui/toast";

import { useUserData } from "@/features/auth";
import { useApi } from "@/shared/hooks";
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

interface GoogleFormData {
  idToken?: string | null;
  email?: string | null;
  name?: string | null;
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
  const [loginFormData, setLoginFormData] = useState<LogInFormData | null>(
    null
  );
  const [googleFormData, setGoogleFormData] = useState<GoogleFormData | null>(
    null
  );

  const [validations, setValidations] = useState<ValidationState>({
    email: null,
    password: null,
  });

  const prevValidationsRef = useRef<ValidationState>({
    email: null,
    password: null,
  });

  // Email/Password Login API
  const {
    data: loginResult,
    loading: isSubmitting,
    error: loginError,
  } = useApi({
    endpoint: "/login",
    method: "POST",
    body: loginFormData,
    enabled: !!loginFormData,
  });

  // Google Login API
  const {
    data: googleResult,
    loading: googleLoading,
    error: googleError,
  } = useApi({
    endpoint: "/login-google",
    method: "POST",
    body: googleFormData,
    enabled: !!googleFormData,
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

        const formData = new FormData(e.currentTarget);
        const data: LogInFormData = Object.fromEntries(
          Array.from(formData.entries()).map(([k, v]) => [
            k,
            typeof v === "string" ? v : "",
          ])
        ) as unknown as LogInFormData;

        setLoginFormData(data);
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
   * Handle Google login
   */
  const handleGoogleLogin = useCallback(async () => {
    try {
      const googleUser = await signInWithGoogle();

      setGoogleFormData({
        idToken: googleUser.idToken,
        email: googleUser.email,
        name: googleUser.name,
      });
    } catch (err) {
      console.error("Error during Google login:", err);
    }
  }, []);

  /**
   * Handle email/password login response
   */
  useEffect(() => {
    if (loginResult?.data) {
      addToast({
        title: "Procesando la solicitud",
        description: "Iniciando sesión...",
        color: "success",
        variant: "flat",
        timeout: 5000,
      });
      setUserDataState(loginResult.data);
      formRef.current?.reset();
      setValidations({
        email: null,
        password: null,
      });
      setLoginFormData(null);
      router.push(getRedirectPath(loginResult.data));
    }
  }, [loginResult, setUserDataState, router]);

  useEffect(() => {
    if (loginError) {
      addToast({
        title: "Error de autenticación",
        description:
          "No se encontró una cuenta con ese email o la contraseña es incorrecta.",
        color: "danger",
        variant: "flat",
        timeout: 5000,
      });
      setLoginFormData(null);
    }
  }, [loginError]);

  /**
   * Handle Google login response
   */
  useEffect(() => {
    if (googleResult?.data) {
      setUserDataState(googleResult.data);
      setGoogleFormData(null);
      router.push(getRedirectPath(googleResult.data));
    }
  }, [googleResult, setUserDataState, router]);

  useEffect(() => {
    if (googleError) {
      addToast({
        title: "Error en login con Google",
        description:
          googleError || "Hubo un problema al iniciar sesión con Google.",
        color: "danger",
        variant: "flat",
        timeout: 5000,
      });
      setGoogleFormData(null);
    }
  }, [googleError]);

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
