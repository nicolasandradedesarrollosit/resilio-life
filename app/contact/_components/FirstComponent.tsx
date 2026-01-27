export default function FirstComponent() {
  const features = [
    {
      icon: (
        <svg
          className="h-6 w-6"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 12.75c1.63 0 3.07.39 4.24.9c1.08.48 1.76 1.56 1.76 2.73V18H6v-1.61c0-1.18.68-2.26 1.76-2.73c1.17-.52 2.61-.91 4.24-.91zM4 13c1.1 0 2-.9 2-2s-.9-2-2-2s-2 .9-2 2s.9 2 2 2zm1.13 1.1c-.37-.06-.74-.1-1.13-.1c-.99 0-1.93.21-2.78.58A2.01 2.01 0 0 0 0 16.43V18h4.5v-1.61c0-.83.23-1.61.63-2.29zM20 13c1.1 0 2-.9 2-2s-.9-2-2-2s-2 .9-2 2s.9 2 2 2zm4 3.43c0-.81-.48-1.53-1.22-1.85A6.95 6.95 0 0 0 20 14c-.39 0-.76.04-1.13.1c.4.68.63 1.46.63 2.29V18H24v-1.57zM12 6c1.66 0 3 1.34 3 3s-1.34 3-3 3s-3-1.34-3-3s1.34-3 3-3z" />
        </svg>
      ),
      title: "Asistencia personalizada",
      description: "Atención dedicada según tus necesidades",
    },
    {
      icon: (
        <svg
          className="h-6 w-6"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10s10-4.5 10-10S17.5 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8m.5-13H11v6l5.2 3.2l.8-1.3l-4.5-2.7V7z" />
        </svg>
      ),
      title: "Soporte 24/7",
      description: "Disponibles en cualquier momento",
    },
    {
      icon: (
        <svg
          className="h-6 w-6"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M13 2.05v2.02c3.95.49 7 3.85 7 7.93c0 3.21-1.92 6-4.72 7.28L13 17v5l-1-1l-1 1v-5l-2.28 2.28C5.92 18 4 15.21 4 12c0-4.08 3.05-7.44 7-7.93V2.05c-5 .5-9 4.76-9 9.95c0 5.52 4.48 10 10 10s10-4.48 10-10c0-5.19-4-9.45-9-9.95z" />
        </svg>
      ),
      title: "Respuestas rápidas",
      description: "Soluciones ágiles y efectivas",
    },
  ];

  return (
    <div className="flex justify-center items-center w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-8 md:py-12 lg:py-16 bg-transparent lg:w-1/2">
      <div className="flex flex-col w-full max-w-2xl gap-6 md:gap-10">
        <div className="flex flex-col gap-3 md:gap-4">
          <div className="flex items-center gap-3">
            <div className="h-1 w-8 md:w-12 bg-magenta-fuchsia-500 rounded-full" />
            <span className="text-xs md:text-sm font-semibold text-magenta-fuchsia-600 uppercase tracking-wider">
              Contacto
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
            Contactémonos
          </h2>
          <p className="text-base md:text-lg text-gray-500 leading-relaxed">
            ¿Tenés una pregunta o necesitás asistencia? Contactate con el equipo
            de soporte, estamos para ayudarte en lo que requieras.
          </p>
        </div>

        <div className="flex flex-col gap-3 md:gap-5">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-start gap-3 md:gap-4 p-4 md:p-5 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-fuchsia-200 group"
            >
              <div className="flex-shrink-0 p-2 md:p-3 bg-magenta-fuchsia-100 rounded-lg text-magenta-fuchsia-600 group-hover:bg-magenta-fuchsia-500 group-hover:text-white transition-all duration-300">
                {feature.icon}
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-base md:text-lg font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 pt-4 md:pt-6 border-t border-gray-200">
          <div className="p-2 bg-magenta-fuchsia-100 rounded-full">
            <svg
              className="h-4 md:h-5 w-4 md:w-5 text-magenta-fuchsia-600"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5l-8-5V6l8 5l8-5v2z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-medium text-gray-900">
              Tiempo de respuesta promedio
            </p>
            <p className="text-xs text-gray-600">Menos de 24 horas</p>
          </div>
        </div>
      </div>
    </div>
  );
}
