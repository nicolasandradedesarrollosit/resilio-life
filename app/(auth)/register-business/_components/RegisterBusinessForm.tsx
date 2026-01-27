"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import Link from "next/link";
import { addToast } from "@heroui/toast";
import { useRouter, usePathname } from "next/navigation";
import { EyeOff, Eye, MapPin, ImagePlus, X } from "lucide-react";

import LocationPickerWrapper from "./LocationPickerWrapper";

import { useApi } from "@/hooks/useApi";

interface BusinessFormData {
  name: string;
  lastName: string;
  email: string;
  password: string;
  businessName: string;
  businessDescription: string;
  businessCategory: string;
  businessImageURL: string;
  location: {
    address: string;
    coordinates: [number, number] | undefined;
  };
}

const BUSINESS_CATEGORIES = [
  { key: "restaurante", label: "Restaurante" },
  { key: "cafeteria", label: "Cafetería" },
  { key: "tienda", label: "Tienda" },
  { key: "servicios", label: "Servicios" },
  { key: "salud", label: "Salud y Bienestar" },
  { key: "entretenimiento", label: "Entretenimiento" },
  { key: "educacion", label: "Educación" },
  { key: "otro", label: "Otro" },
];

export default function RegisterBusinessForm() {
  const [isVisiblePassword, setIsVisiblePassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [coordinates, setCoordinates] = useState<[number, number] | undefined>(
    undefined,
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const token = pathname.split("/").pop() || "";

  const [registerData, setRegisterData] = useState<FormData | null>(null);

  const { data, error, loading } = useApi<{ user: any }>({
    endpoint: "/businesses",
    method: "POST",
    body: registerData,
    enabled: registerData !== null,
  });

  const [stateValidations, setStateValidations] = useState<{
    name: boolean | null;
    lastName: boolean | null;
    email: boolean | null;
    password: boolean | null;
    businessName: boolean | null;
    businessDescription: boolean | null;
    businessCategory: boolean | null;
    businessImage: boolean | null;
  }>({
    name: null,
    lastName: null,
    email: null,
    password: null,
    businessName: null,
    businessDescription: null,
    businessCategory: null,
    businessImage: null,
  });

  const formRef = useRef<HTMLFormElement | null>(null);
  const prevValidationsRef = useRef(stateValidations);

  const validationRules: Record<string, RegExp> = {
    name: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,}$/,
    lastName: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,}$/,
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
    businessName: /^.{2,100}$/,
    businessDescription: /^.{10,500}$/,
    businessCategory: /^.{1,}$/,
    businessImage: /^.+$/,
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

  const [addressValue, setAddressValue] = useState("");

  const handleLocationSelect = useCallback(
    (lat: number, lng: number, address?: string) => {
      setCoordinates([lng, lat]);
      if (address) {
        setAddressValue(address);
      }
    },
    [],
  );

  useEffect(() => {
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

    if (data?.user) {
      formRef.current?.reset();
      addToast({
        title: "Registro exitoso",
        description: "¡Tu negocio ha sido registrado correctamente!",
        color: "success",
        variant: "flat",
        timeout: 3000,
      });
      setIsSubmitting(false);
      setRegisterData(null);
      router.push("/login");
    }
  }, [data, error, loading, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const requiredFields = [
      "name",
      "lastName",
      "email",
      "password",
      "businessName",
      "businessDescription",
      "businessCategory",
      "businessImage",
    ] as const;
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

    if (!imageFile) {
      addToast({
        title: "Imagen requerida",
        description: "Por favor, seleccioná una imagen para tu negocio.",
        color: "warning",
        variant: "flat",
        timeout: 5000,
      });

      return;
    }

    const formDataToSend = new FormData();

    formDataToSend.append("token", token);
    formDataToSend.append(
      "name",
      e.currentTarget.querySelector<HTMLInputElement>('[name="name"]')?.value ||
        "",
    );
    formDataToSend.append(
      "lastName",
      e.currentTarget.querySelector<HTMLInputElement>('[name="lastName"]')
        ?.value || "",
    );
    formDataToSend.append(
      "email",
      e.currentTarget.querySelector<HTMLInputElement>('[name="email"]')
        ?.value || "",
    );
    formDataToSend.append(
      "password",
      e.currentTarget.querySelector<HTMLInputElement>('[name="password"]')
        ?.value || "",
    );
    formDataToSend.append(
      "businessName",
      e.currentTarget.querySelector<HTMLInputElement>('[name="businessName"]')
        ?.value || "",
    );
    formDataToSend.append(
      "businessDescription",
      e.currentTarget.querySelector<HTMLInputElement>(
        '[name="businessDescription"]',
      )?.value || "",
    );
    formDataToSend.append(
      "businessCategory",
      e.currentTarget.querySelector<HTMLInputElement>(
        '[name="businessCategory"]',
      )?.value || "",
    );
    formDataToSend.append("image", imageFile);

    if (addressValue || coordinates) {
      formDataToSend.append(
        "location",
        JSON.stringify({
          address: addressValue,
          coordinates: coordinates,
        }),
      );
    }

    addToast({
      title: "Registro en proceso",
      description: "Estamos registrando tu negocio.",
      color: "success",
      variant: "flat",
      timeout: 3000,
    });

    setRegisterData(formDataToSend);
  };

  const toggleVisibility = () => setIsVisiblePassword(!isVisiblePassword);

  const inputClasses = {
    inputWrapper:
      "border-2 hover:border-magenta-fuchsia-600 group-data-[focus=true]:border-magenta-fuchsia-500 text-black",
    label: "font-semibold",
  };

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto py-8 sm:px-6 px-0">
      <div className="w-full bg-transparent rounded-3xl p-8 md:p-10 space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-3xl md:text-3xl font-bold bg-gradient-to-r from-magenta-fuchsia-600 to-magenta-fuchsia-400 bg-clip-text text-transparent">
            ¡Registra tu negocio!
          </h1>
          <p className="text-gray-500 text-sm md:text-base font-medium">
            Únete a nuestra plataforma y haz crecer tu negocio
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

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">
              Datos del Negocio
            </h2>

            <div className="flex flex-col">
              <Input
                isRequired
                classNames={inputClasses}
                color="secondary"
                isInvalid={stateValidations.businessName === false}
                label="Nombre del Negocio"
                name="businessName"
                placeholder="Mi Negocio"
                type="text"
                variant="bordered"
                onChange={(e) => handleChange("businessName", e.target.value)}
              />
              <span
                className={`text-xs text-red-500 mt-1 ${stateValidations.businessName === false ? "visible" : "invisible"}`}
              >
                Mínimo 2 caracteres
              </span>
            </div>

            <div className="flex flex-col">
              <Input
                isRequired
                classNames={inputClasses}
                color="secondary"
                isInvalid={stateValidations.businessDescription === false}
                label="Descripción"
                name="businessDescription"
                placeholder="Describe brevemente tu negocio..."
                type="text"
                variant="bordered"
                onChange={(e) =>
                  handleChange("businessDescription", e.target.value)
                }
              />
              <span
                className={`text-xs text-red-500 mt-1 ${stateValidations.businessDescription === false ? "visible" : "invisible"}`}
              >
                Entre 10 y 500 caracteres
              </span>
            </div>

            <div className="flex flex-col">
              <Select
                isRequired
                classNames={{
                  trigger:
                    "border-2 hover:border-magenta-fuchsia-600 data-[focus=true]:border-magenta-fuchsia-500",
                  label: "font-semibold",
                }}
                label="Categoría"
                name="businessCategory"
                placeholder="Selecciona una categoría"
                variant="bordered"
                onChange={(e) =>
                  handleChange("businessCategory", e.target.value)
                }
              >
                {BUSINESS_CATEGORIES.map((cat) => (
                  <SelectItem key={cat.key}>{cat.label}</SelectItem>
                ))}
              </Select>
              <span
                className={`text-xs text-red-500 mt-1 ${stateValidations.businessCategory === false ? "visible" : "invisible"}`}
              >
                Selecciona una categoría
              </span>
            </div>

            <div className="flex flex-col">
              <label className="font-semibold text-sm text-gray-700 mb-2">
                Imagen del Negocio *
              </label>
              <input
                ref={fileInputRef}
                accept="image/jpeg,image/png,image/gif,image/webp"
                className="hidden"
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0];

                  if (file) {
                    setImageFile(file);
                    const reader = new FileReader();

                    reader.onloadend = () => {
                      setImagePreview(reader.result as string);
                    };
                    reader.readAsDataURL(file);
                    handleChange("businessImage", file.name);
                  }
                }}
              />

              {imagePreview ? (
                <div className="relative w-full h-48 rounded-xl overflow-hidden border-2 border-gray-200 group">
                  <img
                    alt="Vista previa"
                    className="w-full h-full object-cover"
                    src={imagePreview}
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <Button
                      className="bg-white text-gray-800"
                      size="sm"
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Cambiar
                    </Button>
                    <Button
                      className="bg-red-500 text-white"
                      size="sm"
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview(null);
                        handleChange("businessImage", "");
                      }}
                    >
                      <X size={16} />
                    </Button>
                  </div>
                </div>
              ) : (
                <button
                  className={`w-full h-48 rounded-xl border-2 border-dashed transition-colors flex flex-col items-center justify-center gap-3 ${
                    stateValidations.businessImage === false
                      ? "border-red-400 bg-red-50"
                      : "border-gray-300 hover:border-magenta-fuchsia-500 hover:bg-fuchsia-50"
                  }`}
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImagePlus className="text-gray-400" size={40} />
                  <span className="text-gray-500 text-sm">
                    Click para subir imagen
                  </span>
                  <span className="text-gray-400 text-xs">
                    JPG, PNG, GIF, WEBP
                  </span>
                </button>
              )}
              <span
                className={`text-xs text-red-500 mt-1 ${stateValidations.businessImage === false ? "visible" : "invisible"}`}
              >
                Seleccioná una imagen para tu negocio
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-700 border-b pb-2 flex items-center gap-2">
              <MapPin size={20} />
              Ubicación
            </h2>

            <div className="space-y-2">
              <Button
                className="w-full text-magenta-fuchsia-800 border-2 border-dashed border-gray-300 hover:border-magenta-fuchsia-500"
                type="button"
                variant="bordered"
                onClick={() => setShowMap(!showMap)}
              >
                <MapPin className="mr-2" size={18} />
                {showMap ? "Ocultar mapa" : "Seleccionar ubicación en el mapa"}
              </Button>

              {showMap && (
                <div className="animate-in slide-in-from-top-2 duration-300">
                  <LocationPickerWrapper
                    onLocationSelect={handleLocationSelect}
                  />
                  {coordinates && (
                    <p className="text-xs text-green-600 mt-2">
                      ✓ Ubicación seleccionada correctamente
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          <Button
            className="w-full bg-gradient-to-r from-magenta-fuchsia-600 to-magenta-fuchsia-400 text-white font-bold shadow-lg"
            isLoading={isSubmitting}
            size="lg"
            type="submit"
          >
            Registrar Negocio
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
