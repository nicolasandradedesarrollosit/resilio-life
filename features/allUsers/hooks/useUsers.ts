"use client";

import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";

import { allUsersService } from "@/features/allUsers/services/allUsersService";
import {
  selectAllUsers,
  setAllUserData,
  setLoading,
} from "@/features/allUsers/allUserSlice";

export const useUsers = () => {
  const allUsers = useSelector(selectAllUsers);
  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      dispatch(setLoading(false));
    }
  }, [error, dispatch]);

  return {
    users: allUsers,
    loading: allUsers.length === 0,
    error: null,
    hasUsers: allUsers.length > 0,
  };
};
