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
        if (userDataState.loaded) {
            console.log('[useUserData] Already loaded, skipping verification');
            return;
        }
        
        if (isGlobalVerifying) {
            console.log('[useUserData] Global verification in progress, skipping');
            return;
        }

        if (hasAttemptedVerification.current) {
            console.log('[useUserData] Already attempted verification, skipping');
            return;
        }

        const verifySession = async () => {            
            console.log('[useUserData] Starting session verification...');
            isGlobalVerifying = true;
            hasAttemptedVerification.current = true;
            
            try {
                if (!userDataState.loading) {
                    dispatch(setLoading(true));
                }
                
                const result = await checkSession();
                console.log('[useUserData] checkSession result:', { loggedIn: result?.loggedIn, hasUser: !!result?.user, error: result?.error });
                
                if (result?.loggedIn && result.user) {
                    console.log('[useUserData] User authenticated, setting user data');
                    dispatch(setUserData({
                        data: result.user as UserData,
                        loading: false,
                        loaded: true,
                    }));
                } else {
                    console.log('[useUserData] User not authenticated, clearing data');
                    dispatch(setUserData({
                        data: null,
                        loading: false,
                        loaded: true,
                    }));
                }
            } catch (error) {
                console.error("[useUserData] Session check failed:", error);
                dispatch(setUserData({
                    data: null,
                    loading: false,
                    loaded: true,
                }));
            } finally {
                isGlobalVerifying = false;
                console.log('[useUserData] Verification complete');
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