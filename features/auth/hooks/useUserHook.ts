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
  } = useApi({
    endpoint: "/check-session",
    method: "GET",
    includeCredentials: true,
    enabled: !userDataState.loaded,
  });

  useEffect(() => {
    if (userDataState.loaded || verificationAttempted.current) return;

    if (sessionData) {
      verificationAttempted.current = true;

      if (sessionData?.loggedIn && sessionData.user) {
        dispatch(
          setUserData({
            loggedIn: sessionData.loggedIn,
            data: sessionData.user as UserData,
            loading: false,
            loaded: true,
          }),
        );
      } else {
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
      verificationAttempted.current = true;
      dispatch(
        setUserData({
          data: null,
          loading: false,
          loaded: true,
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
