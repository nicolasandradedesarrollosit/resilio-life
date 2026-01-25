"use client"

import { useDispatch, useSelector } from "react-redux";
import { setUserData, clearUserData, setLoading } from "@/redux/userSlice";
import { selectUserData } from "@/redux/userSlice";
import { useEffect, useRef } from "react";
import { useApi } from "./useApi";
import type { UserData } from "@/types/userData.type";

export const useUserData = () => {
    const dispatch = useDispatch();
    const userDataState = useSelector(selectUserData);
    const verificationAttempted = useRef(false);

    const { data: sessionData, loading, error } = useApi({
        endpoint: '/check-session',
        method: 'GET',
        includeCredentials: true,
        enabled: !userDataState.loaded,
    });

    useEffect(() => {
        if (userDataState.loaded) {
            console.log('[useUserData] Already loaded, skipping verification');
            return;
        }

        if (verificationAttempted.current) {
            console.log('[useUserData] Already attempted verification, skipping');
            return;
        }

        if (sessionData) {
            console.log('[useUserData] Session data received:', { loggedIn: sessionData?.loggedIn, hasUser: !!sessionData?.user });
            verificationAttempted.current = true;

            if (sessionData?.loggedIn && sessionData.user) {
                console.log('[useUserData] User authenticated, setting user data');
                dispatch(setUserData({
                    loggedIn: sessionData.loggedIn,
                    data: sessionData.user as UserData,
                    loading: false,
                    loaded: true,
                }));
            } else {
                console.log('[useUserData] User not authenticated, clearing data');
                dispatch(setUserData({
                    loggedIn: false,
                    data: null,
                    loading: false,
                    loaded: true,
                }));
            }
        }
    }, [sessionData, userDataState.loaded, dispatch]);

    useEffect(() => {
        if (error) {
            console.error("[useUserData] Session check failed:", error);
            verificationAttempted.current = true;
            dispatch(setUserData({
                data: null,
                loading: false,
                loaded: true,
            }));
        }
    }, [error, dispatch]);

    const handleLogout = () => {
        dispatch(clearUserData());
    }

    return {
        userDataState,
        userData: userDataState.data,
        isLoggedIn: userDataState.loggedIn,
        isLoading: userDataState.loading,
        isLoaded: userDataState.loaded,
        logOut: handleLogout,
        setUserDataState: (userData: UserData | null) => dispatch(setUserData({ data: userData, loading: false, loaded: true, loggedIn: !!userData })),
        setLoadingState: (loading: boolean) => dispatch(setLoading(loading))
    };
}