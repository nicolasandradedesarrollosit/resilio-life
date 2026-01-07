import { useDispatch, useSelector } from "react-redux";
import { setUserData, clearUserData, setLoading } from "@/redux/user/userSlice";
import { selectUserData } from "@/redux/user/userSlice"; 
import { useEffect } from "react";
import { checkSession } from "@/services/userService";
import type { UserData } from "@/types/userData";

const MIN_LOADING_TIME = 1000;

// Variable global para evitar múltiples llamadas a la API
let isVerifyingSession = false;

export const useUserData = () => {
    const dispatch = useDispatch();
    const userDataState = useSelector(selectUserData);

    useEffect(() => {
        // Si ya se verificó la sesión (loaded=true), no volver a verificar
        if (userDataState.loaded) {
            return;
        }

        // Si ya se está verificando, no hacer otra llamada
        if (isVerifyingSession) {
            return;
        }

        const verifySession = async () => {
            isVerifyingSession = true;
            const startTime = Date.now();
            
            try {
                dispatch(setLoading(true));
                const result = await checkSession();
                
                const elapsedTime = Date.now() - startTime;
                const remainingTime = Math.max(0, MIN_LOADING_TIME - elapsedTime);
                
                await new Promise(resolve => setTimeout(resolve, remainingTime));
                
                if (result?.loggedIn && result.user) {
                    const userData = result.user as UserData;
                    dispatch(setUserData({
                        data: userData,
                        loading: false,
                        loaded: true,
                    }));
                } else {
                    dispatch(setUserData({
                        data: null,
                        loading: false,
                        loaded: true,
                    }));
                }
            } catch (error) {
                dispatch(setUserData({
                    data: null,
                    loading: false,
                    loaded: true,
                }));
            } finally {
                isVerifyingSession = false;
            }
        };
        
        verifySession();
    }, [userDataState.loaded, dispatch]);

    const handleLogout = () => {
        dispatch(clearUserData());
    }
    
    return { 
        userDataState,
        userData: userDataState.data,
        logOut: handleLogout, 
        setUserDataState: (userData: UserData | null) => dispatch(setUserData({ data: userData, loading: false, loaded: true })), 
        setLoadingState: (loading: boolean) => dispatch(setLoading(loading)) 
    };
}