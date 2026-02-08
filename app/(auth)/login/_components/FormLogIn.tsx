"use client";
import { useState } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Form } from "@heroui/form";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

import { useLoginForm } from "@/features/auth";

export default function FormLogIn() {
  const [isVisiblePassword, setIsVisiblePassword] = useState(false);

  const {
    validations,
    formIsInvalid,
    isSubmitting,
    googleLoading,
    formRef,
    handleChange,
    handleSubmit,
    handleGoogleLogin,
  } = useLoginForm();

  const toggleVisibility = () => setIsVisiblePassword(!isVisiblePassword);

  const svgGoogle = (
    <svg
      height="20"
      viewBox="0 0 16 16"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipRule="evenodd" fill="none" fillRule="evenodd">
        <path
          d="M7.209 1.061c.725-.081 1.154-.081 1.933 0a6.57 6.57 0 0 1 3.65 1.82a100 100 0 0 0-1.986 1.93q-1.876-1.59-4.188-.734q-1.696.78-2.362 2.528a78 78 0 0 1-2.148-1.658a.26.26 0 0 0-.16-.027q1.683-3.245 5.26-3.86"
          fill="#F44336"
          opacity=".987"
        />
        <path
          d="M1.946 4.92q.085-.013.161.027a78 78 0 0 0 2.148 1.658A7.6 7.6 0 0 0 4.04 7.99q.037.678.215 1.331L2 11.116Q.527 8.038 1.946 4.92"
          fill="#FFC107"
          opacity=".997"
        />
        <path
          d="M12.685 13.29a26 26 0 0 0-2.202-1.74q1.15-.812 1.396-2.228H8.122V6.713q3.25-.027 6.497.055q.616 3.345-1.423 6.032a7 7 0 0 1-.51.49"
          fill="#448AFF"
          opacity=".999"
        />
        <path
          d="M4.255 9.322q1.23 3.057 4.51 2.854a3.94 3.94 0 0 0 1.718-.626q1.148.812 2.202 1.74a6.62 6.62 0 0 1-4.027 1.684a6.4 6.4 0 0 1-1.02 0Q3.82 14.524 2 11.116z"
          fill="#43A047"
          opacity=".993"
        />
      </g>
    </svg>
  );

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto py-8 sm:px-6 px-0">
      <div className="w-full bg-transparent rounded-3xl p-8 md:p-10 space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-3xl md:text-3xl font-bold bg-gradient-to-r from-magenta-fuchsia-600 to-magenta-fuchsia-400 bg-clip-text text-transparent">
            ¡Bienvenido de vuelta!
          </h1>
          <p className="text-gray-500 text-sm md:text-base font-medium">
            Inicia sesión para continuar tu experiencia
          </p>
        </div>

        <Button
          className="w-full bg-white text-black/70 font-semibold"
          isLoading={googleLoading}
          size="lg"
          startContent={svgGoogle}
          onPress={handleGoogleLogin}
        >
          Continuar con Google
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="mt-6 bg-transparent text-gray-500 font-medium">
              O continúa con email
            </span>
          </div>
        </div>

        <Form
          ref={formRef}
          className="space-y-5 bg-white rounded-2xl p-4 md:p-8 shadow-md"
          onSubmit={handleSubmit}
        >
          <Input
            isRequired
            classNames={{
              inputWrapper:
                "border-2 hover:border-magenta-fuchsia-600 group-data-[focus=true]:border-magenta-fuchsia-500 text-black",
              label: "font-semibold",
            }}
            color="secondary"
            isInvalid={
              formIsInvalid === null ? false : validations.email === false
            }
            label="Email"
            name="email"
            placeholder="tu@email.com"
            type="email"
            variant="bordered"
            onChange={(e) => {
              handleChange(e, 0);
            }}
          />

          <Input
            isRequired
            classNames={{
              inputWrapper:
                "border-2 hover:border-magenta-fuchsia-600 group-data-[focus=true]:border-magenta-fuchsia-500 text-black",
              label: "font-semibold",
            }}
            color="secondary"
            endContent={
              <button
                aria-label="toggle password visibility"
                className="text-gray-400 hover:text-gray-600 transition-colors text-xl focus:outline-none"
                type="button"
                onClick={toggleVisibility}
              >
                {isVisiblePassword ? <Eye /> : <EyeOff />}
              </button>
            }
            isInvalid={
              formIsInvalid === null
                ? false
                : validations.password === false
            }
            label="Contraseña"
            name="password"
            placeholder="••••••••"
            type={isVisiblePassword ? "text" : "password"}
            variant="bordered"
            onChange={(e) => {
              handleChange(e, 1);
            }}
          />

          <div className="flex justify-end">
            <Link
              className="transition duration-300 text-sm font-semibold text-black hover:text-magenta-fuchsia-600"
              href="#"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <Button
            className="w-full bg-gradient-to-r from-magenta-fuchsia-600 to-magenta-fuchsia-400 text-white font-bold shadow-lg"
            isLoading={isSubmitting}
            size="lg"
            type="submit"
          >
            Iniciar sesión
          </Button>
        </Form>

        <div className="text-center pt-2">
          <p className="text-gray-600 text-sm">
            ¿No tenés cuenta?{" "}
            <Link className="font-semibold text-black" href="/register">
              Registrate gratis
            </Link>
          </p>
        </div>
      </div>

      <p className="mt-8 text-center text-xs text-gray-500 px-4">
        Al continuar, aceptás nuestros términos de servicio y política de
        privacidad
      </p>
    </div>
  );
}
