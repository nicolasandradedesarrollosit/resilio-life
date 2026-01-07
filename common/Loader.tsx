import { Spinner } from "@heroui/spinner";
import Image from "next/image";

export default function Loader({ fallback }: { fallback: string }) {
    return (
        <div className="fixed inset-0 flex flex-col gap-12 items-center justify-center bg-background z-50">
            <Image
            width={40}
            height={40} 
            className="h-10 w-10 md:h-12 md:w-12 lg:h-14 lg:w-14 animate-bounce" 
            src="/logo-icon.png" 
            alt="Logo" 
            />
            <Spinner color="secondary" label="Cargando" labelColor="secondary" size="lg"/>
            <p className="text-foreground/80">{fallback}</p>
        </div>
    )
}