"use client"

import { useDispatch, useSelector } from "react-redux";
import { setUserData, clearUserData, setLoading } from "@/redux/userSlice";
import { selectUserData } from "@/redux/userSlice"; 
import { useEffect, useRef } from "react";
import { useApi } from "./useApi";
import type { UserData } from "@/types/userData.type";

let isGlobalVerifying = false;

export const useUserData = () => {
    const dispatch = useDispatch();
    const userDataState = useSelector(selectUserData);
    const hasAttemptedVerification = useRef(false);

    const { data: sessionData, loading, error } = useApi({
        endpoint: '/check-session',
        method: 'GET',
        includeCredentials: true,
        enabled: !userDataState.loaded && !isGlobalVerifying && !hasAttemptedVerification.current,
    });

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

        if (sessionData) {
            console.log('[useUserData] Session data received:', { loggedIn: sessionData?.loggedIn, hasUser: !!sessionData?.user });
            hasAttemptedVerification.current = true;
            isGlobalVerifying = true;
            
            if (sessionData?.loggedIn && sessionData.user) {
                console.log('[useUserData] User authenticated, setting user data');
                dispatch(setUserData({
                    data: sessionData.user as UserData,
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
            
            isGlobalVerifying = false;
        }
    }, [sessionData, userDataState.loaded, dispatch]);

    useEffect(() => {
        if (error) {
            console.error("[useUserData] Session check failed:", error);
            hasAttemptedVerification.current = true;
            dispatch(setUserData({
                data: null,
                loading: false,
                loaded: true,
            }));
            isGlobalVerifying = false;
        }
    }, [error, dispatch]);

    const handleLogout = () => {
        isGlobalVerifying = false;
        hasAttemptedVerification.current = false;
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