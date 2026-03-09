"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import Link from "next/link";
import { addToast } from "@heroui/toast";
import { useRouter, usePathname } from "next/navigation";
import { EyeOff, Eye } from "lucide-react";

import { useApi } from "@/shared/hooks";
import {
  NAME_REGEX,
  EMAIL_REGEX,
  PASSWORD_REGEX,
} from "@/shared/utils/validation";

export default function RegisterInfluencerForm() {
  const [isVisiblePassword, setIsVisiblePassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const token = pathname.split("/").pop() || "";

  const [registerData, setRegisterData] = useState<object | null>(null);

  const { data, error, loading } = useApi<{ user: any }>({
    endpoint: "/influencers",
    method: "POST",
    body: registerData,
    enabled: registerData !== null,
  });

  const [stateValidations, setStateValidations] = useState<{
    name: boolean | null;
    lastName: boolean | null;
    email: boolean | null;
    password: boolean | null;
  }>({
    name: null,
    lastName: null,
    email: null,
    password: null,
  });

  const formRef = useRef<HTMLFormElement | null>(null);
  const prevValidationsRef = useRef(stateValidations);

  const validationRules: Record<string, RegExp> = {
    name: NAME_REGEX,
    lastName: NAME_REGEX,
    email: EMAIL_REGEX,
    password: PASSWORD_REGEX,
  };

  const handleChange = (
    field: keyof typeof stateValidations,
    value: string,
  ) => {
    const regex = validationRules[field];
    const isValid = regex ? regex.test(value) : true;

    if (prevValidationsRef.current[field] === isValid) return;
    prevValidationsRef.current = {
      ...prevValidationsRef.current,
      [field]: isValid,
    };
    setStateValidations((prev) => ({ ...prev, [field]: isValid }));
  };

  useEffect(() => {
    const handleApiResponse = async () => {
      try {
        if (loading) {
          setIsSubmitting(true);

          return;
        }
        if (error) {
          addToast({
            title: "Error al registrar",
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
        if (data !== null && data !== undefined) {
          formRef.current?.reset();
          addToast({
            title: "Registro exitoso",
            description: "¡Tu cuenta de influencer ha sido creada correctamente!",
            color: "success",
            variant: "flat",
            timeout: 3000,
          });
          setIsSubmitting(false);
          setRegisterData(null);
          router.push("/login");
        }
      } catch {
        addToast({
          title: "Error inesperado",
          description:
            "Ocurrió un error inesperado. Por favor, intentá nuevamente más tarde.",
          color: "danger",
          variant: "flat",
          timeout: 5000,
        });
        setIsSubmitting(false);
        setRegisterData(null);
        router.push("/");
      } finally {
        setIsSubmitting(false);
      }
    };

    handleApiResponse();
  }, [data, error, loading, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const requiredFields = ["name", "lastName", "email", "password"] as const;
    const allValid = requiredFields.every(
      (field) => stateValidations[field] === true,
    );

    if (!allValid) {
      addToast({
        title: "Validación fallida",
        description:
          "Por favor, completá correctamente todos los campos requeridos.",
        color: "warning",
        variant: "flat",
        timeout: 5000,
      });

      return;
    }

    const name =
      e.currentTarget.querySelector<HTMLInputElement>('[name="name"]')?.value || "";
    const lastName =
      e.currentTarget.querySelector<HTMLInputElement>('[name="lastName"]')?.value || "";
    const email =
      e.currentTarget.querySelector<HTMLInputElement>('[name="email"]')?.value || "";
    const password =
      e.currentTarget.querySelector<HTMLInputElement>('[name="password"]')?.value || "";

    addToast({
      title: "Registro en proceso",
      description: "Estamos creando tu cuenta de influencer.",
      color: "success",
      variant: "flat",
      timeout: 3000,
    });

    setRegisterData({ token, name, lastName, email, password });
  };

  const toggleVisibility = () => setIsVisiblePassword(!isVisiblePassword);

  const inputClasses = {
    inputWrapper:
      "border-2 hover:border-magenta-fuchsia-600 group-data-[focus=true]:border-magenta-fuchsia-500 text-black",
    label: "font-semibold",
  };

  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto py-8 sm:px-6 px-0">
      <div className="w-full bg-transparent rounded-3xl p-8 md:p-10 space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-3xl md:text-3xl font-bold bg-gradient-to-r from-magenta-fuchsia-600 to-magenta-fuchsia-400 bg-clip-text text-transparent">
            ¡Únete como Influencer!
          </h1>
          <p className="text-gray-500 text-sm md:text-base font-medium">
            Creá tu cuenta y empezá a compartir beneficios
          </p>
        </div>

        <form
          ref={formRef}
          className="space-y-6 bg-white rounded-2xl p-4 md:p-8 shadow-md"
          onSubmit={handleSubmit}
        >
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">
              Datos Personales
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <Input
                  isRequired
                  classNames={inputClasses}
                  color="secondary"
                  isInvalid={stateValidations.name === false}
                  label="Nombre"
                  name="name"
                  placeholder="Tu nombre"
                  type="text"
                  variant="bordered"
                  onChange={(e) => handleChange("name", e.target.value)}
                />
                <span
                  className={`text-xs text-red-500 mt-1 ${stateValidations.name === false ? "visible" : "invisible"}`}
                >
                  Mínimo 2 letras
                </span>
              </div>

              <div className="flex flex-col">
                <Input
                  isRequired
                  classNames={inputClasses}
                  color="secondary"
                  isInvalid={stateValidations.lastName === false}
                  label="Apellido"
                  name="lastName"
                  placeholder="Tu apellido"
                  type="text"
                  variant="bordered"
                  onChange={(e) => handleChange("lastName", e.target.value)}
                />
                <span
                  className={`text-xs text-red-500 mt-1 ${stateValidations.lastName === false ? "visible" : "invisible"}`}
                >
                  Mínimo 2 letras
                </span>
              </div>
            </div>

            <div className="flex flex-col">
              <Input
                isRequired
                classNames={inputClasses}
                color="secondary"
                isInvalid={stateValidations.email === false}
                label="Email"
                name="email"
                placeholder="tu@email.com"
                type="email"
                variant="bordered"
                onChange={(e) => handleChange("email", e.target.value)}
              />
              <span
                className={`text-xs text-red-500 mt-1 ${stateValidations.email === false ? "visible" : "invisible"}`}
              >
                Ingresá un email válido
              </span>
            </div>

            <div className="flex flex-col">
              <Input
                isRequired
                classNames={inputClasses}
                color="secondary"
                endContent={
                  <button
                    aria-label="toggle password visibility"
                    className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                    type="button"
                    onClick={toggleVisibility}
                  >
                    {isVisiblePassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                }
                isInvalid={stateValidations.password === false}
                label="Contraseña"
                name="password"
                placeholder="••••••••"
                type={isVisiblePassword ? "text" : "password"}
                variant="bordered"
                onChange={(e) => handleChange("password", e.target.value)}
              />
              <span
                className={`text-xs text-red-500 mt-1 ${stateValidations.password === false ? "visible" : "invisible"}`}
              >
                Mínimo 8 caracteres, una mayúscula y un número
              </span>
            </div>
          </div>

          <Button
            className="w-full bg-gradient-to-r from-magenta-fuchsia-600 to-magenta-fuchsia-400 text-white font-bold shadow-lg"
            isLoading={isSubmitting}
            size="lg"
            type="submit"
          >
            Crear cuenta de Influencer
          </Button>
        </form>

        <div className="text-center pt-2">
          <p className="text-gray-600 text-sm">
            ¿Ya tenés cuenta?{" "}
            <Link
              className="font-semibold text-black hover:text-magenta-fuchsia-600 transition-colors"
              href="/login"
            >
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>

      <p className="mt-8 text-center text-xs text-gray-500">
        Al continuar, aceptás nuestros términos de servicio y política de
        privacidad
      </p>
    </div>
  );
}
