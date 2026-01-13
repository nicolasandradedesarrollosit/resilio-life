"use client"

import {Accordion, AccordionItem} from "@heroui/accordion"
import { useRouter } from "next/navigation";

export default function ThirdSection() {
    const router = useRouter();
    const faqs = [
        {
            pregunta: "¿Qué es este SaaS de beneficios y descuentos?",
            respuesta: "Es una plataforma que conecta a usuarios con descuentos exclusivos y beneficios en marcas, servicios y experiencias, todo en un solo lugar. Básicamente, pagás menos por vivir mejor, sin cupones impresos ni magia negra."
        },
        {
            pregunta: "¿Quiénes pueden usar la plataforma?",
            respuesta: "Cualquier persona que tenga una cuenta activa. En algunos casos el acceso puede estar habilitado por una empresa, universidad o comunidad, pero el único requisito técnico es saber hacer clic."
        },
        {
            pregunta: "¿Los descuentos tienen costo adicional?",
            respuesta: "No. Los descuentos ya están incluidos en tu membresía o beneficio de acceso. Si ves un precio más bajo, ese es el precio final, sin asteriscos traicioneros."
        },
        {
            pregunta: "¿Cómo uso un beneficio o descuento?",
            respuesta: "Elegís el beneficio, seguís las instrucciones y listo. Puede ser un código, un link directo o una validación automática. Menos pasos que armar un café."
        },
        {
            pregunta: "¿Los descuentos tienen fecha de vencimiento?",
            respuesta: "Sí, algunos beneficios son por tiempo limitado. Siempre indicamos la vigencia para evitar dramas de último minuto."
        },
        {
            pregunta: "¿Puedo usar un mismo descuento más de una vez?",
            respuesta: "Depende del beneficio. Algunos son reutilizables y otros tienen límite de uso. Si no dice nada raro, no te preocupes, no estás rompiendo ninguna regla."
        },
        {
            pregunta: "¿Qué pasa si un descuento no funciona?",
            respuesta: "Podés reportarlo desde la plataforma y nuestro equipo lo revisa con el proveedor. Nadie merece un descuento fantasma."
        },
        {
            pregunta: "¿Las marcas asociadas son confiables?",
            respuesta: "Sí. Trabajamos solo con marcas y comercios verificados. No vas a terminar comprando zapatillas que llegan en formato PDF."
        },
        {
            pregunta: "¿Puedo sugerir nuevas marcas o beneficios?",
            respuesta: "Claro que sí. Valoramos mucho las sugerencias y las usamos para ampliar el catálogo. Si muchos lo piden, suele pasar."
        },
        {
            pregunta: "¿Mis datos personales están seguros?",
            respuesta: "Totalmente. Usamos buenas prácticas de seguridad y nunca compartimos tu información sin consentimiento. Tus datos están más protegidos que el Wi-Fi de tu casa."
        }
    ];
    
    return (
        <section className="flex flex-col justify-center items-center w-full py-16 sm:py-20 md:py-24 lg:py-32 px-4 sm:px-6 md:px-8 lg:px-16 bg-gradient-to-b from-white via-gray-50 to-white">
            <div className="max-w-4xl w-full">
                <div className="text-center mb-12 sm:mb-16 md:mb-20">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-gray-900 mb-4 sm:mb-5 md:mb-6 tracking-tight">
                        Preguntas frecuentes
                    </h2>
                    <div className="w-16 h-px bg-gradient-to-r from-transparent via-magenta-fuchsia-500 to-transparent mx-auto mb-4 sm:mb-5 md:mb-6"></div>
                    <p className="text-base sm:text-lg md:text-xl text-gray-600 font-light">
                        Todo lo que necesitás saber sobre Resilio
                    </p>
                </div>

                <Accordion 
                    variant="splitted"
                    className="gap-3 sm:gap-4"
                    itemClasses={{
                        base: "bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:border-magenta-fuchsia-200 px-4 sm:px-6 md:px-8 py-2",
                        title: "font-medium text-base sm:text-lg md:text-xl text-gray-900 group-data-[open=true]:text-magenta-fuchsia-600 transition-colors",
                        trigger: "py-4 sm:py-5 md:py-6",
                        indicator: "text-gray-400 group-data-[open=true]:text-magenta-fuchsia-600 transition-colors",
                        content: "text-sm sm:text-base md:text-lg text-gray-600 font-light pb-4 sm:pb-5 md:pb-6 leading-relaxed"
                    }}
                >
                    {faqs.map((faq, index) => (
                        <AccordionItem
                            key={index}
                            aria-label={faq.pregunta}
                            title={faq.pregunta}
                        >
                            {faq.respuesta}
                        </AccordionItem>
                    ))}
                </Accordion>

                <div className="text-center mt-12 sm:mt-16 md:mt-20">
                    <p className="text-gray-600 font-light mb-6 text-sm sm:text-base md:text-lg">
                        ¿Tenés otra pregunta?
                    </p>
                    <button 
                        className="px-8 sm:px-10 py-3 sm:py-4 bg-purple-600 text-white font-light text-base sm:text-lg rounded-full border-2 border-purple-600 hover:bg-white hover:text-purple-600 transition-all duration-300 cursor-pointer"
                        onClick={() => {
                            router.push('/contact');
                        }}
                    >
                        Contactanos
                    </button>
                </div>
            </div>
        </section>
    )
}