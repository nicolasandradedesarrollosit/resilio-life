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
    if (allUsers.length > 0) return;

    const fetchUsers = async () => {
      try {
        dispatch(setLoading(true));

        const response = await allUsersService.getAll();

        if (response.data && response.data.length > 0) {
          dispatch(
            setAllUserData({
              users: response.data,
              loading: false,
              loaded: true,
            }),
          );
        }
      } catch {
        dispatch(setLoading(false));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchUsers();
  }, [allUsers.length, dispatch]);

  return {
    users: allUsers,
    loading: allUsers.length === 0,
    error: null,
    hasUsers: allUsers.length > 0,
  };
};
