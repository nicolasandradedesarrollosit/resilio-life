"use client";

import { useState, useRef, useEffect } from "react";
import { addToast } from "@heroui/toast";
import { Button } from "@heroui/button";

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

export default function SecondComponent() {
  const [formIsInvalid, setFormIsInvalid] = useState<boolean | null>(null);
  const [formData, setFormData] = useState<ContactFormData | null>(null);

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

  const [stateValidations, setStateValidations] = useState<{
    name: boolean | null;
    email: boolean | null;
    subject: boolean | null;
    message: boolean | null;
  }>({
    name: null,
    email: null,
    subject: null,
    message: null,
  });

  const formRef = useRef<HTMLFormElement | null>(null);
  const prevValidationsRef = useRef<{
    name: boolean | null;
    email: boolean | null;
    subject: boolean | null;
    message: boolean | null;
  }>({ name: null, email: null, subject: null, message: null });

  const validationRegex = [
    NAME_EXTENDED_REGEX,
    EMAIL_REGEX,
    MESSAGE_REGEX,
    LONG_MESSAGE_REGEX,
  ];

  const fields = ["name", "email", "subject", "message"] as const;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number,
  ) => {
    const value = e.target.value;
    const isValid = validationRegex[index].test(value);
    const key = fields[index] as keyof typeof stateValidations;

    if (prevValidationsRef.current[key] === isValid) return;
    prevValidationsRef.current[key] = isValid;
    setStateValidations((prev) => ({ ...prev, [key]: isValid }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      if (!Object.values(stateValidations).every(Boolean))
        return setFormIsInvalid(true);
      setFormIsInvalid(false);

      const formDataObj = new FormData(e.currentTarget);
      const data: ContactFormData = Object.fromEntries(
        Array.from(formDataObj.entries()).map(([k, v]) => [
          k,
          typeof v === "string" ? v : "",
        ]),
      ) as unknown as ContactFormData;

      setFormData({ ...data, origin: "Resilio B2C SAAS APP" });
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
  };

  useEffect(() => {
    if (submitResult) {
      addToast({
        title: "¡Transacción completada!",
        description: "Los datos se guardaron correctamente.",
        color: "success",
        variant: "flat",
        timeout: 5000,
      });

      formRef.current?.reset();
      setStateValidations({
        name: null,
        email: null,
        subject: null,
        message: null,
      });
      setFormData(null);
    }
  }, [submitResult]);

  useEffect(() => {
    if (submitError) {
      addToast({
        title: "Error al enviar",
        description:
          "Hubo un problema al procesar tu solicitud. Por favor, intentá nuevamente.",
        color: "danger",
        variant: "flat",
        timeout: 5000,
      });
      setFormData(null);
    }
  }, [submitError]);

  return (
    <div className="flex justify-center items-center w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-8 md:py-12 lg:py-16 bg-transparent lg:w-1/2">
      <div className="w-full max-w-2xl pb-4 md:pb-6">
        <form
          ref={formRef}
          className="flex flex-col gap-y-6 md:gap-y-4 bg-white rounded-2xl shadow-xl p-5 sm:p-6 md:p-8 border border-gray-200"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-2 pb-3 md:pb-4 border-b border-gray-200">
            <h3 className="text-xl md:text-2xl font-semibold text-gray-900">
              Envíanos un mensaje
            </h3>
            <p className="text-xs md:text-sm text-gray-600">
              Completa el formulario y te responderemos a la brevedad
            </p>
          </div>

          <div className="flex flex-col relative mb-4">
            <label
              className="text-sm font-medium text-gray-700 mb-2"
              htmlFor="name"
            >
              Nombre completo
            </label>
            <input
              className="px-3 md:px-4 py-2.5 md:py-3 rounded-lg border border-gray-300 focus:border-magenta-fuchsia-500 focus:ring-2 focus:ring-magenta-fuchsia-200 outline-none transition-all duration-200 text-gray-900 placeholder:text-gray-400 text-sm md:text-base"
              id="name"
              name="name"
              placeholder="Ingresá tu nombre"
              type="text"
              onChange={(e) => handleChange(e, 0)}
            />
            <span
              aria-live="polite"
              className={`text-xs left-0 top-full absolute mt-1 ${stateValidations.name === false ? "visible text-red-500" : "invisible"}`}
              role="alert"
            >
              El formato del nombre es inválido ejemplo: Juan Peréz
            </span>
          </div>

          <div className="flex flex-col relative mb-4">
            <label
              className="text-sm font-medium text-gray-700 mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="px-3 md:px-4 py-2.5 md:py-3 rounded-lg border border-gray-300 focus:border-magenta-fuchsia-500 focus:ring-2 focus:ring-magenta-fuchsia-200 outline-none transition-all duration-200 text-gray-900 placeholder:text-gray-400 text-sm md:text-base"
              id="email"
              name="email"
              placeholder="tu@email.com"
              type="email"
              onChange={(e) => handleChange(e, 1)}
            />
            <span
              aria-live="polite"
              className={`text-xs left-0 top-full absolute mt-1 ${stateValidations.email === false ? "visible text-red-500" : "invisible"}`}
              role="alert"
            >
              El formato del email es inválido ejemplo: juanperez@example.com
            </span>
          </div>

          <div className="flex flex-col relative mb-4">
            <label
              className="text-sm font-medium text-gray-700 mb-2"
              htmlFor="subject"
            >
              Asunto
            </label>
            <input
              className="px-3 md:px-4 py-2.5 md:py-3 rounded-lg border border-gray-300 focus:border-magenta-fuchsia-500 focus:ring-2 focus:ring-magenta-fuchsia-200 outline-none transition-all duration-200 text-gray-900 placeholder:text-gray-400 text-sm md:text-base"
              id="subject"
              name="subject"
              placeholder="¿En qué podemos ayudarte?"
              type="text"
              onChange={(e) => handleChange(e, 2)}
            />
            <span
              aria-live="polite"
              className={`text-xs left-0 top-full absolute mt-1 ${stateValidations.subject === false ? "visible text-red-500" : "invisible"}`}
              role="alert"
            >
              El formato del asunto es inválido ejemplo: Consulta general
            </span>
          </div>

          <div className="flex flex-col relative mb-4">
            <label
              className="text-sm font-medium text-gray-700 mb-2"
              htmlFor="message"
            >
              Mensaje
            </label>
            <textarea
              className="px-3 md:px-4 py-2.5 md:py-3 rounded-lg border border-gray-300 focus:border-magenta-fuchsia-500 focus:ring-2 focus:ring-magenta-fuchsia-200 outline-none transition-all duration-200 resize-none text-gray-900 placeholder:text-gray-400 text-sm md:text-base"
              id="message"
              name="message"
              placeholder="Contanos más sobre tu consulta..."
              rows={4}
              onChange={(e) => handleChange(e, 3)}
            />
            <span
              aria-live="polite"
              className={`text-xs left-0 top-full absolute mt-1 ${stateValidations.message === false ? "visible text-red-500" : "invisible"}`}
              role="alert"
            >
              El formato del mensaje es inválido ejemplo: Consulta general
            </span>
          </div>

          <Button
            className="w-full px-4 md:px-6 py-2.5 md:py-3 bg-magenta-fuchsia-500 hover:bg-magenta-fuchsia-600 text-white font-medium rounded-lg transition-all duration-300 cursor-pointer shadow-lg shadow-magenta-fuchsia-500/30 hover:shadow-xl hover:shadow-magenta-fuchsia-500/40 transition-duration-300 hover:scale-[1.02] active:scale-[0.98] text-sm md:text-base"
            isDisabled={isSubmitting}
            isLoading={isSubmitting}
            type="submit"
          >
            Enviar mensaje
          </Button>
          {formIsInvalid === true && (
            <p
              aria-live="polite"
              className="text-sm text-red-500 text-center"
              role="alert"
            >
              Por favor, corregí los errores en el formulario antes de enviarlo.
            </p>
          )}
        </form>

        <div className="flex items-center justify-center gap-2 pt-3 md:pt-4 border-t border-gray-200">
          <svg
            className="h-4 w-4 text-magenta-fuchsia-500 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-11v6h2v-6h-2zm0-4v2h2V7h-2z" />
          </svg>
          <p className="text-xs text-gray-600">
            Respondemos en menos de 24 horas
          </p>
        </div>
      </div>
    </div>
  );
}
