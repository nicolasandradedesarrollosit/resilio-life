"use client"
import { useState, useRef, useEffect } from "react"
import { Button } from "@heroui/button"
import { Input } from "@heroui/input"
import Link from "next/link"
import { addToast } from "@heroui/toast"
import { useRouter } from "next/navigation"
import { setUserData } from "@/redux/userSlice"
import { useDispatch } from "react-redux"
import { UserData } from "@/types/userData.type"
import { EyeOff, Eye } from "lucide-react"
import { useApi } from "@/hooks/useApi"

interface RegisterFormData {
    name: string;
    lastName: string;
    email: string;
    password: string;
}

export default function FormRegister() {
    const [isVisiblePassword, setIsVisiblePassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const dispatch = useDispatch();
    const router = useRouter();

    const [registerData, setRegisterData] = useState<RegisterFormData | null>(null);

    const { data, error, loading } = useApi<{ user: UserData }>({
        endpoint: '/users',
        method: 'POST',
        body: registerData,
        enabled: registerData !== null,
    });

    const [stateValidations, setStateValidations] = useState<{
        name: boolean | null;
        lastName: boolean | null;
        email: boolean | null;
        password: boolean | null;
    }>({
        name: null,
        lastName: null,
        email: null,
        password: null
    });

    const formRef = useRef<HTMLFormElement | null>(null);
    const prevValidationsRef = useRef<{ name: boolean | null; lastName: boolean | null; email: boolean | null; password: boolean | null }>({
        name: null,
        lastName: null,
        email: null,
        password: null
    });

    const validationRegex = [
        /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,}$/,
        /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,}$/,
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
    ]

    const fields = ['name', 'lastName', 'email', 'password'] as const;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
        const value = e.target.value;
        const isValid = validationRegex[index].test(value);
        const key = fields[index] as keyof typeof stateValidations;

        if (prevValidationsRef.current[key] === isValid) return;
        prevValidationsRef.current[key] = isValid;
        setStateValidations(prev => ({ ...prev, [key]: isValid }));
    }

    useEffect(() => {
        if (loading) {
            setIsSubmitting(true);
            return;
        }

        if (error) {
            addToast({
                title: 'Error al enviar',
                description: 'Hubo un problema al procesar tu solicitud. Por favor, intentá nuevamente.',
                color: 'danger',
                variant: 'flat',
                timeout: 5000
            });
            setIsSubmitting(false);
            setRegisterData(null);
            return;
        }

        if (data?.user) {
            formRef.current?.reset();
            setStateValidations({
                name: null,
                lastName: null,
                email: null,
                password: null
            });
            dispatch(setUserData({
                data: data.user,
                loading: false,
                loaded: true
            }));

            addToast({
                title: 'Registro exitoso',
                description: '¡Tu cuenta ha sido creada correctamente!',
                color: 'success',
                variant: 'flat',
                timeout: 3000
            });

            setIsSubmitting(false);
            setRegisterData(null);
            router.push('/login');
        }
    }, [data, error, loading, dispatch, router]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const data: RegisterFormData = Object.fromEntries(
            Array.from(formData.entries()).map(([k, v]) => [k, typeof v === "string" ? v : ""])
        ) as unknown as RegisterFormData;

        const allValid = Object.values(stateValidations).every(val => val === true);

        if (!allValid) {
            addToast({
                title: 'Validación fallida',
                description: 'Por favor, completá correctamente todos los campos.',
                color: 'warning',
                variant: 'flat',
                timeout: 5000
            });
            return;
        }

        addToast({
            title: 'Registro en proceso',
            description: 'Estamos procesando tu solicitud.',
            color: 'success',
            variant: 'flat',
            timeout: 3000
        });

        setRegisterData(data);
    };

    const toggleVisibility = () => setIsVisiblePassword(!isVisiblePassword);

    const IconEyeOff = () => <EyeOff size={20} className="text-current" />;
    const IconEye = () => <Eye size={20} className="text-current" />;

    return (
        <div className="flex flex-col items-center w-full max-w-xl mx-auto py-8 sm:px-6 px-0">
            <div className="w-full bg-transparent rounded-3xl p-8 md:p-10 space-y-8">
                <div className="text-center space-y-3">
                    <h1 className="text-3xl md:text-3xl font-bold bg-gradient-to-r from-magenta-fuchsia-600 to-magenta-fuchsia-400 bg-clip-text text-transparent">
                        ¡Crea tu cuenta!
                    </h1>
                    <p className="text-gray-500 text-sm md:text-base font-medium">
                        Únete a nuestra comunidad y comienza tu experiencia
                    </p>
                </div>

                <form
                    ref={formRef}
                    onSubmit={handleSubmit}
                    className="space-y-5 bg-white rounded-2xl p-4 md:p-8 shadow-md">
                    <div className="flex flex-col relative">
                        <Input
                            name="name"
                            isInvalid={stateValidations.name === false}
                            color="secondary"
                            type="text"
                            label="Nombre"
                            placeholder="Tu nombre"
                            variant="bordered"
                            onChange={(e) => { handleChange(e, 0) }}
                            isRequired
                            classNames={{
                                inputWrapper: "border-2 hover:border-magenta-fuchsia-600 group-data-[focus=true]:border-magenta-fuchsia-500 text-black",
                                label: "font-semibold"
                            }}
                        />
                        <span className={`text-xs text-red-500 mt-1 ${stateValidations.name === false ? "visible" : "invisible"}`}>
                            El nombre debe tener al menos 2 letras
                        </span>
                    </div>

                    <div className="flex flex-col relative">
                        <Input
                            name="lastName"
                            isInvalid={stateValidations.lastName === false}
                            color="secondary"
                            type="text"
                            label="Apellido"
                            placeholder="Tu apellido"
                            variant="bordered"
                            onChange={(e) => { handleChange(e, 1) }}
                            isRequired
                            classNames={{
                                inputWrapper: "border-2 hover:border-magenta-fuchsia-600 group-data-[focus=true]:border-magenta-fuchsia-500 text-black",
                                label: "font-semibold"
                            }}
                        />
                        <span className={`text-xs text-red-500 mt-1 ${stateValidations.lastName === false ? "visible" : "invisible"}`}>
                            El apellido debe tener al menos 2 letras
                        </span>
                    </div>

                    <div className="flex flex-col relative">
                        <Input
                            name="email"
                            isInvalid={stateValidations.email === false}
                            color="secondary"
                            type="email"
                            label="Email"
                            placeholder="tu@email.com"
                            variant="bordered"
                            onChange={(e) => { handleChange(e, 2) }}
                            isRequired
                            classNames={{
                                inputWrapper: "border-2 hover:border-magenta-fuchsia-600 group-data-[focus=true]:border-magenta-fuchsia-500 text-black",
                                label: "font-semibold"
                            }}
                        />
                        <span className={`text-xs text-red-500 mt-1 ${stateValidations.email === false ? "visible" : "invisible"}`}>
                            Ingresá un email válido
                        </span>
                    </div>

                    <div className="flex flex-col relative">
                        <Input
                            isInvalid={stateValidations.password === false}
                            color="secondary"
                            label="Contraseña"
                            placeholder="••••••••"
                            name="password"
                            variant="bordered"
                            onChange={(e) => { handleChange(e, 3) }}
                            isRequired
                            type={isVisiblePassword ? 'text' : 'password'}
                            endContent={
                                <button
                                    type="button"
                                    onClick={toggleVisibility}
                                    className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                                    aria-label="toggle password visibility"
                                >
                                    {isVisiblePassword ? <IconEyeOff /> : <IconEye />}
                                </button>
                            }
                            classNames={{
                                inputWrapper: "border-2 hover:border-magenta-fuchsia-600 group-data-[focus=true]:border-magenta-fuchsia-500 text-black",
                                label: "font-semibold"
                            }}
                        />
                        <span className={`text-xs text-red-500 mt-1 ${stateValidations.password === false ? "visible" : "invisible"}`}>
                            La contraseña debe tener al menos 8 caracteres, una mayúscula y un número
                        </span>
                    </div>

                    <Button
                        isLoading={isSubmitting}
                        type="submit"
                        size="lg"
                        className="w-full bg-gradient-to-r from-magenta-fuchsia-600 to-magenta-fuchsia-400 text-white font-bold shadow-lg"
                    >
                        Crear cuenta
                    </Button>
                </form>

                <div className="text-center pt-2">
                    <p className="text-gray-600 text-sm">
                        ¿Ya tenés cuenta?{' '}
                        <Link href="/login" className="font-semibold text-black hover:text-magenta-fuchsia-600 transition-colors">
                            Inicia sesión aquí
                        </Link>
                    </p>
                </div>
            </div>

            <p className="mt-8 text-center text-xs text-gray-500">
                Al continuar, aceptás nuestros términos de servicio y política de privacidad
            </p>
        </div>
    )
}