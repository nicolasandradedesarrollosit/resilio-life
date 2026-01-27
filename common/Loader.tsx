import { Spinner } from "@heroui/spinner";
import Image from "next/image";

export default function Loader({ fallback }: { fallback: string }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background z-50">
      <div className="absolute inset-0 bg-gradient-to-br from-magenta-fuchsia-500/10 via-transparent to-magenta-fuchsia-700/10" />

      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-magenta-fuchsia-400/20 rounded-full blur-3xl animate-pulse" />
      <div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-magenta-fuchsia-600/15 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      />

      <div className="relative flex flex-col items-center gap-8">
        <div className="relative">
          <div className="absolute inset-0 bg-magenta-fuchsia-500/30 blur-2xl rounded-full animate-pulse" />
          <div
            className="absolute inset-0 bg-magenta-fuchsia-400/20 blur-xl rounded-full animate-pulse"
            style={{ animationDelay: "500ms" }}
          />

          <Image
            alt="Logo"
            className="h-12 w-12 md:h-14 md:w-14 lg:h-16 lg:w-16 animate-bounce relative z-10 drop-shadow-2xl"
            height={56}
            src="/logo-icon.png"
            width={56}
          />
        </div>

        <div className="flex flex-col items-center gap-3">
          <Spinner
            color="secondary"
            label="Cargando"
            labelColor="secondary"
            size="lg"
          />
        </div>

        {fallback && (
          <div className="max-w-md text-center px-4">
            <p className="text-sm md:text-base text-foreground/70 font-medium tracking-wide">
              {fallback}
            </p>
          </div>
        )}

        <div className="flex gap-2 mt-2">
          <div
            className="w-2 h-2 rounded-full bg-gradient-to-r from-magenta-fuchsia-400 to-magenta-fuchsia-500 animate-pulse shadow-lg shadow-magenta-fuchsia-500/50"
            style={{ animationDelay: "0ms" }}
          />
          <div
            className="w-2 h-2 rounded-full bg-gradient-to-r from-magenta-fuchsia-500 to-magenta-fuchsia-600 animate-pulse shadow-lg shadow-magenta-fuchsia-600/50"
            style={{ animationDelay: "200ms" }}
          />
          <div
            className="w-2 h-2 rounded-full bg-gradient-to-r from-magenta-fuchsia-600 to-magenta-fuchsia-700 animate-pulse shadow-lg shadow-magenta-fuchsia-700/50"
            style={{ animationDelay: "400ms" }}
          />
        </div>
      </div>
    </div>
  );
}
