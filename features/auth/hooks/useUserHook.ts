"use client";

import type { UserData } from "@/shared/types";

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef } from "react";

import { useApi } from "@/shared/hooks";

import { setUserData, clearUserData, setLoading, selectUserData, selectIsUserBusiness } from "@/features/auth/authSlice";

export const useUserData = () => {
  const dispatch = useDispatch();
  const userDataState = useSelector(selectUserData);
  const verificationAttempted = useRef(false);

  const {
    data: sessionData,
    error,
  } = useApi<{
    success: boolean;
    message: string;
    data: {
      loggedIn: boolean;
      user?: UserData;
    };
  }>({
    endpoint: "/check-session",
    method: "GET",
    includeCredentials: true,
    enabled: !userDataState.loaded,
  });

  useEffect(() => {
    if (userDataState.loaded || verificationAttempted.current) return;

    if (sessionData?.data) {
      verificationAttempted.current = true;

      console.log("[useUserData] Session check response:", sessionData);

      // Access the nested data property from API response
      const isLoggedIn = sessionData.data.loggedIn === true;
      const userData = sessionData.data.user;

      if (isLoggedIn && userData) {
        console.log("[useUserData] User is logged in, setting user data:", userData);
        dispatch(
          setUserData({
            loggedIn: true,
            data: userData as UserData,
            loading: false,
            loaded: true,
          }),
        );
      } else {
        console.log("[useUserData] User is not logged in");
        dispatch(
          setUserData({
            loggedIn: false,
            data: null,
            loading: false,
            loaded: true,
          }),
        );
      }
    }
  }, [sessionData, userDataState.loaded, dispatch]);

  useEffect(() => {
    if (error) {
      console.log("[useUserData] Session check error:", error);
      verificationAttempted.current = true;
      dispatch(
        setUserData({
          data: null,
          loading: false,
          loaded: true,
          loggedIn: false,
        }),
      );
    }
  }, [error, dispatch]);

  const handleLogout = () => {
    dispatch(clearUserData());
  };

  return {
    userDataState,
    userData: userDataState.data,
    isLoggedIn: userDataState.loggedIn,
    isLoading: userDataState.loading,
    isLoaded: userDataState.loaded,
    logOut: handleLogout,
    setUserDataState: (userData: UserData | null) =>
      dispatch(
        setUserData({
          data: userData,
          loading: false,
          loaded: true,
          loggedIn: !!userData,
        }),
      ),
    setLoadingState: (loading: boolean) => dispatch(setLoading(loading)),
    isBusiness: useSelector(selectIsUserBusiness),
  };
};
