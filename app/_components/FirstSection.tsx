import { Card, CardHeader, CardBody } from "@heroui/card";

export default function FirstSection () {

    const svg1 = (
        <svg className="block h-full w-full" xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 512 512">
            <path fill="currentColor" d="M32 376a56 56 0 0 0 56 56h336a56 56 0 0 0 56-56V222H32Zm66-76a30 30 0 0 1 30-30h48a30 30 0 0 1 30 30v20a30 30 0 0 1-30 30h-48a30 30 0 0 1-30-30ZM424 80H88a56 56 0 0 0-56 56v26h448v-26a56 56 0 0 0-56-56Z"/>
        </svg>
    )

    const svg2 = (
        <svg className="block h-full w-full" xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 26 26">
            <path fill="currentColor" d="M25.326 10.137a1.001 1.001 0 0 0-.807-.68l-7.34-1.066l-3.283-6.651c-.337-.683-1.456-.683-1.793 0L8.82 8.391L1.48 9.457a1 1 0 0 0-.554 1.705l5.312 5.178l-1.254 7.31a1.001 1.001 0 0 0 1.451 1.054L13 21.252l6.564 3.451a1 1 0 0 0 1.451-1.054l-1.254-7.31l5.312-5.178a.998.998 0 0 0 .253-1.024z"/>
        </svg>
    )

    const svg3 = (
        <svg className="block h-full w-full" xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.6 2.1c-.1-.3-.4-.6-.7-.7c-4.2-1.1-8.5.2-11.4 3.6L9.4 6.3l-2.7-.6C5.4 5.2 4 5.8 3.4 7l-2.2 3.9c-.2.3-.2.6 0 .9c.1.3.4.5.7.6l3.1.7c-.3.8-.4 1.6-.6 2.4c0 .3.1.6.3.8l3.1 3.1c.2.2.4.3.7.3h.1c.9-.1 1.7-.2 2.5-.5l.6 3c.1.3.3.6.6.7c.1.1.3.1.4.1c.2 0 .3 0 .5-.1l3.9-2.2c1.1-.6 1.7-2 1.4-3.3l-.7-2.8l1.2-1.1c3.3-2.8 4.7-7.3 3.6-11.4zM7.3 8.8c-.6.8-1.2 1.6-1.6 2.4l-2.1-.5L5.1 8c.2-.4.6-.5 1.1-.4l1.7.4l-.6.8zM16 18.9l-2.7 1.5l-.4-2c.9-.4 1.7-1 2.4-1.6l.7-.7l.4 1.7c.2.5-.1 1-.4 1.1zm.7-10.1c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5s1.5.7 1.5 1.5s-.6 1.5-1.5 1.5z"/>
        </svg>
    )

    const svg4 = (
        <svg className="block h-full w-full" xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 42 42">
            <path fill="currentColor" d="M31.5 6.65c0-2.589-.561-3.15-3-3.15h-17c-2.47 0-3 .529-3 3.15V36.5c0 2.439.56 3 3 3h17c2.5 0 3-.561 3-3V6.65zm-18 1.85h13v24h-13v-24zm8 28h-3v-2h3v2z"/>
        </svg>
    )

    const features = [
        {
            title: "Descuentos exclusivos",
            description: "Accedé a precios preferenciales en marcas asociadas.",
            svg: svg1
        },
        {
            title: "Acumulación de puntos",
            description: "Sumá puntos con cada compra y canjealos por beneficios.",
            svg: svg2
        },
        {
            title: "Acceso prioritario",
            description: "Entrá primero a promociones y lanzamientos limitados.",
            svg: svg3
        },
        {
            title: "Gestión simple",
            description: "Todo desde una app centralizada, fácil y rápida.",
            svg: svg4
        }
    ]

    return (
        <section className="py-16 sm:py-20 md:py-24 lg:py-32 px-4 w-full bg-gradient-to-b from-white via-gray-50 to-white">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 items-stretch">
                    {features.map((feature, index) => (
                        <Card 
                            key={index} 
                            className="h-full bg-white border border-gray-200 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 flex flex-col items-center text-center shadow-sm hover:shadow-xl hover:border-magenta-fuchsia-200 transition-all duration-500 group relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-magenta-fuchsia-50/0 to-magenta-fuchsia-50/0 group-hover:from-magenta-fuchsia-50/30 group-hover:to-transparent transition-all duration-500 rounded-2xl sm:rounded-3xl"></div>
                            
                            <CardHeader className="relative z-10">
                                <div className="bg-gradient-to-br from-gray-100 to-gray-50 rounded-full p-4 sm:p-5 mb-6 sm:mb-8 inline-flex items-center justify-center group-hover:from-magenta-fuchsia-100 group-hover:to-magenta-fuchsia-50 transition-all duration-500">
                                    <span className="inline-flex items-center text-magenta-fuchsia-600 justify-center h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 text-gray-700">
                                        {feature.svg}
                                    </span>
                                </div>
                            </CardHeader>
                            
                            <CardBody className="flex-1 relative z-10">
                                <h3 className="font-medium text-lg sm:text-xl md:text-2xl mb-3 sm:mb-4 text-gray-900 tracking-tight">
                                    {feature.title}
                                </h3>
                                <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed font-light">
                                    {feature.description}
                                </p>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}