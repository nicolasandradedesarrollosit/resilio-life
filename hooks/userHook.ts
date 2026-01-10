import { useDispatch, useSelector } from "react-redux";
import { setUserData, clearUserData, setLoading } from "@/redux/userSlice";
import { selectUserData } from "@/redux/userSlice"; 
import { useEffect, useRef } from "react";
import { checkSession } from "@/services/userService";
import type { UserData } from "@/types/userData";

let isGlobalVerifying = false;

export const useUserData = () => {
    const dispatch = useDispatch();
    const userDataState = useSelector(selectUserData);
    const hasAttemptedVerification = useRef(false);

    useEffect(() => {
        if (userDataState.loaded) return;
        
        if (isGlobalVerifying) return;

        if (hasAttemptedVerification.current) return;

        const verifySession = async () => {            
            isGlobalVerifying = true;
            hasAttemptedVerification.current = true;
            
            try {
                // Solo disparamos loading si realmente vamos a fetchear
                if (!userDataState.loading) {
                    dispatch(setLoading(true));
                }
                
                const result = await checkSession();
                
                if (result?.loggedIn && result.user) {
                    dispatch(setUserData({
                        data: result.user as UserData,
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
                console.error("Session check failed", error);
                dispatch(setUserData({
                    data: null,
                    loading: false,
                    loaded: true,
                }));
            } finally {
                isGlobalVerifying = false;
                // Nos aseguramos de quitar el loading
                dispatch(setLoading(false));
            }
        };
        
        verifySession();
    }, [dispatch, userDataState.loaded, userDataState.loading]);

    const handleLogout = () => {
        isGlobalVerifying = false;
        dispatch(clearUserData());
    }
    
    return { 
        userDataState,
        userData: userDataState.data,
        isLoggedIn: !!userDataState.data,
        isLoading: userDataState.loading,
        isLoaded: userDataState.loaded,
        logOut: handleLogout, 
        setUserDataState: (userData: UserData | null) => dispatch(setUserData({ data: userData, loading: false, loaded: true })), 
        setLoadingState: (loading: boolean) => dispatch(setLoading(loading)) 
    };
}