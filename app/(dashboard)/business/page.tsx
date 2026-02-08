"use client";

import { useState, useEffect } from "react";
import { Input, Textarea } from "@heroui/input";
import { Button } from "@heroui/button";
import { Camera, Save, User, FileText, Tag } from "lucide-react";

import { DashboardLayout, BUSINESS_NAV_ITEMS } from "@/shared/components/layout";
import { useApi } from "@/shared/hooks";

export default function BusinessPage() {
  const [businessName, setBusinessName] = useState("");
  const [businessDescription, setBusinessDescription] = useState("");
  const [businessCategory, setBusinessCategory] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData | null>(null);
  const [saved, setSaved] = useState(false);

  const { data: profileData, loading: profileLoading } = useApi({
    endpoint: "/business/profile",
    method: "GET",
    includeCredentials: true,
    enabled: true,
  });

  const { loading: isUpdating, data: updateResult } = useApi({
    endpoint: "/business/profile",
    method: "PATCH",
    includeCredentials: true,
    body: formData,
    enabled: formData !== null,
  });

  useEffect(() => {
    if (profileData?.data) {
      const b = profileData.data;
      setBusinessName(b.businessName || "");
      setBusinessDescription(b.businessDescription || "");
      setBusinessCategory(b.businessCategory || "");
      setImagePreview(b.businessImageURL || null);
    }
  }, [profileData]);

  useEffect(() => {
    if (updateResult) {
      setFormData(null);
      setImageFile(null);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  }, [updateResult]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return;
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!validTypes.includes(file.type)) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    const fd = new FormData();
    fd.set("businessName", businessName);
    fd.set("businessDescription", businessDescription);
    fd.set("businessCategory", businessCategory);
    if (imageFile) fd.set("image", imageFile);
    setFormData(fd);
  };

  return (
    <DashboardLayout
      currentPageName="Mi Negocio"
      items={BUSINESS_NAV_ITEMS}
      roleLabel="Negocio"
    >
      <div className="w-full px-4 md:px-6 lg:px-8 mt-6 max-w-[100vw]">
        <div className="max-w-2xl mx-auto">
          <h1 className="ml-12 text-2xl font-bold text-gray-800 mb-6">
            Perfil de Negocio
          </h1>

          {profileLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-magenta-fuchsia-500" />
            </div>
          ) : (
            <div className="relative bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              {/* Overlay loader durante el update */}
              {isUpdating && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 rounded-xl">
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-magenta-fuchsia-500" />
                    <span className="text-sm font-medium text-magenta-fuchsia-600">
                      Guardando cambios...
                    </span>
                  </div>
                </div>
              )}
              {/* Header con imagen */}
              <div className="relative bg-gradient-to-r from-magenta-fuchsia-600 to-magenta-fuchsia-500 h-32">
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
                  <div className="relative w-20 h-20 rounded-full border-4 border-white shadow-md overflow-hidden bg-gray-100">
                    {imagePreview ? (
                      <img
                        alt="Logo del negocio"
                        className="w-full h-full object-cover"
                        src={imagePreview}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <Camera className="text-gray-400" size={28} />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-14 pb-6 px-6">
                {/* Subir imagen */}
                <div className="flex justify-center mb-6">
                  <label className="cursor-pointer text-magenta-fuchsia-600 hover:text-magenta-fuchsia-700 text-sm font-medium flex items-center gap-1.5 transition-colors">
                    <Camera size={15} />
                    {imagePreview ? "Cambiar imagen" : "Subir imagen"}
                    <input
                      accept="image/*"
                      className="hidden"
                      type="file"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>

                <div className="space-y-5">
                  {/* Nombre del negocio */}
                  <div>
                    <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
                      <User size={14} />
                      Nombre del negocio
                    </label>
                    <Input
                      classNames={{
                        inputWrapper:
                          "border-gray-200 hover:border-gray-300 group-data-[focus=true]:border-magenta-fuchsia-500 group-data-[focus=true]:ring-1 group-data-[focus=true]:ring-magenta-fuchsia-500 bg-white",
                        input: "text-gray-800",
                      }}
                      value={businessName}
                      variant="bordered"
                      onChange={(e) => setBusinessName(e.target.value)}
                    />
                  </div>

                  {/* Categoría */}
                  <div>
                    <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
                      <Tag size={14} />
                      Categoría
                    </label>
                    <Input
                      classNames={{
                        inputWrapper:
                          "border-gray-200 hover:border-gray-300 group-data-[focus=true]:border-magenta-fuchsia-500 group-data-[focus=true]:ring-1 group-data-[focus=true]:ring-magenta-fuchsia-500 bg-white",
                        input: "text-gray-800",
                      }}
                      value={businessCategory}
                      variant="bordered"
                      onChange={(e) => setBusinessCategory(e.target.value)}
                    />
                  </div>

                  {/* Descripción */}
                  <div>
                    <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
                      <FileText size={14} />
                      Descripción
                    </label>
                    <Textarea
                      classNames={{
                        inputWrapper:
                          "border-gray-200 hover:border-gray-300 group-data-[focus=true]:border-magenta-fuchsia-500 group-data-[focus=true]:ring-1 group-data-[focus=true]:ring-magenta-fuchsia-500 bg-white",
                        input: "text-gray-800",
                      }}
                      minRows={3}
                      value={businessDescription}
                      variant="bordered"
                      onChange={(e) => setBusinessDescription(e.target.value)}
                    />
                  </div>

                  {/* Botón guardar */}
                  <div className="pt-2">
                    <Button
                      className="w-full bg-gradient-to-r from-magenta-fuchsia-600 to-magenta-fuchsia-500"
                      isLoading={isUpdating}
                      size="md"
                      startContent={!isUpdating ? <Save size={16} /> : null}
                      onPress={handleSubmit}
                    >
                      Guardar cambios
                    </Button>
                  </div>

                  {/* Toast de éxito */}
                  {saved && (
                    <div className="mt-3 flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-2.5">
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                      </svg>
                      Perfil actualizado exitosamente
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
