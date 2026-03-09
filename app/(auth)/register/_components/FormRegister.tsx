"use client";
import { useState } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import Link from "next/link";
import { EyeOff, Eye } from "lucide-react";

import { useRegisterForm } from "@/features/auth";

export default function FormRegister() {
  const [isVisiblePassword, setIsVisiblePassword] = useState(false);

  const {
    validations,
    isSubmitting,
    formRef,
    handleChange,
    handleSubmit,
    getErrorMessage,
  } = useRegisterForm();

  const toggleVisibility = () => setIsVisiblePassword(!isVisiblePassword);

  const IconEyeOff = () => <EyeOff className="text-current" size={20} />;
  const IconEye = () => <Eye className="text-current" size={20} />;

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto py-8 sm:px-6 px-0">
      <div className="w-full bg-transparent rounded-3xl p-8 md:p-10 space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-3xl md:text-3xl font-bold bg-gradient-to-r from-magenta-fuchsia-600 to-magenta-fuchsia-400 bg-clip-text text-transparent">
            ¡Crea tu cuenta!
          </h1>
          <p className="text-gray-500 text-sm md:text-base font-medium">
            Únete a nuestra comunidad y comienza tu experiencia
          </p>
        </div>

        <form
          ref={formRef}
          className="space-y-5 bg-white rounded-2xl p-4 md:p-8 shadow-md"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col relative">
            <Input
              isRequired
              classNames={{
                inputWrapper:
                  "border-2 hover:border-magenta-fuchsia-600 group-data-[focus=true]:border-magenta-fuchsia-500 text-black",
                label: "font-semibold",
              }}
              color="secondary"
              isInvalid={validations.name === false}
              label="Nombre"
              name="name"
              placeholder="Tu nombre"
              type="text"
              variant="bordered"
              onChange={(e) => {
                handleChange(e, 0);
              }}
            />
            <span
              className={`text-xs text-red-500 mt-1 ${validations.name === false ? "visible" : "invisible"}`}
            >
              {getErrorMessage("name")}
            </span>
          </div>

          <div className="flex flex-col relative">
            <Input
              isRequired
              classNames={{
                inputWrapper:
                  "border-2 hover:border-magenta-fuchsia-600 group-data-[focus=true]:border-magenta-fuchsia-500 text-black",
                label: "font-semibold",
              }}
              color="secondary"
              isInvalid={validations.lastName === false}
              label="Apellido"
              name="lastName"
              placeholder="Tu apellido"
              type="text"
              variant="bordered"
              onChange={(e) => {
                handleChange(e, 1);
              }}
            />
            <span
              className={`text-xs text-red-500 mt-1 ${validations.lastName === false ? "visible" : "invisible"}`}
            >
              {getErrorMessage("lastName")}
            </span>
          </div>

          <div className="flex flex-col relative">
            <Input
              isRequired
              classNames={{
                inputWrapper:
                  "border-2 hover:border-magenta-fuchsia-600 group-data-[focus=true]:border-magenta-fuchsia-500 text-black",
                label: "font-semibold",
              }}
              color="secondary"
              isInvalid={validations.email === false}
              label="Email"
              name="email"
              placeholder="tu@email.com"
              type="email"
              variant="bordered"
              onChange={(e) => {
                handleChange(e, 2);
              }}
            />
            <span
              className={`text-xs text-red-500 mt-1 ${validations.email === false ? "visible" : "invisible"}`}
            >
              {getErrorMessage("email")}
            </span>
          </div>

          <div className="flex flex-col relative">
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
                  className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                  type="button"
                  onClick={toggleVisibility}
                >
                  {isVisiblePassword ? <IconEyeOff /> : <IconEye />}
                </button>
              }
              isInvalid={validations.password === false}
              label="Contraseña"
              name="password"
              placeholder="••••••••"
              type={isVisiblePassword ? "text" : "password"}
              variant="bordered"
              onChange={(e) => {
                handleChange(e, 3);
              }}
            />
            <span
              className={`text-xs text-red-500 mt-1 ${validations.password === false ? "visible" : "invisible"}`}
            >
              {getErrorMessage("password")}
            </span>
          </div>

          <Button
            className="w-full bg-gradient-to-r from-magenta-fuchsia-600 to-magenta-fuchsia-400 text-white font-bold shadow-lg"
            isLoading={isSubmitting}
            size="lg"
            type="submit"
          >
            Crear cuenta
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
