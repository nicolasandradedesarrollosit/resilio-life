import Link from "next/link";
import { Button } from "@heroui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-gray-50 px-4">
      <h1 className="text-6xl font-bold text-magenta-fuchsia-600">404</h1>
      <h2 className="text-2xl font-semibold text-gray-800">
        Página no encontrada
      </h2>
      <p className="text-gray-500 text-center max-w-md">
        La página que estás buscando no existe o fue movida.
      </p>
      <Button
        as={Link}
        className="bg-magenta-fuchsia-900 text-white"
        href="/"
      >
        Volver al inicio
      </Button>
    </div>
  );
}
