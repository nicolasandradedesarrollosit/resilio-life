import Link from "next/link";
import { Instagram, Linkedin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-black text-white w-full border-t border-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-16 py-12 sm:py-16 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12 md:gap-16 mb-12 sm:mb-16">
          <div className="flex flex-col gap-4 sm:gap-6">
            <div className="flex items-center gap-3">
              <img
                alt="Resilio logo"
                className="h-10 w-10 sm:h-12 sm:w-12"
                src="logo-icon.png"
              />
              <span className="text-xl sm:text-2xl font-light tracking-tight">
                Resilio
              </span>
            </div>
            <p className="text-sm sm:text-base text-gray-400 font-light leading-relaxed max-w-xs">
              Una comunidad de jóvenes amantes de la creatividad y las buenas
              experiencias.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:gap-5">
            <h3 className="text-sm sm:text-base font-medium text-white/90 mb-2">
              Legal
            </h3>
            <Link
              className="text-sm sm:text-base text-gray-400 hover:text-magenta-fuchsia-400 transition-colors duration-300 font-light w-fit"
              href="/terms"
            >
              Términos de servicio
            </Link>
            <Link
              className="text-sm sm:text-base text-gray-400 hover:text-magenta-fuchsia-400 transition-colors duration-300 font-light w-fit"
              href="/privacity"
            >
              Políticas de privacidad
            </Link>
            <Link
              className="text-sm sm:text-base text-gray-400 hover:text-magenta-fuchsia-400 transition-colors duration-300 font-light w-fit"
              href="/contact"
            >
              Contacto
            </Link>
          </div>

          <div className="flex flex-col gap-4 sm:gap-5">
            <h3 className="text-sm sm:text-base font-medium text-white/90 mb-2">
              Seguinos
            </h3>
            <div className="flex gap-4">
              <a
                aria-label="Instagram"
                className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center hover:bg-magenta-fuchsia-600 transition-all duration-300 group"
                href="https://www.instagram.com/resilio.life/"
              >
                <Instagram className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
              </a>
              <a
                aria-label="LinkedIn"
                className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center hover:bg-magenta-fuchsia-600 transition-all duration-300 group"
                href="https://www.linkedin.com/company/resilio-life/"
              >
                <Linkedin className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
              </a>
            </div>
          </div>
        </div>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent mb-8 sm:mb-10" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6">
          <p className="text-xs sm:text-sm text-white font-light text-center sm:text-left">
            © 2024 Resilio. Todos los derechos reservados.
          </p>
          <p className="text-xs sm:text-sm text-white font-light text-center sm:text-right">
            Desarrollado por{" "}
            <a
              className="text-gray-400 hover:text-magenta-fuchsia-400 transition-colors duration-300"
              href="https://nicolas-andrade-portfolio.vercel.app/"
              rel="noopener noreferrer"
              target="_blank"
            >
              Nicolás Andrade
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};
