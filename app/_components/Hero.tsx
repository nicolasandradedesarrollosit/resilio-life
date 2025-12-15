import {Button} from "@heroui/button"

export default function Hero() {
    return (
        <section className="flex flex-col items-center bg-gradient-to-br from-gray-900 via-magenta-fuchsia-900 to-gray-800 min-h-[70vh] w-full gap-8 sm:gap-10 md:gap-12 relative overflow-hidden px-4 sm:px-8 lg:px-16">
            <div className="pt-8 sm:pt-12 md:pt-16 lg:pt-24 flex justify-center w-full">
                <img 
                    className="h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20" 
                    src="logo-icon.png" 
                    alt="logo" 
                />
            </div>
            
            <div className="w-full h-auto flex flex-col items-center gap-4 sm:gap-5 md:gap-6 z-10 max-w-4xl mx-auto">
                <h2 className="font-light text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white text-center tracking-tight">
                    Somos Resilio
                </h2>
                <span className="font-light text-white/80 text-sm sm:text-base md:text-lg lg:text-xl tracking-wide w-full sm:w-4/5 md:w-3/4 lg:w-2/3 text-center px-4">
                    Una comunidad, un grupo de jóvenes amantes de la creatividad y de las buenas experiencias
                </span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-8 z-10 pb-8 sm:pb-12 md:pb-16 items-center w-full sm:w-auto px-4">
                <Button 
                    radius="full" 
                    size="lg" 
                    variant="bordered" 
                    className="text-white font-light border-white/30 hover:bg-white/10 transition-all duration-300 w-full sm:w-auto min-w-[180px]"
                >
                    Contáctanos
                </Button>
                <Button 
                    radius="full" 
                    size="lg" 
                    className="bg-magenta-fuchsia-600 text-white font-light hover:bg-magenta-fuchsia-700 transition-all duration-300 w-full sm:w-auto min-w-[180px]"
                >
                    Iniciar sesión
                </Button>
            </div>
        </section>
    )
}