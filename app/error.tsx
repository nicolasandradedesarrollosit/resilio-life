"use client";

import { useEffect } from "react";
import { Button } from "@heroui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-gray-50 px-4">
      <h1 className="text-3xl font-bold text-gray-800">Algo salió mal</h1>
      <p className="text-gray-500 text-center max-w-md">
        Ocurrió un error inesperado. Por favor, intentá nuevamente.
      </p>
      <Button
        className="bg-magenta-fuchsia-900 text-white"
        onPress={() => reset()}
      >
        Reintentar
      </Button>
    </div>
  );
}
