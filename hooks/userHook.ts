import { useDispatch, useSelector } from "react-redux";
import { setUserData, clearUserData, setLoading } from "@/redux/user/userSlice";
import { selectUserData } from "@/redux/user/userSlice"; 
import { useEffect, useState } from "react";
import { checkSession } from "@/services/userService";
import type { UserData } from "@/types/userData";

// Tiempo mínimo que se muestra el loader (1 segundo)
const MIN_LOADING_TIME = 1500;

export const useUserData = () => {
    const dispatch = useDispatch();
    const userDataState = useSelector(selectUserData);
    const [isMinLoadingComplete, setIsMinLoadingComplete] = useState(false);

    useEffect(() => {
        const verifySession = async () => {
            console.log('useAuth - Verificando sesión...');
            const startTime = Date.now();
            
            try {
                dispatch(setLoading(true));
                const result = await checkSession();
                console.log('useAuth - Resultado checkSession:', result);
                
                // Calcular tiempo restante para completar el mínimo
                const elapsedTime = Date.now() - startTime;
                const remainingTime = Math.max(0, MIN_LOADING_TIME - elapsedTime);
                
                // Esperar el tiempo restante antes de actualizar el estado
                await new Promise(resolve => setTimeout(resolve, remainingTime));
                
                if (result?.loggedIn) {
                    console.log('useAuth - Usuario autenticado');
                    dispatch(setUserData({
                        data: result.user as UserData,
                        loading: false,
                        loaded: true,
                    }));
                }
                else {
                    console.log('useAuth - Usuario NO autenticado');
                    dispatch(clearUserData());
                }
            } catch (error) {
                console.error('useAuth - Error verificando sesión:', error);
                dispatch(clearUserData());
            } finally {
                setIsMinLoadingComplete(true);
                dispatch(setLoading(false));
            }
        };
        verifySession();
    }, [dispatch]);

    const handleLogout = () => {
        dispatch(clearUserData());
    }
    
    return { 
        userDataState,
        userData: userDataState.data,
        logOut: handleLogout, 
        setUserDataState: (userData: UserData | null) => dispatch(setUserData({ data: userData, loaded: true })), 
        setLoadingState: (loading: boolean) => dispatch(setLoading(loading)) 
    };
}