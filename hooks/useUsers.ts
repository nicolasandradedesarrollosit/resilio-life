"use client";

import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";

import { useApi } from "./useApi";

import {
  selectAllUsers,
  setAllUserData,
  setLoading,
} from "@/redux/allUserSlice";
import { UserData } from "@/types/userData.type";

export const useUsers = () => {
  const allUsers = useSelector(selectAllUsers);
  const dispatch = useDispatch();

  const { data, loading, error } = useApi<UserData[]>({
    endpoint: "/users",
    method: "GET",
    includeCredentials: true,
    enabled: allUsers.length === 0,
  });

  useEffect(() => {
    if (data && data.length > 0) {
      dispatch(
        setAllUserData({
          users: data,
          loading: false,
          loaded: true,
        }),
      );
    }
  }, [data, dispatch]);

  useEffect(() => {
    dispatch(setLoading(loading));
  }, [loading, dispatch]);

  useEffect(() => {
    if (error) {
      console.error("Error fetching users:", error);
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
