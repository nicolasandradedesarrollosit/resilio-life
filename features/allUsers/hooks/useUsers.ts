"use client";

import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";

import { useApi } from "@/shared/hooks";

import {
  selectAllUsers,
  setAllUserData,
  setLoading,
} from "@/features/allUsers/allUserSlice";
import type { UserData, ApiResponse } from "@/shared/types";

export const useUsers = () => {
  const allUsers = useSelector(selectAllUsers);
  const dispatch = useDispatch();

  console.log("[useUsers] Current allUsers:", allUsers);

  const { data, loading, error } = useApi<ApiResponse<UserData[]>>({
    endpoint: "/users",
    method: "GET",
    includeCredentials: true,
    enabled: allUsers.length === 0,
  });

  useEffect(() => {
    if (data?.data) {
      console.log("[useUsers] API response received:", data);
      if (data.data.length > 0) {
        console.log("[useUsers] Dispatching setAllUserData with:", data.data.length, "users");
        dispatch(
          setAllUserData({
            users: data.data,
            loading: false,
            loaded: true,
          }),
        );
      } else {
        console.warn("[useUsers] API response is empty array");
      }
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (loading) {
      console.log("[useUsers] Setting loading state:", loading);
    }
    dispatch(setLoading(loading));
  }, [loading, dispatch]);

  useEffect(() => {
    if (error) {
      console.error("[useUsers] Error fetching users:", error);
      dispatch(setLoading(false));
    }
  }, [error, dispatch]);

  return {
    users: allUsers,
    loading,
    error,
    hasUsers: allUsers.length > 0,
  };
};
