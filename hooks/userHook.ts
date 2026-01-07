import { useDispatch, useSelector } from "react-redux";
import { setUserData, clearUserData, setLoading } from "@/redux/user/userSlice";
import { selectUserData } from "@/redux/user/userSlice"; 
import { useEffect, useRef } from "react";
import { checkSession } from "@/services/userService";
import type { UserData } from "@/types/userData";

const MIN_LOADING_TIME = 1500;

export const useUserData = () => {
    const dispatch = useDispatch();
    const userDataState = useSelector(selectUserData);
    const hasRun = useRef(false);

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        const verifySession = async () => {
            console.log('useAuth - Verificando sesión...');
            const startTime = Date.now();
            try {
                dispatch(clearUserData());
                dispatch(setLoading(true));
                const result = await checkSession();
                console.log('useAuth - Resultado checkSession:', result);
                
                const elapsedTime = Date.now() - startTime;
                const remainingTime = Math.max(0, MIN_LOADING_TIME - elapsedTime);
                
                await new Promise(resolve => setTimeout(resolve, remainingTime));
                
                if (result?.loggedIn) {
                    console.log('useAuth - Usuario autenticado');
                    const userData = result.user as UserData;
                    dispatch(setUserData({
                        data: userData,
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
                dispatch(setLoading(false));
            }
        };
        verifySession();
    }, []);

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