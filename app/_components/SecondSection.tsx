import { Card, CardBody, CardHeader } from "@heroui/card"

export default function SecondSection() {
    const svg1 = (
        <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 32 32" fill="currentColor">
            <g fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 9h4m-4 7h12m-12 4h12m-12 4h4m-6 5h16a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v22a2 2 0 0 0 2 2Z"/><circle cx="22" cy="9" r=".5" fill="currentColor"/>
            </g>
        </svg>
    );

    const svg2 = (
        <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24">
            <path fill="currentColor" d="M11.3 8.3L9.2 6.2q-.3-.3-.3-.7t.3-.7l2.1-2.1q.3-.3.7-.3t.7.3l2.1 2.1q.3.3.3.7t-.3.7l-2.1 2.1q-.3.3-.7.3t-.7-.3ZM2 20q-.425 0-.713-.288T1 19v-3q0-.85.588-1.425T3 14h3.275q.5 0 .95.25t.725.675q.725.975 1.788 1.525T12 17q1.225 0 2.288-.55t1.762-1.525q.325-.425.763-.675t.912-.25H21q.85 0 1.425.575T23 16v3q0 .425-.288.713T22 20h-5q-.425 0-.713-.288T16 19v-1.275q-.875.625-1.888.95T12 19q-1.075 0-2.1-.338T8 17.7V19q0 .425-.288.713T7 20H2Zm2-7q-1.25 0-2.125-.875T1 10q0-1.275.875-2.138T4 7q1.275 0 2.138.863T7 10q0 1.25-.863 2.125T4 13Zm16 0q-1.25 0-2.125-.875T17 10q0-1.275.875-2.138T20 7q1.275 0 2.138.863T23 10q0 1.25-.863 2.125T20 13Z"/>
        </svg>
    );

    const svg3 = (
        <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24">
            <path fill="currentColor" d="M23 7a8.44 8.44 0 0 0-5 1.31c-.36-.41-.73-.82-1.12-1.21l-.29-.27l.14-.12a3.15 3.15 0 0 0 .9-3.49A3.9 3.9 0 0 0 14 1v2a2 2 0 0 1 1.76 1c.17.4 0 .84-.47 1.31l-.23.21a16.71 16.71 0 0 0-3.41-2.2c-2.53-1.14-3.83-.61-4.47 0a2.18 2.18 0 0 0-.46.68l-.18.53L5.1 8.87C6.24 11.71 9 16.76 15 18.94l5-1.66a1 1 0 0 0 .43-.31l.21-.18c1.43-1.44.51-4.21-1.41-6.9A6.63 6.63 0 0 1 23 9zm-3.79 8.37h-.06c-.69.37-3.55-.57-6.79-3.81c-.34-.34-.66-.67-.95-1c-.1-.11-.19-.23-.29-.35l-.53-.64l-.28-.39c-.14-.19-.28-.38-.4-.56s-.16-.26-.24-.39s-.22-.34-.31-.51s-.13-.24-.19-.37s-.17-.28-.23-.42s-.09-.23-.14-.34s-.11-.27-.15-.4S8.6 6 8.58 5.9s-.06-.24-.08-.34a2 2 0 0 1 0-.24a1.15 1.15 0 0 1 0-.26l.11-.31c.17-.18.91-.23 2.23.37a13.83 13.83 0 0 1 2.49 1.54A4.17 4.17 0 0 1 12 7v2a6.43 6.43 0 0 0 3-.94l.49.46c.44.43.83.86 1.19 1.27A5.31 5.31 0 0 0 16 13.2l2-.39a3.23 3.23 0 0 1 0-1.14c1.29 1.97 1.53 3.39 1.21 3.7zM4.4 11l-2.23 6.7A3.28 3.28 0 0 0 5.28 22a3.21 3.21 0 0 0 1-.17l6.52-2.17A18.7 18.7 0 0 1 4.4 11z"/>
        </svg>
    )

    const steps = [
        {
            title: "Registrate",
            description: "Creá tu cuenta en pocos pasos y accedé a los planes de nuestra red de beneficios exclusivos.",
            svg: svg1
        },
        {
            title: "Elegí tu partner",
            description: "Explorá las marcas asociadas, activá tus beneficios y empezá a ahorrar.",
            svg: svg2
        },
        {
            title: "Disfrutá tus beneficios",
            description: "Acumulá puntos, recibí descuentos y accedé a promociones especiales.",
            svg: svg3
        }
    ]
    
    return (
        <section className="py-16 sm:py-20 md:py-24 lg:py-32 px-4 w-full bg-gradient-to-b from-white via-gray-50 to-white">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12 sm:mb-16 md:mb-20 lg:mb-24">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-gray-900 mb-4 sm:mb-5 md:mb-6 tracking-tight">
                        ¿Cómo funciona?
                    </h2>
                    <div className="w-16 h-px bg-gradient-to-r from-transparent via-magenta-fuchsia-500 to-transparent mx-auto mb-4 sm:mb-5 md:mb-6"></div>
                    <p className="text-base sm:text-lg md:text-xl text-gray-600 font-light max-w-2xl mx-auto px-4">
                        Comenzá a disfrutar de tus beneficios en 3 simples pasos
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
                    {steps.map((step, index) => (
                        <Card 
                            key={index} 
                            className="h-full bg-white border border-gray-200 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 flex flex-col items-center text-center shadow-sm hover:shadow-xl hover:border-magenta-fuchsia-200 transition-all duration-500 group relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-magenta-fuchsia-50/0 to-magenta-fuchsia-50/0 group-hover:from-magenta-fuchsia-50/30 group-hover:to-transparent transition-all duration-500 rounded-2xl sm:rounded-3xl"></div>
                            
                            <CardHeader className="relative z-10">
                                <div className="bg-gradient-to-br from-gray-100 to-gray-50 rounded-full p-4 sm:p-5 mb-6 sm:mb-8 inline-flex items-center justify-center group-hover:from-magenta-fuchsia-100 group-hover:to-magenta-fuchsia-50 transition-all duration-500">
                                    <span className="inline-flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 lg:h-16 lg:w-16 text-gray-700 group-hover:text-magenta-fuchsia-600 transition-colors duration-500">
                                        {step.svg}
                                    </span>
                                </div>
                            </CardHeader>
                            
                            <CardBody className="flex-1 relative z-10">
                                <h3 className="font-medium text-xl sm:text-xl md:text-2xl mb-4 sm:mb-5 text-gray-900 tracking-tight">
                                    {step.title}
                                </h3>
                                <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed font-light">
                                    {step.description}
                                </p>
                            </CardBody>

                            <div className="mt-6 sm:mt-8 relative z-10">
                                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-gray-200 flex items-center justify-center text-sm font-medium text-gray-400 group-hover:border-magenta-fuchsia-500 group-hover:text-magenta-fuchsia-600 transition-all duration-500">
                                    {index + 1}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* CTA */}
                <div className="flex justify-center mt-12 sm:mt-16 md:mt-20 lg:mt-24">
                    <button className="px-8 cursor-pointer sm:px-10 py-3 sm:py-4 bg-magenta-fuchsia-600 text-white font-light text-base sm:text-lg rounded-full shadow-lg hover:shadow-xl hover:bg-magenta-fuchsia-700 transition-all duration-300 border border-magenta-fuchsia-600">
                        Comenzar ahora
                    </button>
                </div>
            </div>
        </section>
    )
}